<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::latest()->get();

        return Inertia::render('admin/supplier/index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/supplier/create');
    }

    public function store(Request $request)
    {
        // Lakukan validasi
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:2048',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'business_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $user = $request->user();
        $roleName = $user ? ($user->getRoleNames()->first() ?? $user->primaryRole()) : 'admin';

        $validated['created_by_user_id'] = $user?->id;
        $validated['added_by_role'] = $roleName;

        // Simpan data
        Supplier::create($validated);

        // Redirect kembali ke index dengan pesan sukses
        return redirect()->route('admin.supplier.index')->with('success', 'Supplier berhasil ditambahkan.');
    }

    public function edit(Supplier $supplier)
    {
        return Inertia::render('admin/supplier/edit', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        // Lakukan validasi
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|string|max:2048',
            'city' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'business_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        // Update data
        $supplier->update($validated);

        // Redirect kembali ke index dengan pesan sukses
        return redirect()->route('admin.supplier.index')->with('success', 'Supplier berhasil diupdate.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();

        return redirect()->route('admin.supplier.index')->with('success', 'Supplier berhasil dihapus.');
    }
}
