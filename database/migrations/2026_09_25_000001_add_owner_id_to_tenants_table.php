<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Tenant;
use App\Models\User;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->foreignUuid('owner_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });

        // Set owner_id untuk tenant yang sudah ada di database
        $tenants = Tenant::all();
        foreach ($tenants as $tenant) {
            $owner = User::role('owner')->where('tenant_id', $tenant->id)->first();
            if (! $owner) {
                $owner = User::where('tenant_id', $tenant->id)->first();
            }
            if ($owner) {
                $tenant->update(['owner_id' => $owner->id]);
            }
        }
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn('owner_id');
        });
    }
};
