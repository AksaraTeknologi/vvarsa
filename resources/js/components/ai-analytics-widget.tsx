import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
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
    Lightbulb
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

export function AiAnalyticsWidget() {
    const { t } = useTranslation();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'reorder' | 'pricing' | 'health'>('reorder');

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
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-xl text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 backdrop-blur-md animate-pulse">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                {t('ai.title')}
                            </h3>
                            <p className="text-xs text-indigo-200/70">{t('ai.reloading')}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-center py-10">
                    <RefreshCw className="h-7 w-7 text-indigo-400 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-3xl border border-rose-500/20 bg-slate-900/95 p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-6 w-6 text-rose-400" />
                        <h3 className="font-semibold">{t('ai.title')}</h3>
                    </div>
                    <button 
                        onClick={fetchAnalytics}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> {t('ai.retry')}
                    </button>
                </div>
                <p className="mt-3 text-xs text-rose-300/80">{error}</p>
            </div>
        );
    }

    const reorderAlerts = data?.reorder_alerts || [];
    const pricingRecs = data?.pricing_recommendations || [];
    const health = data?.health_summary;

    const warningPricingCount = pricingRecs.filter(p => p.action_needed).length;

    return (
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-900 p-6 shadow-2xl text-white">
            {/* Ambient Background Glow Accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                        <BrainCircuit className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold tracking-tight text-white">{t('ai.title')}</h2>
                        </div>
                        <p className="text-xs text-indigo-200/70 mt-0.5">
                            {t('ai.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchAnalytics}
                        className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition backdrop-blur-md"
                        title={t('ai.sync')}
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> {t('ai.sync')}
                    </button>
                </div>
            </div>

            {/* Tabs (Hidden scrollbar) */}
            <div className="relative z-10 mt-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-2">
                <button
                    onClick={() => setActiveTab('reorder')}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                        activeTab === 'reorder'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                >
                    <ShoppingBag className="h-4 w-4" />
                    {t('ai.tabReorder')}
                    {reorderAlerts.length > 0 && (
                        <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                            {reorderAlerts.length}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('pricing')}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                        activeTab === 'pricing'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                >
                    <DollarSign className="h-4 w-4" />
                    {t('ai.tabPricing')}
                    {warningPricingCount > 0 && (
                        <span className="ml-1 rounded-full bg-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-white">
                            {warningPricingCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={() => setActiveTab('health')}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                        activeTab === 'health'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                >
                    <Sparkles className="h-4 w-4" />
                    {t('ai.tabHealth')}
                    {health && (
                        <span className="ml-1 rounded-full bg-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                            {health.health_score}/100
                        </span>
                    )}
                </button>
            </div>

            {/* Tab Contents */}
            <div className="relative z-10 mt-4">
                {/* ── 1. Smart Reorder Tab ─────────────────────────── */}
                {activeTab === 'reorder' && (
                    <div className="space-y-4">
                        {reorderAlerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                                <h4 className="font-semibold text-white">{t('ai.reorderSafeTitle')}</h4>
                                <p className="text-xs text-slate-400 max-w-md mt-1">
                                    {t('ai.reorderSafeDesc')}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {reorderAlerts.map((alert) => (
                                    <div
                                        key={alert.product_id}
                                        className="group relative flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900/80 p-4 transition-all hover:border-amber-500/40 hover:shadow-lg"
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
                                                    <h4 className="mt-2 font-bold text-white text-base">{alert.product_name}</h4>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400">{t('ai.remainingStock')}</p>
                                                    <p className="text-sm font-bold text-amber-400">
                                                        {alert.current_stock} <span className="text-xs font-normal text-slate-300">{alert.unit}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="mt-2 text-xs text-slate-300 line-clamp-2">{alert.reason}</p>

                                            <div className="mt-3 flex items-center justify-between text-xs bg-black/20 rounded-xl p-2.5 border border-white/5">
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

                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
                                            <Link
                                                href={`/inventory/stock-in?product_id=${alert.product_id}&qty=${alert.recommended_reorder_qty}`}
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
                    <div className="space-y-4">
                        {pricingRecs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                                <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
                                <h4 className="font-semibold text-white">{t('ai.pricingOptimalTitle')}</h4>
                                <p className="text-xs text-slate-400 max-w-md mt-1">
                                    {t('ai.pricingOptimalDesc')}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {pricingRecs.map((rec) => (
                                    <div
                                        key={rec.variant_id}
                                        className="group relative flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/80 p-4 transition-all hover:border-indigo-500/40 hover:shadow-lg"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                                                        <TrendingUp className="h-3 w-3" /> {t('ai.lowMargin')} ({rec.current_margin_percent}%)
                                                    </span>
                                                    <h4 className="mt-2 font-bold text-white text-base">{rec.variant_name}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400">{t('ai.recipeCost')}</p>
                                                    <p className="text-xs font-semibold text-slate-300">{formatCurrency(rec.cost_price)}</p>
                                                </div>
                                            </div>

                                            <p className="mt-2 text-xs text-slate-300 line-clamp-2">{rec.reason}</p>

                                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-black/20 rounded-xl p-2.5 border border-white/5">
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

                                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-[11px] text-indigo-200">
                                                {t('ai.targetMargin')}: <strong className="text-emerald-300">{rec.recommended_margin_percent}%</strong>
                                            </span>
                                            <Link
                                                href={`/inventory?search=${encodeURIComponent(rec.variant_name)}`}
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
                    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-teal-950/30 to-slate-900/90 p-5 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                                    {t('ai.performanceAnalysis')}
                                </span>
                                <h3 className="text-lg font-bold text-white mt-1">{t('ai.executiveSummary')}</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-400">{t('ai.score')}</p>
                                    <p className="text-xl font-black text-emerald-400">{health.health_score}<span className="text-xs text-slate-400">/100</span></p>
                                </div>
                                <span
                                    className={`inline-flex rounded-xl px-3 py-1 text-xs font-bold capitalize ${
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
                        <div className="mt-4 rounded-xl bg-white/5 p-4 border border-white/5">
                            <p className="text-sm leading-relaxed text-indigo-100 italic">
                                &ldquo;{health.narrative_summary}&rdquo;
                            </p>
                        </div>

                        {/* Key takeaways & Tips */}
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {t('ai.keyTakeaways')}
                                </h4>
                                <ul className="space-y-1.5">
                                    {health.key_takeaways.map((point, idx) => (
                                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <Lightbulb className="h-4 w-4 text-amber-400" /> {t('ai.actionableTips')}
                                </h4>
                                <ul className="space-y-1.5">
                                    {health.actionable_tips.map((tip, idx) => (
                                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
