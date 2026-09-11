import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type SubscriptionPlan } from '@/types/mrp';
import { Head } from '@inertiajs/react';
import { CheckCircle, Crown, Package, Users, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Langganan', href: '/subscription' }];

interface TenantPlan {
    name: string;
    slug: string;
    features: string[];
}

interface Props {
    plans: SubscriptionPlan[];
    current_plan: TenantPlan | null;
    subscription: { status: string; ends_at: string | null } | null;
    product_count: number;
    user_count: number;
}

const PLAN_ICONS: Record<string, React.ElementType> = {
    free: Package,
    pro: Zap,
    enterprise: Crown,
};

const PLAN_COLORS: Record<string, string> = {
    free: 'border-slate-300 dark:border-slate-600',
    pro: 'border-blue-400 shadow-blue-100 dark:border-blue-500 dark:shadow-blue-900/20',
    enterprise: 'border-purple-400 shadow-purple-100 dark:border-purple-500 dark:shadow-purple-900/20',
};

const FEATURE_LABELS: Record<string, string> = {
    inventory: 'Manajemen Inventori',
    stock_in: 'Stok Masuk',
    stock_out: 'Stok Keluar',
    stock_opname: 'Stok Opname',
    finance_daily: 'Laporan Keuangan Harian',
    finance_monthly: 'Laporan Keuangan Bulanan',
    finance_export: 'Export Laporan',
    events_view: 'Lihat Event',
    events_register: 'Daftar Event',
    events_organizer: 'Selenggarakan Event',
    community_read: 'Baca Diskusi Komunitas',
    community_join: 'Bergabung Komunitas',
    community_post: 'Posting Diskusi',
    suppliers_view: 'Lihat Rekomendasi Supplier',
    suppliers_add: 'Tambah Supplier',
    tax_reports: 'Laporan Pajak',
    tax_consultation: 'Konsultasi Pajak',
    tax_priority: 'Konsultasi Pajak Prioritas',
    multi_user: 'Multi Pengguna',
    export_pdf: 'Export PDF',
    api_access: 'Akses API',
    dedicated_support: 'Dedicated Support',
};

// Features to highlight comparison
const COMPARISON_FEATURES = [
    'inventory',
    'stock_opname',
    'finance_daily',
    'finance_monthly',
    'finance_export',
    'events_view',
    'events_register',
    'community_post',
    'suppliers_view',
    'tax_reports',
    'tax_consultation',
    'multi_user',
    'export_pdf',
    'api_access',
    'dedicated_support',
];

export default function SubscriptionIndex({ plans, current_plan, product_count, user_count }: Props) {
    const currentSlug = current_plan?.slug || 'free';
    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

    const handleUpgrade = (planId: number) => {
        setLoadingPlanId(planId);
        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/subscription/upgrade',
                    { plan_id: planId },
                    {
                        onFinish: () => setLoadingPlanId(null),
                    },
                ),
            {
                loading: 'Memproses upgrade paket...',
                success: 'Paket berhasil diperbarui!',
                error: 'Gagal Upgrade Paket',
            },
        ).finally(() => setLoadingPlanId(null));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} className="subscription-page-layout">
            <Head title="Langganan" />
            <div className="subscription-shell relative isolate min-h-screen overflow-hidden px-4 py-6 md:px-6">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="subscription-orb absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/35" />
                    <div className="subscription-orb subscription-orb-delay absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-200/40" />
                    <div className="subscription-orb subscription-orb-delay-2 absolute bottom-8 left-1/5 h-96 w-96 rounded-full bg-lime-100/35" />
                    <div className="subscription-orb-alt absolute left-1/3 top-14 h-52 w-52 rounded-full bg-emerald-100/55" />
                    <div className="subscription-orb-alt subscription-orb-delay-3 absolute right-1/4 bottom-20 h-60 w-60 rounded-full bg-white/55" />
                    <div className="subscription-orb-alt subscription-orb-delay-4 absolute left-12 bottom-24 h-48 w-48 rounded-full bg-emerald-50/70" />
                    <div className="subscription-orb absolute right-12 top-1/2 h-40 w-40 rounded-full bg-emerald-100/50" />
                </div>

                <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
                    {/* Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-4xl">Pilih Paket yang Tepat</h1>
                        <p className="mt-2 text-sm text-emerald-50/90 md:text-base">
                            Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis Anda
                        </p>
                    </div>

                    {/* Current status */}
                    {current_plan && (
                        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/50 bg-white/72 p-4 shadow-[0_30px_80px_-30px_rgba(2,44,22,0.72)] backdrop-blur-md">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-emerald-800/80">Paket Aktif</p>
                                    <p className="text-lg font-bold text-slate-800">{current_plan.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-3 text-sm text-slate-700">
                                        <span className="flex items-center gap-1">
                                            <Package size={14} className="text-emerald-700" />
                                            {product_count} produk
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={14} className="text-emerald-700" />
                                            {user_count} pengguna
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Cards */}
                    <div className="mx-auto grid w-full max-w-5xl gap-6 sm:grid-cols-3">
                        {plans.map((plan) => {
                            const Icon = PLAN_ICONS[plan.slug] || Package;
                            const isCurrent = plan.slug === currentSlug;
                            const isPopular = plan.slug === 'pro';
                            const isLoading = loadingPlanId === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-[28px] border-2 bg-white/78 p-6 shadow-[0_25px_60px_-25px_rgba(3,45,23,0.7)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_70px_-24px_rgba(3,45,23,0.75)] ${PLAN_COLORS[plan.slug]}`}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="rounded-full bg-gradient-to-r from-emerald-600 to-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-900/20">
                                                Paling Populer
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <div
                                            className={`mb-3 inline-flex rounded-xl p-2.5 ${plan.slug === 'free' ? 'bg-slate-100' : plan.slug === 'pro' ? 'bg-emerald-100' : 'bg-violet-100'}`}
                                        >
                                            <Icon
                                                size={20}
                                                className={
                                                    plan.slug === 'free' ? 'text-slate-600' : plan.slug === 'pro' ? 'text-emerald-600' : 'text-violet-600'
                                                }
                                            />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">{plan.name}</h2>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold text-slate-900">
                                                {plan.price === 0 || Number(plan.price) === 0 ? 'Gratis' : formatRupiah(plan.price)}
                                            </span>
                                            {Number(plan.price) > 0 && <span className="text-sm text-slate-500">/bulan</span>}
                                        </div>
                                    </div>

                                    {/* Limits */}
                                    <div className="mb-4 space-y-1 rounded-2xl bg-emerald-50/80 p-3 ring-1 ring-emerald-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Pengguna</span>
                                            <span className="font-semibold text-slate-800">
                                                {plan.max_users === 99 || plan.max_users >= 99 ? 'Tak Terbatas' : plan.max_users}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">Produk</span>
                                            <span className="font-semibold text-slate-800">{plan.max_products >= 9999 ? 'Tak Terbatas' : plan.max_products}</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6 flex-1 space-y-2">
                                        {COMPARISON_FEATURES.map((feat) => {
                                            const hasFeature = plan.features?.includes(feat);
                                            return (
                                                <div key={feat} className="flex items-center gap-2 text-sm">
                                                    {hasFeature ? (
                                                        <CheckCircle size={14} className="shrink-0 text-emerald-500" />
                                                    ) : (
                                                        <XCircle size={14} className="shrink-0 text-slate-300" />
                                                    )}
                                                    <span className={hasFeature ? 'text-slate-700' : 'text-slate-400'}>{FEATURE_LABELS[feat] || feat}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant={isCurrent ? 'secondary' : 'owner'}
                                        size="default"
                                        disabled={isCurrent || isLoading}
                                        onClick={() => handleUpgrade(plan.id)}
                                        className="w-full text-sm font-semibold"
                                    >
                                        {isLoading
                                            ? 'Memproses...'
                                            : isCurrent
                                              ? '✓ Paket Aktif'
                                              : plan.price === 0 || Number(plan.price) === 0
                                                ? 'Mulai Gratis'
                                                : 'Upgrade Sekarang'}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>

                    {/* FAQ */}
                    <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-white/60 bg-white/72 p-6 shadow-[0_30px_80px_-30px_rgba(2,44,22,0.72)] backdrop-blur-md">
                        <h2 className="mb-4 font-semibold text-slate-800">Pertanyaan Umum</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    q: 'Apakah bisa upgrade/downgrade kapan saja?',
                                    a: 'Ya, Anda bisa upgrade atau downgrade paket kapan saja. Perubahan berlaku di periode tagihan berikutnya.',
                                },
                                {
                                    q: 'Metode pembayaran apa yang diterima?',
                                    a: 'Kami menerima transfer bank, kartu kredit/debit, dan dompet digital (GoPay, OVO, DANA).',
                                },
                                {
                                    q: 'Apakah ada uji coba gratis untuk paket berbayar?',
                                    a: 'Paket Free sudah bisa digunakan selamanya tanpa biaya. Anda bisa upgrade kapan saja saat bisnis Anda berkembang.',
                                },
                            ].map((item, i) => (
                                <div key={i} className="border-b border-emerald-100 pb-4 last:border-0 last:pb-0">
                                    <p className="mb-1 text-sm font-semibold text-slate-800">{item.q}</p>
                                    <p className="text-sm text-slate-600">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
