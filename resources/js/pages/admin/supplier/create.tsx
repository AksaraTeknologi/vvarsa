import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Supplier', href: '/admin/supplier' },
    { title: 'Tambah Supplier', href: '/admin/supplier/create' },
];

export default function SupplierCreate() {
    // Inisialisasi form state menggunakan helper Inertia
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        website: '',
        city: '',
        address: '',
        business_type: '',
        description: '',
        is_verified: false as boolean,
        is_active: true as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Ganti URL sesuai dengan route POST untuk menyimpan data
        post('/admin/supplier');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Supplier" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-foreground text-2xl font-bold tracking-tight">Tambah Supplier Baru</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Masukkan informasi detail mengenai supplier baru.</p>
                </div>

                <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                    <form onSubmit={submit} className="space-y-8 p-6">
                        {/* Section: Informasi Dasar */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">Informasi Dasar</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Nama Supplier <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="PT / CV / Nama Toko"
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="business_type" className="text-sm font-medium">
                                        Tipe Bisnis
                                    </label>
                                    <select
                                        id="business_type"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Pilih Tipe Bisnis</option>
                                        <option value="FNB">F&B (Makanan/Minuman)</option>
                                        <option value="Retail">Retail</option>
                                        <option value="Grosir">Grosir</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.business_type && <p className="text-xs text-red-500">{errors.business_type}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Kontak */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">Kontak & Lokasi</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="contact_name" className="text-sm font-medium">
                                        Nama PIC / Kontak
                                    </label>
                                    <Input
                                        id="contact_name"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        placeholder="Nama orang yang bisa dihubungi"
                                    />
                                    {errors.contact_name && <p className="text-xs text-red-500">{errors.contact_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        Nomor Telepon/WA
                                    </label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="0812xxxxxx"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@perusahaan.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="website" className="text-sm font-medium">
                                        Website
                                    </label>
                                    <Input
                                        id="website"
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium">
                                        Kota
                                    </label>
                                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} placeholder="Nama Kota" />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="address" className="text-sm font-medium">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    ></textarea>
                                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Pengaturan & Lainnya */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">Lainnya</h2>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    Deskripsi / Catatan Tambahan
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Catatan khusus tentang supplier ini..."
                                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                ></textarea>
                                {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                            </div>

                            <div className="flex flex-col gap-6 pt-2 sm:flex-row">
                                <label className="flex cursor-pointer items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                    <span className="text-sm font-medium">Supplier Aktif</span>
                                </label>

                                <label className="flex cursor-pointer items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_verified}
                                        onChange={(e) => setData('is_verified', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                    <span className="text-sm font-medium">Terverifikasi</span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 border-t pt-6">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/supplier">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Supplier'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
