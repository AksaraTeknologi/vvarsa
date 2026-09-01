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

function VariantActions({ variant }: { variant: ProductVariant }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/variants/${variant.id}`, {}, { preserveScroll: true }), {
            loading: `Menghapus varian "${variant.name}"...`,
            success: `Varian "${variant.name}" berhasil dihapus!`,
            error: 'Gagal Menghapus',
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
                <TooltipContent>
                    <p>Edit Varian</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="link" size="icon" className="size-8 text-red-500 hover:cursor-pointer">
                                    <Trash className="size-4" />
                                    <span className="sr-only">Hapus Varian</span>
                                </Button>
                            }
                            title="Apakah Anda yakin ingin menonaktifkan/menghapus varian ini?"
                            itemName={variant.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Hapus Varian</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const columns: ColumnDef<ProductVariant & { hpp: number; margin: number; profit: number }>[] = [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="font-medium">{index}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Varian" />,
        cell: ({ row }) => {
            const variant = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-violet-50 p-1.5 text-violet-500 dark:bg-violet-950/40">
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Resep" />,
        cell: ({ row }) => {
            const variant = row.original;
            return variant.recipe ? (
                <div>
                    <div className="text-xs font-semibold text-violet-600 dark:text-violet-400">{variant.recipe.name}</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">Porsi: x{Number(variant.recipe_qty)}</div>
                </div>
            ) : (
                <span className="text-muted-foreground text-xs italic">Tidak ada resep</span>
            );
        },
    },
    {
        accessorKey: 'hpp',
        header: ({ column }) => <DataTableColumnHeader column={column} title="HPP" />,
        cell: ({ row }) => {
            return <div className="text-muted-foreground text-right font-medium">{formatRupiah(row.original.hpp ?? 0)}</div>;
        },
    },
    {
        accessorKey: 'sell_price',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Harga Jual" />,
        cell: ({ row }) => {
            return <div className="text-right font-bold">{formatRupiah(row.original.sell_price)}</div>;
        },
    },
    {
        accessorKey: 'margin',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Margin" />,
        cell: ({ row }) => {
            const margin = row.original.margin ?? 0;
            return (
                <div className="text-right">
                    <span
                        className={`text-sm font-semibold ${margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-rose-600'}`}
                    >
                        {margin.toFixed(1)}%
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const active = row.original.is_active;
            return (
                <div className="text-center">
                    <Badge variant={active ? 'default' : 'secondary'} className="text-xs">
                        {active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => <VariantActions variant={row.original} />,
    },
];
