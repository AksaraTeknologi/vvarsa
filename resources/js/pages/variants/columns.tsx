'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DeleteConfirmDialog from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type ProductVariant } from '@/types/mrp';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, FlaskConical, Trash } from 'lucide-react';

function VariantActions({ variant, t }: { variant: ProductVariant; t: any }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/variants/${variant.id}`, {}, { preserveScroll: true }), {
            loading: t('variants.deleting', { name: variant.name, defaultValue: `Menghapus varian "${variant.name}"...` }),
            success: t('variants.deleteSuccess', { name: variant.name, defaultValue: `Varian "${variant.name}" berhasil dihapus!` }),
            error: t('common.failed', 'Gagal Menghapus'),
        });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/variants/${variant.id}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('variants.editVariant', 'Edit Varian')}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="link" size="icon" className="size-8 text-red-500 hover:cursor-pointer">
                                    <Trash className="size-4" />
                                    <span className="sr-only">{t('variants.deleteVariant', 'Hapus Varian')}</span>
                                </Button>
                            }
                            title={t('variants.deleteConfirm', 'Apakah Anda yakin ingin menonaktifkan/menghapus varian ini?')}
                            itemName={variant.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('variants.deleteVariant', 'Hapus Varian')}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const columns = (t: any): ColumnDef<ProductVariant & { hpp: number; margin: number; profit: number }>[] => [
    {
        accessorKey: 'no',
        header: () => <div className="w-full text-center">No</div>,
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="w-full text-center font-medium">{index}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.variantName', 'Nama Varian')} />,
        cell: ({ row }) => {
            const variant = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-[#edf8f1] p-1.5 text-[#3f9567]">
                        <FlaskConical size={16} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{variant.name}</div>
                        {variant.sku && <div className="text-muted-foreground mt-0.5 text-xs">SKU: {variant.sku}</div>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'recipe',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.recipe', 'Resep')} />,
        cell: ({ row }) => {
            const variant = row.original;
            return variant.recipe ? (
                <div>
                    <div className="text-xs font-semibold text-[#3f9567]">{variant.recipe.name}</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">
                        {t('variants.portion', { qty: Number(variant.recipe_qty), defaultValue: `Porsi: x${Number(variant.recipe_qty)}` })}
                    </div>
                </div>
            ) : (
                <span className="text-muted-foreground text-xs italic">{t('variants.noRecipe', 'Tidak ada resep')}</span>
            );
        },
    },
    {
        accessorKey: 'hpp',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.hpp', 'HPP')} centered />,
        cell: ({ row }) => {
            return <div className="text-muted-foreground w-full text-center font-medium">{formatRupiah(row.original.hpp ?? 0)}</div>;
        },
    },
    {
        accessorKey: 'sell_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.sellPrice', 'Harga Jual')} centered />,
        cell: ({ row }) => {
            return <div className="text-muted-foreground w-full text-center font-bold">{formatRupiah(row.original.sell_price)}</div>;
        },
    },
    {
        accessorKey: 'margin',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.margin', 'Margin')} centered />,
        cell: ({ row }) => {
            const margin = row.original.margin ?? 0;
            return (
                <div className="w-full text-center">
                    <span className="text-muted-foreground text-sm font-semibold">{margin.toFixed(1)}%</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('variants.status', 'Status')} centered />,
        cell: ({ row }) => {
            const active = row.original.is_active;
            return (
                <div className="flex w-full justify-center">
                    <Badge
                        variant="outline"
                        className={`text-xs ${active ? 'border-[#c7e0ce] bg-[#edf8f1] text-[#3f9567]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                    >
                        {active ? t('variants.active', 'Aktif') : t('variants.inactive', 'Nonaktif')}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('variants.actions', 'Aksi')}</div>,
        cell: ({ row }) => <VariantActions variant={row.original} t={t} />,
    },
];
