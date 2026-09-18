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

        $baseQuery = Supplier::where('is_active', true)
            ->where(function ($q) use ($tenant) {
                $q->whereNull('tenant_id')
                    ->orWhere('tenant_id', $tenant->id);
            });

        if ($search = $request->get('search')) {
            $baseQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($businessType) {
            $baseQuery->where(function ($q) use ($businessType) {
                $q->where('business_type', $businessType)
                    ->orWhereNull('business_type');
            });
        }

        if ($city = $request->get('city')) {
            $baseQuery->where('city', $city);
        }

        // Semuanya diambil tanpa pagination untuk ditampilkan di daftar dan peta
        $suppliers = (clone $baseQuery)->with(['creator:id,name'])
            ->orderByDesc('is_verified')
            ->orderByDesc('rating')
            ->get();

        $cities = Supplier::where('is_active', true)
            ->distinct()
            ->whereNotNull('city')
            ->pluck('city')
            ->values();

        return Inertia::render('suppliers/index', [
            'suppliers' => $suppliers,
            'all_suppliers' => $suppliers,
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
        $roleName = $user ? ($user->getRoleNames()->first() ?? $user->primaryRole()) : 'owner';

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:2048',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'business_type' => 'nullable|string',
            'product_categories' => 'nullable|array',
            'description' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'review_count' => 'nullable|integer|min:0',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $validated['tenant_id'] = $tenant->id;
        $validated['created_by_user_id'] = $user?->id;
        $validated['added_by_role'] = $roleName;
        $validated['business_type'] = !empty($validated['business_type']) ? $validated['business_type'] : ($tenant->business_type ?? 'fnb');
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
            'website' => 'nullable|url|max:2048',
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

    public function parseLink(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'url' => 'required|string',
        ]);

        $scrapedData = \App\Services\GoogleMapsScraperService::scrape($request->input('url'));

        return response()->json([
            'success' => true,
            'data' => $scrapedData,
        ]);
    }
}
