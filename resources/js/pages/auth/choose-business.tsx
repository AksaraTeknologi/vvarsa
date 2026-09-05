import { Head, useForm } from '@inertiajs/react';
import { Check, Info, LoaderCircle, Package, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Types ──────────────────────────────────────────────────────────────────────

type Plan = {
    id: string;
    name: string;
    slug: string;
    price: number;
    max_users: number;
    max_products: number;
    features: string[];
};

type Props = {
    plans: Plan[];
    alreadySetup?: boolean;
};

type FormData = {
    plan_slug: string;
    business_name: string;
    business_type: string;
};

// ── Plan config (Gaya Solid/Unipay Style) ────────────────────────────────────

const planMeta: Record<
    string,
    {
        badge?: string;
        badgeColor?: string;
        bg: string;
        text: string;
        descriptionText: string;
        activeRing: string;
        icon: React.ReactNode;
        highlight?: boolean;
    }
> = {
    free: {
        bg: 'bg-white',
        text: 'text-black',
        descriptionText: 'text-gray-600',
        activeRing: 'ring-4 ring-white/50',
        icon: <Package className="h-6 w-6 text-black" />,
    },
    pro: {
        badge: 'Paling Populer',
        badgeColor: 'bg-white text-[#9333ea] border-2 border-[#9333ea]/20',
        bg: 'bg-[#9333ea]',
        text: 'text-white',
        descriptionText: 'text-white/80',
        activeRing: 'ring-4 ring-[#9333ea]/60',
        icon: <Zap className="h-6 w-6 text-white" />,
        highlight: true,
    },
    enterprise: {
        badge: 'Terlengkap',
        badgeColor: 'bg-black text-[#ffc200] border-2 border-white/20',
        bg: 'bg-[#ffc200]', // Kuning Unipay
        text: 'text-black',
        descriptionText: 'text-black/70',
        activeRing: 'ring-4 ring-[#ffc200]/60',
        icon: <Sparkles className="h-6 w-6 text-black" />,
    },
};

// ── Feature label map ──────────────────────────────────────────────────────────

const featureLabels: Record<string, string> = {
    inventory: 'Manajemen Inventori',
    stock_in: 'Stok Masuk',
    stock_out: 'Stok Keluar',
    stock_opname: 'Stock Opname',
    finance_daily: 'Laporan Keuangan Harian',
    finance_monthly: 'Laporan Keuangan Bulanan',
    finance_export: 'Export Laporan Keuangan',
    events_view: 'Lihat Event',
    events_register: 'Daftar Event',
    events_organizer: 'Kelola Event',
    community_read: 'Baca Forum Komunitas',
    community_join: 'Bergabung Forum',
    community_post: 'Posting di Forum',
    suppliers_view: 'Lihat Supplier',
    suppliers_add: 'Tambah Supplier',
    tax_reports: 'Laporan Pajak',
    tax_consultation: 'Konsultasi Pajak',
    tax_priority: 'Konsultasi Pajak Prioritas',
    multi_user: 'Multi Pengguna',
    export_pdf: 'Export PDF',
    api_access: 'Akses API',
    dedicated_support: 'Dukungan Khusus',
};

const planHighlights: Record<string, string[]> = {
    free: ['inventory', 'stock_in', 'stock_out', 'finance_daily', 'events_view'],
    pro: ['multi_user', 'finance_export', 'tax_reports', 'tax_consultation', 'export_pdf'],
    enterprise: ['api_access', 'dedicated_support', 'tax_priority', 'events_organizer', 'suppliers_add'],
};

// ── Business type cards ────────────────────────────────────────────────────────

const businessTypes = [
    {
        value: 'fnb',
        label: 'Food & Beverage',
        emoji: '🍜',
        description: 'Restoran, kafe, kuliner.',
        activeBg: 'bg-[#ffc200]',
        activeText: 'text-black',
        activeDesc: 'text-black/80',
    },
    {
        value: 'retail',
        label: 'Retail / Toko',
        emoji: '🛍️',
        description: 'Toko, minimarket, fashion.',
        activeBg: 'bg-[#1a56ff]',
        activeText: 'text-white',
        activeDesc: 'text-white/80',
    },
    {
        value: 'services',
        label: 'Jasa / Services',
        emoji: '🔧',
        description: 'Salon, bengkel, layanan.',
        activeBg: 'bg-[#ffb5c6]',
        activeText: 'text-black',
        activeDesc: 'text-black/80',
    },
    {
        value: 'fashion',
        label: 'Fashion & Tekstil',
        emoji: '👗',
        description: 'Butik, sepatu, tas.',
        activeBg: 'bg-white',
        activeText: 'text-black',
        activeDesc: 'text-gray-600',
    },
    {
        value: 'general',
        label: 'Manufaktur / Umum',
        emoji: '🏭',
        description: 'Produksi, kerajinan, lainnya.',
        activeBg: 'bg-[#2a2a2c]',
        activeText: 'text-white',
        activeDesc: 'text-gray-400',
    },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

// ── Step indicator ─────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 }) {
    return (
        <div className="mb-10 flex items-center justify-center gap-3">
            {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-3">
                    <div
                        className={[
                            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300',
                            s === step ? 'bg-[#1a56ff] text-white' : s < step ? 'bg-white text-black' : 'bg-[#1c1c1e] text-gray-500',
                        ].join(' ')}
                    >
                        {s < step ? <Check className="h-4 w-4" /> : s}
                    </div>
                    <span className={['hidden text-sm font-bold transition-colors sm:block', s === step ? 'text-white' : 'text-gray-500'].join(' ')}>
                        {s === 1 ? 'Pilih Paket' : 'Detail Bisnis'}
                    </span>
                    {s < 2 && (
                        <div className={['h-1 w-8 rounded-full transition-colors duration-300', step > 1 ? 'bg-white' : 'bg-[#1c1c1e]'].join(' ')} />
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ChooseBusiness({ plans = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        plan_slug: '',
        business_name: '',
        business_type: '',
    });

    const [step, setStep] = useState<1 | 2>(1);
    const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
    const [hoveredType, setHoveredType] = useState<string | null>(null);
    const [detailPlan, setDetailPlan] = useState<Plan | null>(null);

    const handlePlanNext = () => {
        if (data.plan_slug) setStep(2);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('choose-business.store'));
    };

    return (
        <>
            <Head title="Setup Bisnis" />

            <div className="min-h-svh w-full bg-black pb-20 font-sans text-white selection:bg-white/30">
                {/* ── Decorative background ── */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-50">
                    <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#ffc200]/10 blur-3xl" />
                </div>

                {/* max-w-5xl untuk membuat card lebih lebar dan leluasa */}
                <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-10 sm:py-16">
                    {/* ── Header ── */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            {step === 1 ? 'Pilih Paket Langganan' : 'Detail Bisnis Anda'}
                        </h1>
                        <p className="mt-3 text-sm font-medium text-gray-400 sm:text-base">
                            {step === 1
                                ? 'Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis Anda.'
                                : 'Isi informasi bisnis Anda untuk personalisasi pengalaman.'}
                        </p>
                    </div>

                    {/* ── Step indicator ── */}
                    <StepIndicator step={step} />

                    {/* ═══════════════ STEP 1: Plan selection ═══════════════ */}
                    {step === 1 && (
                        <div className="w-full space-y-12">
                            {/* gap-8 lg:gap-10 untuk memberi jarak renggang antar card */}
                            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
                                {plans.map((plan) => {
                                    const meta = planMeta[plan.slug] ?? planMeta.free;
                                    const isSelected = data.plan_slug === plan.slug;
                                    const isHovered = hoveredPlan === plan.slug;
                                    const highlights = planHighlights[plan.slug] ?? plan.features.slice(0, 5);

                                    // Membuat card Pro (tengah) lebih besar
                                    const isPro = plan.slug === 'pro';

                                    // Dynamic scale class
                                    const scaleClass = isPro
                                        ? isSelected
                                            ? 'scale-[1.05] sm:scale-110 shadow-2xl'
                                            : isHovered
                                              ? 'scale-[1.02] sm:scale-[1.08] shadow-xl'
                                              : 'scale-100 sm:scale-105 shadow-lg'
                                        : isSelected
                                          ? 'scale-[1.03] shadow-2xl'
                                          : isHovered
                                            ? 'scale-[1.01] shadow-xl'
                                            : 'scale-100 shadow-sm';

                                    return (
                                        <div
                                            key={plan.slug}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => setData('plan_slug', plan.slug)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setData('plan_slug', plan.slug);
                                                }
                                            }}
                                            onMouseEnter={() => setHoveredPlan(plan.slug)}
                                            onMouseLeave={() => setHoveredPlan(null)}
                                            className={[
                                                'relative flex cursor-pointer flex-col rounded-[2.5rem] p-7 text-left transition-all duration-300 outline-none focus-visible:ring-offset-4 focus-visible:ring-offset-black',
                                                meta.bg,
                                                meta.text,
                                                scaleClass,
                                                isPro ? 'z-10' : 'z-0',
                                                isSelected ? meta.activeRing : '',
                                            ].join(' ')}
                                        >
                                            {/* Dekorasi abstrak di dalam kartu (dibungkus clip/hidden agar tidak memotong badge di luar) */}
                                            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
                                                <div className="absolute -top-10 -right-6 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
                                            </div>

                                            {/* Badge - diletakkan di luar overflow-hidden agar terlihat jelas */}
                                            {meta.badge && (
                                                <span
                                                    className={[
                                                        'absolute -top-5 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-1.5 text-[11px] font-extrabold tracking-widest whitespace-nowrap uppercase shadow-xl',
                                                        meta.badgeColor,
                                                    ].join(' ')}
                                                >
                                                    {meta.badge}
                                                </span>
                                            )}

                                            {/* Selected checkmark */}
                                            {isSelected && (
                                                <span className="absolute top-6 right-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-current shadow-inner backdrop-blur-sm">
                                                    <Check className="h-5 w-5" />
                                                </span>
                                            )}

                                            {/* Plan icon */}
                                            <div className="z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black/10 backdrop-blur-md">
                                                {meta.icon}
                                            </div>

                                            {/* Name & price */}
                                            <div className="z-10">
                                                <p className="text-xl font-bold">{plan.name} Plan</p>
                                                <p className="mt-2 text-4xl font-extrabold tracking-tight">
                                                    {formatPrice(plan.price)}
                                                    {plan.price > 0 && (
                                                        <span className={['ml-1 text-sm font-bold', meta.descriptionText].join(' ')}>/ bln</span>
                                                    )}
                                                </p>
                                            </div>

                                            {/* Limits */}
                                            <div className={['z-10 mt-4 flex gap-4 text-xs font-bold', meta.descriptionText].join(' ')}>
                                                <span className="rounded-md bg-black/5 px-2 py-1">
                                                    👤 {plan.max_users === 99 ? 'Unlimited' : plan.max_users}
                                                </span>
                                                <span className="rounded-md bg-black/5 px-2 py-1">
                                                    📦 {plan.max_products >= 9999 ? 'Unlimited' : plan.max_products}
                                                </span>
                                            </div>

                                            {/* Features */}
                                            <ul className="z-10 mt-8 flex-1 space-y-3">
                                                {highlights.map((feat) => (
                                                    <li key={feat} className="flex items-start gap-3 text-sm font-bold">
                                                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10">
                                                            <Check className="h-3 w-3" />
                                                        </div>
                                                        <span className="opacity-95">{featureLabels[feat] ?? feat}</span>
                                                    </li>
                                                ))}
                                                {plan.features.length > highlights.length && (
                                                    <li className={['pt-1 pl-8 text-xs font-bold', meta.descriptionText].join(' ')}>
                                                        +{plan.features.length - highlights.length} fitur lainnya
                                                    </li>
                                                )}
                                            </ul>

                                            {/* Button to view plan details */}
                                            <div className="z-10 mt-8 border-t border-black/10 pt-5">
                                                <button
                                                    type="button"
                                                    className="flex w-full items-center justify-center gap-2 rounded-full bg-black/10 py-3.5 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-black/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDetailPlan(plan);
                                                    }}
                                                >
                                                    <Info className="h-4 w-4" />
                                                    Detail Paket
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {errors.plan_slug && <p className="text-center text-sm font-bold text-red-500">{errors.plan_slug}</p>}

                            <div className="flex justify-center pt-4">
                                <Button
                                    type="button"
                                    size="lg"
                                    className="h-16 w-full rounded-full text-xl font-bold shadow-[0_0_40px_rgba(255,255,255,0.1)] sm:w-2/3"
                                    disabled={!data.plan_slug}
                                    onClick={handlePlanNext}
                                >
                                    Lanjutkan Pendaftaran
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ═══════════════ STEP 2: Business detail ═══════════════ */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl space-y-8">
                            {/* Back button */}
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex items-center gap-2 text-sm font-bold text-gray-400 transition-colors hover:text-white"
                            >
                                ← Kembali pilih paket
                            </button>

                            {/* Selected plan summary */}
                            {(() => {
                                const p = plans.find((p) => p.slug === data.plan_slug);
                                const meta = planMeta[data.plan_slug] ?? planMeta.free;
                                return p ? (
                                    <div
                                        className={['flex items-center gap-5 rounded-3xl p-5 shadow-lg transition-all', meta.bg, meta.text].join(' ')}
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/10">{meta.icon}</div>
                                        <div>
                                            <p className="text-base font-bold">Paket {p.name}</p>
                                            <p className={['text-sm font-bold', meta.descriptionText].join(' ')}>
                                                {formatPrice(p.price)}
                                                {p.price > 0 ? '/bulan' : ''}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="rounded-full bg-black/20 px-5 py-2.5 text-xs font-bold transition-colors hover:bg-black/30"
                                            >
                                                Ganti
                                            </button>
                                        </div>
                                    </div>
                                ) : null;
                            })()}

                            {/* Business name */}
                            <div className="space-y-3 pt-2">
                                <Label htmlFor="business_name" className="text-lg font-bold text-white">
                                    Nama Bisnis <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="business_name"
                                    type="text"
                                    required
                                    autoFocus
                                    value={data.business_name}
                                    onChange={(e) => setData('business_name', e.target.value)}
                                    disabled={processing}
                                    placeholder="contoh: Warung Mochi Bahagia"
                                    className="h-16 rounded-full border-0 bg-[#1c1c1e] px-8 text-lg font-bold text-white placeholder:font-medium placeholder:text-gray-600 focus-visible:ring-4 focus-visible:ring-[#1a56ff]"
                                />
                                <InputError message={errors.business_name} />
                            </div>

                            {/* Business type cards */}
                            <div className="space-y-4 pt-2">
                                <Label className="text-lg font-bold text-white">
                                    Tipe Bisnis <span className="text-red-500">*</span>
                                </Label>
                                <InputError message={errors.business_type} />

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    {businessTypes.map((type) => {
                                        const isSelected = data.business_type === type.value;
                                        const isHovered = hoveredType === type.value;

                                        return (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setData('business_type', type.value)}
                                                onMouseEnter={() => setHoveredType(type.value)}
                                                onMouseLeave={() => setHoveredType(null)}
                                                disabled={processing}
                                                className={[
                                                    'group relative flex flex-col items-start gap-3 rounded-[2rem] p-6 text-left transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-[#1a56ff]',
                                                    isSelected
                                                        ? `${type.activeBg} ${type.activeText} scale-[1.02] shadow-xl ring-4 ring-white/20`
                                                        : 'bg-[#1c1c1e] text-white hover:bg-[#2c2c2e]',
                                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                                ].join(' ')}
                                            >
                                                <span
                                                    className={[
                                                        'flex h-14 w-14 items-center justify-center rounded-full text-3xl transition-transform duration-200',
                                                        isSelected ? 'bg-black/10' : 'bg-[#2c2c2e]',
                                                        isSelected || isHovered ? 'scale-110' : '',
                                                    ].join(' ')}
                                                >
                                                    {type.emoji}
                                                </span>
                                                <div className="mt-1">
                                                    <p className="text-lg leading-tight font-bold">{type.label}</p>
                                                    <p
                                                        className={[
                                                            'mt-1.5 text-sm leading-snug font-medium',
                                                            isSelected ? type.activeDesc : 'text-gray-400',
                                                        ].join(' ')}
                                                    >
                                                        {type.description}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-16 w-full rounded-full bg-[#1a56ff] text-xl font-bold text-white shadow-[0_8px_30px_0_rgba(26,86,255,0.4)] hover:bg-[#1545cc]"
                                    disabled={processing || !data.business_type || !data.business_name.trim()}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                                            Menyiapkan bisnis Anda…
                                        </>
                                    ) : (
                                        'Mulai Menggunakan MRP'
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* ── Dialog Detail Paket ── */}
            <Dialog open={!!detailPlan} onOpenChange={(open) => !open && setDetailPlan(null)}>
                {detailPlan && (
                    <DialogContent className="max-w-md border-[#2c2c2e] bg-[#1c1c1e] p-7 text-white sm:rounded-[2.5rem]">
                        <DialogHeader>
                            <div className="flex items-center gap-5">
                                <div className={['flex h-16 w-16 items-center justify-center rounded-full', planMeta[detailPlan.slug]?.bg].join(' ')}>
                                    {planMeta[detailPlan.slug]?.icon}
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-extrabold text-white capitalize">{detailPlan.name}</DialogTitle>
                                    <DialogDescription className="mt-1 text-base font-bold text-gray-400">
                                        {formatPrice(detailPlan.price)}
                                        {detailPlan.price > 0 ? ' / bulan' : ' (Gratis)'}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-7 py-5">
                            {/* Limit Box */}
                            <div className="grid grid-cols-2 gap-4 rounded-[1.5rem] border border-[#2c2c2e] bg-black/40 p-5 text-center shadow-inner">
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Maks. User</p>
                                    <p className="mt-1.5 text-2xl font-extrabold text-white">
                                        {detailPlan.max_users === 99 ? 'Unl' : detailPlan.max_users}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Maks. Produk</p>
                                    <p className="mt-1.5 text-2xl font-extrabold text-white">
                                        {detailPlan.max_products >= 9999 ? 'Unl' : detailPlan.max_products}
                                    </p>
                                </div>
                            </div>

                            {/* Fitur Lengkap */}
                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-widest text-gray-500 uppercase">
                                    Daftar Fitur Lengkap ({detailPlan.features.length})
                                </h4>
                                <div className="custom-scrollbar max-h-64 space-y-4 overflow-y-auto pr-3">
                                    {detailPlan.features.map((feat) => (
                                        <div key={feat} className="flex items-center gap-4 text-base font-bold">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1a56ff]/20 text-[#1a56ff]">
                                                <Check className="h-4 w-4" />
                                            </div>
                                            <span className="text-gray-200">{featureLabels[feat] ?? feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-2 sm:justify-center">
                            <Button
                                type="button"
                                size="lg"
                                className="h-14 w-full rounded-full bg-white text-lg font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-gray-200"
                                onClick={() => {
                                    setData('plan_slug', detailPlan.slug);
                                    setDetailPlan(null);
                                    if (step === 1) {
                                        setStep(2);
                                    }
                                }}
                            >
                                Pilih Paket {detailPlan.name}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
