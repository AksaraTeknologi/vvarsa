import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Activity, ArrowLeft, CalendarDays, CreditCard, MapPin, Package, Phone, Shield, ToggleLeft, ToggleRight, User, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserItem {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface TenantDetail {
    id: number;
    name: string;
    slug: string;
    phone: string | null;
    address: string | null;
    is_active: boolean;
    plan_id: number;
    created_at: string;
    max_products: number;
    max_users: number;
    plan?: {
        name: string;
        price: number;
    };
    users: UserItem[];
}

interface Stats {
    product_count: number;
    user_count: number;
    transaction_count: number;
    total_sales: number;
}

interface Props {
    tenant: TenantDetail;
    stats: Stats;
    plans: { id: number; name: string }[];
}

export default function TenantShow({ tenant, stats, plans = [] }: Props) {
    const { t } = useTranslation();
    const [isPlanOpen, setIsPlanOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'navigation.dashboard', href: '/admin' },
        { title: 'navigation.tenants', href: '/admin/tenants' },
        { title: tenant.name, href: `/admin/tenants/${tenant.id}` },
    ];

    const planForm = useForm({
        plan_id: tenant.plan_id.toString(),
    });

    const handleUpdatePlan = (e: React.FormEvent) => {
        e.preventDefault();
        planForm.put(`/admin/tenants/${tenant.id}/plan`, {
            onSuccess: () => {
                setIsPlanOpen(false);
            },
        });
    };

    const handleToggleActive = () => {
        handleAsyncAction(() => routerPromise('post', `/admin/tenants/${tenant.id}/toggle`, {}, { preserveScroll: true }), {
            loading: `Mengubah status bisnis "${tenant.name}"...`,
            success: `Status bisnis "${tenant.name}" berhasil diubah!`,
            error: 'Gagal Mengubah Status',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('admin.tenants.detailTitle')}: ${tenant.name}`} />
            <main className="admin-dashboard-surface relative flex min-h-full flex-col gap-6 overflow-hidden p-4 font-['Plus_Jakarta_Sans'] text-[#191827] md:p-6 lg:p-8">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>

                {/* Back button */}
                <div className="relative z-10 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get('/admin/tenants')}
                        className="h-9 rounded-xl border-[#DDD9E9] bg-white px-3 text-[#4D4B5A] shadow-sm hover:border-[#CFC8F6] hover:bg-[#FDFCFF] hover:text-[#5E4BF2]"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        {t('common.back')}
                    </Button>
                </div>

                {/* Header Profile */}
                <div className="relative z-10 flex flex-col gap-5 rounded-2xl border border-[#E7E3FA] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F1EFFD] text-xl font-bold text-[#5E4BF2]">
                            {tenant.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[1.45rem] leading-tight font-bold tracking-[-0.04em] text-[#17182A] md:text-[1.65rem]">
                                    {tenant.name}
                                </h1>
                                <Badge
                                    variant={tenant.is_active ? 'default' : 'destructive'}
                                    className={
                                        tenant.is_active
                                            ? 'rounded-full border-0 bg-[#DCD8FF] px-2.5 py-1 text-xs font-semibold text-[#4938D9] hover:bg-[#DCD8FF]'
                                            : 'rounded-full border-0 bg-[#F7EFF0] px-2.5 py-1 text-xs font-semibold text-[#A96A73] hover:bg-[#F7EFF0]'
                                    }
                                >
                                    {tenant.is_active ? t('admin.active') : t('admin.inactive')}
                                </Badge>
                            </div>
                            <p className="mt-1 text-sm text-[#92909D]">{tenant.slug}.vvarsa.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Toggle active button */}
                        <Button
                            variant="outline"
                            onClick={handleToggleActive}
                            className={`h-10 rounded-xl border-[#DDD9E9] bg-white text-sm font-semibold shadow-sm ${tenant.is_active ? 'text-[#A96A73] hover:border-[#E7C9CE] hover:bg-[#FFF8F8] hover:text-[#963F4C]' : 'text-[#2B8A62] hover:border-[#BFE6D2] hover:bg-[#F4FFF8] hover:text-[#18704A]'}`}
                        >
                            {tenant.is_active ? (
                                <span className="flex items-center gap-1.5">
                                    <ToggleRight size={18} />
                                    {t('admin.tenants.deactivate')}
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5">
                                    <ToggleLeft size={18} />
                                    {t('admin.tenants.activate')}
                                </span>
                            )}
                        </Button>

                        {/* Upgrade plan dialog */}
                        <Dialog open={isPlanOpen} onOpenChange={setIsPlanOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-10 rounded-xl bg-[#5E4BF2] px-4 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(94,75,242,0.18)] hover:bg-[#4938D9]">
                                    {t('admin.tenants.changePlan')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="border-[#DCD8FF] bg-white p-6 shadow-[0_18px_50px_rgba(43,35,94,0.18)] sm:max-w-[420px]">
                                <form onSubmit={handleUpdatePlan}>
                                    <DialogHeader className="gap-2 pr-6">
                                        <DialogTitle className="text-xl font-bold tracking-[-0.03em] text-[#17182A]">
                                            {t('admin.tenants.changePlan')}
                                        </DialogTitle>
                                        <DialogDescription className="text-sm leading-relaxed text-[#92909D]">
                                            Sesuaikan tingkat fitur dan batas kapasitas untuk tenant {tenant.name}.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-2.5 py-5">
                                        <div className="grid gap-2">
                                            <Label htmlFor="plan_id" className="text-sm font-semibold text-[#303042]">
                                                Pilih Paket
                                            </Label>
                                            <Select value={planForm.data.plan_id} onValueChange={(value) => planForm.setData('plan_id', value)}>
                                                <SelectTrigger className="h-11 w-full rounded-xl border-[#DCD8FF] bg-white text-sm text-[#303042] hover:border-[#BDB4FF] focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20">
                                                    <SelectValue placeholder="Pilih Paket" />
                                                </SelectTrigger>
                                                <SelectContent className="border-[#DCD8FF] bg-white text-[#303042]">
                                                    {plans.map((plan) => (
                                                        <SelectItem
                                                            key={plan.id}
                                                            value={plan.id.toString()}
                                                            className="focus:bg-[#F1EFFD] focus:text-[#4938D9] data-[state=checked]:bg-[#F1EFFD] data-[state=checked]:text-[#4938D9]"
                                                        >
                                                            {plan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2 sm:gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsPlanOpen(false)}
                                            className="h-10 rounded-xl border-[#DCD8FF] bg-white px-4 text-sm font-semibold text-[#4D4B5A] hover:border-[#BDB4FF] hover:bg-[#F8F7FF] hover:text-[#5E4BF2]"
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={planForm.processing}
                                            className="h-10 rounded-xl bg-[#5E4BF2] px-5 text-sm font-semibold text-white shadow-[0_7px_18px_rgba(94,75,242,0.18)] hover:bg-[#4938D9]"
                                        >
                                            {planForm.processing ? t('common.saving') : t('common.save')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-[#E7E3FA] bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-[#777584]">{t('admin.tenants.productLimit')}</CardTitle>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F1EFFD] text-[#5E4BF2]">
                                <Package size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A]">{stats.product_count}</div>
                            <p className="mt-3 text-[11px] text-[#92909D]">
                                Batas maksimal paket: {tenant.max_products >= 9999 ? '∞' : tenant.max_products}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-[#E7E3FA] bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-[#777584]">{t('admin.tenants.userLimit')}</CardTitle>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F1EFFD] text-[#5E4BF2]">
                                <Users size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A]">{stats.user_count}</div>
                            <p className="mt-3 text-[11px] text-[#92909D]">Batas maksimal paket: {tenant.max_users >= 99 ? '∞' : tenant.max_users}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[#E7E3FA] bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-[#777584]">{t('navigation.transactions')}</CardTitle>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F1EFFD] text-[#5E4BF2]">
                                <Activity size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A]">{stats.transaction_count}</div>
                            <p className="mt-3 text-[11px] text-[#92909D]">Total riwayat transaksi bisnis</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[#E7E3FA] bg-white shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-[#777584]">{t('finance.totalRevenue')}</CardTitle>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-[#F1EFFD] text-[#5E4BF2]">
                                <CreditCard size={16} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A]">
                                {formatRupiah(stats.total_sales)}
                            </div>
                            <p className="mt-3 text-[11px] text-[#92909D]">Total omset tenant bisnis</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Details & Member List Grid */}
                <div className="relative z-10 grid gap-6 md:grid-cols-3">
                    {/* Left: General info */}
                    <Card className="border-[#E7E3FA] bg-white shadow-sm md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold tracking-[-0.03em] text-[#17182A]">{t('admin.tenants.detailTitle')}</CardTitle>
                            <CardDescription className="text-sm text-[#92909D]">Informasi umum bisnis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="flex items-center gap-2 text-xs font-medium text-[#92909D]">
                                    <CreditCard size={14} className="text-[#5E4BF2]" />
                                    {t('admin.tenants.colPlan')}
                                </Label>
                                <p className="mt-1 text-sm font-semibold text-[#303042] capitalize">{tenant.plan?.name || 'Free'}</p>
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 text-xs font-medium text-[#92909D]">
                                    <Phone size={14} className="text-[#5E4BF2]" />
                                    {t('admin.tenants.contact')}
                                </Label>
                                <p className="mt-1 text-sm text-[#303042]">{tenant.phone || '—'}</p>
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 text-xs font-medium text-[#92909D]">
                                    <MapPin size={14} className="text-[#5E4BF2]" />
                                    {t('admin.tenants.address')}
                                </Label>
                                <p className="mt-1 text-sm text-[#303042]">{tenant.address || '—'}</p>
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 text-xs font-medium text-[#92909D]">
                                    <CalendarDays size={14} className="text-[#5E4BF2]" />
                                    {t('admin.tenants.registeredSince')}
                                </Label>
                                <p className="mt-1 text-sm text-[#303042]">
                                    {new Date(tenant.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right: Team Members */}
                    <Card className="border-[#E7E3FA] bg-white shadow-sm md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold tracking-[-0.03em] text-[#17182A]">{t('admin.tenants.memberList')}</CardTitle>
                            <CardDescription className="text-sm text-[#92909D]">{t('admin.tenants.memberListSub')}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-[#EEEAF8] bg-[#FBFAFE]">
                                            <th className="px-6 py-3 text-xs font-semibold tracking-wide text-[#92909D] uppercase">
                                                {t('admin.users.colNameEmail')}
                                            </th>
                                            <th className="px-6 py-3 text-xs font-semibold tracking-wide text-[#92909D] uppercase">
                                                {t('admin.users.colRole')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-border divide-y">
                                        {tenant.users.length === 0 ? (
                                            <tr>
                                                <td colSpan={2} className="text-muted-foreground py-6 text-center text-sm">
                                                    {t('common.noData')}
                                                </td>
                                            </tr>
                                        ) : (
                                            tenant.users.map((u) => {
                                                const role = u.roles[0]?.name || 'staff';
                                                return (
                                                    <tr key={u.id} className="border-[#F0EDF8] transition-colors hover:bg-[#FBFAFE]">
                                                        <td className="px-6 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1EFFD] text-xs font-bold text-[#5E4BF2]">
                                                                    {u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold text-[#303042]">{u.name}</div>
                                                                    <span className="text-xs text-[#92909D]">{u.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <Badge
                                                                variant={role === 'owner' ? 'default' : 'outline'}
                                                                className={`capitalize ${
                                                                    role === 'owner'
                                                                        ? 'border-0 bg-[#E8F1FF] text-[#3564B8] hover:bg-[#E8F1FF]'
                                                                        : 'border-0 bg-[#F1EFFD] text-[#5E4BF2] hover:bg-[#F1EFFD]'
                                                                }`}
                                                            >
                                                                {role === 'owner' ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <Shield size={10} />
                                                                        Owner
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1">
                                                                        <User size={10} />
                                                                        Staff
                                                                    </span>
                                                                )}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </AppLayout>
    );
}
