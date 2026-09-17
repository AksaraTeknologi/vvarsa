import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type Event, type PaginatedData } from '@/types/mrp';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { CalendarDays, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    events: PaginatedData<Event>;
    registered_event_ids: (string | number)[];
    cities: string[];
    filters: { search?: string; city?: string; business_type?: string; only_registered?: string };
}

const BUSINESS_TYPE_KEYS = ['', 'fnb', 'retail', 'fashion', 'general', 'service'];

const STATUS_STYLES: Record<string, string> = {
    upcoming: 'border border-white/40 bg-white/20 text-white',
    ongoing: 'border border-white/40 bg-white/20 text-white',
    completed: 'border border-white/40 bg-white/20 text-white',
    cancelled: 'border border-white/40 bg-white/20 text-white',
};

export const getCalculatedStatus = (event: {
    status: string;
    start_date: string;
    end_date: string;
}): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' => {
    if (event.status === 'cancelled') return 'cancelled';

    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now > endDate) {
        return 'completed';
    } else if (now >= startDate && now <= endDate) {
        return 'ongoing';
    } else {
        const isSameDay = now.toDateString() === startDate.toDateString();
        if (isSameDay) {
            return 'ongoing';
        }
        return 'upcoming';
    }
};

export default function EventsIndex({ events, registered_event_ids, cities, filters }: Props) {
    const { t, i18n } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const isOwner = auth.user?.roles?.includes('owner') ?? false;
    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');
    const [businessType, setBusinessType] = useState(filters.business_type || '');

    const currentLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('events.title'), href: '/events' }];

    const onlyRegistered = filters.only_registered === 'true' || filters.only_registered === '1';

    const applyFilter = () => {
        router.get(
            '/events',
            {
                search,
                business_type: businessType,
                city,
                only_registered: onlyRegistered ? 'true' : '',
            },
            { preserveState: true },
        );
    };

    const handleTabChange = (showRegistered: boolean) => {
        router.get(
            '/events',
            {
                search,
                business_type: businessType,
                city,
                only_registered: showRegistered ? 'true' : '',
            },
            { preserveState: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('events.pageTitle')} />
            <div className="business-page flex flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">
                        {t('events.pageTitle')}
                    </h1>
                    <p className="business-page-subtitle text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">
                        {t('events.pageSubtitle')}
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-border flex gap-2 border-b">
                    <button
                        onClick={() => handleTabChange(false)}
                        className={`-mb-[1px] border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            !onlyRegistered
                                ? `${isOwner ? 'border-[#3f9567] text-[#3f9567]' : 'border-[#2596be] text-[#2596be]'} font-bold`
                                : 'text-muted-foreground hover:text-foreground border-transparent'
                        }`}
                    >
                        {t('events.allEvents')}
                    </button>
                    <button
                        onClick={() => handleTabChange(true)}
                        className={`-mb-[1px] border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            onlyRegistered
                                ? `${isOwner ? 'border-[#3f9567] text-[#3f9567]' : 'border-[#2596be] text-[#2596be]'} font-bold`
                                : 'text-muted-foreground hover:text-foreground border-transparent'
                        }`}
                    >
                        {t('events.myEvents', { count: registered_event_ids.length })}
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-card border-border flex flex-col items-center gap-3 rounded-2xl border p-4 sm:flex-row">
                    <div className="relative w-full flex-1">
                        <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder={t('events.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="h-10 w-full rounded-xl border-[#c7e0ce] !bg-white pl-9 text-[#254533] placeholder:text-[#9aa9a0] focus-visible:border-[#6bb789] focus-visible:ring-[#5aa67a]/20"
                        />
                    </div>
                    <Select value={businessType || 'all'} onValueChange={(val) => setBusinessType(val === 'all' ? '' : val)}>
                        <SelectTrigger className="h-10 w-full rounded-xl sm:w-[180px]">
                            <SelectValue placeholder={t('events.categoryPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {BUSINESS_TYPE_KEYS.map((key) => (
                                <SelectItem key={key || 'all'} value={key || 'all'}>
                                    {t(`events.categories.${key || 'all'}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={city || 'all'} onValueChange={(val) => setCity(val === 'all' ? '' : val)}>
                        <SelectTrigger className="h-10 w-full rounded-xl sm:w-[180px]">
                            <SelectValue placeholder={t('events.cityPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('events.allCities')}</SelectItem>
                            {cities.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="owner" onClick={applyFilter} className="h-10 w-full rounded-xl px-6 sm:w-auto">
                        {t('events.filter')}
                    </Button>
                </div>

                {/* Event Cards */}
                {events.data.length === 0 ? (
                    <div className="bg-card border-border rounded-2xl border py-16 text-center">
                        <CalendarDays size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">{t('events.noEventsFound')}</p>
                    </div>
                ) : (
                    <div className="grid gap-5 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((event) => {
                            const isRegistered = registered_event_ids.includes(event.id);
                            const isFull = event.max_participants !== null && event.registered_count >= event.max_participants;
                            const calculatedStatus = getCalculatedStatus(event);
                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="business-event-card bg-card border-border group overflow-hidden rounded-2xl border shadow-sm transition-[transform,box-shadow,border-color] duration-300 ease-out [transform-style:preserve-3d] hover:[transform:translateY(-6px)_rotateX(2deg)_rotateY(3deg)_translateZ(6px)] hover:border-[#a9d4b6] hover:shadow-[0_18px_30px_rgba(63,149,103,0.18)] motion-reduce:transition-none motion-reduce:hover:transform-none"
                                >
                                    {/* Date banner */}
                                    <div className="flex [transform:translateZ(8px)] items-center justify-between border-b border-[#3f9567] bg-[#5aa67a] px-5 py-3 text-white">
                                        <div>
                                            <p className="text-xs font-medium text-white/80">
                                                {new Date(event.start_date).toLocaleString(currentLocale, { weekday: 'long' })}
                                            </p>
                                            <p className="text-lg font-bold text-white">
                                                {formatDate(event.start_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[calculatedStatus]}`}>
                                            {t(`events.status.${calculatedStatus}`)}
                                        </span>
                                    </div>

                                    <div className="[transform:translateZ(6px)] p-5">
                                        <h3
                                            className={`line-clamp-2 leading-snug font-semibold transition-colors ${isOwner ? 'group-hover:text-[#3f9567]' : 'group-hover:text-[#2596be]'}`}
                                        >
                                            {event.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">{event.organizer}</p>

                                        <div className="mt-3 flex flex-col gap-1.5">
                                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                <MapPin size={12} />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                <Users size={12} />
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[calculatedStatus]}`}
                                                ></span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span
                                                className={`text-sm font-semibold ${event.registration_fee === 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                                            >
                                                {event.registration_fee === 0 ? t('events.free') : formatRupiah(event.registration_fee)}
                                            </span>
                                            {isRegistered ? (
                                                <span className="rounded-full border border-[#9bc9aa] bg-white px-3 py-1 text-xs font-semibold text-[#3f9567]">
                                                    {t('events.registeredBadge')}
                                                </span>
                                            ) : isFull ? (
                                                <span className="text-muted-foreground rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
                                                    {t('events.fullBadge')}
                                                </span>
                                            ) : (
                                                <span className={`${isOwner ? 'text-[#3f9567]' : 'text-[#2596be]'} text-xs font-medium`}>
                                                    {t('events.viewDetail')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
