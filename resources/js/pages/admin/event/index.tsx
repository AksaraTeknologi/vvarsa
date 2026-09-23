import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatDateTime, formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, CalendarDays, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.events', href: '/admin/events' },
];

export interface Event {
    id: string;
    title: string;
    organizer: string;
    business_types: string[] | null;
    location: string;
    city: string | null;
    description: string | null;
    image: string | null;
    start_date: string;
    end_date: string;
    max_participants: number | null;
    registered_count: number;
    registration_fee: string | number;
    registration_url: string | null;
    allow_platform_registration: boolean;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    events: {
        data: Event[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusColors: Record<string, string> = {
    upcoming: 'bg-[#F1EFFD] text-[#5E4BF2] dark:bg-[#5E4BF2]/20 dark:text-[#A99DFF]',
    ongoing: 'bg-white text-[#3f9567] dark:bg-emerald-950/20 dark:text-emerald-400',
    completed: 'bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
    cancelled: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export default function EventIndex({ events, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const statusLabels: Record<string, string> = {
        upcoming: t('admin.event.upcoming'),
        ongoing: t('admin.event.ongoing'),
        completed: t('admin.event.completed'),
        cancelled: t('admin.event.cancelled'),
    };

    const handleFilter = () => {
        router.get(
            '/admin/events',
            {
                search,
                status: status === 'all' ? '' : status,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus event "${title}"?`)) {
            handleAsyncAction(() => routerPromise('delete', `/admin/events/${id}`), {
                loading: `Menghapus event "${title}"...`,
                success: `Event "${title}" berhasil dihapus!`,
                error: 'Gagal Menghapus',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.event.title')} />
            <div className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col gap-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)]">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>
                {/* Page Header */}
                <div className="admin-page-header relative z-10 overflow-hidden bg-transparent px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <CalendarDays size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A] md:text-[2.1rem]">{t('admin.event.title')}</h1>
                            <p className="mt-3 text-sm leading-relaxed text-[#5F6073] md:text-[0.95rem]">{t('admin.event.subtitle')}</p>
                        </div>
                        <Link href="/admin/events/create">
                            <Button className="admin-primary-button inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white">
                                <Plus size={16} /> {t('admin.event.add')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content relative z-10 flex flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    {/* Filters */}
                    <div className="admin-filter-panel bg-card border-border flex flex-col items-center gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row">
                        <div className="relative w-full flex-1">
                            <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder={t('common.search')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full rounded-xl pl-9"
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <Select value={status} onValueChange={(val) => setStatus(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('common.status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all')}</SelectItem>
                                    <SelectItem value="upcoming">{t('admin.event.upcoming')}</SelectItem>
                                    <SelectItem value="ongoing">{t('admin.event.ongoing')}</SelectItem>
                                    <SelectItem value="completed">{t('admin.event.completed')}</SelectItem>
                                    <SelectItem value="cancelled">{t('admin.event.cancelled')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleFilter} className="admin-primary-button h-10 w-full rounded-xl px-4 text-sm font-semibold sm:w-auto">
                            {t('common.filter')}
                        </Button>
                    </div>

                    {/* Events Table */}
                    <div className="admin-data-table border-border w-full overflow-x-auto rounded-2xl border bg-white shadow-sm">
                        <table className="w-full min-w-[800px] border-collapse bg-white text-left text-xs">
                            <thead className="bg-[#F8F7FC]">
                                <tr className="border-border text-muted-foreground border-b bg-[#F8F7FC] text-[11px] font-bold tracking-wider uppercase">
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">{t('common.date')}</th>
                                    <th className="px-4 py-3">{t('common.address')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.plans.users')}</th>
                                    <th className="px-4 py-3">{t('common.amount')}</th>
                                    <th className="px-4 py-3 text-center">{t('common.status')}</th>
                                    <th className="px-4 py-3 text-center">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-border divide-y bg-white">
                                {events.data.length > 0 ? (
                                    events.data.map((event) => (
                                        <tr key={event.id} className="border-border border-b bg-white transition-colors hover:bg-[#F4F2FF]">
                                            {/* Event Detail */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {event.image ? (
                                                        <img
                                                            src={event.image}
                                                            alt={event.title}
                                                            className="h-10 w-10 rounded-lg border bg-slate-100 object-cover dark:bg-slate-800"
                                                        />
                                                    ) : (
                                                        <div className="border-muted-foreground/30 flex h-10 w-10 items-center justify-center rounded-lg border border-dashed bg-slate-100 dark:bg-slate-800">
                                                            <Calendar size={18} className="text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-foreground font-semibold">{event.title}</span>
                                                            {event.is_featured && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="border-amber-200 bg-amber-100 px-1.5 py-0 text-[10px] text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                                >
                                                                    {t('admin.plans.mostPopular')}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-muted-foreground text-xs">{t('admin.event.organizerLabel')}: {event.organizer}</span>
                                                        {event.business_types && event.business_types.length > 0 && (
                                                            <div className="mt-1 flex gap-1">
                                                                {event.business_types.map((type) => (
                                                                    <Badge key={type} variant="outline" className="rounded-full border-[#DCD8FF] bg-[#F1EFFD] px-2 py-0.5 text-[10px] font-semibold text-[#5E4BF2] uppercase">
                                                                        {type}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Date */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="text-foreground flex flex-col text-xs">
                                                    <span className="font-medium">{formatDateTime(event.start_date)}</span>
                                                    <span className="text-muted-foreground">{t('admin.event.until')} {formatDateTime(event.end_date)}</span>
                                                </div>
                                            </td>
                                            {/* Location */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col text-xs">
                                                    <span className="text-foreground font-medium">{event.location}</span>
                                                    {event.city && <span className="text-muted-foreground">{event.city}</span>}
                                                </div>
                                            </td>
                                            {/* Capacity */}
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-foreground font-semibold">{event.registered_count}</span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {t('admin.event.from')} {event.max_participants ? event.max_participants : '∞'}
                                                    </span>
                                                </div>
                                            </td>
                                            {/* Fee */}
                                            <td className="text-foreground px-4 py-3 font-medium whitespace-nowrap">
                                                {Number(event.registration_fee) === 0 ? (
                                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t('admin.plans.free')}</span>
                                                ) : (
                                                    formatRupiah(Number(event.registration_fee))
                                                )}
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <Badge
                                                    className={`rounded-full !border-[#5E4BF2] px-2 py-0.5 text-[10px] uppercase ${statusColors[event.status] || ''}`}
                                                >
                                                    {statusLabels[event.status] || event.status}
                                                </Badge>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <TooltipProvider delayDuration={150}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Tooltip>
                                                             <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    asChild
                                                                    className="h-8 w-8 text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9] dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/20 dark:hover:text-[#C4B5FD]"
                                                                >
                                                                    <Link href={`/admin/events/${event.id}/edit`}>
                                                                        <Edit size={15} className="text-[#5E4BF2] dark:text-[#A78BFA]" />
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2] dark:bg-[#7C3AED] dark:fill-[#7C3AED]"
                                                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.25)] font-semibold dark:border-purple-400/40 dark:bg-[#7C3AED]"
                                                            >
                                                                Edit event
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleDelete(event.id, event.title)}
                                                                    className="h-8 w-8 text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9] dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/20 dark:hover:text-[#C4B5FD]"
                                                                >
                                                                    <Trash2 size={15} className="text-[#5E4BF2] dark:text-[#A78BFA]" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent
                                                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2] dark:bg-[#7C3AED] dark:fill-[#7C3AED]"
                                                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.25)] font-semibold dark:border-purple-400/40 dark:bg-[#7C3AED]"
                                                            >
                                                                Hapus event
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </TooltipProvider>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white">
                                        <td colSpan={7} className="text-muted-foreground h-32 text-center text-sm">
                                            {t('common.noData')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {events.last_page > 1 && (
                        <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                            <p className="text-muted-foreground text-sm">
                                {t('community.showing')} {(events.current_page - 1) * events.per_page + 1}–
                                {Math.min(events.current_page * events.per_page, events.total)} {t('admin.event.from')} {events.total} event
                            </p>
                            <div className="flex gap-1">
                                {events.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'owner' : 'outline'}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className="h-9 rounded-xl px-3 text-sm"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
