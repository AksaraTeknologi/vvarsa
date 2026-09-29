<?php

use App\Models\Product;
use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(SubscriptionPlanSeeder::class);

    $plan = SubscriptionPlan::where('slug', 'free')->first();

    $this->owner = User::create([
        'name' => 'Owner Multi',
        'email' => 'owner.multi@example.com',
        'password' => bcrypt('password'),
        'is_active' => true,
    ]);
    $this->owner->assignRole('owner');

    $this->tenant1 = Tenant::create([
        'owner_id' => $this->owner->id,
        'name' => 'Tenant Pertama',
        'slug' => 'tenant-pertama',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    $this->owner->update(['tenant_id' => $this->tenant1->id]);

    // Tambah staff ke Tenant 1
    $this->staff1 = User::create([
        'name' => 'Staff Tenant 1',
        'email' => 'staff1@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant1->id,
        'is_active' => true,
    ]);
    $this->staff1->assignRole('staff');

    // Tambah produk ke Tenant 1
    Product::create([
        'tenant_id' => $this->tenant1->id,
        'name' => 'Kopi Arabika Tenant 1',
        'unit' => 'pcs',
        'min_stock' => 5,
        'current_stock' => 20,
        'purchase_price' => 10000,
        'cost_price' => 10000,
        'sell_price' => 25000,
        'is_active' => true,
    ]);
});

test('role owner dapat membuat tenant baru dengan isi tenant dan tim yang berbeda', function () {
    $response = $this->actingAs($this->owner)->post(route('owner.tenants.store'), [
        'name' => 'Tenant Kedua Baru',
        'business_type' => 'retail',
        'plan_slug' => 'free',
        'currency' => 'IDR',
        'phone' => '081234567890',
        'address' => 'Jl. Bisnis Baru No. 1',
    ]);

    $response->assertRedirect(route('dashboard'));
    $response->assertSessionHas('success');

    $tenant2 = Tenant::where('name', 'Tenant Kedua Baru')->first();
    expect($tenant2)->not->toBeNull();
    expect($tenant2->owner_id)->toBe($this->owner->id);
    expect($tenant2->business_type)->toBe('retail');

    // Pastikan user aktif telah beralih ke tenant baru
    $this->owner->refresh();
    expect($this->owner->tenant_id)->toBe($tenant2->id);

    // Pastikan tenant baru belum memiliki produk (isi tenant berbeda/bersih)
    expect(Product::where('tenant_id', $tenant2->id)->count())->toBe(0);

    // Pastikan tim staff dari tenant 1 tidak terdaftar di tenant 2
    $membersTenant2 = User::where('tenant_id', $tenant2->id)->where('id', '!=', $this->owner->id)->get();
    expect($membersTenant2->count())->toBe(0);

    // Tambah staff di tenant 2
    $staff2 = User::create([
        'name' => 'Staff Tenant 2',
        'email' => 'staff2@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $tenant2->id,
        'is_active' => true,
    ]);
    $staff2->assignRole('staff');

    expect(User::where('tenant_id', $this->tenant1->id)->pluck('email'))->toContain('staff1@example.com');
    expect(User::where('tenant_id', $this->tenant1->id)->pluck('email'))->not->toContain('staff2@example.com');
    expect(User::where('tenant_id', $tenant2->id)->pluck('email'))->toContain('staff2@example.com');
});

test('non-owner tidak dapat membuat tenant baru', function () {
    $response = $this->actingAs($this->staff1)->post(route('owner.tenants.store'), [
        'name' => 'Tenant Ilegal',
        'business_type' => 'fnb',
        'plan_slug' => 'free',
    ]);

    $response->assertStatus(403);
});

test('owner dapat beralih antar tenant miliknya melalui switch tenant endpoint', function () {
    $plan = SubscriptionPlan::where('slug', 'free')->first();
    $tenant2 = Tenant::create([
        'owner_id' => $this->owner->id,
        'name' => 'Tenant Kedua',
        'slug' => 'tenant-kedua',
        'business_type' => 'retail',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    // Switch ke Tenant 2
    $response = $this->actingAs($this->owner)->post(route('owner.tenants.switch'), [
        'tenant_id' => $tenant2->id,
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->owner->refresh();
    expect($this->owner->tenant_id)->toBe($tenant2->id);

    // Switch kembali ke Tenant 1
    $response2 = $this->actingAs($this->owner)->post(route('owner.tenants.switch'), [
        'tenant_id' => $this->tenant1->id,
    ]);

    $response2->assertRedirect(route('dashboard'));
    $this->owner->refresh();
    expect($this->owner->tenant_id)->toBe($this->tenant1->id);
});

test('hanya boleh ada satu supervisor di dalam satu tenant', function () {
    // Beri kuota user yang cukup untuk tenant 1
    $this->tenant1->plan->update(['max_users' => 10]);

    // 1. Tambah supervisor pertama ke tenant 1
    $response1 = $this->actingAs($this->owner)->post('/members', [
        'name' => 'Supervisor Satu',
        'email' => 'spv1@example.com',
        'password' => 'password123',
        'role' => 'supervisor',
    ]);

    $response1->assertSessionHas('success');
    expect(User::where('tenant_id', $this->tenant1->id)->role('supervisor')->count())->toBe(1);

    // 2. Coba tambah supervisor kedua ke tenant 1 — harus ditolak
    $response2 = $this->actingAs($this->owner)->post('/members', [
        'name' => 'Supervisor Dua',
        'email' => 'spv2@example.com',
        'password' => 'password123',
        'role' => 'supervisor',
    ]);

    $response2->assertSessionHas('error', 'Hanya boleh ada 1 Supervisor dalam satu tenant.');
    expect(User::where('tenant_id', $this->tenant1->id)->role('supervisor')->count())->toBe(1);

    // 3. Coba ubah role staff1 menjadi supervisor saat sudah ada supervisor — harus ditolak
    $response3 = $this->actingAs($this->owner)->put("/members/{$this->staff1->id}", [
        'role' => 'supervisor',
    ]);

    $response3->assertSessionHas('error', 'Hanya boleh ada 1 Supervisor dalam satu tenant.');
    expect($this->staff1->fresh()->hasRole('staff'))->toBeTrue();
});
