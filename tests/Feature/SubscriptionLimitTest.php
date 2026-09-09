<?php

use App\Models\Product;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(SubscriptionPlanSeeder::class);

    $this->freePlan = SubscriptionPlan::where('slug', 'free')->first();
    $this->proPlan = SubscriptionPlan::where('slug', 'pro')->first();

    $this->tenant = Tenant::create([
        'name' => 'Toko Serba Ada',
        'slug' => 'toko-serba-ada',
        'business_type' => 'retail',
        'plan_id' => $this->freePlan->id,
        'is_active' => true,
    ]);

    $this->owner = User::create([
        'name' => 'Owner Toko',
        'email' => 'owner.toko@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant->id,
        'is_active' => true,
    ]);
    $this->owner->assignRole('owner');
});

test('Tenant Free (limit 100 produk): verifikasi penambahan produk ke-101 ditolak dengan pesan error', function () {
    // Create 100 active products for this tenant
    for ($i = 1; $i <= 100; $i++) {
        Product::create([
            'tenant_id' => $this->tenant->id,
            'name' => "Produk Ke-{$i}",
            'unit' => 'pcs',
            'min_stock' => 0,
            'current_stock' => 10,
            'purchase_price' => 1000,
            'purchase_qty' => 1,
            'cost_price' => 1000,
            'sell_price' => 2000,
            'is_active' => true,
        ]);
    }

    expect($this->tenant->products()->where('is_active', true)->count())->toBe(100);
    expect($this->tenant->canAddProduct())->toBeFalse();

    $this->actingAs($this->owner);

    // Attempting to add 101st product
    $response = $this->post(route('inventory.store'), [
        'name' => 'Produk Ke-101',
        'unit' => 'pcs',
        'min_stock' => 0,
        'purchase_price' => 5000,
        'purchase_qty' => 1,
        'sell_price' => 10000,
    ]);

    $response->assertSessionHasErrors(['limit']);
    expect($this->tenant->products()->count())->toBe(100);
});

test('Tenant Free (limit 1 user): verifikasi penambahan member tim kedua ditolak', function () {
    expect($this->tenant->users()->count())->toBe(1);
    expect($this->tenant->canAddUser())->toBeFalse();

    $this->actingAs($this->owner);

    // Attempting to add 2nd team member
    $response = $this->post(route('members.store'), [
        'name' => 'Staff Baru',
        'email' => 'staffbaru@example.com',
        'password' => 'password123',
        'role' => 'staff',
    ]);

    $response->assertSessionHas('error');
    expect($this->tenant->users()->count())->toBe(1);
});

test('verifikasi batas terangkat otomatis setelah upgrade ke Pro / Enterprise', function () {
    // Fill up Free limits (100 products, 1 user)
    for ($i = 1; $i <= 100; $i++) {
        Product::create([
            'tenant_id' => $this->tenant->id,
            'name' => "Produk Ke-{$i}",
            'unit' => 'pcs',
            'min_stock' => 0,
            'purchase_price' => 1000,
            'purchase_qty' => 1,
            'sell_price' => 2000,
            'is_active' => true,
        ]);
    }

    expect($this->tenant->canAddProduct())->toBeFalse();
    expect($this->tenant->canAddUser())->toBeFalse();

    // Upgrade plan to Pro
    $this->tenant->update(['plan_id' => $this->proPlan->id]);
    $this->tenant->refresh();

    expect($this->tenant->max_products)->toBe(1000);
    expect($this->tenant->max_users)->toBe(5);
    expect($this->tenant->canAddProduct())->toBeTrue();
    expect($this->tenant->canAddUser())->toBeTrue();

    $this->actingAs($this->owner);

    // Successfully add 101st product
    $this->post(route('inventory.store'), [
        'name' => 'Produk Ke-101 (Setah Upgrade)',
        'unit' => 'pcs',
        'min_stock' => 0,
        'purchase_price' => 5000,
        'purchase_qty' => 1,
        'sell_price' => 10000,
    ])->assertRedirect(route('inventory.index'));

    expect($this->tenant->products()->count())->toBe(101);

    // Successfully add 2nd user
    $this->post(route('members.store'), [
        'name' => 'Supervisor Baru',
        'email' => 'supervisorbaru@example.com',
        'password' => 'password123',
        'role' => 'supervisor',
    ])->assertSessionHas('success');

    expect($this->tenant->users()->count())->toBe(2);
});
