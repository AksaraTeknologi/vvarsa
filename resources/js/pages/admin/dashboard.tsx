import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, CreditCard, DollarSign, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'navigation.dashboard',
        href: '/admin',
    },
];

interface Tenant {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    created_at: string;
    plan?: {
        name: string;
        price: number;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    tenant?: {
        name: string;
    } | null;
}

interface Stats {
    total_tenants: number;
    active_tenants: number;
    total_users: number;
    total_plans: number;
    monthly_revenue: number;
}

interface Props {
    stats: Stats;
    recent_tenants: Tenant[];
    recent_users: User[];
}

function AdminStatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle: string; icon: React.ElementType }) {
    return (
        <div className="group rounded-2xl border border-[#E7E3FA] bg-white px-4 py-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm leading-none font-medium text-[#777584]">{title}</p>
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#F1EFFD] text-[#5E4BF2] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={16} />
                </div>
            </div>

            <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[1.55rem] leading-none font-bold tracking-[-0.05em] text-[#17182A] md:text-[1.8rem]">{value}</p>
                    <p className="mt-3 text-[10px] leading-none text-[#92909D] md:text-[11px]">{subtitle}</p>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard({ stats, recent_tenants, recent_users }: Props) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.dashboardTitle')} />

            <main className="relative flex min-h-full flex-col gap-6 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)] p-4 font-['Plus_Jakarta_Sans'] text-[#191827] md:p-6 lg:p-8">
                {/* Soft decorative background */}
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble admin-dashboard-bubble-six" />
                </div>

                {/* HERO */}
                <section className="relative z-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {/* LEFT */}
                        <div>
                            <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] md:text-[2.1rem]">{t('admin.dashboardTitle')}</h1>

                            <p className="mt-3 text-sm leading-relaxed font-medium text-[#777584] md:text-[0.95rem]">
                                {t('admin.dashboardSubtitle')}
                            </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex shrink-0 flex-row gap-3 rounded-xl bg-transparent">
                            <Button
                                asChild
                                size="sm"
                                variant="secondary"
                                className="h-10 rounded-xl border border-[#DDD9E9] bg-white px-4 text-sm font-semibold text-[#4D4B5A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC8F6] hover:bg-[#FDFCFF] hover:text-[#5E4BF2]"
                            >
                                <Link href="/admin/plans">
                                    <CreditCard className="mr-1 size-3.5" />
                                    {t('navigation.plans')}
                                </Link>
                            </Button>

                            <Button
                                asChild
                                size="sm"
                                className="h-10 rounded-xl bg-[#5E4BF2] px-4 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(94,75,242,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(94,75,242,0.24)]"
                            >
                                <Link href="/admin/tenants/create">
                                    <Plus className="mr-1 size-3.5" />
                                    {t('common.add')} Tenant
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <div className="relative z-10 space-y-6">
                    {/* RINGKASAN PLATFORM */}
                    <section>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <AdminStatCard
                                title={t('admin.totalTenants')}
                                value={String(stats.total_tenants)}
                                subtitle={`${stats.active_tenants} ${t('admin.active')}`}
                                icon={Building2}
                            />
                            <AdminStatCard
                                title={t('admin.totalUsers')}
                                value={String(stats.total_users)}
                                subtitle={t('admin.registeredUsers')}
                                icon={Users}
                            />
                            <AdminStatCard
                                title={t('admin.activePlans')}
                                value={String(stats.total_plans)}
                                subtitle={t('admin.subscriptionOptions')}
                                icon={CreditCard}
                            />
                            <AdminStatCard
                                title={t('admin.totalIncome')}
                                value={formatRupiah(stats.monthly_revenue)}
                                subtitle={t('admin.mrrSubtitle')}
                                icon={DollarSign}
                            />
                        </div>
                    </section>

                    {/* AKTIVITAS TERBARU */}
                    <section>
                        <div className="mb-4">
                            <h2 className="text-xl font-bold tracking-tight">{t('admin.recentActivity')}</h2>

                            <p className="mt-1 text-sm font-medium text-[#92909D]">{t('admin.recentActivitySub')}</p>
                        </div>

                        <div className="grid items-start gap-4 xl:grid-cols-2">
                            {/* TENANT BARU */}
                            <Card className="overflow-hidden rounded-[18px] border-[#E7E3EC] bg-white shadow-[0_5px_22px_rgba(35,30,70,0.035)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(35,30,70,0.06)]">
                                <CardHeader className="border-b border-[#EEEAF3] px-5 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#5E4BF2]">
                                                <Building2 className="size-[18px]" />
                                            </div>

                                            <div className="min-w-0">
                                                <CardTitle className="text-sm font-semibold text-[#292737]">{t('admin.newTenant')}</CardTitle>

                                                <CardDescription className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                    {t('admin.newTenantSub')}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Link href="/admin/tenants">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-lg px-2.5 text-xs font-bold text-[#5E4BF2] hover:bg-[#F3F1FF] hover:text-[#5140E2]"
                                            >
                                                {t('common.viewAll')}
                                                <ArrowRight className="ml-1.5 size-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {recent_tenants.length === 0 ? (
                                        <p className="px-5 py-8 text-center text-sm text-[#9997A4]">{t('common.noData')}</p>
                                    ) : (
                                        <div className="divide-y divide-[#F0EDF4]">
                                            {recent_tenants.map((tenant) => (
                                                <div
                                                    key={tenant.id}
                                                    className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-[#FCFBFE]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-[#5E4BF2] text-sm font-black text-white shadow-[0_5px_14px_rgba(94,75,242,0.14)]">
                                                            {tenant.name.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <Link
                                                                href={`/admin/tenants/${tenant.id}`}
                                                                className="block truncate text-sm font-semibold text-[#292737] transition-colors hover:text-[#5E4BF2]"
                                                            >
                                                                {tenant.name}
                                                            </Link>

                                                            <p className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                                {new Date(tenant.created_at).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-1.5">
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-full border-0 bg-[#F3F1F7] px-2.5 py-1 text-[11px] font-bold text-[#686673]"
                                                        >
                                                            {tenant.plan?.name || 'Free'}
                                                        </Badge>

                                                        <Badge
                                                            className={
                                                                tenant.is_active
                                                                    ? 'rounded-full border-0 bg-[#DCD8FF] px-2.5 py-1 text-xs font-semibold text-[#4938D9] shadow-none'
                                                                    : 'rounded-full border-0 bg-[#F7EFF0] px-2.5 py-1 text-[11px] font-bold text-[#A96A73] shadow-none'
                                                            }
                                                        >
                                                            {tenant.is_active ? t('admin.active') : t('admin.inactive')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* PENGGUNA BARU */}
                            <Card className="overflow-hidden rounded-[18px] border-[#E7E3EC] bg-white shadow-[0_5px_22px_rgba(35,30,70,0.035)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(35,30,70,0.06)]">
                                <CardHeader className="border-b border-[#EEEAF3] px-5 py-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#5E4BF2]">
                                                <Users className="size-[18px]" />
                                            </div>

                                            <div className="min-w-0">
                                                <CardTitle className="text-sm font-semibold text-[#292737]">{t('admin.newUser')}</CardTitle>

                                                <CardDescription className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                    {t('admin.newUserSub')}
                                                </CardDescription>
                                            </div>
                                        </div>

                                        <Link href="/admin/users">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-lg px-2.5 text-xs font-bold text-[#5E4BF2] hover:bg-[#F3F1FF] hover:text-[#5140E2]"
                                            >
                                                {t('common.viewAll')}
                                                <ArrowRight className="ml-1.5 size-3.5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0">
                                    {recent_users.length === 0 ? (
                                        <p className="px-5 py-8 text-center text-sm text-[#9997A4]">{t('common.noData')}</p>
                                    ) : (
                                        <div className="divide-y divide-[#F0EDF4]">
                                            {recent_users.map((u) => (
                                                <div
                                                    key={u.id}
                                                    className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-[#FCFBFE]"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-[#EAE7FF] text-sm font-black text-[#5E4BF2]">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-[#292737]">{u.name}</p>

                                                            <p className="mt-0.5 truncate text-xs font-medium text-[#9997A4]">{u.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className="max-w-[145px] truncate rounded-full border-0 bg-[#F3F1F7] px-2.5 py-1 text-[11px] font-bold text-[#686673]"
                                                        >
                                                            {u.tenant?.name || 'Admin'}
                                                        </Badge>

                                                        <span className="text-[11px] font-medium text-[#A09EAA]">
                                                            {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
