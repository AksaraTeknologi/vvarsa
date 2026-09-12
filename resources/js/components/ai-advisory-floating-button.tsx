import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from 'sonner';
import { 
    Sparkles, 
    AlertTriangle, 
    TrendingUp, 
    ShoppingBag, 
    DollarSign, 
    CheckCircle2, 
    RefreshCw, 
    BrainCircuit,
    ChevronRight,
    ShieldAlert,
    Lightbulb,
    X
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils-mrp';

interface ReorderAlert {
    product_id: number;
    product_name: string;
    current_stock: number;
    min_stock: number;
    unit: string;
    daily_usage_avg: number;
    days_until_depleted: number;
    recommended_reorder_qty: number;
    urgency: 'critical' | 'warning' | 'normal';
    reason: string;
}

interface PricingRecommendation {
    variant_id: number;
    variant_name: string;
    current_sell_price: number;
    cost_price: number;
    current_margin_percent: number;
    recommended_sell_price: number;
    recommended_margin_percent: number;
    reason: string;
    action_needed: boolean;
}

interface HealthSummary {
    narrative_summary: string;
    health_score: number;
    status_badge: 'excellent' | 'good' | 'needs_attention';
    key_takeaways: string[];
    actionable_tips: string[];
    is_ai_generated?: boolean;
    ai_error?: string | null;
}

interface AnalyticsData {
    reorder_alerts: ReorderAlert[];
    pricing_recommendations: PricingRecommendation[];
    health_summary: HealthSummary;
}

export function AiAdvisoryFloatingButton() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'reorder' | 'pricing' | 'health'>('reorder');
    const [hasFetched, setHasFetched] = useState<boolean>(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ai/analytics');
            if (!response.ok) throw new Error(t('ai.errorTitle'));
            const result = await response.json();
            if (result.success && result.data) {
                setData(result.data);
                const health = result.data.health_summary;
                if (health && health.is_ai_generated === false) {
                    toast.warning(health.ai_error || 'Gemini API tidak aktif/terkendala. Menggunakan engine aturan lokal.', {
                        duration: 5000,
                    });
                }
            } else {
                throw new Error(result.message || t('ai.errorTitle'));
            }
        } catch (err: any) {
            const errMsg = err.message || t('ai.errorTitle');
            setError(errMsg);
            toast.error(`Gagal memuat AI Analytics: ${errMsg}`);
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    };

    // Lock page scroll when popup is open so only the AI widget is scrollable
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Fetch initial data on mount for alert badge count
    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Listen to Escape key press to close popup
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close popup on Inertia page navigation
    useEffect(() => {
        const unbind = router.on('start', () => {
            setIsOpen(false);
        });
        return () => unbind();
    }, []);

    const reorderAlerts = data?.reorder_alerts || [];
    const pricingRecs = data?.pricing_recommendations || [];
    const health = data?.health_summary;

    const criticalReorderCount = reorderAlerts.filter(a => a.urgency === 'critical').length;
    const warningPricingCount = pricingRecs.filter(p => p.action_needed).length;
    const totalAlertCount = criticalReorderCount + warningPricingCount;

    const toggleOpen = () => {
        if (!isOpen && !hasFetched) {
            fetchAnalytics();
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Backdrop overlay for mobile / focus mode */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 sm:bg-black/20"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ── Chatbot Floating Button (Bottom Right) ──────────────────── */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">

                <button
                    ref={buttonRef}
                    onClick={toggleOpen}
                    aria-label={t('ai.title')}
                    className={`group relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isOpen
                            ? 'bg-slate-950 border-2 border-cyan-500 text-white shadow-cyan-500/30 ring-4 ring-cyan-500/20'
                            : 'bg-slate-900 border-2 border-cyan-500/40 text-white shadow-cyan-500/30 ring-4 ring-slate-800/80 hover:border-cyan-400 hover:bg-slate-950 hover:shadow-cyan-500/50'
                    }`}
                >
                    {/* Ambient Glow */}
                    <div className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-indigo-500/40 blur-md opacity-70 group-hover:opacity-100 transition duration-300" />

                    {isOpen ? (
                        <X className="h-6 w-6 transition-transform duration-300 rotate-90 text-cyan-400" />
                    ) : (
                        <div className="relative flex h-9 w-9 items-center justify-center pointer-events-none">
                            <DotLottieReact src="/animation/auth/Ai.lottie" autoplay loop className="h-full w-full object-contain" />
                        </div>
                    )}

                    {/* Alert Badge Counter */}
                    {!isOpen && totalAlertCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-black text-white shadow-lg border-2 border-slate-950 animate-bounce">
                            {totalAlertCount}
                        </span>
                    )}
                </button>
            </div>

            {/* ── Chatbot Popup Window ────────────────────────────────────── */}
            {isOpen && (
                <div
                    ref={popupRef}
                    role="dialog"
                    aria-modal="true"
                    className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[660px] max-h-[85vh] z-50 flex flex-col rounded-3xl border border-indigo-500/30 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-6 overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between border-b border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700/60 shadow-md overflow-hidden p-1">
                                <DotLottieReact src="/animation/auth/Ai.lottie" autoplay loop className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-base tracking-tight">{t('ai.title')}</h3>
                                </div>
                                <p className="text-[11px] text-indigo-200/70">{t('ai.subtitle')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchAnalytics}
                                disabled={loading}
                                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition backdrop-blur-md disabled:opacity-50"
                                title={t('ai.sync')}
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">{t('ai.sync')}</span>
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition"
                                title="Close"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs (Scrollbar hidden) */}
                    <div className="relative z-10 flex gap-1.5 border-b border-white/5 bg-slate-900/60 px-4 py-2.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        <button
                            onClick={() => setActiveTab('reorder')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                activeTab === 'reorder'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/25'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            {t('ai.tabReorder')}
                            {reorderAlerts.length > 0 && (
                                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold">
                                    {reorderAlerts.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('pricing')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                activeTab === 'pricing'
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            <DollarSign className="h-3.5 w-3.5" />
                            {t('ai.tabPricing')}
                            {warningPricingCount > 0 && (
                                <span className="rounded-full bg-rose-500/40 px-1.5 py-0.2 text-[10px] font-bold text-white">
                                    {warningPricingCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('health')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                                activeTab === 'health'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            {t('ai.tabHealth')}
                            {health && (
                                <span className="rounded-full bg-emerald-500/30 px-1.5 py-0.2 text-[10px] font-bold text-emerald-200">
                                    {health.health_score}/100
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Content Scrollable Body (Scrollbar hidden, but fully scrollable) */}
                    <div className="relative z-10 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-4 sm:p-5 space-y-4 max-h-[calc(85vh-140px)]">
                        {loading && !data && (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin mb-3" />
                                <p className="text-xs font-medium text-indigo-200">{t('ai.reloading')}</p>
                            </div>
                        )}

                        {error && (
                            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4 text-white">
                                <div className="flex items-center gap-2 text-rose-400">
                                    <ShieldAlert className="h-5 w-5" />
                                    <h4 className="font-semibold text-xs">{t('ai.errorTitle')}</h4>
                                </div>
                                <p className="mt-2 text-xs text-rose-300/80">{error}</p>
                                <button
                                    onClick={fetchAnalytics}
                                    className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
                                >
                                    <RefreshCw className="h-3 w-3" /> {t('ai.retry')}
                                </button>
                            </div>
                        )}

                        {!loading && data && (
                            <>
                                {/* ── 1. Smart Reorder Tab ─────────────────────────── */}
                                {activeTab === 'reorder' && (
                                    <div className="space-y-3">
                                        {reorderAlerts.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                                                <CheckCircle2 className="h-9 w-9 text-emerald-400 mb-2" />
                                                <h4 className="font-semibold text-white text-sm">{t('ai.reorderSafeTitle')}</h4>
                                                <p className="text-xs text-slate-400 max-w-sm mt-1">
                                                    {t('ai.reorderSafeDesc')}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {reorderAlerts.map((alert) => (
                                                    <div
                                                        key={alert.product_id}
                                                        className="group relative flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900/90 p-4 transition-all hover:border-amber-500/40"
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <span
                                                                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                                            alert.urgency === 'critical'
                                                                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                                        }`}
                                                                    >
                                                                        <AlertTriangle className="h-3 w-3" />
                                                                        {alert.urgency === 'critical' ? t('ai.critical') : t('ai.reorderAlert')}
                                                                    </span>
                                                                    <h4 className="mt-1.5 font-bold text-white text-sm">{alert.product_name}</h4>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-[10px] text-slate-400">{t('ai.remainingStock')}</p>
                                                                    <p className="text-xs font-bold text-amber-400">
                                                                        {alert.current_stock} <span className="text-[10px] font-normal text-slate-300">{alert.unit}</span>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <p className="mt-2 text-xs text-slate-300">{alert.reason}</p>

                                                            <div className="mt-2.5 flex items-center justify-between text-xs bg-black/20 rounded-xl p-2 border border-white/5">
                                                                <div>
                                                                    <span className="text-slate-400 block text-[10px]">{t('ai.dailyUsage')}</span>
                                                                    <span className="font-semibold text-white">{alert.daily_usage_avg} {alert.unit}{t('ai.perDay')}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-slate-400 block text-[10px]">{t('ai.suggestedPurchase')}</span>
                                                                    <span className="font-bold text-amber-300">+{alert.recommended_reorder_qty} {alert.unit}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-end">
                                                            <Link
                                                                href={`/inventory/stock-in?product_id=${alert.product_id}&qty=${alert.recommended_reorder_qty}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all"
                                                            >
                                                                <ShoppingBag className="h-3.5 w-3.5" />
                                                                {t('ai.btnCreateStockIn')}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── 2. Pricing Recommendation Tab ──────────────────── */}
                                {activeTab === 'pricing' && (
                                    <div className="space-y-3">
                                        {pricingRecs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md">
                                                <CheckCircle2 className="h-9 w-9 text-emerald-400 mb-2" />
                                                <h4 className="font-semibold text-white text-sm">{t('ai.pricingOptimalTitle')}</h4>
                                                <p className="text-xs text-slate-400 max-w-sm mt-1">
                                                    {t('ai.pricingOptimalDesc')}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {pricingRecs.map((rec) => (
                                                    <div
                                                        key={rec.variant_id}
                                                        className="group relative flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/90 p-4 transition-all hover:border-indigo-500/40"
                                                    >
                                                        <div>
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                                                                        <TrendingUp className="h-3 w-3" /> {t('ai.lowMargin')} ({rec.current_margin_percent}%)
                                                                    </span>
                                                                    <h4 className="mt-1.5 font-bold text-white text-sm">{rec.variant_name}</h4>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] text-slate-400">{t('ai.recipeCost')}</p>
                                                                    <p className="text-xs font-semibold text-slate-300">{formatCurrency(rec.cost_price)}</p>
                                                                </div>
                                                            </div>

                                                            <p className="mt-2 text-xs text-slate-300">{rec.reason}</p>

                                                            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs bg-black/20 rounded-xl p-2 border border-white/5">
                                                                <div>
                                                                    <span className="text-slate-400 block text-[10px]">{t('ai.currentPrice')}</span>
                                                                    <span className="font-semibold text-slate-300 line-through">{formatCurrency(rec.current_sell_price)}</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <span className="text-slate-400 block text-[10px]">{t('ai.aiRecommendation')}</span>
                                                                    <span className="font-bold text-emerald-400">{formatCurrency(rec.recommended_sell_price)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                                                            <span className="text-[11px] text-indigo-200">
                                                                {t('ai.targetMargin')}: <strong className="text-emerald-300">{rec.recommended_margin_percent}%</strong>
                                                            </span>
                                                            <Link
                                                                href={`/inventory?search=${encodeURIComponent(rec.variant_name)}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
                                                            >
                                                                {t('ai.btnFixPrice')}
                                                                <ChevronRight className="h-3.5 w-3.5" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ── 3. Business Health Summary Tab ───────────────── */}
                                {activeTab === 'health' && health && (
                                    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-teal-950/30 to-slate-900/90 p-4 backdrop-blur-md space-y-3">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <div>
                                                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                                    {t('ai.performanceAnalysis')}
                                                </span>
                                                <h4 className="text-base font-bold text-white mt-0.5">{t('ai.executiveSummary')}</h4>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400">{t('ai.score')}</p>
                                                    <p className="text-lg font-black text-emerald-400">{health.health_score}<span className="text-xs text-slate-400">/100</span></p>
                                                </div>
                                                <span
                                                    className={`inline-flex rounded-xl px-2.5 py-1 text-[11px] font-bold capitalize ${
                                                        health.status_badge === 'excellent'
                                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                            : health.status_badge === 'good'
                                                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                                    }`}
                                                >
                                                    {health.status_badge === 'excellent' ? t('ai.statusExcellent') : health.status_badge === 'good' ? t('ai.statusGood') : t('ai.statusAttention')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Narrative summary */}
                                        <div className="rounded-xl bg-white/5 p-3 border border-white/5">
                                            <p className="text-xs leading-relaxed text-indigo-100 italic">
                                                &ldquo;{health.narrative_summary}&rdquo;
                                            </p>
                                        </div>

                                        {/* Key takeaways & Tips */}
                                        <div className="grid gap-3 sm:grid-cols-2 pt-1">
                                            <div>
                                                <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {t('ai.keyTakeaways')}
                                                </h5>
                                                <ul className="space-y-1.5">
                                                    {health.key_takeaways.map((point, idx) => (
                                                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                                            <span>{point}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" /> {t('ai.actionableTips')}
                                                </h5>
                                                <ul className="space-y-1.5">
                                                    {health.actionable_tips.map((tip, idx) => (
                                                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                                            <span>{tip}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
