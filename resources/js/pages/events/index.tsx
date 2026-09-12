import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Event, type PaginatedData } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
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
    upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    ongoing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    completed: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
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
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{t('events.pageTitle')}</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{t('events.pageSubtitle')}</p>
                </div>

                {/* Navigation Tabs */}
                <div className="border-border flex gap-2 border-b">
                    <button
                        onClick={() => handleTabChange(false)}
                        className={`-mb-[1px] border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            !onlyRegistered
                                ? 'border-primary text-primary font-bold'
                                : 'text-muted-foreground hover:text-foreground border-transparent'
                        }`}
                    >
                        {t('events.allEvents')}
                    </button>
                    <button
                        onClick={() => handleTabChange(true)}
                        className={`-mb-[1px] border-b-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                            onlyRegistered
                                ? 'border-primary text-primary font-bold'
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
                            className="h-10 w-full rounded-xl pl-9"
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
                    <Button onClick={applyFilter} className="h-10 w-full rounded-xl px-6 sm:w-auto">
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
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {events.data.map((event) => {
                            const isRegistered = registered_event_ids.includes(event.id);
                            const isFull = event.max_participants !== null && event.registered_count >= event.max_participants;
                            const calculatedStatus = getCalculatedStatus(event);
                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="bg-card border-border group overflow-hidden rounded-2xl border shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {/* Date banner */}
                                    <div className="from-primary/80 to-primary flex items-center justify-between bg-gradient-to-r px-5 py-3 text-white">
                                        <div>
                                            <p className="text-xs font-medium opacity-80">
                                                {new Date(event.start_date).toLocaleString(currentLocale, { weekday: 'long' })}
                                            </p>
                                            <p className="text-lg font-bold">
                                                {formatDate(event.start_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[calculatedStatus]}`}>
                                            {t(`events.status.${calculatedStatus}`)}
                                        </span>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition-colors">
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
                                                <span>
                                                    {t('events.registeredCount', { count: event.registered_count })}
                                                    {event.max_participants && t('events.maxCount', { max: event.max_participants })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span
                                                className={`text-sm font-semibold ${event.registration_fee === 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}
                                            >
                                                {event.registration_fee === 0 ? t('events.free') : formatRupiah(event.registration_fee)}
                                            </span>
                                            {isRegistered ? (
                                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    {t('events.registeredBadge')}
                                                </span>
                                            ) : isFull ? (
                                                <span className="text-muted-foreground rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-slate-800">
                                                    {t('events.fullBadge')}
                                                </span>
                                            ) : (
                                                <span className="text-primary text-xs font-medium">{t('events.viewDetail')}</span>
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
