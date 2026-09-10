import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.events', href: '/admin/events' },
    { title: 'admin.event.createTitle', href: '/admin/events/create' },
];

const BUSINESS_TYPES = [
    { id: 'fnb', labelKey: 'admin.tenants.fnb' },
    { id: 'retail', labelKey: 'admin.tenants.retail' },
    { id: 'fashion', labelKey: 'admin.tenants.fashion' },
    { id: 'general', labelKey: 'admin.tenants.general' },
    { id: 'service', labelKey: 'admin.tenants.service' },
];

export default function EventCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        organizer: '',
        business_types: [] as string[],
        location: '',
        city: '',
        description: '',
        image: null as File | null,
        start_date: '',
        end_date: '',
        max_participants: '' as string | number,
        registration_fee: 0 as number,
        registration_url: '',
        allow_platform_registration: true as boolean,
        status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled',
        is_featured: false as boolean,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/events');
    };

    const handleBusinessTypeChange = (id: string, checked: boolean) => {
        if (checked) {
            setData('business_types', [...data.business_types, id]);
        } else {
            setData(
                'business_types',
                data.business_types.filter((t) => t !== id),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.event.createTitle')} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('admin.event.createTitle')}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{t('admin.event.createSubtitle')}</p>
                </div>

                <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
                    <form onSubmit={submit} className="space-y-8 p-6">
                        {/* Section: Informasi Event */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.event.eventInfo')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="title" className="text-sm font-medium">
                                        {t('admin.event.eventTitle')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder={t('admin.event.eventTitlePlaceholder')}
                                        autoFocus
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="organizer" className="text-sm font-medium">
                                        {t('admin.event.organizer')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="organizer"
                                        value={data.organizer}
                                        onChange={(e) => setData('organizer', e.target.value)}
                                        placeholder={t('admin.event.organizerPlaceholder')}
                                    />
                                    {errors.organizer && <p className="text-xs text-red-500">{errors.organizer}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="status" className="text-sm font-medium">
                                        {t('admin.event.eventStatus')} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled')}
                                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="upcoming">{t('admin.event.upcoming')}</option>
                                        <option value="ongoing">{t('admin.event.ongoing')}</option>
                                        <option value="completed">{t('admin.event.completed')}</option>
                                        <option value="cancelled">{t('admin.event.cancelled')}</option>
                                    </select>
                                    {errors.status && <p className="text-xs text-red-500">{errors.status}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-sm font-medium">{t('admin.event.targetBusinessType')}</label>
                                    <div className="mt-2 flex flex-wrap gap-4">
                                        {BUSINESS_TYPES.map((type) => (
                                            <div key={type.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${type.id}`}
                                                    checked={data.business_types.includes(type.id)}
                                                    onCheckedChange={(checked) => handleBusinessTypeChange(type.id, !!checked)}
                                                />
                                                <label
                                                    htmlFor={`type-${type.id}`}
                                                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {t(type.labelKey)}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.business_types && <p className="text-xs text-red-500">{errors.business_types}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Waktu & Lokasi */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.event.timeAndLocation')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="start_date" className="text-sm font-medium">
                                        {t('admin.event.startDate')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="start_date"
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                    />
                                    {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="end_date" className="text-sm font-medium">
                                        {t('admin.event.endDate')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="end_date"
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                    />
                                    {errors.end_date && <p className="text-xs text-red-500">{errors.end_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="location" className="text-sm font-medium">
                                        {t('admin.event.location')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder={t('admin.event.locationPlaceholder')}
                                    />
                                    {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="text-sm font-medium">
                                        {t('admin.supplier.city')}
                                    </label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        placeholder={t('admin.event.cityPlaceholder')}
                                    />
                                    {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Registrasi & Biaya */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.event.registrationAndFee')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="registration_fee" className="text-sm font-medium">
                                        {t('admin.event.registrationFee')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="registration_fee"
                                        type="number"
                                        value={data.registration_fee}
                                        onChange={(e) => setData('registration_fee', Number(e.target.value))}
                                        placeholder={t('admin.event.freePlaceholder')}
                                    />
                                    {errors.registration_fee && <p className="text-xs text-red-500">{errors.registration_fee}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="max_participants" className="text-sm font-medium">
                                        {t('admin.event.maxParticipants')}
                                    </label>
                                    <Input
                                        id="max_participants"
                                        type="number"
                                        value={data.max_participants}
                                        onChange={(e) => setData('max_participants', e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder={t('admin.event.unlimitedPlaceholder')}
                                    />
                                    {errors.max_participants && <p className="text-xs text-red-500">{errors.max_participants}</p>}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="registration_url" className="text-sm font-medium">
                                        {t('admin.event.externalRegUrl')}
                                    </label>
                                    <Input
                                        id="registration_url"
                                        type="url"
                                        value={data.registration_url}
                                        onChange={(e) => setData('registration_url', e.target.value)}
                                        placeholder={t('admin.event.externalRegUrlPlaceholder')}
                                    />
                                    {errors.registration_url && <p className="text-xs text-red-500">{errors.registration_url}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section: Deskripsi & Media */}
                        <div className="space-y-4">
                            <h2 className="border-b pb-2 text-lg font-semibold">{t('admin.event.additionalDetails')}</h2>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="image" className="text-sm font-medium">
                                        {t('admin.event.eventPoster')}
                                    </label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            setData('image', file);
                                        }}
                                        className="cursor-pointer"
                                    />
                                    {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                                    {data.image && data.image instanceof File && (
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {t('admin.event.selectedFile')} {data.image.name} ({Math.round(data.image.size / 1024)} KB)
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        {t('admin.event.fullDescription')}
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('admin.event.descriptionPlaceholder')}
                                        rows={5}
                                    />
                                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                </div>

                                <div className="flex flex-col gap-6 border-t pt-4 sm:flex-row">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="allow_platform_registration"
                                            type="checkbox"
                                            checked={data.allow_platform_registration}
                                            onChange={(e) => setData('allow_platform_registration', e.target.checked)}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <label htmlFor="allow_platform_registration" className="cursor-pointer text-sm font-medium">
                                            {t('admin.event.allowPlatformReg')}
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="is_featured"
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                        />
                                        <label htmlFor="is_featured" className="cursor-pointer text-sm font-medium">
                                            {t('admin.event.featuredEvent')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="animate-in fade-in flex items-center justify-end gap-3 border-t pt-6 duration-300">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/events">{t('common.cancel')}</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="rounded-xl">
                                {processing ? t('common.saving') : t('admin.event.saveEvent')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
