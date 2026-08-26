import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
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

    const handleOpenEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setIsEditOpen(true);
    };

    const handleDelete = (plan: Plan) => {
        if (confirm(`Apakah Anda yakin ingin menghapus paket "${plan.name}"?`)) {
            router.delete(`/admin/plans/${plan.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Paket Langganan SaaS" />
            <div className="flex flex-col gap-0">

                {/* Page Header */}
                <div className="relative overflow-hidden bg-[#0d0d0d] px-6 pt-6 pb-5 md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase text-[#1a56ff] border border-[#1a56ff]/20">
                                    <CreditCard size={11} />
                                    Platform Admin
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">Paket Langganan SaaS</h1>
                            <p className="mt-0.5 text-sm text-white/50">Konfigurasi penawaran paket, batasan resource produk &amp; user, serta fitur aktif untuk tenant.</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-[#1a56ff] hover:bg-[#1a56ff]/90 text-white gap-1.5 shadow-lg shadow-[#1a56ff]/20"
                        >
                            <Plus size={14} /> Buat Paket Baru
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6 px-6 pb-6 pt-4 md:px-8">

                    {/* Plans List Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card key={plan.id} className="border-border relative flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            {!plan.is_active && (
                                <div className="absolute top-0 right-0 left-0 bg-slate-500 py-1 text-center text-xs font-semibold text-white">
                                    Nonaktif
                                </div>
                            )}
                            <CardHeader className={!plan.is_active ? 'pt-8' : ''}>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    <Badge variant="outline">{plan.billing_cycle === 'monthly' ? 'Bulanan' : 'Tahunan'}</Badge>
                                </div>
                                <CardDescription className="text-2xl font-bold text-slate-900 dark:text-slate-50 pt-2">
                                    {plan.price === 0 || Number(plan.price) === 0 ? 'Gratis' : formatRupiah(plan.price)}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1 space-y-4">
                                <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Maks. Pengguna:</span>
                                        <span className="font-semibold">{plan.max_users >= 99 ? 'Tak Terbatas' : plan.max_users}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Maks. Produk:</span>
                                        <span className="font-semibold">{plan.max_products >= 9999 ? 'Tak Terbatas' : plan.max_products}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Digunakan Oleh:</span>
                                        <span className="font-semibold">{plan.tenants_count} tenant</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Fitur Aktif ({plan.features?.length || 0}):</p>
                                    <div className="space-y-1.5 pr-2">
                                        {AVAILABLE_FEATURES.filter((f) => plan.features?.includes(f.id)).map((feat) => (
                                            <div key={feat.id} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                                                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                                                <span>{feat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <div className="border-border flex justify-end gap-2 border-t bg-slate-50/50 px-6 py-4 dark:bg-slate-850/20">
                                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(plan)} className="rounded-xl">
                                    <Edit3 size={14} className="mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(plan)}
                                    disabled={plan.tenants_count > 0}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                    title={plan.tenants_count > 0 ? 'Paket sedang digunakan oleh tenant' : 'Hapus Paket'}
                                >
                                    <Trash2 size={14} className="mr-1" />
                                    Hapus
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
                </div>
            </div>

            {/* Create/Edit Modals */}
            <CreatePlanDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
            <EditPlanDialog plan={editingPlan} open={isEditOpen} onOpenChange={setIsEditOpen} />
        </AppLayout>
    );
}
