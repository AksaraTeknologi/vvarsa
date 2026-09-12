'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DeleteConfirmDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type Product } from '@/types/mrp';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Package, ToggleLeft, ToggleRight, Trash } from 'lucide-react';

const getStockBadge = (product: Product, t: (key: string, options?: any) => string) => {
    const isOutOfStock = product.current_stock <= 0;
    const isLowStock = product.current_stock <= product.min_stock;

    if (isOutOfStock) {
        return (
            <Badge variant="destructive" className="bg-rose-150 hover:bg-rose-150/80 text-rose-700">
                {t('inventory.outOfStock')} ({product.current_stock} {product.unit})
            </Badge>
        );
    }

    if (isLowStock) {
        return (
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100">
                {t('inventory.lowStock')} ({product.current_stock} {product.unit})
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
            {t('inventory.safeStock')} ({product.current_stock} {product.unit})
        </Badge>
    );
};

function ProductActions({ product, onToggleActive, t }: { product: Product; onToggleActive: (product: Product) => void; t: (key: string, options?: any) => string }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/inventory/${product.id}`, {}, { preserveScroll: true }), {
            loading: `Menghapus produk "${product.name}"...`,
            success: `Produk "${product.name}" berhasil dihapus!`,
            error: 'Gagal Menghapus',
        });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            {/* Edit */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/inventory/${product.id}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('inventory.editProduct')}</p>
                </TooltipContent>
            </Tooltip>

            {/* Toggle Aktif / Nonaktif */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(product)}
                        className={`hover:bg-muted h-8 w-8 ${product.is_active ? 'text-rose-500' : 'text-emerald-500'}`}
                    >
                        {product.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </Button>
                </TooltipTrigger>

                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{product.is_active ? t('common.inactive') : t('admin.active')}</p>
                </TooltipContent>
            </Tooltip>

            {/* Hapus */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
                                    <Trash size={16} />
                                    <span className="sr-only">{t('inventory.deleteProduct')}</span>
                                </Button>
                            }
                            title={t('common.confirmDelete')}
                            itemName={product.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('inventory.deleteProduct')}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const getColumns = (t: (key: string, options?: any) => string, onToggleActive: (product: Product) => void): ColumnDef<Product>[] => [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => <div className="w-full text-center font-medium">{row.index + 1}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('inventory.product')} />,
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-1.5 ${product.is_active ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-300'}`}>
                        <Package size={16} />
                    </div>
                    <div>
                        <div className={`text-sm font-medium ${product.is_active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                            {product.name}
                        </div>
                        {product.sku && <div className="text-muted-foreground font-mono text-xs">{product.sku}</div>}
                    </div>
                    {!product.is_active && (
                        <Badge variant="outline" className="ml-1 border-slate-200 text-[10px] text-slate-400">
                            {t('common.inactive')}
                        </Badge>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('inventory.category')} centered />,
        cell: ({ row }) => (
            <div className="flex w-full justify-center text-center">
                <span className="text-muted-foreground text-sm">{row.original.category?.name || '—'}</span>
            </div>
        ),
    },
    {
        accessorKey: 'purchase_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('inventory.purchasePrice')} centered />,
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex w-full flex-col items-center text-center">
                    <div className="font-medium">{formatRupiah(product.purchase_price)}</div>
                    <div className="text-muted-foreground text-[11px]">
                        per {parseFloat(String(product.purchase_qty))} {product.unit}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'sell_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('inventory.sellPrice')} centered />,
        cell: ({ row }) => (
            <div className="flex w-full justify-center text-center font-semibold text-slate-900 dark:text-slate-50">
                {formatRupiah(row.original.sell_price)}
            </div>
        ),
    },
    {
        accessorKey: 'current_stock',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('inventory.stock')} centered />,
        cell: ({ row }) => <div className="flex w-full justify-center text-center">{getStockBadge(row.original, t)}</div>,
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('common.actions')}</div>,
        cell: ({ row }) => <ProductActions product={row.original} onToggleActive={onToggleActive} t={t} />,
    },
];

export const columns = (onToggleActive: (product: Product) => void) => getColumns((k) => k, onToggleActive);
