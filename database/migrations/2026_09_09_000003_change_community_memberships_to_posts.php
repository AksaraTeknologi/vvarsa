<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('community_memberships', 'post_id')) {
            Schema::table('community_memberships', function (Blueprint $table) {
                $table->foreignUuid('post_id')->nullable()->after('user_id');
            });
        }

        DB::table('community_memberships')->delete();

        Schema::table('community_memberships', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique('community_memberships_user_id_business_type_unique');
            $table->dropIndex('community_memberships_business_type_index');
            $table->dropColumn('business_type');
        });

        Schema::table('community_memberships', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('post_id')->references('id')->on('community_posts')->cascadeOnDelete();
            $table->unique(['user_id', 'post_id']);
            $table->index('post_id');
            $table->uuid('post_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('community_memberships', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropUnique('community_memberships_user_id_post_id_unique');
            $table->dropIndex('community_memberships_post_id_index');
            $table->dropColumn('post_id');
            $table->string('business_type');
            $table->unique(['user_id', 'business_type']);
            $table->index('business_type');
        });
    }
};
