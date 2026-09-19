import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function SupplierCreate() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.suppliers'), href: '/suppliers' },
        { title: t('common.create'), href: '/suppliers/create' },
    ];

    const businessTypes = [
        { value: '', label: t('supplier.selectBusinessType') },
        { value: 'fnb', label: t('supplier.businessTypes.fnb') },
        { value: 'retail', label: t('supplier.businessTypes.retail') },
        { value: 'fashion', label: t('supplier.businessTypes.fashion') },
    ];

    const { data, setData, post, processing, errors, transform, reset } = useForm({
        name: '',
        contact_name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        business_type: '',
        product_categories: '',
        description: '',
    });

    // Ubah string product_categories menjadi array sebelum dikirim
    transform((data) => ({
        ...data,
        product_categories: data.product_categories
            ? data.product_categories
                  .split(',')
                  .map((cat) => cat.trim())
                  .filter(Boolean)
            : [],
    }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/suppliers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('supplier.createTitle')} />

            <div className="business-page w-full p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 shrink-0 rounded-xl">
                        <Link href="/suppliers" aria-label={t('common.back')}>
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            {t('supplier.createTitle')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('supplier.createSubtitle')}</p>
                    </div>
                </div>

                <div className="bg-card border-border rounded-2xl border p-5 shadow-sm md:p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold">{t('supplier.basicInfo')}</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        {t('supplier.supplierName')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder={t('supplier.supplierNamePlaceholder')}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                        required
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="business_type" className="text-sm font-medium">
                                        {t('supplier.businessType')}
                                    </label>
                                    <Select
                                        value={data.business_type || 'unselected'}
                                        onValueChange={(value) => setData('business_type', value === 'unselected' ? '' : value)}
                                    >
                                        <SelectTrigger
                                            id="business_type"
                                            className="h-10 w-full rounded-xl border-[#d9e5dd] bg-white text-sm text-slate-700 focus:border-owner-accent focus:ring-owner-accent/20"
                                        >
                                            <SelectValue placeholder={t('supplier.selectBusinessType')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unselected">{t('supplier.selectBusinessType')}</SelectItem>
                                            {businessTypes
                                                .filter((type) => type.value)
                                                .map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.business_type && <p className="text-xs text-red-500">{errors.business_type}</p>}
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label htmlFor="product_categories" className="text-sm font-medium">
                                        {t('supplier.productCategories')}
                                    </label>
                                    <input
                                        id="product_categories"
                                        type="text"
                                        placeholder={t('supplier.productCategoriesPlaceholder')}
                                        value={data.product_categories}
                                        onChange={(e) => setData('product_categories', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.product_categories && <p className="text-xs text-red-500">{errors.product_categories}</p>}
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        {t('supplier.shortDescription')}
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={3}
                                        placeholder={t('supplier.notesPlaceholder')}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        <hr className="border-border" />

                        {/* Contact & Location Info */}
                        <div>
                            <h2 className="mb-4 text-lg font-semibold">{t('supplier.contactAndLocation')}</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label htmlFor="contact_name" className="text-sm font-medium">
                                        {t('supplier.picName')}
                                    </label>
                                    <input
                                        id="contact_name"
                                        type="text"
                                        placeholder={t('supplier.picNamePlaceholder')}
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.contact_name && <p className="text-xs text-red-500">{errors.contact_name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="phone" className="text-sm font-medium">
                                        {t('supplier.phone')}
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder={t('supplier.phonePlaceholder')}
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        {t('common.email')}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder={t('supplier.emailPlaceholder')}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="website" className="text-sm font-medium">
                                        {t('supplier.website')}
                                    </label>
                                    <input
                                        id="website"
                                        type="url"
                                        placeholder={t('supplier.websitePlaceholder')}
                                        value={data.website}
                                        onChange={(e) => setData('website', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label htmlFor="city" className="text-sm font-medium">
                                        {t('supplier.city')}
                                    </label>
                                    <input
                                        id="city"
                                        type="text"
                                        placeholder={t('supplier.cityPlaceholder')}
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>

                                <div className="space-y-1 sm:col-span-2">
                                    <label htmlFor="address" className="text-sm font-medium">
                                        {t('supplier.fullAddress')}
                                    </label>
                                    <textarea
                                        id="address"
                                        rows={3}
                                        placeholder={t('supplier.addressPlaceholder')}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="border-border bg-background focus:ring-primary w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset()}
                                className="rounded-xl"
                            >
                                {t('supplier.reset')}
                            </Button>
                            <Button
                                type="submit"
                                variant="owner"
                                disabled={processing}
                                className="rounded-xl"
                            >
                                <Save size={16} />
                                {processing ? t('common.saving') : t('supplier.saveSupplier')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
