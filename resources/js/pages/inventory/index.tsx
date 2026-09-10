import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { type BreadcrumbItem } from '@/types';
import { type InventoryFilters, type PaginatedData, type Product, type ProductCategory } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, Package, PackagePlus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getColumns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.inventory', href: '/inventory' },
    { title: 'navigation.products', href: '/inventory' },
];

interface Props {
    products: PaginatedData<Product>;
    categories: ProductCategory[];
    filters: InventoryFilters;
    low_stock_list: Product[];
    total_count: number;
    max_products: number;
}

export default function InventoryIndex({ products, categories, filters, low_stock_list, total_count, max_products }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');

    const applyFilter = () => {
        router.get(
            '/inventory',
            {
                search,
                category: category === 'all' ? '' : category,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleToggleActive = (product: Product) => {
        handleAsyncAction(() => routerPromise('patch', `/inventory/${product.id}/toggle-active`, {}, { preserveScroll: true }), {
            loading: `Mengubah status produk "${product.name}"...`,
            success: `Status produk "${product.name}" berhasil diubah!`,
            error: `Gagal Mengubah Status`,
        });
    };

    const tableColumns = getColumns(t, handleToggleActive);

    const usagePercent = Math.round((total_count / max_products) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('navigation.inventory')} - ${t('navigation.products')}`} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('navigation.products')}</h1>
                        <p className="text-muted-foreground text-sm">
                            {t('inventory.productsUsed', { current: total_count, max: max_products })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" asChild className="rounded-xl">
                            <Link href="/inventory/stock-in">{t('navigation.stockIn')}</Link>
                        </Button>
                        <Button asChild className="inline-flex items-center gap-2 rounded-xl">
                            <Link href="/inventory/create">
                                <PackagePlus size={16} />
                                {t('inventory.addProduct')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Usage bar */}
                <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">{t('inventory.capacityLabel')}</span>
                        <span className="text-foreground font-semibold">
                            {total_count}/{max_products}
                        </span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                            className={`h-full rounded-full transition-all ${usagePercent >= 90 ? 'bg-rose-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-primary'}`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                    </div>
                    {usagePercent >= 90 && (
                        <p className="mt-2 flex items-center gap-1 text-xs text-rose-500">
                            <AlertTriangle size={12} />
                            Mendekati batas produk.{' '}
                            <Link href="/subscription" className="underline">
                                Upgrade paket
                            </Link>{' '}
                            untuk menambah lebih banyak produk.
                        </p>
                    )}
                </div>

                {/* Filters */}
                <div className="bg-card border-border flex flex-col items-center gap-3 rounded-2xl border p-4 sm:flex-row">
                    <div className="relative w-full flex-1">
                        <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder={t('inventory.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="w-full rounded-xl pl-9"
                        />
                    </div>

                    <div className="w-full sm:w-48">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full rounded-xl">
                                <SelectValue placeholder={t('inventory.category')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('inventory.allCategories')}</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={applyFilter} className="w-full rounded-xl px-6 sm:w-auto">
                        {t('common.filter')}
                    </Button>
                </div>

                {/* Products TanStack Table + Low Stock Panel */}
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        <DataTable columns={tableColumns} data={products.data} />

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                                <p className="text-muted-foreground text-sm">
                                    {t('inventory.showingPagination', {
                                        start: (products.current_page - 1) * products.per_page + 1,
                                        end: Math.min(products.current_page * products.per_page, products.total),
                                        total: products.total,
                                    })}
                                </p>
                                <div className="flex gap-1">
                                    {products.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className="h-8 rounded-lg px-3 text-xs"
                                        >
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">{t('inventory.lowStockTitle')}</h2>
                                <p className="text-muted-foreground text-xs">{t('inventory.lowStockSubtitle')}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild className="rounded-lg text-xs">
                                <Link href="/inventory?low_stock=1">{t('inventory.viewAll')}</Link>
                            </Button>
                        </div>

                        {low_stock_list.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Package size={32} className="mb-2 text-emerald-500" />
                                <p className="text-muted-foreground text-sm">{t('inventory.allStockSafe')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {low_stock_list.map((product) => {
                                    const isEmpty = product.current_stock <= 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-amber-200 bg-amber-50/70 p-3 dark:border-amber-900/40 dark:bg-amber-900/10"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="text-foreground truncate text-sm font-medium">{product.name}</p>
                                                <p className="text-muted-foreground text-xs">
                                                    {t('inventory.minStockLimit', { min: product.min_stock, unit: product.unit })}
                                                </p>
                                            </div>
                                            <div
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isEmpty ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}
                                            >
                                                {product.current_stock} {product.unit}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
