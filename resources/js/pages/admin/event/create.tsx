import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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

const normalizeTimeInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
        return digits.length === 2 ? `${digits}:` : digits;
    }

    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

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
                            <Link href="/admin/events" aria-label={t('common.back')}>
                                <ArrowLeft size={18} />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#17182A] md:text-[1.9rem]">{t('admin.event.createTitle')}</h1>
                            <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('admin.event.createSubtitle')}</p>
                        </div>
                    </div>

                    <div className="bg-card border-[#DCD8FF] overflow-hidden rounded-2xl border p-5 shadow-sm md:p-6">
                    <form onSubmit={submit} className="space-y-6 [&_input]:border-[#DCD8FF] [&_input]:bg-white [&_input]:text-sm [&_input]:focus-visible:border-[#5E4BF2] [&_textarea]:border-[#DCD8FF] [&_textarea]:bg-white [&_textarea]:text-sm [&_textarea]:focus-visible:border-[#5E4BF2]">
                        {/* Section: Informasi Event */}
                        <div className="space-y-4">
                            <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold">{t('admin.event.eventInfo')}</h2>
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
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value as 'upcoming' | 'ongoing' | 'completed' | 'cancelled')}
                                    >
                                        <SelectTrigger
                                            id="status"
                                            className="h-10 w-full rounded-xl border-[#DCD8FF] bg-white text-sm text-slate-700 focus:border-[#5E4BF2] focus:ring-[#5E4BF2]/20"
                                        >
                                            <SelectValue placeholder={t('admin.event.eventStatus')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">{t('admin.event.upcoming')}</SelectItem>
                                            <SelectItem value="ongoing">{t('admin.event.ongoing')}</SelectItem>
                                            <SelectItem value="completed">{t('admin.event.completed')}</SelectItem>
                                            <SelectItem value="cancelled">{t('admin.event.cancelled')}</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold">{t('admin.event.timeAndLocation')}</h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="start_date" className="text-sm font-medium text-[#17182A]">
                                        {t('admin.event.startDate')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <DatePicker
                                            value={data.start_date}
                                            onChange={(date) => {
                                                const time = data.start_date.split('T')[1] || '00:00';
                                                setData('start_date', date ? `${date}T${time}` : '');
                                            }}
                                            theme="admin"
                                            placeholder="Pilih tanggal"
                                            className="admin-event-date-picker h-10 flex-1 border-[#DCD8FF] text-sm text-slate-700 hover:bg-[#F1EFFD] hover:text-[#5E4BF2] focus-visible:border-[#5E4BF2]"
                                        />
                                        <Input
                                            aria-label="Waktu mulai"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="HH:MM"
                                            maxLength={5}
                                            value={normalizeTimeInput(data.start_date.split('T')[1] || '')}
                                            onChange={(e) => {
                                                const date = data.start_date.split('T')[0];
                                                const time = normalizeTimeInput(e.target.value);
                                                setData('start_date', date ? `${date}T${time}` : `T${time}`);
                                            }}
                                            className="admin-event-time h-10 w-32 rounded-xl border-[#DCD8FF] bg-white text-sm text-slate-700 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                        />
                                    </div>
                                    {errors.start_date && <p className="text-xs text-red-500">{errors.start_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="end_date" className="text-sm font-medium text-[#17182A]">
                                        {t('admin.event.endDate')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <DatePicker
                                            value={data.end_date}
                                            onChange={(date) => {
                                                const time = data.end_date.split('T')[1] || '00:00';
                                                setData('end_date', date ? `${date}T${time}` : '');
                                            }}
                                            theme="admin"
                                            placeholder="Pilih tanggal"
                                            className="admin-event-date-picker h-10 flex-1 border-[#DCD8FF] text-sm text-slate-700 hover:bg-[#F1EFFD] hover:text-[#5E4BF2] focus-visible:border-[#5E4BF2]"
                                        />
                                        <Input
                                            aria-label="Waktu selesai"
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="HH:MM"
                                            maxLength={5}
                                            value={normalizeTimeInput(data.end_date.split('T')[1] || '')}
                                            onChange={(e) => {
                                                const date = data.end_date.split('T')[0];
                                                const time = normalizeTimeInput(e.target.value);
                                                setData('end_date', date ? `${date}T${time}` : `T${time}`);
                                            }}
                                            className="admin-event-time h-10 w-32 rounded-xl border-[#DCD8FF] bg-white text-sm text-slate-700 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                        />
                                    </div>
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
                            <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold">{t('admin.event.registrationAndFee')}</h2>
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
                            <h2 className="mb-4 border-b border-[#DCD8FF] pb-2 text-lg font-semibold">{t('admin.event.additionalDetails')}</h2>
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

                                <div className="flex flex-col gap-6 border-t border-[#DCD8FF] pt-4 sm:flex-row">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="allow_platform_registration"
                                            type="checkbox"
                                            checked={data.allow_platform_registration}
                                            onChange={(e) => setData('allow_platform_registration', e.target.checked)}
                                            className="h-4 w-4 cursor-pointer rounded border-[#DCD8FF] text-[#5E4BF2] focus:ring-[#5E4BF2]"
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
                                            className="h-4 w-4 cursor-pointer rounded border-[#DCD8FF] text-[#5E4BF2] focus:ring-[#5E4BF2]"
                                        />
                                        <label htmlFor="is_featured" className="cursor-pointer text-sm font-medium">
                                            {t('admin.event.featuredEvent')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="animate-in fade-in flex items-center justify-end gap-3 border-t border-[#DCD8FF] pt-6 duration-300">
                            <Button type="button" variant="outline" asChild>
                                <Link href="/admin/events">{t('common.cancel')}</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="admin-primary-button rounded-xl">
                                <Save size={16} />
                                {processing ? t('common.saving') : t('admin.event.saveEvent')}
                            </Button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
