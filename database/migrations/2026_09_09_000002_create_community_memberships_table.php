<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('community_memberships', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->string('business_type');
            $table->timestamps();

            $table->unique(['user_id', 'business_type']);
            $table->index('business_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('community_memberships');
    }
};
