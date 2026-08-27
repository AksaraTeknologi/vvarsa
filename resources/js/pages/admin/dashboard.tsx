import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, CreditCard, Activity, ArrowRight, UserPlus, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
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

export default function AdminDashboard({ stats, recent_tenants, recent_users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola infrastruktur platform, tenant bisnis, dan rencana langganan SaaS.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none bg-[#1a56ff] text-white">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-white">Total Tenant</CardTitle>
                            <Building2 className=" h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_tenants}</div>
                            <p className="text-xs mt-1 text-white/80">
                                {stats.active_tenants} aktif & running
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-[#ffc200] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                            <Users className="h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs mt-1 text-black/70">
                                Pengguna terdaftar di seluruh tenant
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-[#ffb5c6] text-black">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
                            <CreditCard className="h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_plans}</div>
                            <p className=" text-xs mt-1 text-black/70">
                                Pilihan paket langganan SaaS
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-[#FFFFFF] shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-blue-900 dark:text-blue-400 text-sm font-medium">Estimasi MRR</CardTitle>
                            <DollarSign className="text-blue-900 dark:text-blue-400 h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-900 dark:text-blue-400">
                                {formatRupiah(stats.monthly_revenue)}
                            </div>
                            <p className="text-blue-800 dark:text-blue-500/70 text-xs mt-1">
                                Monthly Recurring Revenue berjalan
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid for Recent Lists */}
                <div className="grid gap-6 md:grid-cols-2">
                    
                    {/* Recent Tenants */}
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <div>
                                <CardTitle className="text-lg">Tenant Baru</CardTitle>
                                <CardDescription>Pendaftaran tenant bisnis terbaru</CardDescription>
                            </div>
                            <Link
                                href="/admin/tenants"
                                className="text-[#1a56ff] dark:text-blue-400 flex items-center gap-1 text-sm font-medium hover:underline"
                            >
                                Semua Tenant
                                <ArrowRight size={14} />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recent_tenants.length === 0 ? (
                                    <p className="text-muted-foreground p-6 text-center text-sm">Belum ada tenant terdaftar.</p>
                                ) : (
                                    recent_tenants.map((tenant) => (
                                        <div
                                            key={tenant.id}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <Link
                                                    href={`/admin/tenants/${tenant.id}`}
                                                    className="font-semibold text-sm hover:text-[#1a56ff] transition-colors"
                                                >
                                                    {tenant.name}
                                                </Link>
                                                <span className="text-muted-foreground text-xs">
                                                    Terdaftar: {new Date(tenant.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Badge Plan - Menggunakan aksen Pink */}
                                                <Badge className="capitalize bg-[#ffb5c6]/20 text-rose-700 hover:bg-[#ffb5c6]/30 dark:bg-[#ffb5c6]/10 dark:text-rose-300 border-none shadow-none">
                                                    {tenant.plan?.name || 'Free'}
                                                </Badge>
                                                
                                                {/* Badge Status - Menggunakan aksen Biru & Merah standar */}
                                                <Badge
                                                    className={
                                                        tenant.is_active
                                                            ? 'bg-[#1a56ff]/10 text-[#1a56ff] hover:bg-[#1a56ff]/20 dark:bg-blue-500/20 dark:text-blue-300 border-none shadow-none'
                                                            : 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 border-none shadow-none'
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
                    <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <div>
                                <CardTitle className="text-lg">Pengguna Baru</CardTitle>
                                <CardDescription>Pengguna terbaru di platform</CardDescription>
                            </div>
                            <Link
                                href="/admin/users"
                                className="text-[#1a56ff] dark:text-blue-400 flex items-center gap-1 text-sm font-medium hover:underline"
                            >
                                Semua Pengguna
                                <ArrowRight size={14} />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recent_users.length === 0 ? (
                                    <p className="text-muted-foreground p-6 text-center text-sm">Belum ada pengguna terdaftar.</p>
                                ) : (
                                    recent_users.map((u) => (
                                        <div
                                            key={u.id}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Avatar - Menggunakan aksen Kuning */}
                                                <div className="bg-[#ffc200] text-black shadow-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-sm">{u.name}</span>
                                                    <span className="text-muted-foreground text-xs">{u.email}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                {/* Badge Tenant Context */}
                                                <span className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-md text-[11px] font-medium">
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
        </AppLayout>
    );
}