<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    $this->seed(SubscriptionPlanSeeder::class);
    $plan = SubscriptionPlan::where('slug', 'free')->first();

    $this->tenant = Tenant::create([
        'name' => 'Kuliner Nusantara',
        'slug' => 'kuliner-nusantara',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);
});

test('pengujian konversi takaran bahan baku (harga beli per kg dikonversi ke pemakaian gram pada resep)', function () {
    // 1 kg = 1000 gram, harga beli Rp 100.000
    $product = Product::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Daging Sapi',
        'unit' => 'gr',
        'min_stock' => 100,
        'current_stock' => 5000,
        'purchase_price' => 100000,
        'purchase_qty' => 1000,
        'sell_price' => 0,
    ]);

    // cost_price per gram harus otomatis dihitung: 100000 / 1000 = 100
    expect((float) $product->cost_price)->toBe(100.0);

    $recipe = Recipe::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Rendang Sapi',
        'portion_qty' => 1,
    ]);

    // Pemakaian 250 gram pada resep
    $ingredient = RecipeIngredient::create([
        'recipe_id' => $recipe->id,
        'ingredient_id' => $product->id,
        'ingredient_name' => $product->name,
        'qty' => 250,
        'unit' => 'gr',
        'ingredient_cost' => $product->cost_price,
    ]);

    // Total cost kontribusi bahan = 250 * 100 = 25.000
    expect($ingredient->total_cost)->toBe(25000.0);
    expect($recipe->fresh()->total_cost)->toBe(25000.0);
});

test('pengujian HPP porsi resep jika portion_qty bernilai pecahan (contoh: 2.5 porsi)', function () {
    $recipe = Recipe::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Adonan Kue Bulk',
        'portion_qty' => 2.5,
    ]);

    // Ingredient 1: Total cost 30.000
    RecipeIngredient::create([
        'recipe_id' => $recipe->id,
        'ingredient_name' => 'Tepung Terigu',
        'qty' => 1000,
        'unit' => 'gr',
        'ingredient_cost' => 30, // 1000 * 30 = 30.000
    ]);

    // Ingredient 2: Total cost 20.000
    RecipeIngredient::create([
        'recipe_id' => $recipe->id,
        'ingredient_name' => 'Mentega',
        'qty' => 200,
        'unit' => 'gr',
        'ingredient_cost' => 100, // 200 * 100 = 20.000
    ]);

    // Total cost batch = 30.000 + 20.000 = 50.000
    expect($recipe->total_cost)->toBe(50000.0);

    // HPP per porsi = 50.000 / 2.5 = 20.000
    expect($recipe->hpp)->toBe(20000.0);
});

test('pengujian margin keuntungan nominal dan persentase pada varian produk', function () {
    $recipe = Recipe::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Kopi Espresso',
        'portion_qty' => 1,
    ]);

    RecipeIngredient::create([
        'recipe_id' => $recipe->id,
        'ingredient_name' => 'Biji Kopi Arabika',
        'qty' => 18,
        'unit' => 'gr',
        'ingredient_cost' => 500, // 18 * 500 = 9.000
    ]);

    // HPP recipe = 9.000

    $variant = ProductVariant::create([
        'tenant_id' => $this->tenant->id,
        'name' => 'Double Espresso',
        'recipe_id' => $recipe->id,
        'recipe_qty' => 2.0, // 2x porsi recipe -> HPP = 18.000
        'sell_price' => 30000,
    ]);

    expect($variant->hpp)->toBe(18000.0);

    // Profit nominal = 30.000 - 18.000 = 12.000
    expect($variant->profit)->toBe(12000.0);

    // Margin persentase = ((30.000 - 18.000) / 30.000) * 100 = 40%
    expect($variant->margin)->toBe(40.0);
});
