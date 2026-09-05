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
import { CreatePlanDialog } from './create-dialog';
import { EditPlanDialog } from './edit-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Plans', href: '/admin/plans' },
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

export const AVAILABLE_FEATURES = [
    { id: 'inventory', label: 'Manajemen Inventori' },
    { id: 'stock_in', label: 'Stok Masuk' },
    { id: 'stock_out', label: 'Stok Keluar' },
    { id: 'stock_opname', label: 'Stok Opname' },
    { id: 'finance_daily', label: 'Keuangan Harian' },
    { id: 'finance_monthly', label: 'Keuangan Bulanan' },
    { id: 'finance_export', label: 'Ekspor Keuangan' },
    { id: 'events_view', label: 'Lihat Event' },
    { id: 'events_register', label: 'Daftar Event' },
    { id: 'events_organizer', label: 'Penyelenggara Event' },
    { id: 'community_read', label: 'Baca Komunitas' },
    { id: 'community_join', label: 'Bergabung Komunitas' },
    { id: 'community_post', label: 'Posting Komunitas' },
    { id: 'suppliers_view', label: 'Rekomendasi Supplier' },
    { id: 'suppliers_add', label: 'Tambah Supplier' },
    { id: 'tax_reports', label: 'Laporan Pajak' },
    { id: 'tax_consultation', label: 'Konsultasi Pajak' },
    { id: 'tax_priority', label: 'Prioritas Konsultasi Pajak' },
    { id: 'multi_user', label: 'Multi Pengguna' },
    { id: 'export_pdf', label: 'Ekspor PDF' },
];

export default function PlansIndex({ plans }: Props) {
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
            <Head title="Paket Langganan SaaS" />
            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="admin-page-header relative overflow-hidden bg-[#F9F7F4] px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <CreditCard size={11} />
                                    Platform Admin
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#17182A] md:text-2xl">Paket Langganan SaaS</h1>
                            <p className="mt-0.5 text-sm text-[#5F6073]">
                                Konfigurasi penawaran paket, batasan resource produk &amp; user, serta fitur aktif untuk tenant.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                            className="admin-primary-button gap-1.5 text-white"
                        >
                            <Plus size={14} /> Buat Paket Baru
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
                                        Paling populer
                                    </div>
                                )}
                                {!plan.is_active && (
                                    <div className="absolute left-5 top-5 rounded-full bg-[#F7EFF0] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#A96A73]">
                                        Nonaktif
                                    </div>
                                )}
                                <CardHeader className="gap-4 px-6 pt-6 pb-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#9693AA]">Paket bisnis</p>
                                            <CardTitle className="text-2xl font-black text-[#17182A]">{plan.name}</CardTitle>
                                        </div>
                                        {!isFeatured && <Badge variant="outline" className="rounded-full border-[#E4E0F1] px-2.5 py-1 text-[10px] font-bold text-[#686673]">{plan.billing_cycle === 'monthly' ? 'Bulanan' : 'Tahunan'}</Badge>}
                                    </div>
                                    <CardDescription className="text-3xl font-black tracking-[-0.04em] text-[#17182A]">
                                        {plan.price === 0 || Number(plan.price) === 0 ? 'Gratis' : formatRupiah(plan.price)}
                                        <span className="ml-1 text-xs font-semibold tracking-normal text-[#9693AA]">/{plan.billing_cycle === 'monthly' ? 'bulan' : 'tahun'}</span>
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex-1 space-y-5 px-6 pb-5">
                                    <div className={`grid grid-cols-3 divide-x rounded-xl border p-3 text-center ${isFeatured ? 'border-[#DCD8FF] bg-[#F4F2FF]' : 'border-[#EEEAF3] bg-[#F8F7FC]'}`}>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Maks. Pengguna:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.max_users >= 99 ? '∞' : plan.max_users}</strong><small className="text-[10px] font-semibold text-[#9693AA]">Pengguna</small></span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Maks. Produk:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.max_products >= 9999 ? '∞' : plan.max_products}</strong><small className="text-[10px] font-semibold text-[#9693AA]">Produk</small></span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="sr-only">Digunakan Oleh:</span>
                                            <span className="w-full"><strong className="block text-base font-black text-[#17182A]">{plan.tenants_count}</strong><small className="text-[10px] font-semibold text-[#9693AA]">Tenant</small></span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-xs font-extrabold tracking-[0.12em] text-[#777583] uppercase">
                                            Termasuk ({plan.features?.length || 0} fitur)
                                        </p>
                                        <div className="grid gap-2 pr-2">
                                            {AVAILABLE_FEATURES.filter((f) => plan.features?.includes(f.id)).map((feat) => (
                                                <div key={feat.id} className="flex items-center gap-2 text-xs font-semibold text-[#53556A]">
                                                    <CheckCircle2 size={14} className="shrink-0 text-[#4C9A78]" />
                                                    <span>{feat.label}</span>
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
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(plan)}
                                        disabled={plan.tenants_count > 0}
                                        className="admin-plan-delete h-10 rounded-xl px-3 text-xs font-extrabold"
                                        title={plan.tenants_count > 0 ? 'Paket sedang digunakan oleh tenant' : 'Hapus Paket'}
                                    >
                                        <Trash2 size={14} className="mr-1" />
                                        Hapus
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
