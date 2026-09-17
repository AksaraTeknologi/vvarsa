import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Supplier } from './columns';

interface Props {
    supplier: Supplier;
}

export default function SupplierEdit({ supplier }: Props) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.dashboard', 'Dasbor'), href: '/admin' },
        { title: t('navigation.suppliers', 'Supplier'), href: '/admin/supplier' },
        { title: t('admin.supplier.editTitle', 'Edit Supplier'), href: `/admin/supplier/${supplier.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        contact_name: supplier.contact_name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        website: supplier.website || '',
        city: supplier.city || '',
        address: supplier.address || '',
        business_type: supplier.business_type || '',
        description: supplier.description || '',
        is_verified: !!supplier.is_verified,
        is_active: !!supplier.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/supplier/${supplier.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.supplier.editTitle')} />

            <div className="relative isolate min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)] p-4 md:p-6">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>

                <div className="relative z-10 flex w-full flex-col gap-4">
                    <div className="mb-2 flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="h-10 w-10 shrink-0 rounded-xl hover:bg-[#F1EFFD] hover:text-[#5E4BF2]">
                            <Link href="/admin/supplier" aria-label={t('common.back')}>
                                <ArrowLeft size={18} />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#17182A] md:text-[1.9rem]">
                                {t('admin.supplier.editTitle')}
                            </h1>
                            <p className="mt-1 text-sm leading-relaxed text-[#5F6073] md:text-[0.95rem]">{t('admin.supplier.editSubtitle')}</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#DCD8FF] bg-white p-5 shadow-sm md:p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Section: Informasi Dasar */}
                            <div className="space-y-4">
                                <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold text-[#303042]">
                                    {t('admin.supplier.basicInfo')}
                                </h2>
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
                                        <Select value={data.business_type} onValueChange={(value) => setData('business_type', value)}>
                                            <SelectTrigger className="h-10 w-full rounded-xl border-[#DCD8FF] bg-white text-sm hover:border-[#BDB4FF] focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20">
                                                <SelectValue placeholder={t('admin.supplier.selectBusinessType')} />
                                            </SelectTrigger>
                                            <SelectContent className="border-[#DCD8FF] bg-white">
                                                <SelectItem value="FNB" className="focus:bg-[#F1EFFD] focus:text-[#4938D9]">
                                                    F&B ({t('admin.tenants.fnb')})
                                                </SelectItem>
                                                <SelectItem value="Retail" className="focus:bg-[#F1EFFD] focus:text-[#4938D9]">
                                                    Retail ({t('admin.tenants.retail')})
                                                </SelectItem>
                                                <SelectItem value="Grosir" className="focus:bg-[#F1EFFD] focus:text-[#4938D9]">
                                                    Grosir
                                                </SelectItem>
                                                <SelectItem value="Lainnya" className="focus:bg-[#F1EFFD] focus:text-[#4938D9]">
                                                    {t('common.all')}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.business_type && <p className="text-xs text-red-500">{errors.business_type}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Kontak */}
                            <div className="space-y-4">
                                <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold text-[#303042]">
                                    {t('admin.supplier.contactAndLocation')}
                                </h2>
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
                                        <Input
                                            id="city"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            placeholder={t('admin.supplier.cityPlaceholder')}
                                        />
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
                                            className="flex min-h-[80px] w-full rounded-xl border border-[#DCD8FF] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#92909D] focus-visible:border-[#5E4BF2] focus-visible:ring-2 focus-visible:ring-[#5E4BF2]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        ></textarea>
                                        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Pengaturan & Lainnya */}
                            <div className="space-y-4">
                                <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold text-[#303042]">
                                    {t('admin.supplier.others')}
                                </h2>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        {t('admin.supplier.notes')}
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('admin.supplier.notesPlaceholder')}
                                        className="flex min-h-[80px] w-full rounded-xl border border-[#DCD8FF] bg-white px-3 py-2 text-sm outline-none placeholder:text-[#92909D] focus-visible:border-[#5E4BF2] focus-visible:ring-2 focus-visible:ring-[#5E4BF2]/20 disabled:cursor-not-allowed disabled:opacity-50"
                                    ></textarea>
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex flex-col gap-6 pt-2 sm:flex-row">
                                    <label className="flex cursor-pointer items-center space-x-2">
                                        <Checkbox
                                            id="supplier-is-active"
                                            checked={data.is_active}
                                            onCheckedChange={(checked) => setData('is_active', checked === true)}
                                            className="border-[#C9C2F5] data-[state=checked]:border-[#5E4BF2] data-[state=checked]:bg-[#5E4BF2]"
                                        />
                                        <span className="text-sm font-medium text-[#303042]">{t('admin.supplier.activeSupplier')}</span>
                                    </label>

                                    <label className="flex cursor-pointer items-center space-x-2">
                                        <Checkbox
                                            id="supplier-is-verified"
                                            checked={data.is_verified}
                                            onCheckedChange={(checked) => setData('is_verified', checked === true)}
                                            className="border-[#C9C2F5] data-[state=checked]:border-[#5E4BF2] data-[state=checked]:bg-[#5E4BF2]"
                                        />
                                        <span className="text-sm font-medium text-[#303042]">{t('admin.supplier.verified')}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 border-t border-[#DCD8FF] pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="rounded-xl border-[#F0C7CC] bg-[#FFF7F8] text-[#B6404D] hover:border-[#E8AAB2] hover:bg-[#FDECEE] hover:text-[#96333F]"
                                >
                                    <Link href="/admin/supplier">{t('common.cancel')}</Link>
                                </Button>
                                <Button type="submit" disabled={processing} className="admin-primary-button rounded-xl">
                                    <Save size={16} />
                                    {processing ? t('common.saving') : t('admin.supplier.updateSupplier')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
