<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenant_user', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'user_id']);
        });

        // Sinkronkan user yang sudah ada ke tabel pivot tenant_user
        $users = User::whereNotNull('tenant_id')->get();
        foreach ($users as $user) {
            DB::table('tenant_user')->insertOrIgnore([
                'tenant_id' => $user->tenant_id,
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Sinkronkan juga owner_id pada tenant ke pivot jika belum ada
        $tenants = Tenant::whereNotNull('owner_id')->get();
        foreach ($tenants as $tenant) {
            DB::table('tenant_user')->insertOrIgnore([
                'tenant_id' => $tenant->id,
                'user_id' => $tenant->owner_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('tenant_user');
    }
};
