'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DeleteConfirmDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Edit, Trash } from 'lucide-react';

export interface Supplier {
    id: string;
    name: string;
    contact_name: string | null;
    phone: string | null;
    email: string | null;
    business_type: string | null;
    rating: number;
    is_verified: boolean;
    is_active: boolean;
    website: string | null;
    city: string | null;
    address: string | null;
    description: string | null;
}

function SupplierActions({ supplier, t }: { supplier: Supplier; t: (key: string, options?: any) => string }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/admin/supplier/${supplier.id}`, {}, { preserveScroll: true }), {
            loading: `Menghapus supplier "${supplier.name}"...`,
            success: `Supplier "${supplier.name}" berhasil dihapus!`,
            error: 'Gagal Menghapus',
        });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/supplier/${supplier.id}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('admin.supplier.editTitle')}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="link" size="icon" className="size-8 text-red-500 hover:cursor-pointer">
                                    <Trash className="size-4" />
                                    <span className="sr-only">{t('common.delete')}</span>
                                </Button>
                            }
                            title={t('common.confirmDelete')}
                            itemName={supplier.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('common.delete')}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const getColumns = (t: (key: string, options?: any) => string): ColumnDef<Supplier>[] => [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.supplier.supplierName')} />,
        cell: ({ row }) => {
            const supplier = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{supplier.name}</div>
                    {supplier.is_verified && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <CheckCircle2 className="size-4 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('admin.supplier.verifiedSupplier')}</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'contact_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.contact')} />,
        cell: ({ row }) => {
            const supplier = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{supplier.contact_name || '-'}</span>
                    <span className="text-muted-foreground text-xs">{supplier.phone || supplier.email || ''}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'business_type',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.supplier.businessType')} />,
        cell: ({ row }) => {
            return (
                <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {row.original.business_type || t('admin.tenants.general')}
                </span>
            );
        },
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <span className="font-semibold text-amber-500">{row.original.rating}</span>
                    <span className="text-muted-foreground text-xs"> / 5</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.status')} />,
        cell: ({ row }) => {
            const isActive = row.original.is_active;
            return (
                <div className="text-center">
                    {isActive ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                            {t('admin.active')}
                        </span>
                    ) : (
                        <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/20 dark:text-rose-400">
                            {t('admin.inactive')}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('common.actions')}</div>,
        cell: ({ row }) => <SupplierActions supplier={row.original} t={t} />,
    },
];

export const columns = getColumns((key: string) => key);

