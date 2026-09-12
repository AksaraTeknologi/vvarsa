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
import { Edit, Package, Trash } from 'lucide-react';

interface PackageModel {
    id: number;
    name: string;
    capacity: number;
    price: string | number;
    is_active: boolean;
    description: string | null;
    variants?: ProductVariant[];
}

function PackageActions({ pkg, t }: { pkg: PackageModel; t: any }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/packages/${pkg.id}`, {}, { preserveScroll: true }), {
            loading: t('packages.deleting', { name: pkg.name, defaultValue: `Menghapus paket "${pkg.name}"...` }),
            success: t('packages.deleteSuccess', { name: pkg.name, defaultValue: `Paket "${pkg.name}" berhasil dihapus!` }),
            error: t('common.failed', 'Gagal Menghapus'),
        });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/packages/${pkg.id}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('packages.editPackage', 'Edit Paket')}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="link" size="icon" className="size-8 text-red-500 hover:cursor-pointer">
                                    <Trash className="size-4" />
                                    <span className="sr-only">{t('packages.deletePackage', 'Hapus Paket')}</span>
                                </Button>
                            }
                            title={t('packages.deleteConfirm', 'Apakah Anda yakin ingin menghapus paket produk ini?')}
                            itemName={pkg.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#5aa67a] text-white" arrowClassName="!bg-[#5aa67a] !fill-[#5aa67a]">
                    <p>{t('packages.deletePackage', 'Hapus Paket')}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const columns = (t: any): ColumnDef<PackageModel>[] => [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('packages.packageName', 'Nama Paket')} />,
        cell: ({ row }) => {
            const pkg = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-[#edf8f1] p-1.5 text-[#3f9567]">
                        <Package size={16} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pkg.name}</div>
                        {pkg.description && <div className="text-muted-foreground mt-0.5 max-w-xs truncate text-xs">{pkg.description}</div>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'capacity',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('packages.capacity', 'Kapasitas (Isi)')} centered />,
        cell: ({ row }) => {
            return (
                <div className="w-full text-center font-semibold">
                    {t('packages.capacityPcs', { count: row.original.capacity, defaultValue: `${row.original.capacity} Pcs` })}
                </div>
            );
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('packages.bundlePrice', 'Harga Bundle')} centered />,
        cell: ({ row }) => {
            return <div className="w-full text-center font-semibold text-foreground">{formatRupiah(Number(row.original.price))}</div>;
        },
    },
    {
        accessorKey: 'variants',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('packages.flavorLimit', 'Batasan Rasa')} centered />,
        cell: ({ row }) => {
            const pkg = row.original;
            return !pkg.variants || pkg.variants.length === 0 ? (
                <div className="flex w-full justify-center">
                    <span className="inline-flex items-center rounded-full border border-[#c7e0ce] bg-[#edf8f1] px-2 py-0.5 text-xs font-medium text-[#3f9567]">
                        {t('packages.freeMix', 'Bebas Mix')}
                    </span>
                </div>
            ) : (
                <div className="flex max-w-xs flex-wrap justify-center gap-1">
                    {pkg.variants.map((v) => (
                        <span
                            key={v.id}
                            className="inline-flex items-center rounded-lg border border-[#c7e0ce] bg-[#edf8f1] px-2 py-0.5 text-xs font-medium text-[#3f9567]"
                        >
                            {v.name.replace('Mochi ', '')}
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('packages.status', 'Status')} />,
        cell: ({ row }) => {
            const active = row.original.is_active;
            return (
                <div className="flex w-full items-center justify-start text-left">
                    <Badge
                        variant="outline"
                        className={`text-xs font-medium ${active ? 'border-[#c7e0ce] bg-[#edf8f1] text-[#3f9567]' : 'border-slate-200 bg-slate-50 text-slate-500'}`}
                    >
                        {active ? t('packages.active', 'Aktif') : t('packages.inactive', 'Nonaktif')}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('packages.actions', 'Aksi')}</div>,
        cell: ({ row }) => <PackageActions pkg={row.original} t={t} />,
    },
];
