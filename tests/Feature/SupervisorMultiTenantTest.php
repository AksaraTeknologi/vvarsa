<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class SupervisorMultiTenantTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'owner']);
        Role::firstOrCreate(['name' => 'supervisor']);
        Role::firstOrCreate(['name' => 'staff']);
    }

    public function test_owner_can_import_supervisor_from_another_owned_tenant(): void
    {
        $plan = SubscriptionPlan::firstOrCreate(
            ['slug' => 'pro'],
            ['name' => 'Pro', 'price' => 100000, 'max_users' => 5, 'max_products' => 100, 'features' => [], 'is_active' => true]
        );

        // Buat Owner
        $owner = User::factory()->create();
        $owner->assignRole('owner');

        // Buat Tenant 1
        $tenant1 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Toko Cabang 1',
            'slug' => 'toko-cabang-1-'.Str::random(6),
            'business_type' => 'retail',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);
        $tenant1->users()->attach($owner->id);
        $owner->update(['tenant_id' => $tenant1->id]);

        // Buat Tenant 2
        $tenant2 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Toko Cabang 2',
            'slug' => 'toko-cabang-2-'.Str::random(6),
            'business_type' => 'retail',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);
        $tenant2->users()->attach($owner->id);

        // Buat Supervisor di Tenant 1
        $supervisor = User::factory()->create([
            'tenant_id' => $tenant1->id,
        ]);
        $supervisor->assignRole('supervisor');
        $tenant1->users()->attach($supervisor->id);

        // Login sebagai Owner di Tenant 2
        $owner->update(['tenant_id' => $tenant2->id]);
        $this->actingAs($owner);

        // Akses halaman anggota tim di Tenant 2 - harus ada available_supervisors
        $response = $this->get(route('members.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('owner/members/index')
            ->has('available_supervisors', 1)
            ->where('available_supervisors.0.id', $supervisor->id)
        );

        // Import supervisor dari Tenant 1 ke Tenant 2
        $importResponse = $this->post(route('members.import-supervisor'), [
            'supervisor_id' => $supervisor->id,
        ]);

        $importResponse->assertRedirect();
        $importResponse->assertSessionHas('success');

        // Pastikan supervisor sekarang terdaftar di kedua tenant
        $this->assertTrue($tenant1->users()->where('users.id', $supervisor->id)->exists());
        $this->assertTrue($tenant2->users()->where('users.id', $supervisor->id)->exists());
    }

    public function test_supervisor_can_switch_between_assigned_tenants(): void
    {
        $plan = SubscriptionPlan::firstOrCreate(
            ['slug' => 'pro'],
            ['name' => 'Pro', 'price' => 100000, 'max_users' => 5, 'max_products' => 100, 'features' => [], 'is_active' => true]
        );

        $owner = User::factory()->create();
        $owner->assignRole('owner');

        $tenant1 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Resto A',
            'slug' => 'resto-a-'.Str::random(6),
            'business_type' => 'fnb',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);

        $tenant2 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Resto B',
            'slug' => 'resto-b-'.Str::random(6),
            'business_type' => 'fnb',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);

        $supervisor = User::factory()->create(['tenant_id' => $tenant1->id]);
        $supervisor->assignRole('supervisor');
        $tenant1->users()->attach($supervisor->id);
        $tenant2->users()->attach($supervisor->id);

        // Login sebagai supervisor di Resto A
        $this->actingAs($supervisor);

        // Switch ke Resto B
        $switchResponse = $this->post(route('owner.tenants.switch'), [
            'tenant_id' => $tenant2->id,
        ]);

        $switchResponse->assertRedirect(route('dashboard'));
        $this->assertEquals($tenant2->id, $supervisor->fresh()->tenant_id);
    }

    public function test_destroy_supervisor_from_one_tenant_does_not_delete_user_if_in_other_tenants(): void
    {
        $plan = SubscriptionPlan::firstOrCreate(
            ['slug' => 'pro'],
            ['name' => 'Pro', 'price' => 100000, 'max_users' => 5, 'max_products' => 100, 'features' => [], 'is_active' => true]
        );

        $owner = User::factory()->create();
        $owner->assignRole('owner');

        $tenant1 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Cabang X',
            'slug' => 'cabang-x-'.Str::random(6),
            'business_type' => 'fnb',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);

        $tenant2 = Tenant::create([
            'owner_id' => $owner->id,
            'name' => 'Cabang Y',
            'slug' => 'cabang-y-'.Str::random(6),
            'business_type' => 'fnb',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);

        $supervisor = User::factory()->create(['tenant_id' => $tenant1->id]);
        $supervisor->assignRole('supervisor');
        $tenant1->users()->attach($supervisor->id);
        $tenant2->users()->attach($supervisor->id);

        // Login owner di Cabang X
        $owner->update(['tenant_id' => $tenant1->id]);
        $this->actingAs($owner);

        // Hapus supervisor dari Cabang X
        $deleteResponse = $this->delete(route('members.destroy', $supervisor->id));
        $deleteResponse->assertRedirect();

        // User supervisor harus tetap ada di DB karena masih di Cabang Y
        $this->assertDatabaseHas('users', ['id' => $supervisor->id]);
        $this->assertFalse($tenant1->users()->where('users.id', $supervisor->id)->exists());
        $this->assertTrue($tenant2->users()->where('users.id', $supervisor->id)->exists());
        $this->assertEquals($tenant2->id, $supervisor->fresh()->tenant_id);
    }
}
