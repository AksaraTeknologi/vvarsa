import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    CreditCard,
    DollarSign,
    Plus,
    ShieldCheck,
    TrendingUp,
    Users,
} from 'lucide-react';

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
        title: 'Admin Dashboard',
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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <main className="min-h-full bg-[radial-gradient(circle_at_top_left,#E6E1FF_0%,#F8F5F1_42%,#FFFFFF_100%)] font-['Plus_Jakarta_Sans'] text-[#191827]">

                {/* =========================================================
                    HERO
                ========================================================== */}
                <section className="relative overflow-hidden bg-transparent">

                    {/* Soft decorative background */}
                    <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#E9E5FF] opacity-55 blur-3xl" />
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F0EDFF] opacity-65 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-[-100px] left-[42%] h-56 w-56 rounded-full bg-[#F3F0E9] opacity-75 blur-3xl" />

                    <div className="relative px-5 py-7 md:px-8 md:py-8">
                        <div className="mx-auto max-w-[1500px]">

                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                {/* LEFT */}
                                <div className="max-w-3xl">

                                    {/* Label */}
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E3DFF2] bg-white px-3 py-1.5 shadow-[0_3px_10px_rgba(35,30,70,0.04)]">
                                        <span className="flex size-7 items-center justify-center rounded-full bg-[#5E4BF2] text-white">
                                            <ShieldCheck className="size-3.5" />
                                        </span>

                                        <span className="text-xs font-bold uppercase tracking-wide text-[#5E4BF2]">
                                            Platform Admin
                                        </span>
                                    </div>

                                    {/* Heading */}
                                    <h1 className="text-[2.35rem] font-black leading-[1.08] tracking-[-0.045em] text-[#171725] sm:text-[2.6rem] lg:text-[2.8rem]">
                                        Selamat datang kembali
                                    </h1>

                                    <p className="mt-2.5 max-w-2xl text-[15px] font-medium leading-6 text-[#777584]">
                                        Kelola infrastruktur platform, tenant bisnis,
                                        dan rencana langganan SaaS.
                                    </p>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex shrink-0 flex-row gap-2 rounded-[18px] border border-[#E8E3F3] bg-white/85 p-1.5 shadow-[0_8px_25px_rgba(35,30,70,0.055)] backdrop-blur-sm">
                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-10.5 rounded-xl px-4 text-sm font-bold shadow-[0_7px_18px_rgba(94,75,242,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_22px_rgba(94,75,242,0.24)]"
                                    >
                                        <Link href="/admin/tenants/create">
                                            <Plus className="size-4" />
                                            Tambah Tenant
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        size="sm"
                                        variant="secondary"
                                        className="h-10.5 rounded-xl border border-[#DDD9E9] bg-white px-4 text-sm font-bold text-[#4D4B5A] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#CFC8F6] hover:bg-[#FDFCFF] hover:text-[#5E4BF2]"
                                    >
                                        <Link href="/admin/plans">
                                            <CreditCard className="size-4" />
                                            Kelola Paket
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* =========================================================
                    MAIN CONTENT
                ========================================================== */}
                <div className="px-5 py-6 md:px-8 md:py-7">
                    <div className="mx-auto max-w-[1500px] space-y-7">

                        {/* =================================================
                            RINGKASAN PLATFORM
                        ================================================== */}
                        <section>

                            <div className="mb-4">
                                <h2 className="text-[19px] font-extrabold tracking-[-0.02em] text-[#242332]">
                                    Ringkasan platform
                                </h2>

                                <p className="mt-1 text-sm font-medium text-[#92909D]">
                                    Gambaran singkat kondisi VVARSA saat ini.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                {/* =================================================
                                    TOTAL TENANT
                                ================================================== */}
                                <Card
                                    className="
                                        group
                                        min-h-[132px]
                                        rounded-[18px]
                                        border-[#CFC7F5]
                                        bg-[#E2DDFF]
                                        shadow-[0_5px_20px_rgba(35,30,70,0.035)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]
                                    "
                                >
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-3 pb-1">
                                        <CardTitle className="text-sm font-bold text-[#777583]">
                                            Total Tenant
                                        </CardTitle>

                                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-[#5E4BF2] transition-transform duration-300 group-hover:scale-105">
                                            <Building2 className="size-4" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-3">
                                        <p className="text-[27px] font-black leading-none tracking-[-0.035em] text-[#181725]">
                                            {stats.total_tenants}
                                        </p>

                                        <div className="mt-2.5 flex items-center gap-1.5">
                                            <TrendingUp className="size-3.5 text-[#5E4BF2]" />

                                            <span className="text-xs font-semibold text-[#85838F]">
                                                <span className="font-bold text-[#5E4BF2]">
                                                    {stats.active_tenants}
                                                </span>{' '}
                                                aktif & running
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* =================================================
                                    TOTAL PENGGUNA
                                ================================================== */}
                                <Card
                                    className="
                                        group
                                        min-h-[132px]
                                        rounded-[18px]
                                        border-[#C5E3D5]
                                        bg-[#E1F2EA]
                                        shadow-[0_5px_20px_rgba(35,30,70,0.035)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]
                                    "
                                >
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-3 pb-1">
                                        <CardTitle className="text-sm font-bold text-[#777583]">
                                            Total Pengguna
                                        </CardTitle>

                                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-[#4C9A78] transition-transform duration-300 group-hover:scale-105">
                                            <Users className="size-4" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-3">
                                        <p className="text-[27px] font-black leading-none tracking-[-0.035em] text-[#181725]">
                                            {stats.total_users}
                                        </p>

                                        <p className="mt-2.5 text-xs font-semibold leading-4.5 text-[#85838F]">
                                            Pengguna terdaftar di seluruh tenant
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* =================================================
                                    PAKET AKTIF
                                ================================================== */}
                                <Card
                                    className="
                                        group
                                        min-h-[132px]
                                        rounded-[18px]
                                        border-[#F0D69A]
                                        bg-[#FFF0C9]
                                        shadow-[0_5px_20px_rgba(35,30,70,0.035)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]
                                    "
                                >
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-3 pb-1">
                                        <CardTitle className="text-sm font-bold text-[#777583]">
                                            Paket Aktif
                                        </CardTitle>

                                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-[#C18A2E] transition-transform duration-300 group-hover:scale-105">
                                            <CreditCard className="size-4" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-3">
                                        <p className="text-[27px] font-black leading-none tracking-[-0.035em] text-[#181725]">
                                            {stats.total_plans}
                                        </p>

                                        <p className="mt-2.5 text-xs font-semibold leading-4.5 text-[#85838F]">
                                            Pilihan paket langganan SaaS
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* =================================================
                                    MRR
                                ================================================== */}
                                <Card
                                    className="
                                        group
                                        min-h-[132px]
                                        rounded-[18px]
                                        border-[#EBC5D0]
                                        bg-[#F8E1E7]
                                        shadow-[0_5px_20px_rgba(35,30,70,0.035)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-[0_12px_28px_rgba(35,30,70,0.07)]
                                    "
                                >
                                    <CardHeader className="flex flex-row items-center justify-between px-5 pt-3 pb-1">
                                        <CardTitle className="text-sm font-bold text-[#777583]">
                                            Estimasi MRR
                                        </CardTitle>

                                        <div className="flex size-9 items-center justify-center rounded-xl bg-white/80 text-[#C06D82] transition-transform duration-300 group-hover:scale-105">
                                            <DollarSign className="size-4" />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="px-5 pb-3">
                                        <p className="text-[24px] font-black leading-none tracking-[-0.035em] text-[#5E4BF2]">
                                            {formatRupiah(stats.monthly_revenue)}
                                        </p>

                                        <div className="mt-2.5 flex items-center gap-1.5">
                                            <TrendingUp className="size-3.5 text-[#5E4BF2]" />

                                            <span className="text-xs font-semibold text-[#85838F]">
                                                Monthly Recurring Revenue
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* =================================================
                            AKTIVITAS TERBARU
                        ================================================== */}
                        <section>

                            <div className="mb-4">
                                <h2 className="text-[19px] font-extrabold tracking-[-0.02em] text-[#242332]">
                                    Aktivitas terbaru
                                </h2>

                                <p className="mt-1 text-sm font-medium text-[#92909D]">
                                    Data tenant dan pengguna yang baru bergabung.
                                </p>
                            </div>

                            <div className="grid items-start gap-4 xl:grid-cols-2">

                                {/* =================================================
                                    TENANT BARU
                                ================================================== */}
                                <Card
                                    className="
                                        overflow-hidden
                                        rounded-[18px]
                                        border-[#E7E3EC]
                                        bg-white
                                        shadow-[0_5px_22px_rgba(35,30,70,0.035)]
                                        transition-shadow
                                        duration-300
                                        hover:shadow-[0_10px_28px_rgba(35,30,70,0.06)]
                                    "
                                >
                                    <CardHeader className="border-b border-[#EEEAF3] px-5 py-4">
                                        <div className="flex items-center justify-between gap-4">

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#5E4BF2]">
                                                    <Building2 className="size-[18px]" />
                                                </div>

                                                <div className="min-w-0">
                                                    <CardTitle className="text-sm font-extrabold text-[#292737]">
                                                        Tenant Baru
                                                    </CardTitle>

                                                    <CardDescription className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                        Pendaftaran tenant bisnis terbaru
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <Link href="/admin/tenants">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 rounded-lg px-2.5 text-xs font-bold text-[#5E4BF2] hover:bg-[#F3F1FF] hover:text-[#5140E2]"
                                                >
                                                    Semua
                                                    <ArrowRight className="ml-1.5 size-3.5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        {recent_tenants.length === 0 ? (
                                            <p className="px-5 py-8 text-center text-sm text-[#9997A4]">
                                                Belum ada tenant terdaftar.
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
                                                                    ? 'Aktif'
                                                                    : 'Nonaktif'}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* =================================================
                                    PENGGUNA BARU
                                ================================================== */}
                                <Card
                                    className="
                                        overflow-hidden
                                        rounded-[18px]
                                        border-[#E7E3EC]
                                        bg-white
                                        shadow-[0_5px_22px_rgba(35,30,70,0.035)]
                                        transition-shadow
                                        duration-300
                                        hover:shadow-[0_10px_28px_rgba(35,30,70,0.06)]
                                    "
                                >
                                    <CardHeader className="border-b border-[#EEEAF3] px-5 py-4">
                                        <div className="flex items-center justify-between gap-4">

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0EEFF] text-[#5E4BF2]">
                                                    <Users className="size-[18px]" />
                                                </div>

                                                <div className="min-w-0">
                                                    <CardTitle className="text-sm font-extrabold text-[#292737]">
                                                        Pengguna Baru
                                                    </CardTitle>

                                                    <CardDescription className="mt-0.5 text-xs font-medium text-[#9997A4]">
                                                        Pengguna terbaru di platform
                                                    </CardDescription>
                                                </div>
                                            </div>

                                            <Link href="/admin/users">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 rounded-lg px-2.5 text-xs font-bold text-[#5E4BF2] hover:bg-[#F3F1FF] hover:text-[#5140E2]"
                                                >
                                                    Semua
                                                    <ArrowRight className="ml-1.5 size-3.5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-0">
                                        {recent_users.length === 0 ? (
                                            <p className="px-5 py-8 text-center text-sm text-[#9997A4]">
                                                Belum ada pengguna terdaftar.
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
                </div>
            </main>
        </AppLayout>
    );
}
