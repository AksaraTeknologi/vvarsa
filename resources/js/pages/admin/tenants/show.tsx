import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Activity, ArrowLeft, CreditCard, Package, Shield, ToggleLeft, ToggleRight, User, Users } from 'lucide-react';
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
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Back button */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.get('/admin/tenants')} className="rounded-xl">
                        <ArrowLeft size={16} className="mr-1" />
                        {t('common.back')}
                    </Button>
                </div>

                {/* Header Profile */}
                <div className="bg-card border-border flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold">
                            {tenant.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
                                <Badge
                                    variant={tenant.is_active ? 'default' : 'destructive'}
                                    className={
                                        tenant.is_active
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
                                    }
                                >
                                    {tenant.is_active ? t('admin.active') : t('admin.inactive')}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">{tenant.slug}.vvarsa.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Toggle active button */}
                        <Button
                            variant="outline"
                            onClick={handleToggleActive}
                            className={`rounded-xl ${tenant.is_active ? 'text-rose-500 hover:text-rose-600' : 'text-emerald-500 hover:text-emerald-600'}`}
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
                                <Button className="rounded-xl">{t('admin.tenants.changePlan')}</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                                <form onSubmit={handleUpdatePlan}>
                                    <DialogHeader>
                                        <DialogTitle>{t('admin.tenants.changePlan')}</DialogTitle>
                                        <DialogDescription>Sesuaikan tingkat fitur dan batas kapasitas untuk tenant {tenant.name}.</DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="plan_id">Pilih Paket</Label>
                                            <select
                                                id="plan_id"
                                                value={planForm.data.plan_id}
                                                onChange={(e) => planForm.setData('plan_id', e.target.value)}
                                                className="border-border bg-background rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                {plans.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        {plan.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsPlanOpen(false)}>
                                            {t('common.cancel')}
                                        </Button>
                                        <Button type="submit" disabled={planForm.processing}>
                                            {planForm.processing ? t('common.saving') : t('common.save')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('admin.tenants.productLimit')}</CardTitle>
                            <Package className="text-muted-foreground h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.product_count}</div>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Batas maksimal paket: {tenant.max_products >= 9999 ? '∞' : tenant.max_products}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('admin.tenants.userLimit')}</CardTitle>
                            <Users className="text-muted-foreground h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.user_count}</div>
                            <p className="text-muted-foreground mt-1 text-xs">
                                Batas maksimal paket: {tenant.max_users >= 99 ? '∞' : tenant.max_users}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('navigation.transactions')}</CardTitle>
                            <Activity className="text-muted-foreground h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.transaction_count}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Total riwayat transaksi bisnis</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('finance.totalRevenue')}</CardTitle>
                            <CreditCard className="text-muted-foreground h-4.5 w-4.5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatRupiah(stats.total_sales)}</div>
                            <p className="text-muted-foreground mt-1 text-xs">Total omset tenant bisnis</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Details & Member List Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Left: General info */}
                    <Card className="border-border md:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('admin.tenants.detailTitle')}</CardTitle>
                            <CardDescription>Informasi umum bisnis</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground text-xs">{t('admin.tenants.colPlan')}</Label>
                                <p className="text-sm font-semibold capitalize">{tenant.plan?.name || 'Free'}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs">{t('admin.tenants.contact')}</Label>
                                <p className="text-sm">{tenant.phone || '—'}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs">{t('admin.tenants.address')}</Label>
                                <p className="text-sm">{tenant.address || '—'}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground text-xs">{t('admin.tenants.registeredSince')}</Label>
                                <p className="text-sm">
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
                    <Card className="border-border md:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('admin.tenants.memberList')}</CardTitle>
                            <CardDescription>{t('admin.tenants.memberListSub')}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-border border-b bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="text-muted-foreground px-6 py-3 text-xs font-semibold uppercase">{t('admin.users.colNameEmail')}</th>
                                            <th className="text-muted-foreground px-6 py-3 text-xs font-semibold uppercase">{t('admin.users.colRole')}</th>
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
                                                    <tr key={u.id} className="transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                                                        <td className="px-6 py-3.5">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                                                                    {u.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-semibold">{u.name}</div>
                                                                    <span className="text-muted-foreground text-xs">{u.email}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <Badge
                                                                variant={role === 'owner' ? 'default' : 'outline'}
                                                                className={`capitalize ${
                                                                    role === 'owner'
                                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
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
            </div>
        </AppLayout>
    );
}
