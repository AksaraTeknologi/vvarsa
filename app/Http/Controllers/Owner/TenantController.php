<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    /**
     * Membuat tenant baru khusus untuk role owner.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasRole('owner')) {
            abort(403, 'Hanya role owner yang diizinkan untuk membuat tenant baru.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_type' => 'required|string|in:fnb,retail,services,fashion,general',
            'plan_slug' => 'required|string|exists:subscription_plans,slug',
            'currency' => 'nullable|string|in:IDR,USD,SGD',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',
        ]);

        $plan = SubscriptionPlan::where('slug', $validated['plan_slug'])->firstOrFail();

        // Generate unique slug untuk tenant
        $baseSlug = Str::slug($validated['name']) ?: 'bisnis';
        $slug = $baseSlug;
        $counter = 1;
        while (Tenant::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter++;
        }

        // Buat Tenant baru dengan relasi owner_id
        $tenant = Tenant::create([
            'owner_id' => $user->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'business_type' => $validated['business_type'],
            'plan_id' => $plan->id,
            'currency' => $validated['currency'] ?? 'IDR',
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => true,
        ]);

        // Buat subscription aktif untuk tenant baru
        TenantSubscription::create([
            'tenant_id' => $tenant->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'ends_at' => $plan->price > 0 ? now()->addMonth() : null,
            'amount_paid' => $plan->price,
        ]);

        // Buat metode pembayaran default untuk tenant baru
        PaymentMethod::create([
            'tenant_id' => $tenant->id,
            'name' => 'Tunai (Cash)',
            'is_active' => true,
        ]);

        // Otomatis aktifkan tenant baru ini untuk owner
        $user->update(['tenant_id' => $tenant->id]);

        return to_route('dashboard')->with('success', "Tenant '{$tenant->name}' berhasil dibuat dan siap digunakan!");
    }

    /**
     * Berpindah tenant aktif bagi owner yang memiliki beberapa tenant.
     */
    public function switch(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (! $user->hasRole('owner')) {
            abort(403, 'Akses tidak diizinkan.');
        }

        $validated = $request->validate([
            'tenant_id' => 'required|uuid|exists:tenants,id',
        ]);

        $tenant = Tenant::where('id', $validated['tenant_id'])
            ->where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhere('id', $user->tenant_id);
            })
            ->firstOrFail();

        if (! $tenant->is_active) {
            return back()->with('error', "Tenant {$tenant->name} sedang dinonaktifkan.");
        }

        $user->update(['tenant_id' => $tenant->id]);

        return to_route('dashboard')->with('success', "Berhasil beralih ke bisnis {$tenant->name}!");
    }
}
