import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CreditCard,
    DollarSign,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

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

export default function AdminDashboard({
    stats,
    recent_tenants,
    recent_users,
}: Props) {
    const { t } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.dashboardTitle')} />

            <main className="min-h-full bg-[radial-gradient(circle_at_top_left,#E6E1FF_0%,#F8F5F1_42%,#FFFFFF_100%)] font-['Plus_Jakarta_Sans'] text-[#191827] p-4 md:p-6 flex flex-col gap-6">

                {/* Soft decorative background */}
                <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#E9E5FF] opacity-55 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F0EDFF] opacity-65 blur-3xl" />
                <div className="pointer-events-none absolute bottom-[-100px] left-[42%] h-56 w-56 rounded-full bg-[#F3F0E9] opacity-75 blur-3xl" />

                {/* HERO */}
                <section className="relative z-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* LEFT */}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {t('admin.dashboardTitle')}
                            </h1>

                            <p className="mt-1 text-sm font-medium text-[#777584]">
                                {t('admin.dashboardSubtitle')}
                            </p>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex shrink-0 flex-row gap-4 rounded-xl bg-transparent">
                            <Button
                                asChild
                                size="sm"
                                variant="secondary"
                                className="h-9 rounded-lg border border-[#DDD9E9] bg-white px-3 text-xs font-bold text-[#4D4B5A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC8F6] hover:bg-[#FDFCFF] hover:text-[#5E4BF2]"
                            >
                                <Link href="/admin/plans">
                                    <CreditCard className="size-3.5 mr-1" />
                                    {t('navigation.plans')}
                                </Link>
                            </Button>
                            
                            <Button
                                asChild
                                size="sm"
                                className="h-9 rounded-lg px-3 text-xs font-bold shadow-[0_7px_18px_rgba(94,75,242,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(94,75,242,0.24)] bg-[#5E4BF2] text-white"
                            >
                                <Link href="/admin/tenants/create">
                                    <Plus className="size-3.5 mr-1" />
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

                                {/* TOTAL TENANT */}
                                <Card className="group rounded-2xl border-[#CFC7F5] bg-[#E2DDFF] shadow-[0_5px_20px_rgba(35,30,70,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]">
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-2.5 pb-0 space-y-0">
                                        <CardTitle className="text-sm font-medium text-[#777583]">
                                            {t('admin.totalTenants')}
                                        </CardTitle>

                                        <div className="flex size-7 items-center justify-center rounded-lg bg-white/80 text-[#5E4BF2] transition-transform duration-300 group-hover:scale-105">
                                            <Building2 className="size-3.5" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-2.5 pt-1">
                                        <p className="text-xl font-bold tracking-tight leading-none text-[#181725]">
                                            {stats.total_tenants}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <TrendingUp className="size-3 text-[#5E4BF2]" />

                                            <span className="text-[10px] font-medium text-[#85838F]">
                                                <span className="font-bold text-[#5E4BF2]">
                                                    {stats.active_tenants}
                                                </span>{' '}
                                                {t('admin.active')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* TOTAL PENGGUNA */}
                                <Card className="group rounded-2xl border-[#C5E3D5] bg-[#E1F2EA] shadow-[0_5px_20px_rgba(35,30,70,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]">
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-2.5 pb-0 space-y-0">
                                        <CardTitle className="text-sm font-medium text-[#777583]">
                                            {t('admin.totalUsers')}
                                        </CardTitle>

                                        <div className="flex size-7 items-center justify-center rounded-lg bg-white/80 text-[#4C9A78] transition-transform duration-300 group-hover:scale-105">
                                            <Users className="size-3.5" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-2.5 pt-1">
                                        <p className="text-xl font-bold tracking-tight leading-none text-[#181725]">
                                            {stats.total_users}
                                        </p>

                                        <p className="mt-1 text-[10px] font-medium text-[#85838F]">
                                            {t('admin.registeredUsers')}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* PAKET AKTIF */}
                                <Card className="group rounded-2xl border-[#F0D69A] bg-[#FFF0C9] shadow-[0_5px_20px_rgba(35,30,70,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]">
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-2.5 pb-0 space-y-0">
                                        <CardTitle className="text-sm font-medium text-[#777583]">
                                            {t('admin.activePlans')}
                                        </CardTitle>

                                        <div className="flex size-7 items-center justify-center rounded-lg bg-white/80 text-[#C18A2E] transition-transform duration-300 group-hover:scale-105">
                                            <CreditCard className="size-3.5" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-2.5 pt-1">
                                        <p className="text-xl font-bold tracking-tight leading-none text-[#181725]">
                                            {stats.total_plans}
                                        </p>

                                        <p className="mt-1 text-[10px] font-medium text-[#85838F]">
                                            {t('admin.subscriptionOptions')}
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* MRR */}
                                <Card className="group rounded-2xl border-[#EBC5D0] bg-[#F8E1E7] shadow-[0_5px_20px_rgba(35,30,70,0.035)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]">
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-2.5 pb-0 space-y-0">
                                        <CardTitle className="text-sm font-medium text-[#777583]">
                                            {t('admin.totalIncome')}
                                        </CardTitle>

                                        <div className="flex size-7 items-center justify-center rounded-lg bg-white/80 text-[#C06D82] transition-transform duration-300 group-hover:scale-105">
                                            <DollarSign className="size-3.5" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-2.5 pt-1">
                                        <p className="text-xl font-bold tracking-tight leading-none text-[#5E4BF2]">
                                            {formatRupiah(stats.monthly_revenue)}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1.5">
                                            <TrendingUp className="size-3 text-[#5E4BF2]" />

                                            <span className="text-[10px] font-medium text-[#85838F]">
                                                {t('admin.mrrSubtitle')}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* AKTIVITAS TERBARU */}
                        <section>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold tracking-tight">
                                    {t('admin.recentActivity')}
                                </h2>

                                <p className="mt-1 text-sm font-medium text-[#92909D]">
                                    {t('admin.recentActivitySub')}
                                </p>
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
                                                    <CardTitle className="text-sm font-extrabold text-[#292737]">
                                                        {t('admin.newTenant')}
                                                    </CardTitle>

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
                                            <p className="px-5 py-8 text-center text-sm text-[#9997A4]">
                                                {t('common.noData')}
                                            </p>
                                        ) : (
                                            <div className="divide-y divide-[#F0EDF4]">
                                                {recent_tenants.map((tenant) => (
                                                    <div
                                                        key={tenant.id}
                                                        className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-[#FCFBFE]"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div className="flex size-9.5 shrink-0 items-center justify-center rounded-xl bg-[#5E4BF2] text-sm font-black text-white shadow-[0_5px_14px_rgba(94,75,242,0.14)]">
                                                                {tenant.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={`/admin/tenants/${tenant.id}`}
                                                                    className="block truncate text-sm font-extrabold text-[#292737] transition-colors hover:text-[#5E4BF2]"
                                                                >
                                                                    {tenant.name}
                                                                </Link>

                                                                <p className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                                    {new Date(
                                                                        tenant.created_at,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                        },
                                                                    )}
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
                                                                        ? 'rounded-full border-0 bg-[#EEF8E9] px-2.5 py-1 text-[11px] font-bold text-[#4B8735] shadow-none'
                                                                        : 'rounded-full border-0 bg-[#F7EFF0] px-2.5 py-1 text-[11px] font-bold text-[#A96A73] shadow-none'
                                                                }
                                                            >
                                                                {tenant.is_active
                                                                    ? t('admin.active')
                                                                    : t('admin.inactive')}
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
                                                    <CardTitle className="text-sm font-extrabold text-[#292737]">
                                                        {t('admin.newUser')}
                                                    </CardTitle>

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
                                            <p className="px-5 py-8 text-center text-sm text-[#9997A4]">
                                                {t('common.noData')}
                                            </p>
                                        ) : (
                                            <div className="divide-y divide-[#F0EDF4]">
                                                {recent_users.map((u) => (
                                                    <div
                                                        key={u.id}
                                                        className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-[#FCFBFE]"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-3">

                                                            <div className="flex size-9.5 shrink-0 items-center justify-center rounded-full bg-[#EAE7FF] text-sm font-black text-[#5E4BF2]">
                                                                {u.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate text-sm font-extrabold text-[#292737]">
                                                                    {u.name}
                                                                </p>

                                                                <p className="mt-0.5 truncate text-xs font-medium text-[#9997A4]">
                                                                    {u.email}
                                                                </p>
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
                                                                {new Date(
                                                                    u.created_at,
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    },
                                                                )}
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
