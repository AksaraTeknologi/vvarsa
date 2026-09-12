<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeIngredient extends Model
{
    use HasUuids;

    protected $fillable = [
        'recipe_id',
        'ingredient_id',
        'ingredient_name',
        'qty',
        'unit',
        'ingredient_cost',
    ];

    protected $casts = [
        'qty' => 'decimal:3',
        'ingredient_cost' => 'decimal:2',
    ];

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class, 'recipe_id');
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'ingredient_id');
    }

    /**
     * Effective unit cost of the ingredient based on the latest raw material price (Product.cost_price).
     */
    public function getEffectiveCostAttribute(): float
    {
        if ($this->relationLoaded('ingredient') && $this->ingredient) {
            $cost = (float) $this->ingredient->cost_price;
            if ($cost > 0) {
                return $cost;
            }
        }

        if ($this->ingredient_id) {
            $productCost = Product::where('id', $this->ingredient_id)->value('cost_price');
            if ($productCost !== null && (float) $productCost > 0) {
                return (float) $productCost;
            }
        }

        return (float) $this->ingredient_cost;
    }

    /**
     * Total cost contribution = effective_cost * qty
     */
    public function getTotalCostAttribute(): float
    {
        return $this->effective_cost * (float) $this->qty;
    }
}
