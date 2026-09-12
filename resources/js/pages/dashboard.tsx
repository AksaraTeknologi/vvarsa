import AppLayout from '@/layouts/app-layout';
import { AiAnalyticsWidget } from '@/components/ai-analytics-widget';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Event, type Product, type Transaction } from '@/types/mrp';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CalendarDays, Package, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'navigation.dashboard', href: '/dashboard' }];

interface DashboardStats {
    total_products: number;
    low_stock_products: number;
    sales_today: number;
    sales_month: number;
    expense_today: number;
    expense_month: number;
    net_today: number;
    net_month: number;
}

interface ChartDataPoint {
    date: string;
    sales: number;
}

interface Props {
    stats: DashboardStats;
    chart_data: ChartDataPoint[];
    recent_transactions: Transaction[];
    upcoming_events: Event[];
    low_stock_list: Product[];
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    color,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ElementType;
    trend?: 'up' | 'down' | 'neutral';
    color: string;
}) {
    return (
        <div className="bg-card border-border rounded-2xl border px-4 py-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-sm font-medium leading-none">{title}</p>
                <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
                    <Icon size={16} className="text-white" />
                </div>
            </div>

            <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[1.55rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[1.8rem]">
                        {value}
                    </p>
                    {subtitle && <p className="text-muted-foreground mt-3 text-[10px] leading-none md:text-[11px]">{subtitle}</p>}
                </div>

                {trend && (
                    <div
                        className={`flex items-center justify-center rounded-full p-1.5 ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : trend === 'down' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}
                    >
                        {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard({ stats, chart_data, recent_transactions, upcoming_events, low_stock_list }: Props) {
    const { t } = useTranslation();
    const netPositive = stats.net_today >= 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[1.8rem] font-bold leading-none tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">
                        {t('dashboard.title')}
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-[0.95rem]">
                        {t('dashboard.subtitle')}
                    </p>
                </div>

                {/* ── Stats Cards ─────────────────────────────────────── */}

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        title={t('dashboard.salesToday')}
                        value={formatRupiah(stats.sales_today, true)}
                        subtitle={`${t('dashboard.thisMonth')}: ${formatRupiah(stats.sales_month, true)}`}
                        icon={TrendingUp}
                        color="bg-emerald-500"
                        trend="up"
                    />
                    <StatCard
                        title={t('dashboard.expenseToday')}
                        value={formatRupiah(stats.expense_today, true)}
                        subtitle={`${t('dashboard.thisMonth')}: ${formatRupiah(stats.expense_month, true)}`}
                        icon={TrendingDown}
                        color="bg-rose-500"
                        trend="down"
                    />
                    <StatCard
                        title={t('dashboard.netProfitToday')}
                        value={formatRupiah(Math.abs(stats.net_today), true)}
                        subtitle={netPositive ? t('dashboard.profit') : t('dashboard.loss')}
                        icon={Wallet}
                        color={netPositive ? 'bg-blue-500' : 'bg-orange-500'}
                        trend={netPositive ? 'up' : 'down'}
                    />
                    <StatCard
                        title={t('dashboard.criticalStock')}
                        value={String(stats.low_stock_products)}
                        subtitle={t('dashboard.fromProducts', { total: stats.total_products })}
                        icon={stats.low_stock_products > 0 ? AlertTriangle : Package}
                        color={stats.low_stock_products > 0 ? 'bg-amber-500' : 'bg-slate-500'}
                    />
                </div>

                {/* ── Chart + Low Stock ────────────────────────────────── */}
                <div className="grid gap-5 lg:grid-cols-3">
                    {/* Chart */}
                    <div className="bg-card border-border rounded-2xl border p-4 shadow-sm lg:col-span-2">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-base font-semibold tracking-[-0.02em] md:text-lg">{t('dashboard.salesTrend')}</h2>
                                <p className="text-muted-foreground mt-1 text-xs">{t('dashboard.salesTrendSubtitle')}</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={205}>
                            <AreaChart data={chart_data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatRupiah(v, true)} />
                                <Tooltip
                                    cursor={{ stroke: '#10b981', strokeOpacity: 0.55, strokeWidth: 2.5 }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload || payload.length === 0) return null;

                                        const point = payload[0];
                                        const value = Number(point.value ?? 0);
                                        const label = String(point.payload?.date ?? '');

                                        return (
                                            <div className="rounded-xl border border-emerald-200 bg-white/95 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                                                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">{label}</div>
                                                <div className="mt-0.5 text-[14px] font-extrabold tracking-[-0.03em] text-emerald-600">
                                                    {formatRupiah(value, true)}
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                    fill="url(#salesGradient)"
                                    isAnimationActive={false}
                                    dot={false}
                                    activeDot={{
                                        r: 5,
                                        fill: '#10b981',
                                        stroke: '#ffffff',
                                        strokeWidth: 3,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Low Stock */}
                    <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold tracking-[-0.02em]">{t('dashboard.criticalStock')}</h2>
                            <Link href="/inventory?low_stock=1" className="text-primary text-[11px] font-medium hover:underline md:text-xs">
                                {t('common.viewAll')}
                            </Link>
                        </div>
                        {low_stock_list.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Package size={32} className="mb-2 text-emerald-500" />
                                <p className="text-muted-foreground text-sm">{t('dashboard.allStockSafe')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {low_stock_list.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-muted/30 px-3 py-2.5">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">{p.category?.name}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${p.current_stock <= 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}
                                            >
                                                {p.current_stock} {p.unit}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Transactions + Events ─────────────────────── */}
                <div className="grid gap-5 lg:grid-cols-2">
                    {/* Recent Transactions */}
                    <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold tracking-[-0.02em]">{t('dashboard.recentTransactions')}</h2>
                            <Link href="/finance/transactions" className="text-primary text-[11px] font-medium hover:underline md:text-xs">
                                {t('common.viewAll')}
                            </Link>
                        </div>
                        {recent_transactions.length === 0 ? (
                            <p className="text-muted-foreground py-6 text-center text-sm">{t('dashboard.noRecentTransactions')}</p>
                        ) : (
                            <div className="space-y-3">
                                {recent_transactions.map((tItem) => (
                                    <div key={tItem.id} className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/20 px-3 py-2.5">
                                        <div
                                            className={`flex size-10 items-center justify-center rounded-xl ${tItem.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}
                                        >
                                            {tItem.type === 'income' ? (
                                                <ArrowUpRight size={15} className="text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <ArrowDownRight size={15} className="text-rose-600 dark:text-rose-400" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">
                                                {tItem.description || (tItem.type === 'income' ? t('dashboard.income') : t('dashboard.expense'))}
                                            </p>
                                            <p className="text-muted-foreground mt-0.5 text-xs">{tItem.date}</p>
                                        </div>
                                        <span
                                            className={`shrink-0 text-sm font-bold ${tItem.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                                        >
                                            {tItem.type === 'income' ? '+' : '-'}
                                            {formatRupiah(tItem.amount, true)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h2 className="text-base font-semibold tracking-[-0.02em]">{t('dashboard.upcomingEvents')}</h2>
                            <Link href="/events" className="text-primary text-[11px] font-medium hover:underline md:text-xs">
                                {t('common.viewAll')}
                            </Link>
                        </div>
                        {upcoming_events.length === 0 ? (
                            <p className="text-muted-foreground py-6 text-center text-sm">{t('dashboard.noUpcomingEvents')}</p>
                        ) : (
                            <div className="space-y-3">
                                {upcoming_events.map((e) => (
                                    <Link
                                        key={e.id}
                                        href={`/events/${e.id}`}
                                        className="hover:bg-emerald-50/80 flex items-start gap-3 rounded-2xl border border-border/80 bg-muted/20 p-3 transition-colors"
                                    >
                                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-emerald-100 text-center text-emerald-700">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                                                {new Date(e.start_date).toLocaleString('id-ID', { month: 'short' })}
                                            </span>
                                            <span className="text-base leading-none font-extrabold">{new Date(e.start_date).getDate()}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">{e.title}</p>
                                            <div className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                                                <CalendarDays size={11} />
                                                <span>{e.city}</span>
                                                {e.registration_fee === 0 && (
                                                    <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        {t('dashboard.free')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Quick Actions ─────────────────────────────────────── */}
                <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold tracking-[-0.02em]">{t('dashboard.quickActions')}</h2>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            {
                                label: t('dashboard.addProduct'),
                                href: '/inventory/create',
                                color: 'bg-blue-500',
                                icon: Package,
                            },
                            {
                                label: t('dashboard.recordStockIn'),
                                href: '/inventory/stock-in',
                                color: 'bg-emerald-500',
                                icon: TrendingUp,
                            },
                            {
                                label: t('dashboard.recordTransaction'),
                                href: '/finance/transactions',
                                color: 'bg-rose-500',
                                icon: Wallet,
                            },
                            {
                                label: t('dashboard.viewEvents'),
                                href: '/events',
                                color: 'bg-amber-500',
                                icon: CalendarDays,
                            },
                        ].map(({ label, href, color, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="bg-card border-border flex min-h-[132px] flex-col justify-between rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_16px_30px_rgba(16,185,129,0.08)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className={`flex size-11 items-center justify-center rounded-2xl text-white ${color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <ArrowUpRight size={16} className="text-emerald-600/70" />
                                </div>
                                <span className="text-sm font-bold tracking-[-0.02em]">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
