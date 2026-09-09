<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\Sale;
use App\Models\StockMovement;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(SubscriptionPlanSeeder::class);

    $plan = SubscriptionPlan::where('slug', 'free')->first();

    $this->tenant = Tenant::create([
        'name' => 'Kedai Kopi Utama',
        'slug' => 'kedai-kopi-utama',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    $this->user = User::create([
        'name' => 'Staff POS',
        'email' => 'pos@example.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant->id,
        'is_active' => true,
    ]);
    $this->user->assignRole('staff');

    // Create Raw Material Product
    $this->rawProduct = Product::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Biji Kopi Robusta',
        'unit' => 'gr',
        'min_stock' => 10,
        'current_stock' => 100,
        'purchase_price' => 50000,
        'purchase_qty' => 1000,
        'cost_price' => 50,
        'sell_price' => 0,
    ]);

    // Create Recipe (1 porsi butuh 15gr biji kopi)
    $this->recipe = Recipe::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Resep Kopi Susu',
        'portion_qty' => 1,
    ]);

    RecipeIngredient::create([
        'recipe_id' => $this->recipe->id,
        'ingredient_id' => $this->rawProduct->id,
        'ingredient_name' => $this->rawProduct->name,
        'qty' => 15,
        'unit' => 'gr',
        'ingredient_cost' => 50,
    ]);

    // Create Product Variant
    $this->variant = ProductVariant::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Es Kopi Susu Aren',
        'sell_price' => 20000,
        'recipe_id' => $this->recipe->id,
        'recipe_qty' => 1,
    ]);
});

test('simulasi order POS: buat order -> bayar lunas -> verifikasi pencatatan tabel transactions dan sales', function () {
    $this->actingAs($this->user);

    $response = $this->post(route('orders.store'), [
        'customer_name' => 'Budi POS',
        'customer_phone' => '08123456789',
        'status' => 'done',
        'payment_method' => 'cash',
        'cash_received' => 50000,
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'qty' => 1,
                'paket_isi' => 1,
                'paket_harga' => 20000,
            ],
            [
                'variant_id' => $this->variant->id,
                'qty' => 1,
                'paket_isi' => 1,
                'paket_harga' => 20000,
            ],
        ],
    ]);

    $response->assertRedirect(route('pos.index'));
    $response->assertSessionHas('success');

    // Assert order created and paid
    $this->assertDatabaseHas('orders', [
        'tenant_id' => $this->tenant->id,
        'customer_name' => 'Budi POS',
        'status' => 'done',
        'payment_status' => 'paid',
        'payment_method' => 'cash',
        'subtotal' => 40000,
        'total' => 40000,
        'stock_deducted' => true,
    ]);

    $order = Order::where('customer_name', 'Budi POS')->first();
    expect($order)->not->toBeNull();

    // Verify transaction recorded
    $this->assertDatabaseHas('transactions', [
        'tenant_id' => $this->tenant->id,
        'type' => 'income',
        'category' => 'sales',
        'amount' => 40000,
        'reference' => $order->order_number,
        'payment_method' => 'cash',
    ]);

    $transaction = Transaction::where('reference', $order->order_number)->first();
    expect($transaction)->not->toBeNull();
    expect($order->transaction_id)->toBe($transaction->id);

    // Verify sales recorded
    $this->assertDatabaseHas('sales', [
        'tenant_id' => $this->tenant->id,
        'transaction_id' => $transaction->id,
        'product_name' => 'Es Kopi Susu Aren',
        'qty' => 1,
        'unit_price' => 20000,
        'total' => 20000,
    ]);

    expect(Sale::where('transaction_id', $transaction->id)->count())->toBe(2);
});

test('verifikasi stok produk inventaris berkurang secara tepat sesuai komposisi resep varian yang dipesan', function () {
    $this->actingAs($this->user);

    // Initial stock is 100 gr
    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(100.0);

    // Order 3 cup Es Kopi Susu Aren -> (3 cup * 15 gr per cup = 45 gr raw material consumed)
    $this->post(route('orders.store'), [
        'customer_name' => 'Siti',
        'status' => 'done',
        'payment_method' => 'cash',
        'cash_received' => 100000,
        'items' => [
            [
                'variant_id' => $this->variant->id,
                'qty' => 1,
                'paket_isi' => 1,
                'paket_harga' => 20000,
            ],
            [
                'variant_id' => $this->variant->id,
                'qty' => 1,
                'paket_isi' => 1,
                'paket_harga' => 20000,
            ],
            [
                'variant_id' => $this->variant->id,
                'qty' => 1,
                'paket_isi' => 1,
                'paket_harga' => 20000,
            ],
        ],
    ])->assertRedirect(route('pos.index'));

    // Remaining stock must be 100 - 45 = 55 gr
    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(55.0);

    // Stock movements recorded
    expect(StockMovement::where('product_id', $this->rawProduct->id)->count())->toBe(3);

    $this->assertDatabaseHas('stock_movements', [
        'tenant_id' => $this->tenant->id,
        'product_id' => $this->rawProduct->id,
        'type' => 'out',
        'qty' => 15,
        'qty_after' => 55,
    ]);
});

test('verifikasi idempoten: status update berkali-kali tidak memotong stok berulang kali (stock_deducted flag)', function () {
    $this->actingAs($this->user);

    // Create an order in pending status without payment method
    $order = Order::create([
        'tenant_id' => $this->tenant->id,
        'order_number' => Order::generateOrderNumber($this->tenant->id),
        'customer_name' => 'Idempotent Test',
        'status' => 'pending',
        'payment_status' => 'unpaid',
        'subtotal' => 40000,
        'total' => 40000,
        'stock_deducted' => false,
        'user_id' => $this->user->id,
        'ordered_at' => now(),
    ]);

    $order->items()->create([
        'variant_id' => $this->variant->id,
        'variant_name' => $this->variant->name,
        'qty' => 2,
        'unit_price' => 20000,
        'unit_hpp' => 750,
        'total' => 40000,
        'paket_isi' => 1,
        'paket_harga' => 20000,
    ]);

    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(100.0);

    // 1st Update status to 'processing' -> Stock deducted (2 cup * 15gr = 30gr)
    $this->patch(route('orders.status', $order), ['status' => 'processing'])
        ->assertStatus(302);

    $order->refresh();
    expect($order->stock_deducted)->toBeTrue();
    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(70.0);
    expect(StockMovement::where('product_id', $this->rawProduct->id)->count())->toBe(1);

    // 2nd Update status to 'done' -> Should NOT deduct stock again
    $this->patch(route('orders.status', $order), ['status' => 'done'])
        ->assertStatus(302);

    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(70.0);
    expect(StockMovement::where('product_id', $this->rawProduct->id)->count())->toBe(1);

    // 3rd Update status again to 'done' -> Should NOT deduct stock again
    $this->patch(route('orders.status', $order), ['status' => 'done'])
        ->assertStatus(302);

    expect((float) $this->rawProduct->fresh()->current_stock)->toBe(70.0);
    expect(StockMovement::where('product_id', $this->rawProduct->id)->count())->toBe(1);
});
