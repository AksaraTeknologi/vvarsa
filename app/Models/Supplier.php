<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Supplier extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'created_by_user_id',
        'added_by_role',
        'name',
        'contact_name',
        'phone',
        'email',
        'website',
        'address',
        'city',
        'latitude',
        'longitude',
        'product_categories',
        'business_type',
        'rating',
        'review_count',
        'logo',
        'description',
        'is_verified',
        'is_active',
    ];

    protected $casts = [
        'product_categories' => 'array',
        'rating' => 'double',
        'latitude' => 'double',
        'longitude' => 'double',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    // Global suppliers have tenant_id = null
    public function scopeGlobal($query)
    {
        return $query->whereNull('tenant_id');
    }

    public function scopeForBusinessType($query, string $type)
    {
        return $query->where('business_type', $type)->orWhereNull('business_type');
    }
}
