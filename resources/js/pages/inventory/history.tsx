import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type Product, type StockMovement } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
    movements: PaginatedData<StockMovement>;
    products: Product[];
    filters: { type?: string; product?: string };
}

const TYPE_CONFIG_BASE = {
    in: {
        key: 'stockInLabel',
        icon: ArrowUpRight,
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        iconClass: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    out: {
        key: 'stockOutLabel',
        icon: ArrowDownRight,
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        iconClass: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-100 dark:bg-rose-900/30',
    },
    opname: {
        key: 'stockOpnameLabel',
        icon: RefreshCw,
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        iconClass: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
};

export default function StockHistory({ movements, products, filters }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: t('inventory.history'), href: '/inventory/history' },
    ];

    const applyFilter = (newFilters: Record<string, string>) => {
        router.get('/inventory/history', { ...filters, ...newFilters }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.history')} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('inventory.historyTitle')}</h1>
                        <p className="text-muted-foreground text-sm">{t('inventory.historySubtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/inventory/stock-in"
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                            <ArrowUpRight size={16} /> {t('inventory.stockInTitle')}
                        </Link>
                        <Link
                            href="/inventory/stock-out"
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
                        >
                            <ArrowDownRight size={16} /> {t('inventory.stockOutTitle')}
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row">
                    {/* Type filter */}
                    <div className="flex gap-2">
                        {[
                            { value: '', label: t('common.all') },
                            { value: 'in', label: t('inventory.stockInLabel') },
                            { value: 'out', label: t('inventory.stockOutLabel') },
                            { value: 'opname', label: t('inventory.stockOpnameLabel') },
                        ].map((tItem) => (
                            <button
                                key={tItem.value}
                                onClick={() => applyFilter({ type: tItem.value })}
                                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${(filters.type || '') === tItem.value ? 'bg-primary text-primary-foreground' : 'border-border hover:bg-muted border'}`}
                            >
                                {tItem.label}
                            </button>
                        ))}
                    </div>

                    {/* Product filter */}
                    <div className="flex-1">
                        <select
                            value={filters.product || ''}
                            onChange={(e) => applyFilter({ product: e.target.value })}
                            className="border-border bg-background w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="">{t('inventory.allProducts')}</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-border border-b">
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">{t('common.date')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">{t('inventory.product')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-center text-xs font-semibold uppercase">{t('inventory.type')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-center text-xs font-semibold uppercase">{t('inventory.qty')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-center text-xs font-semibold uppercase">{t('inventory.beforeAfter')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">{t('inventory.reference')}</th>
                                    <th className="text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase">{t('inventory.officer')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-border divide-y">
                                {movements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground py-12 text-center text-sm">
                                            {t('inventory.noHistory')}
                                        </td>
                                    </tr>
                                ) : (
                                    movements.data.map((m) => {
                                        const config = TYPE_CONFIG_BASE[m.type] || TYPE_CONFIG_BASE.in;
                                        const Icon = config.icon;
                                        const label = t(`inventory.${config.key}`);
                                        return (
                                            <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="text-muted-foreground px-4 py-3 text-sm">
                                                    {formatDate(m.movement_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium">{m.product?.name}</p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className={`rounded-lg p-1.5 ${config.bg}`}>
                                                            <Icon size={12} className={config.iconClass} />
                                                        </div>
                                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.badge}`}>
                                                            {label}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`text-sm font-semibold ${m.type === 'in' ? 'text-emerald-600' : m.type === 'out' ? 'text-rose-600' : 'text-blue-600'}`}
                                                    >
                                                        {m.type === 'in' ? '+' : m.type === 'out' ? '-' : '±'}
                                                        {m.qty} {m.product?.unit}
                                                    </span>
                                                </td>
                                                <td className="text-muted-foreground px-4 py-3 text-center text-sm">
                                                    {m.qty_before} → <strong className="text-foreground">{m.qty_after}</strong>
                                                </td>
                                                <td className="text-muted-foreground px-4 py-3 text-sm">{m.reference || m.note || '—'}</td>
                                                <td className="text-muted-foreground px-4 py-3 text-sm">{m.user?.name || '—'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {movements.last_page > 1 && (
                        <div className="border-border flex items-center justify-between border-t px-4 py-3">
                            <p className="text-muted-foreground text-sm">
                                {t('inventory.showingHistoryPagination', {
                                    start: (movements.current_page - 1) * movements.per_page + 1,
                                    end: Math.min(movements.current_page * movements.per_page, movements.total),
                                    total: movements.total,
                                })}
                            </p>
                            <div className="flex gap-1">
                                {movements.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`rounded-lg px-3 py-1 text-sm transition-colors ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted disabled:opacity-50'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
