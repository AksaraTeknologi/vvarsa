import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SupplierCreate() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.dashboard', 'Dasbor'), href: '/admin' },
        { title: t('navigation.suppliers', 'Supplier'), href: '/admin/supplier' },
        { title: t('admin.supplier.createTitle', 'Tambah Supplier Baru'), href: '/admin/supplier/create' },
    ];
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
        post('/admin/supplier');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.supplier.createTitle')} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('admin.supplier.createTitle')}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.supplier.createSubtitle')}</p>
                </div>

                <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                    <form onSubmit={submit} className="space-y-8 p-6">
                        {/* Section: Informasi Dasar */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.supplier.basicInfo')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        {t('admin.supplier.supplierName')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder={t('admin.supplier.supplierNamePlaceholder')}
                                        autoFocus
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="business_type" className="text-sm font-medium">
                                        {t('admin.supplier.businessType')}
                                    </label>
                                    <select
                                        id="business_type"
                                        value={data.business_type}
                                        onChange={(e) => setData('business_type', e.target.value)}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">{t('admin.supplier.selectBusinessType')}</option>
                                        <option value="FNB">F&B ({t('admin.tenants.fnb')})</option>
                                        <option value="Retail">Retail ({t('admin.tenants.retail')})</option>
                                        <option value="Grosir">Grosir</option>
                                        <option value="Lainnya">{t('common.all')}</option>
                                    </select>
                                    {errors.business_type && <p className="text-xs text-red-500">{errors.business_type}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Kontak */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.supplier.contactAndLocation')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="contact_name" className="text-sm font-medium">
                                        {t('admin.supplier.picName')}
                                    </label>
                                    <Input
                                        id="contact_name"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        placeholder={t('admin.supplier.picNamePlaceholder')}
                                    />
                                    {errors.contact_name && <p className="text-xs text-red-500">{errors.contact_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        {t('common.phone')}
                                    </label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder={t('admin.supplier.phonePlaceholder')}
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        {t('common.email')}
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={t('admin.supplier.emailPlaceholder')}
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
                                        placeholder={t('admin.supplier.websitePlaceholder')}
                                    />
                                    {errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium">
                                        {t('admin.supplier.city')}
                                    </label>
                                    <Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} placeholder={t('admin.supplier.cityPlaceholder')} />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="address" className="text-sm font-medium">
                                        {t('admin.supplier.fullAddress')}
                                    </label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder={t('admin.supplier.addressPlaceholder')}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    ></textarea>
                                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Pengaturan & Lainnya */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.supplier.others')}</h2>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium">
                                    {t('admin.supplier.notes')}
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder={t('admin.supplier.notesPlaceholder')}
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
                                    <span className="text-sm font-medium">{t('admin.supplier.activeSupplier')}</span>
                                </label>

                                <label className="flex cursor-pointer items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.is_verified}
                                        onChange={(e) => setData('is_verified', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                    />
                                    <span className="text-sm font-medium">{t('admin.supplier.verified')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 border-t pt-6">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/supplier">{t('common.cancel')}</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? t('common.saving') : t('admin.supplier.saveSupplier')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
