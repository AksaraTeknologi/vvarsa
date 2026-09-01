import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Building2, CreditCard, DollarSign, Plus, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admin Dashboard', href: '/admin' }];

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

export default function AdminDashboard({ stats, recent_tenants, recent_users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6">
                {/* Hero Banner */}
                <div className="relative overflow-hidden bg-[#0d0d0d] px-6 pt-8 pb-6 md:px-8">
                    {/* Background glow blobs */}
                    <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="pointer-events-none absolute right-12 -bottom-8 h-48 w-48 rounded-full bg-[#ffc200]/8 blur-3xl" />
                    <div className="pointer-events-none absolute top-4 right-1/3 h-32 w-32 rounded-full bg-[#ffb5c6]/8 blur-2xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <ShieldCheck size={11} />
                                    Platform Admin
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Selamat datang kembali</h1>
                            <p className="mt-1 text-sm text-white/50">Kelola infrastruktur platform, tenant bisnis, dan rencana langganan SaaS.</p>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Link href="/admin/tenants/create">
                                <Button className="default">
                                    <Plus size={14} />
                                    Tambah Tenant
                                </Button>
                            </Link>
                            <Link href="/admin/plans">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5 border-white/15 text-white/70 hover:bg-white/5 hover:text-white"
                                >
                                    <CreditCard size={14} />
                                    Kelola Paket
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 px-6 pb-6 md:px-8">
                    {/* Stats Cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Card 1 - Blue */}
                        <Card className="relative overflow-hidden border-none bg-[#1a56ff] text-white shadow-lg shadow-[#1a56ff]/20">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                            <div className="absolute -right-2 -bottom-4 h-16 w-16 rounded-full bg-white/5" />
                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-white/90">Total Tenant</CardTitle>
                                <div className="rounded-lg bg-white/15 p-1.5">
                                    <Building2 className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold">{stats.total_tenants}</div>
                                <p className="mt-1.5 flex items-center gap-1 text-xs text-white/70">
                                    <TrendingUp size={10} />
                                    {stats.active_tenants} aktif &amp; running
                                </p>
                            </CardContent>
                        </Card>

                        {/* Card 2 - Yellow */}
                        <Card className="relative overflow-hidden border-none bg-[#ffc200] text-black shadow-lg shadow-[#ffc200]/20">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-black/10" />
                            <div className="absolute -right-2 -bottom-4 h-16 w-16 rounded-full bg-black/5" />
                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-black/80">Total Pengguna</CardTitle>
                                <div className="rounded-lg bg-black/10 p-1.5">
                                    <Users className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold">{stats.total_users}</div>
                                <p className="mt-1.5 text-xs text-black/60">Pengguna terdaftar di seluruh tenant</p>
                            </CardContent>
                        </Card>

                        {/* Card 3 - Pink */}
                        <Card className="relative overflow-hidden border-none bg-[#ffb5c6] text-black shadow-lg shadow-[#ffb5c6]/20">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-black/10" />
                            <div className="absolute -right-2 -bottom-4 h-16 w-16 rounded-full bg-black/5" />
                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-black/80">Paket Aktif</CardTitle>
                                <div className="rounded-lg bg-black/10 p-1.5">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-3xl font-bold">{stats.total_plans}</div>
                                <p className="mt-1.5 text-xs text-black/60">Pilihan paket langganan SaaS</p>
                            </CardContent>
                        </Card>

                        {/* Card 4 - MRR */}
                        <Card className="relative overflow-hidden border border-[#1a56ff]/20 bg-[#1a56ff]/5 shadow-sm">
                            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-[#1a56ff]/5" />
                            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">Estimasi MRR</CardTitle>
                                <div className="rounded-lg bg-[#1a56ff]/10 p-1.5">
                                    <DollarSign className="h-4 w-4 text-[#1a56ff]" />
                                </div>
                            </CardHeader>
                            <CardContent className="relative">
                                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatRupiah(stats.monthly_revenue)}</div>
                                <p className="mt-1.5 flex items-center gap-1 text-xs text-blue-600/70 dark:text-blue-500/70">
                                    <TrendingUp size={10} />
                                    Monthly Recurring Revenue
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grid for Recent Lists */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Recent Tenants */}
                        <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 pb-3 dark:border-white/5 dark:bg-white/[0.02]">
                                <div>
                                    <CardTitle className="text-base">Tenant Baru</CardTitle>
                                    <CardDescription className="mt-0.5 text-xs">Pendaftaran tenant bisnis terbaru</CardDescription>
                                </div>
                                <Link
                                    href="/admin/tenants"
                                    className="flex items-center gap-1 text-xs font-medium text-[#1a56ff] hover:underline dark:text-blue-400"
                                >
                                    Semua
                                    <ArrowRight size={12} />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100 dark:divide-white/5">
                                    {recent_tenants.length === 0 ? (
                                        <p className="text-muted-foreground p-6 text-center text-sm">Belum ada tenant terdaftar.</p>
                                    ) : (
                                        recent_tenants.map((tenant) => (
                                            <div
                                                key={tenant.id}
                                                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar */}
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a56ff]/10 text-xs font-bold text-[#1a56ff]">
                                                        {tenant.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <Link
                                                            href={`/admin/tenants/${tenant.id}`}
                                                            className="text-sm font-semibold transition-colors hover:text-[#1a56ff]"
                                                        >
                                                            {tenant.name}
                                                        </Link>
                                                        <span className="text-muted-foreground text-[11px]">
                                                            {new Date(tenant.created_at).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Badge className="border-none bg-[#ffb5c6]/20 px-2 py-0 text-[11px] text-rose-700 capitalize shadow-none hover:bg-[#ffb5c6]/30 dark:bg-[#ffb5c6]/10 dark:text-rose-300">
                                                        {tenant.plan?.name || 'Free'}
                                                    </Badge>
                                                    <Badge
                                                        className={
                                                            tenant.is_active
                                                                ? 'border-none bg-[#1a56ff]/10 px-2 py-0 text-[11px] text-[#1a56ff] shadow-none hover:bg-[#1a56ff]/20 dark:bg-blue-500/20 dark:text-blue-300'
                                                                : 'border-none bg-rose-100 px-2 py-0 text-[11px] text-rose-700 shadow-none hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400'
                                                        }
                                                    >
                                                        {tenant.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Users */}
                        <Card className="overflow-hidden border-gray-200 shadow-sm dark:border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 bg-gray-50/50 pb-3 dark:border-white/5 dark:bg-white/[0.02]">
                                <div>
                                    <CardTitle className="text-base">Pengguna Baru</CardTitle>
                                    <CardDescription className="mt-0.5 text-xs">Pengguna terbaru di platform</CardDescription>
                                </div>
                                <Link
                                    href="/admin/users"
                                    className="flex items-center gap-1 text-xs font-medium text-[#1a56ff] hover:underline dark:text-blue-400"
                                >
                                    Semua
                                    <ArrowRight size={12} />
                                </Link>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-100 dark:divide-white/5">
                                    {recent_users.length === 0 ? (
                                        <p className="text-muted-foreground p-6 text-center text-sm">Belum ada pengguna terdaftar.</p>
                                    ) : (
                                        recent_users.map((u) => (
                                            <div
                                                key={u.id}
                                                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {/* Avatar - Yellow accent */}
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffc200] text-xs font-bold text-black shadow-sm">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-sm font-semibold">{u.name}</span>
                                                        <span className="text-muted-foreground text-[11px]">{u.email}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 text-right">
                                                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-white/5 dark:text-white/60">
                                                        {u.tenant?.name || 'Admin'}
                                                    </span>
                                                    <p className="text-muted-foreground text-[10px]">
                                                        {new Date(u.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
