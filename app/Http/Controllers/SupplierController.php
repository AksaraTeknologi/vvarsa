<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $tenant = app('tenant');

        // Selalu gunakan business_type dari tenant — tidak bisa di-override dari request
        $businessType = $tenant->business_type ?? 'fnb';

        $query = Supplier::where('is_active', true)
            ->where(function ($q) use ($tenant) {
                $q->whereNull('tenant_id')
                    ->orWhere('tenant_id', $tenant->id);
            });

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter selalu berdasarkan business_type tenant
        $query->where('business_type', $businessType);

        if ($city = $request->get('city')) {
            $query->where('city', $city);
        }

        $suppliers = $query->with(['creator:id,name'])
            ->orderByDesc('is_verified')
            ->orderByDesc('rating')
            ->paginate(9)
            ->withQueryString();

        $cities = Supplier::where('is_active', true)
            ->where('business_type', $businessType)
            ->distinct()
            ->whereNotNull('city')
            ->pluck('city')
            ->values();

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
            'cities' => $cities,
            'filters' => [
                'search' => $request->get('search', ''),
                'city' => $request->get('city', ''),
            ],
            'business_type' => $tenant->business_type,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('suppliers/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $tenant = app('tenant');
        $user = $request->user();
        $roleName = $user?->roles?->pluck('name')->first() ?? 'owner';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:500',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'business_type' => 'nullable|string',
            'product_categories' => 'nullable|array',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'review_count' => 'nullable|integer|min:0',
        ]);

        $validated['tenant_id'] = $tenant->id;
        $validated['created_by_user_id'] = $user?->id;
        $validated['added_by_role'] = $roleName;
        $validated['is_active'] = true;
        $validated['is_verified'] = false;
        $validated['rating'] = $validated['rating'] ?? 0.0;
        $validated['review_count'] = $validated['review_count'] ?? 0;

        Supplier::create($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function edit(Supplier $supplier): Response
    {
        $tenant = app('tenant');

        // Proteksi: Pastikan tenant hanya bisa mengedit supplier miliknya sendiri
        if ($supplier->tenant_id !== $tenant->id) {
            abort(403, 'Anda tidak memiliki izin untuk mengedit supplier ini.');
        }

        return Inertia::render('suppliers/edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $tenant = app('tenant');

        // Proteksi: Pastikan tenant hanya bisa mengubah supplier miliknya sendiri
        if ($supplier->tenant_id !== $tenant->id) {
            abort(403, 'Anda tidak memiliki izin untuk mengubah supplier ini.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'business_type' => 'nullable|string|in:fnb,retail,fashion,services,general',
            'product_categories' => 'nullable|array',
            'description' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return redirect()->route('suppliers.index')
            ->with('success', 'Supplier berhasil diperbarui.');
    }
}
