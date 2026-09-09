<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Recipe;
use App\Models\SubscriptionPlan;
use App\Models\Supplier;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(SubscriptionPlanSeeder::class);

    $plan = SubscriptionPlan::where('slug', 'free')->first();

    $this->tenantA = Tenant::create([
        'name' => 'Tenant A',
        'slug' => 'tenant-a',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    $this->tenantB = Tenant::create([
        'name' => 'Tenant B',
        'slug' => 'tenant-b',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    $this->userA = User::create([
        'name' => 'Owner A',
        'email' => 'ownerA@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenantA->id,
        'is_active' => true,
    ]);
    $this->userA->assignRole('owner');

    $this->userB = User::create([
        'name' => 'Owner B',
        'email' => 'ownerB@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenantB->id,
        'is_active' => true,
    ]);
    $this->userB->assignRole('owner');
});

test('Tenant A tidak dapat melihat, mengubah, atau menghapus produk, varian, dan resep milik Tenant B', function () {
    $productB = Product::create([
        'tenant_id' => $this->tenantB->id,
        'name' => 'Produk B',
        'unit' => 'pcs',
        'min_stock' => 5,
        'purchase_price' => 10000,
        'purchase_qty' => 1,
        'cost_price' => 10000,
        'sell_price' => 15000,
    ]);

    $recipeB = Recipe::create([
        'tenant_id' => $this->tenantB->id,
        'name' => 'Resep B',
        'portion_qty' => 1,
    ]);

    $variantB = ProductVariant::create([
        'tenant_id' => $this->tenantB->id,
        'name' => 'Varian B',
        'sell_price' => 20000,
        'recipe_id' => $recipeB->id,
        'recipe_qty' => 1,
    ]);

    $this->actingAs($this->userA);

    // Verify index list does not contain Tenant B's product
    $this->get(route('inventory.index'))
        ->assertOk()
        ->assertDontSee('Produk B');

    // Product actions
    $this->get(route('inventory.edit', $productB))->assertStatus(403);
    $this->put(route('inventory.update', $productB), [
        'name' => 'Hacked Product',
        'unit' => 'pcs',
        'min_stock' => 1,
        'purchase_price' => 1000,
        'purchase_qty' => 1,
    ])->assertStatus(403);
    $this->delete(route('inventory.destroy', $productB))->assertStatus(403);

    // Variant actions
    $this->get(route('variants.edit', $variantB))->assertStatus(403);
    $this->put(route('variants.update', $variantB), [
        'name' => 'Hacked Variant',
        'sell_price' => 25000,
        'recipe_qty' => 1,
    ])->assertStatus(403);
    $this->delete(route('variants.destroy', $variantB))->assertStatus(403);

    // Recipe actions
    $this->get(route('recipes.edit', $recipeB))->assertStatus(403);
    $this->put(route('recipes.update', $recipeB), [
        'name' => 'Hacked Recipe',
        'portion_qty' => 2,
        'ingredients' => [
            ['ingredient_name' => 'Custom', 'qty' => 1, 'unit' => 'gr', 'ingredient_cost' => 100],
        ],
    ])->assertStatus(403);
    $this->delete(route('recipes.destroy', $recipeB))->assertStatus(403);
});

test('Tenant A tidak dapat mengakses pesanan, laporan transaksi, dan supplier milik Tenant B', function () {
    $orderB = Order::create([
        'tenant_id' => $this->tenantB->id,
        'order_number' => 'ORD-TEST-B001',
        'customer_name' => 'Customer B',
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'subtotal' => 50000,
        'total' => 50000,
        'user_id' => $this->userB->id,
    ]);

    $transactionB = Transaction::create([
        'tenant_id' => $this->tenantB->id,
        'type' => 'income',
        'category' => 'sales',
        'amount' => 50000,
        'date' => now()->toDateString(),
        'payment_method' => 'cash',
        'user_id' => $this->userB->id,
    ]);

    $supplierB = Supplier::create([
        'tenant_id' => $this->tenantB->id,
        'name' => 'Supplier Rahasia B',
        'is_active' => true,
        'business_type' => 'fnb',
    ]);

    $this->actingAs($this->userA);

    // Order access restriction
    $this->get(route('orders.index'))
        ->assertOk()
        ->assertDontSee('ORD-TEST-B001');

    $this->get(route('orders.show', $orderB))->assertStatus(403);
    $this->patch(route('orders.status', $orderB), ['status' => 'processing'])->assertStatus(403);
    $this->patch(route('orders.pay', $orderB), ['payment_method' => 'cash'])->assertStatus(403);
    $this->delete(route('orders.destroy', $orderB))->assertStatus(403);

    // Transaction restriction
    $this->get(route('finance.transactions'))
        ->assertOk()
        ->assertDontSee('50000');

    $this->delete(route('finance.transactions.destroy', $transactionB))->assertStatus(403);

    // Supplier restriction
    $this->get(route('suppliers.index'))
        ->assertOk()
        ->assertDontSee('Supplier Rahasia B');

    $this->get(route('suppliers.edit', $supplierB))->assertStatus(403);
    $this->put(route('suppliers.update', $supplierB), ['name' => 'Hacked Supplier'])->assertStatus(403);
});

test('blokir total (HTTP 403) jika status tenant->is_active = false', function () {
    $this->tenantA->update(['is_active' => false]);

    $this->actingAs($this->userA);

    $this->get(route('dashboard'))
        ->assertStatus(403);

    $this->get(route('inventory.index'))
        ->assertStatus(403);

    $this->get(route('orders.index'))
        ->assertStatus(403);
});
