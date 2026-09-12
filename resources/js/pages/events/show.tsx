import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatDate, formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Event } from '@/types/mrp';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CalendarDays, CheckCircle, Clock, MapPin, Users, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getCalculatedStatus } from './index';

interface Registration {
    id: number;
    user: { id: number; name: string; tenant_id: number };
    tenant: { id: number; name: string };
    status: string;
    registered_at: string;
}

interface Props {
    event: Event;
    is_registered: boolean;
    recent_registrations: Registration[];
}

export default function EventShow({ event, is_registered, recent_registrations }: Props) {
    const { t, i18n } = useTranslation();
    const calculatedStatus = getCalculatedStatus(event);
    const isFull = event.max_participants !== null && event.registered_count >= event.max_participants;
    const canRegister = event.allow_platform_registration && calculatedStatus === 'upcoming' && !isFull;

    const currentLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('events.title'), href: '/events' },
        { title: event.title, href: `/events/${event.id}` },
    ];

    const handleRegister = () => {
        handleAsyncAction(() => routerPromise('post', `/events/${event.id}/register`, {}, { preserveScroll: true }), {
            loading: t('events.toasts.registering'),
            success: t('events.toasts.registeredSuccess'),
            error: t('events.toasts.registerFailed'),
        });
    };

    const handleCancel = () => {
        if (confirm(t('events.confirmCancelRegistration'))) {
            handleAsyncAction(() => routerPromise('delete', `/events/${event.id}/register`, {}, { preserveScroll: true }), {
                loading: t('events.toasts.cancelling'),
                success: t('events.toasts.cancelSuccess'),
                error: t('events.toasts.cancelFailed'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event.title} />
            <div className="w-full p-2 md:p-4">
                <div className="mb-3">
                    <Link href="/events" className="hover:bg-muted inline-flex items-center gap-2 rounded-xl p-2 text-sm font-medium text-slate-700 transition-colors">
                        <ArrowLeft size={16} />
                        {t('events.backToList')}
                    </Link>
                </div>

                <div className="w-full">
                    <div className="grid gap-3 xl:grid-cols-[minmax(0,2.2fr)_minmax(280px,390px)]">
                        <div className="space-y-3">
                            <div className="overflow-hidden rounded-[26px] border border-[#dfeae1] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.04)]">
                                <div className="bg-gradient-to-r from-[#4aaa7a] via-[#4fa96f] to-[#dfeee3] p-4 text-white" style={{ minHeight: '122px' }}>
                                    <div className="mb-2 flex flex-wrap gap-1.5">
                                        {event.business_types?.map((type) => (
                                            <span key={type} className="rounded-full bg-white/20 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-white/90">
                                                {type}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="max-w-xl">
                                        <h1 className="text-[clamp(1.45rem,1.5vw,1.9rem)] leading-[1.08] font-black tracking-[-0.05em] text-white">{event.title}</h1>
                                        <p className="mt-1.5 text-xs text-[#ebfff2] font-medium">{event.organizer}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 p-3">
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        <div className="flex h-full items-start gap-2.5 rounded-2xl border border-[#edf4ef] bg-[#f8fbf9] p-2.5">
                                            <div className="mt-0.5 flex size-6 items-center justify-center rounded-xl bg-[#edf8f1] text-[#3f9567]">
                                                <CalendarDays size={12} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-medium text-slate-500">{t('events.dateLabel')}</p>
                                                <p className="mt-1 text-xs font-semibold text-slate-800">
                                                    {formatDate(event.start_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                {event.end_date !== event.start_date && (
                                                    <p className="text-[10px] text-slate-500">
                                                        {t('events.until')} {formatDate(event.end_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex h-full items-start gap-2.5 rounded-2xl border border-[#edf4ef] bg-[#f8fbf9] p-2.5">
                                            <div className="mt-0.5 flex size-6 items-center justify-center rounded-xl bg-[#edf8f1] text-[#3f9567]">
                                                <Clock size={12} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-medium text-slate-500">{t('events.timeLabel')}</p>
                                                <p className="mt-1 text-xs font-semibold text-slate-800">
                                                    {new Date(event.start_date).toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex h-full items-start gap-2.5 rounded-2xl border border-[#edf4ef] bg-[#f8fbf9] p-2.5">
                                            <div className="mt-0.5 flex size-6 items-center justify-center rounded-xl bg-[#edf8f1] text-[#3f9567]">
                                                <MapPin size={12} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-medium text-slate-500">{t('events.locationLabel')}</p>
                                                <p className="mt-1 text-xs font-semibold text-slate-800">{event.location}</p>
                                                <p className="text-[10px] text-slate-500">{event.city}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {event.description && (
                                        <div className="border-t border-[#edf4ef] pt-2.5">
                                            <h2 className="mb-1.5 text-sm font-bold text-slate-800">{t('events.aboutEvent')}</h2>
                                            <p className="text-xs leading-5 text-slate-600 whitespace-pre-line">{event.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {recent_registrations.length > 0 && (
                                <div className="rounded-2xl border border-[#edf1ef] bg-white p-4 shadow-sm">
                                    <h2 className="mb-3 text-base font-bold text-slate-800">{t('events.recentParticipants')}</h2>
                                    <div className="space-y-2.5">
                                        {recent_registrations.map((reg) => (
                                            <div key={reg.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-2.5 py-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f7ee] text-xs font-bold text-[#3f9567]">
                                                    {reg.user.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold text-slate-700">{reg.user.name}</p>
                                                    <p className="text-[10px] text-slate-500">{reg.tenant.name}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-500">
                                                    {formatDate(reg.registered_at, { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-[24px] border border-[#dfeae1] bg-gradient-to-br from-[#f7fbf8] via-white to-[#eef8f2] p-3 shadow-[0_18px_35px_rgba(63,149,103,0.08)]">
                                <div className="mb-2.5">
                                    <span className="text-[10px] font-medium text-slate-500">{t('events.registrationFee')}</span>
                                    <p className={`mt-1.5 text-[1.5rem] font-black tracking-[-0.05em] ${event.registration_fee === 0 ? 'text-[#3f9567]' : 'text-slate-800'}`}>
                                        {event.registration_fee === 0 ? t('events.freeUpper') : formatRupiah(event.registration_fee)}
                                    </p>
                                </div>

                                <div className="mb-2.5 flex items-center gap-2 text-[10px] text-slate-600">
                                    <Users size={12} className="text-[#3f9567]" />
                                    <span>
                                        {t('events.registeredCount', { count: event.registered_count })}
                                        {event.max_participants && t('events.fromMaxSlots', { max: event.max_participants })}
                                    </span>
                                </div>

                                {event.max_participants && (
                                    <div className="mb-3">
                                        <div className="h-2.5 overflow-hidden rounded-full bg-[#e9f3ed]">
                                            <div
                                                className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-[#3f9567]'}`}
                                                style={{ width: `${Math.min((event.registered_count / event.max_participants) * 100, 100)}%` }}
                                            />
                                        </div>
                                        {isFull && <p className="mt-2 text-[10px] font-medium text-rose-600">{t('events.registrationFullMsg')}</p>}
                                    </div>
                                )}

                                {is_registered ? (
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                                            <CheckCircle size={14} />
                                            <span>{t('events.alreadyRegistered')}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="w-full justify-center rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                                            onClick={handleCancel}
                                        >
                                            <XCircle size={14} />
                                            {t('events.cancelRegistration')}
                                        </Button>
                                    </div>
                                ) : canRegister ? (
                                    <Button
                                        type="button"
                                        variant="owner"
                                        size="lg"
                                        className="w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold shadow-[0_10px_20px_rgba(63,149,103,0.22)]"
                                        onClick={handleRegister}
                                    >
                                        {t('events.registerNow')}
                                    </Button>
                                ) : isFull ? (
                                    <Button type="button" variant="secondary" disabled className="w-full justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-200">
                                        {t('events.registrationFull')}
                                    </Button>
                                ) : event.registration_url ? (
                                    <Button asChild variant="owner" size="lg" className="w-full justify-center rounded-xl px-4 py-2.5 text-sm font-bold shadow-[0_10px_20px_rgba(63,149,103,0.22)]">
                                        <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full">
                                            {t('events.registerExternal')}
                                        </a>
                                    </Button>
                                ) : (
                                    <Button type="button" variant="secondary" disabled className="w-full justify-center rounded-xl bg-slate-200 text-slate-500 hover:bg-slate-200">
                                        {t('events.registrationClosed')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
