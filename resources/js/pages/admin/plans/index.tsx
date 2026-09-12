import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Edit3, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePlanDialog } from './create-dialog';
import { EditPlanDialog } from './edit-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.plans', href: '/admin/plans' },
];

export interface Plan {
    id: number;
    name: string;
    slug: string;
    price: number;
    billing_cycle: 'monthly' | 'yearly';
    max_users: number;
    max_products: number;
    features: string[];
    is_active: boolean;
    tenants_count: number;
}

interface Props {
    plans: Plan[];
}

export const FEATURE_MAP: Record<string, string> = {
    'inventory': 'inventory',
    'Manajemen Inventori': 'inventory',
    'stock_in': 'stock_in',
    'Stok Masuk': 'stock_in',
    'stock_out': 'stock_out',
    'Stok Keluar': 'stock_out',
    'stock_opname': 'stock_opname',
    'Stok Opname': 'stock_opname',
    'finance_daily': 'finance_daily',
    'Keuangan Harian': 'finance_daily',
    'Laporan Keuangan Harian': 'finance_daily',
    'finance_monthly': 'finance_monthly',
    'Keuangan Bulanan': 'finance_monthly',
    'Laporan Keuangan Bulanan': 'finance_monthly',
    'finance_export': 'finance_export',
    'Ekspor Keuangan': 'finance_export',
    'Export Laporan': 'finance_export',
    'events_view': 'events_view',
    'Lihat Event': 'events_view',
    'events_register': 'events_register',
    'Daftar Event': 'events_register',
    'events_organizer': 'events_organizer',
    'Penyelenggara Event': 'events_organizer',
    'Selenggarakan Event': 'events_organizer',
    'community_read': 'community_read',
    'Baca Komunitas': 'community_read',
    'Baca Diskusi Komunitas': 'community_read',
    'community_join': 'community_join',
    'Bergabung Komunitas': 'community_join',
    'community_post': 'community_post',
    'Posting Komunitas': 'community_post',
    'Posting Diskusi': 'community_post',
    'suppliers_view': 'suppliers_view',
    'Rekomendasi Supplier': 'suppliers_view',
    'Lihat Rekomendasi Supplier': 'suppliers_view',
    'suppliers_add': 'suppliers_add',
    'Tambah Supplier': 'suppliers_add',
    'tax_reports': 'tax_reports',
    'Laporan Pajak': 'tax_reports',
    'tax_consultation': 'tax_consultation',
    'Konsultasi Pajak': 'tax_consultation',
    'tax_priority': 'tax_priority',
    'Prioritas Konsultasi Pajak': 'tax_priority',
    'Konsultasi Pajak Prioritas': 'tax_priority',
    'multi_user': 'multi_user',
    'Multi Pengguna': 'multi_user',
    'export_pdf': 'export_pdf',
    'Ekspor PDF': 'export_pdf',
    'Export PDF': 'export_pdf',
    'api_access': 'api_access',
    'Akses API': 'api_access',
    'dedicated_support': 'dedicated_support',
    'Dedicated Support': 'dedicated_support',
    'Dukungan Khusus': 'dedicated_support',
};

export function getFeatureLabel(feat: string, t: (key: string, options?: any) => string): string {
    const key = FEATURE_MAP[feat] || feat;
    return t(`features.${key}`, { defaultValue: feat });
}

export const AVAILABLE_FEATURES = [
    { id: 'inventory' },
    { id: 'stock_in' },
    { id: 'stock_out' },
    { id: 'stock_opname' },
    { id: 'finance_daily' },
    { id: 'finance_monthly' },
    { id: 'finance_export' },
    { id: 'events_view' },
    { id: 'events_register' },
    { id: 'events_organizer' },
    { id: 'community_read' },
    { id: 'community_join' },
    { id: 'community_post' },
    { id: 'suppliers_view' },
    { id: 'suppliers_add' },
    { id: 'tax_reports' },
    { id: 'tax_consultation' },
    { id: 'tax_priority' },
    { id: 'multi_user' },
    { id: 'export_pdf' },
];

export default function PlansIndex({ plans }: Props) {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const featuredPlanId = plans.length > 1 ? plans[Math.floor(plans.length / 2)]?.id : null;

    const handleOpenEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setIsEditOpen(true);
    };

    const handleDelete = (plan: Plan) => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket "${plan.name}"?`)) {
            handleAsyncAction(() => routerPromise('delete', `/admin/plans/${plan.id}`), {
                loading: `Menghapus paket "${plan.name}"...`,
                success: `Paket "${plan.name}" berhasil dihapus!`,
                error: 'Gagal Menghapus',
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.plans.title')} />
            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="admin-page-header relative overflow-hidden bg-[#F9F7F4] px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <CreditCard size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#17182A] md:text-2xl">{t('admin.plans.title')}</h1>
                            <p className="mt-0.5 text-sm text-[#5F6073]">
                                {t('admin.plans.subtitle')}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                            className="admin-primary-button gap-1.5 text-white"
                        >
                            <Plus size={14} /> {t('admin.plans.createPlan')}
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content flex flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    {/* Plans List Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => {
                            const isFeatured = plan.id === featuredPlanId;

                            return (
                            <Card
                                key={plan.id}
                                className={`relative flex flex-col overflow-hidden rounded-[1.35rem] border bg-white shadow-[0_8px_24px_rgba(35,30,70,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(35,30,70,0.1)] ${
                                    isFeatured
                                        ? 'border-[#BDB5FF] shadow-[0_12px_32px_rgba(94,75,242,0.14)]'
                                        : 'border-[#E9E5F0]'
                                }`}
                            >
                                <div className={`h-1.5 w-full ${isFeatured ? 'bg-[#5E4BF2]' : 'bg-[#F0EEFF]'}`} />
                                {isFeatured && (
                                    <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#F0EEFF] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#5E4BF2]">
                                        <Sparkles className="size-3" />
                                        {t('admin.plans.mostPopular')}
                                    </div>
                                )}
                                {!plan.is_active && (
                                    <div className="absolute left-5 top-5 rounded-full bg-[#F7EFF0] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#A96A73]">
                                        {t('admin.inactive')}
                                    </div>
                                )}
                                <CardHeader className="gap-4 px-6 pt-6 pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9693AA]">{t('admin.plans.businessPlan')}</p>
                                            <CardTitle className="text-2xl font-black text-[#17182A]">{plan.name}</CardTitle>
                                        </div>
                                        {!isFeatured && <Badge variant="outline" className="rounded-full border-[#E4E0F1] px-2.5 py-1 text-[10px] font-bold text-[#686673]">{plan.billing_cycle === 'monthly' ? t('admin.plans.monthly') : t('admin.plans.yearly')}</Badge>}
                                    </div>
                                    <CardDescription className="text-3xl font-black tracking-[-0.04em] text-[#17182A]">
                                        {plan.price === 0 || Number(plan.price) === 0 ? t('admin.plans.free') : formatRupiah(plan.price)}
                                        <span className="ml-1 text-xs font-semibold tracking-normal text-[#9693AA]">/{plan.billing_cycle === 'monthly' ? t('admin.plans.perMonth') : t('admin.plans.perYear')}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-5 px-6 pb-5">
                                    <div className={`grid grid-cols-3 divide-x rounded-xl border p-3 text-center ${isFeatured ? 'border-[#DCD8FF] bg-[#F4F2FF]' : 'border-[#EEEAF3] bg-[#F8F7FC]'}`}>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Maks. Pengguna:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.max_users >= 99 ? '∞' : plan.max_users}</strong><small className="text-[10px] font-semibold text-[#9693AA]">{t('admin.plans.users')}</small></span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Maks. Produk:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.max_products >= 9999 ? '∞' : plan.max_products}</strong><small className="text-[10px] font-semibold text-[#9693AA]">{t('admin.plans.products')}</small></span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Digunakan Oleh:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.tenants_count}</strong><small className="text-[10px] font-semibold text-[#9693AA]">{t('admin.plans.tenants')}</small></span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-extrabold tracking-[0.12em] text-[#777583] uppercase">
                                            {t('admin.plans.includes', { count: plan.features?.length || 0 })}
                                        </p>
                                        <div className="grid gap-2 pr-2">
                                            {plan.features?.map((feat, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#53556A]">
                                                    <CheckCircle2 size={14} className="shrink-0 text-[#4C9A78]" />
                                                    <span>{getFeatureLabel(feat, t)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>

                                <div className="border-border grid grid-cols-2 gap-2 border-t bg-[#FCFBFE] px-5 py-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleOpenEdit(plan)}
                                        className="admin-plan-edit h-10 rounded-xl px-3 text-xs font-extrabold"
                                    >
                                        <Edit3 size={14} className="mr-1" />
                                        {t('common.edit')}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(plan)}
                                        disabled={plan.tenants_count > 0}
                                        className="admin-plan-delete h-10 rounded-xl px-3 text-xs font-extrabold"
                                        title={plan.tenants_count > 0 ? 'Paket sedang digunakan oleh tenant' : t('admin.plans.deletePlan')}
                                    >
                                        <Trash2 size={14} className="mr-1" />
                                        {t('common.delete')}
                                    </Button>
                                </div>
                            </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Create/Edit Modals */}
            <CreatePlanDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
            <EditPlanDialog plan={editingPlan} open={isEditOpen} onOpenChange={setIsEditOpen} />
        </AppLayout>
    );
}
