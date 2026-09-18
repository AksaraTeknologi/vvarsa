<?php

namespace Tests\Feature;

use App\Models\SubscriptionPlan;
use App\Models\Supplier;
use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupplierGoogleMapsImportTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenant;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(PermissionSeeder::class);
        $this->seed(SubscriptionPlanSeeder::class);

        $plan = SubscriptionPlan::where('slug', 'free')->first();

        $this->tenant = Tenant::create([
            'name' => 'Tenant Test',
            'slug' => 'tenant-test-' . uniqid(),
            'business_type' => 'fnb',
            'plan_id' => $plan->id,
            'is_active' => true,
        ]);

        $this->user = User::create([
            'name' => 'Owner Test',
            'email' => 'owner.test.' . uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'tenant_id' => $this->tenant->id,
        ]);
        $this->user->assignRole('owner');
    }

    public function test_dapat_menyimpan_supplier_dari_link_embed_prima_kost(): void
    {
        $websiteUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31615.020231318595!2d112.5480112743164!3d-7.907860899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78813ae62bad57%3A0xb88cf640267bfc08!2sPRIMA%20KOST%20PUTRA%20(%20Pak.Sudibyo%20)!5e0!3m2!1sid!2sid!4v1789525441286!5m2!1sid!2sid';

        $payload = [
            'name' => 'PRIMA KOST PUTRA ( Pak.Sudibyo )',
            'phone' => '0812-3456-7890',
            'email' => null,
            'website' => $websiteUrl,
            'city' => 'Malang',
            'address' => 'Jl. Raya Tegalgondo, Dsn Dawuhan, Tegalgondo, Kec. Karang Ploso, Kabupaten Malang, Jawa Timur 65152',
            'business_type' => 'fnb',
            'product_categories' => ['Kost'],
            'description' => 'Supplier akomodasi / kost putra',
            'rating' => 5.0,
            'review_count' => 2,
        ];

        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Tenant-ID' => $this->tenant->id])
            ->post(route('suppliers.store'), $payload);

        $response->assertRedirect(route('suppliers.index'));

        $this->assertDatabaseHas('suppliers', [
            'tenant_id' => $this->tenant->id,
            'name' => 'PRIMA KOST PUTRA ( Pak.Sudibyo )',
            'city' => 'Malang',
            'website' => $websiteUrl,
            'rating' => 5.0,
            'review_count' => 2,
        ]);
    }

    public function test_dapat_menyimpan_supplier_dari_link_embed_polije(): void
    {
        $websiteUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2023887.1556059162!2d111.26493371176944!3d-7.799924233214484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695b617d8f623%3A0xf6c4437632474338!2sPoliteknik%20Negeri%20Jember!5e0!3m2!1sid!2sid!4v1789527039652!5m2!1sid!2sid';

        $payload = [
            'name' => 'Politeknik Negeri Jember',
            'phone' => '0331-333532',
            'email' => 'info@polije.ac.id',
            'website' => $websiteUrl,
            'city' => 'Jember',
            'address' => 'Jl. Mastrip, Kec. Sumbersari, Kabupaten Jember, Jawa Timur 68121',
            'business_type' => 'fnb',
            'product_categories' => ['Pendidikan', 'Supplier Utama'],
            'description' => 'Politeknik Negeri Jember (Polije)',
            'rating' => 4.8,
            'review_count' => 150,
        ];

        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Tenant-ID' => $this->tenant->id])
            ->post(route('suppliers.store'), $payload);

        $response->assertRedirect(route('suppliers.index'));

        $this->assertDatabaseHas('suppliers', [
            'tenant_id' => $this->tenant->id,
            'name' => 'Politeknik Negeri Jember',
            'city' => 'Jember',
            'website' => $websiteUrl,
            'rating' => 4.8,
            'review_count' => 150,
        ]);
    }

    public function test_dapat_melakukan_web_scraping_endpoint_parse_link(): void
    {
        $websiteUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2023887.1556059162!2d111.26493371176944!3d-7.799924233214484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd695b617d8f623%3A0xf6c4437632474338!2sPoliteknik%20Negeri%20Jember!5e0!3m2!1sid!2sid!4v1789527039652!5m2!1sid!2sid';

        \Illuminate\Support\Facades\Http::fake([
            'https://www.google.com/maps/*' => \Illuminate\Support\Facades\Http::response('
                <html><body>
                    ["0x2dd695b617d8f623:0xf6c4437632474338", "Politeknik Negeri Jember, Jl. Mastrip, Sumbersari, Jember", [-8.1585, 113.7229]],
                    4.7, "710 ulasan", null, null, "0331333532"
                </body></html>
            ', 200),
        ]);

        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Tenant-ID' => $this->tenant->id])
            ->postJson(route('suppliers.parse-link'), ['url' => $websiteUrl]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $data = $response->json('data');
        $this->assertEquals('Politeknik Negeri Jember', $data['name']);
        $this->assertEquals('Jember', $data['city']);
        $this->assertEquals(4.7, $data['rating']);
        $this->assertEquals(710, $data['review_count']);
        $this->assertEquals('0331333532', $data['phone']);
    }

    public function test_dapat_menyimpan_supplier_sesuai_role_user_pembuat(): void
    {
        $staffUser = User::create([
            'name' => 'Staff Test',
            'email' => 'staff.test.' . uniqid() . '@example.com',
            'password' => bcrypt('password'),
            'tenant_id' => $this->tenant->id,
        ]);
        $staffUser->assignRole('staff');

        $payload = [
            'name' => 'Supplier Oleh Staff',
            'city' => 'Malang',
            'address' => 'Jl. Kebon Agung Malang',
            'business_type' => 'fnb',
        ];

        $response = $this->actingAs($staffUser)
            ->withHeaders(['X-Tenant-ID' => $this->tenant->id])
            ->post(route('suppliers.store'), $payload);

        $response->assertRedirect(route('suppliers.index'));

        $this->assertDatabaseHas('suppliers', [
            'tenant_id' => $this->tenant->id,
            'name' => 'Supplier Oleh Staff',
            'added_by_role' => 'staff',
        ]);
    }
}
