import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type SubscriptionPlan } from '@/types/mrp';
import { Head } from '@inertiajs/react';
import { CheckCircle, Crown, Package, Users, XCircle, Zap } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFeatureLabel } from '@/pages/admin/plans/index';

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
    const { t } = useTranslation();
    const currentSlug = current_plan?.slug || 'free';
    const [loadingPlanId, setLoadingPlanId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('navigation.subscription'), href: '/subscription' }];

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
                loading: t('subscription.upgradeNotice'),
                success: t('subscription.upgradeSuccess'),
                error: t('subscription.upgradeError'),
            },
        ).finally(() => setLoadingPlanId(null));
    };

    const faqItems = [
        {
            q: t('subscription.faq1Q'),
            a: t('subscription.faq1A'),
        },
        {
            q: t('subscription.faq2Q'),
            a: t('subscription.faq2A'),
        },
        {
            q: t('subscription.faq3Q'),
            a: t('subscription.faq3A'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('navigation.subscription')} />
            <div className="business-page flex flex-col gap-5 p-4 md:p-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">{t('subscription.title')}</h1>
                    <p className="business-page-subtitle text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">{t('subscription.subtitle')}</p>
                </div>

                {/* Current status */}
                {current_plan && (
                    <div className="bg-card border-owner-accent/30 mx-auto w-full max-w-5xl rounded-2xl border p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">{t('subscription.activePlan')}</p>
                                <p className="text-base font-bold text-owner-accent">{current_plan.name}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Package size={14} />
                                        {t('subscription.productsCount', { count: product_count })}
                                    </span>
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Users size={14} />
                                        {t('subscription.usersCount', { count: user_count })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid w-full gap-5 [perspective:1200px] sm:grid-cols-3">
                        {plans.map((plan) => {
                            const Icon = PLAN_ICONS[plan.slug] || Package;
                            const isCurrent = plan.slug === currentSlug;
                            const isPopular = plan.slug === 'pro';
                            const isLoading = loadingPlanId === plan.id;

                        return (
                            <div
                                key={plan.id}
                                className={`bg-card relative flex flex-col rounded-2xl border-2 p-5 shadow-sm [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-owner-accent/60 hover:shadow-[0_16px_28px_rgba(90,166,122,0.16)] hover:[transform:rotateX(1deg)_rotateY(-1deg)_translateZ(5px)] motion-reduce:transition-none motion-reduce:hover:transform-none ${isCurrent ? 'border-owner-accent shadow-[0_8px_18px_rgba(90,166,122,0.12)]' : 'border-border'}`}
                            >
                                {isPopular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="rounded-full bg-owner-accent px-3 py-1 text-sm font-semibold text-white">{t('subscription.popular')}</span>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div
                                        className="mb-3 inline-flex rounded-xl bg-owner-accent/10 p-2.5 text-owner-accent"
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold">{plan.name}</h2>
                                    <div className="mt-2">
                                        <span className="text-3xl font-bold">
                                            {plan.price === 0 || Number(plan.price) === 0 ? t('subscription.freePrice') : formatRupiah(plan.price)}
                                        </span>
                                        {Number(plan.price) > 0 && <span className="text-muted-foreground text-sm">{t('subscription.perMonth')}</span>}
                                    </div>
                                </div>

                                {/* Limits */}
                                <div className="mb-4 space-y-1 rounded-xl border border-owner-accent/15 bg-owner-accent/[0.04] p-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('subscription.usersLimit')}</span>
                                        <span className="font-semibold">
                                            {plan.max_users === 99 || plan.max_users >= 99 ? t('subscription.unlimited') : plan.max_users}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">{t('subscription.productsLimit')}</span>
                                        <span className="font-semibold">{plan.max_products >= 9999 ? t('subscription.unlimited') : plan.max_products}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6 flex-1 space-y-2">
                                    {COMPARISON_FEATURES.map((feat) => {
                                        const hasFeature = plan.features?.includes(feat);
                                        return (
                                            <div key={feat} className="flex items-center gap-2 text-sm">
                                                {hasFeature ? (
                                                    <CheckCircle size={14} className="shrink-0 text-owner-accent" />
                                                ) : (
                                                    <XCircle size={14} className="text-muted-foreground/30 shrink-0" />
                                                )}
                                                <span className={hasFeature ? '' : 'text-muted-foreground/50'}>{getFeatureLabel(feat, t)}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Button
                                    disabled={isCurrent || isLoading}
                                    onClick={() => handleUpgrade(plan.id)}
                                    variant={isCurrent || plan.slug === 'free' ? 'outline' : 'owner'}
                                    className={`business-plan-action w-full rounded-xl text-sm ${isCurrent ? 'cursor-not-allowed' : ''}`}
                                >
                                    {isLoading
                                        ? t('subscription.processing')
                                        : isCurrent
                                          ? t('subscription.activePlanBadge')
                                          : plan.price === 0 || Number(plan.price) === 0
                                            ? t('subscription.startFree')
                                            : t('subscription.upgradeNow')}
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ */}
                <div className="bg-card border-border w-full rounded-2xl border p-5 shadow-sm md:p-6">
                    <h2 className="mb-4 text-sm font-semibold">{t('subscription.faqTitle')}</h2>
                    <div className="space-y-4">
                        {faqItems.map((item, i) => (
                            <div key={i} className="border-border border-b pb-4 last:border-0 last:pb-0">
                                <p className="mb-1 text-sm font-semibold">{item.q}</p>
                                <p className="text-muted-foreground text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
