<?php

use App\Models\MemberRequest;
use App\Models\SubscriptionPlan;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;

beforeEach(function () {
    $this->seed(PermissionSeeder::class);
    $this->seed(SubscriptionPlanSeeder::class);

    $plan = SubscriptionPlan::where('slug', 'pro')->first();

    $this->tenant = Tenant::create([
        'name' => 'Resto Berkah',
        'slug' => 'resto-berkah',
        'business_type' => 'fnb',
        'plan_id' => $plan->id,
        'is_active' => true,
    ]);

    // Platform Admin User
    $this->adminUser = User::create([
        'name' => 'Platform Admin',
        'email' => 'admin@vvarsa.com',
        'password' => bcrypt('password'),
        'tenant_id' => null,
        'is_active' => true,
    ]);
    $this->adminUser->assignRole('admin');

    // Tenant Owner User
    $this->ownerUser = User::create([
        'name' => 'Tenant Owner',
        'email' => 'owner@berkah.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant->id,
        'is_active' => true,
    ]);
    $this->ownerUser->assignRole('owner');

    // Tenant Supervisor User
    $this->supervisorUser = User::create([
        'name' => 'Tenant Supervisor',
        'email' => 'supervisor@berkah.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant->id,
        'is_active' => true,
    ]);
    $this->supervisorUser->assignRole('supervisor');

    // Tenant Staff User
    $this->staffUser = User::create([
        'name' => 'Tenant Staff',
        'email' => 'staff@berkah.com',
        'password' => bcrypt('password'),
        'tenant_id' => $this->tenant->id,
        'is_active' => true,
    ]);
    $this->staffUser->assignRole('staff');
});

test('Staff dilarang mengakses /finance/*, /tax/*, dan /members/*', function () {
    $this->actingAs($this->staffUser);

    // Finance routes
    $this->get(route('finance.index'))->assertStatus(403);
    $this->get(route('finance.transactions'))->assertStatus(403);
    $this->get(route('finance.sales-report'))->assertStatus(403);
    $this->get(route('finance.expense-report'))->assertStatus(403);

    // Tax index route
    $this->get(route('tax.index'))->assertStatus(403);

    // Member routes
    $this->get(route('members.index'))->assertStatus(403);
});

test('Supervisor bisa mengajukan MemberRequest namun dilarang menyetujui (approve) request tersebut', function () {
    $this->actingAs($this->supervisorUser);

    // Supervisor can create member request
    $response = $this->post(route('members.store'), [
        'name' => 'Calon Staff',
        'email' => 'calonstaff@example.com',
        'password' => 'password123',
        'role' => 'staff',
    ]);

    $response->assertSessionHas('success');

    $this->assertDatabaseHas('member_requests', [
        'tenant_id' => $this->tenant->id,
        'requested_by' => $this->supervisorUser->id,
        'email' => 'calonstaff@example.com',
        'status' => 'pending',
    ]);

    $memberRequest = MemberRequest::where('email', 'calonstaff@example.com')->first();

    // Supervisor is forbidden from approving the request
    $this->post(route('members.requests.approve', $memberRequest))
        ->assertStatus(403);

    expect($memberRequest->fresh()->isPending())->toBeTrue();
});

test('Owner memiliki akses penuh ke seluruh rute tenant namun dilarang mengakses rute platform admin /admin/*', function () {
    $this->actingAs($this->ownerUser);

    // Tenant routes access
    $this->get(route('dashboard'))->assertOk();
    $this->get(route('inventory.index'))->assertOk();
    $this->get(route('finance.index'))->assertOk();
    $this->get(route('tax.index'))->assertOk();
    $this->get(route('members.index'))->assertOk();

    // Forbidden from accessing platform admin routes
    $this->get(route('admin.dashboard'))->assertStatus(403);
    $this->get(route('admin.tenants.index'))->assertStatus(403);
    $this->get(route('admin.users.index'))->assertStatus(403);
    $this->get(route('admin.plans.index'))->assertStatus(403);
});

test('Admin Platform hanya bisa mengakses /admin/* dan tidak bisa mengakses dashboard tenant', function () {
    $this->actingAs($this->adminUser);

    // Admin platform access
    $this->get(route('admin.dashboard'))->assertOk();
    $this->get(route('admin.tenants.index'))->assertOk();
    $this->get(route('admin.users.index'))->assertOk();
    $this->get(route('admin.plans.index'))->assertOk();

    // Attempting to access tenant dashboard redirects to admin dashboard
    $this->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
});
