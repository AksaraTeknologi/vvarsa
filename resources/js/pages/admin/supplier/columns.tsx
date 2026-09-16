'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DeleteConfirmDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
        <TooltipProvider delayDuration={150}>
            <div className="flex items-center justify-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 hover:bg-[#F1EFFD] hover:text-[#5E4BF2]"
                        >
                            <Link href={`/admin/supplier/${supplier.id}/edit`}>
                                <Edit size={15} />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2]"
                        className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.22)]"
                    >
                        {t('admin.supplier.editTitle')}
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <DeleteConfirmDialog
                                trigger={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-rose-500 hover:bg-[#FDEBEC] hover:text-rose-600"
                                    >
                                        <Trash size={15} />
                                        <span className="sr-only">{t('common.delete')}</span>
                                    </Button>
                                }
                                title={t('common.confirmDelete')}
                                itemName={supplier.name}
                                onConfirm={handleDelete}
                            />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2]"
                        className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.22)]"
                    >
                        {t('common.delete')}
                    </TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}

export const getColumns = (t: (key: string, options?: any) => string): ColumnDef<Supplier>[] => [
    {
        accessorKey: 'no',
        header: () => <div className="text-center text-xs font-semibold">No</div>,
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="text-center font-medium">{index}</div>;
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.supplier.businessType')} centered />,
        cell: ({ row }) => {
            return (
                <div className="flex w-full justify-center">
                    <span className="rounded-full border border-[#DCD8FF] bg-[#F1EFFD] px-2.5 py-1 text-xs font-semibold text-[#5E4BF2]">
                        {row.original.business_type || t('admin.tenants.general')}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" centered />,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.status')} centered />,
        cell: ({ row }) => {
            const isActive = row.original.is_active;
            return (
                <div className="flex w-full justify-center">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isActive ? 'bg-[#DCD8FF] text-[#4938D9]' : 'bg-[#F7EFF0] text-[#A96A73]'
                        }`}
                    >
                        {isActive ? t('admin.active') : t('admin.inactive')}
                    </span>
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

