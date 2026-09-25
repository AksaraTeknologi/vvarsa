<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantMiddleware
{
    /**
     * Inject tenant context into the request for tenant-scoped routes.
     * Platform admins (role: admin) skip this middleware — they have no tenant.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        // Platform admin tidak butuh tenant context
        if ($user->hasRole('admin')) {
            $request->session()->reflash();

            return redirect()->route('admin.dashboard');
        }

        if (! $user->tenant_id) {
            // User belum setup bisnis — arahkan ke halaman pilih bisnis
            if ($request->routeIs('choose-business') || $request->routeIs('choose-business.store')) {
                return $next($request);
            }
            $request->session()->reflash();

            return redirect()->route('choose-business');
        }

        // Load tenant dengan plan dan subscription aktif
        $tenant = $user->tenant()->with(['plan', 'activeSubscription'])->first();

        if (! $tenant || ! $tenant->is_active) {
            abort(403, 'Akun bisnis Anda tidak aktif. Hubungi administrator.');
        }

        // Inject tenant ke service container agar accessible di controllers
        app()->instance('tenant', $tenant);

        // Load data tenant milik owner & plans untuk tenant switcher & create modal
        $userTenants = [];
        $availablePlans = [];

        if ($user->hasRole('owner')) {
            $userTenants = \App\Models\Tenant::where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhere('id', $user->tenant_id);
            })
                ->where('is_active', true)
                ->with('plan:id,name,slug')
                ->get(['id', 'name', 'slug', 'business_type', 'currency', 'plan_id'])
                ->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'slug' => $t->slug,
                    'business_type' => $t->business_type,
                    'currency' => $t->currency ?? 'IDR',
                    'plan_name' => $t->plan?->name,
                    'is_current' => $t->id === $tenant->id,
                ]);

            $availablePlans = \App\Models\SubscriptionPlan::where('is_active', true)
                ->orderBy('price')
                ->get(['id', 'name', 'slug', 'price', 'max_users', 'max_products', 'features'])
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'price' => (int) $p->price,
                    'max_users' => $p->max_users,
                    'max_products' => $p->max_products,
                    'features' => $p->features ?? [],
                ]);
        }

        // Share tenant data ke Inertia (max_products/max_users dari plan)
        inertia()->share([
            'tenant' => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'business_type' => $tenant->business_type,
                'currency' => $tenant->currency ?? 'IDR',
                'plan' => $tenant->plan ? [
                    'name' => $tenant->plan->name,
                    'slug' => $tenant->plan->slug,
                    'features' => $tenant->plan->features,
                    'max_products' => $tenant->plan->max_products,
                    'max_users' => $tenant->plan->max_users,
                ] : null,
            ],
            'userTenants' => $userTenants,
            'availablePlans' => $availablePlans,
        ]);

        return $next($request);
    }
}
