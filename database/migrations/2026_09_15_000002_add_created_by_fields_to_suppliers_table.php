<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->foreignUuid('created_by_user_id')->nullable()->after('tenant_id')->constrained('users')->nullOnDelete();
            $table->string('added_by_role')->nullable()->after('created_by_user_id');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['created_by_user_id']);
            $table->dropColumn(['created_by_user_id', 'added_by_role']);
        });
    }
};
