'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

export interface Tenant {
    id: number;
    name: string;
    slug: string;
    business_type: string;
    currency: 'IDR' | 'USD' | 'SGD';
    phone: string | null;
    address: string | null;
    is_active: boolean;
    created_at: string;
    users_count: number;
    products_count: number;
    plan?: {
        id: number;
        name: string;
    };
}

export const getColumns = (onEdit: (tenant: Tenant) => void, t: (key: string, options?: any) => string = (k) => k): ColumnDef<Tenant>[] => [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.colTenant')} />,
        cell: ({ row }) => {
            const tenant = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold">
                        {tenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-foreground text-sm font-semibold">{tenant.name}</div>
                        <span className="text-muted-foreground text-xs">{tenant.slug}.vvarsa.com</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'plan',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.colPlan')} centered />,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    <Badge
                        variant="outline"
                        className="rounded-full border-0 bg-[#F1EFFD] px-2.5 py-1 text-xs font-semibold text-[#5E4BF2] capitalize hover:bg-[#F1EFFD]"
                    >
                        {row.original.plan?.name || 'Free'}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'products_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.colProducts')} centered />,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.original.products_count}</div>;
        },
    },
    {
        accessorKey: 'users_count',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.colUsers')} centered />,
        cell: ({ row }) => {
            return <div className="text-center font-medium">{row.original.users_count}</div>;
        },
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.tenants.colStatus')} centered />,
        cell: ({ row }) => {
            const tenant = row.original;
            return (
                <div className="flex w-full justify-center">
                    <Badge
                        variant={tenant.is_active ? 'default' : 'destructive'}
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${
                            tenant.is_active ? 'bg-[#DCD8FF] text-[#4938D9] hover:bg-[#DCD8FF]' : 'bg-[#F7EFF0] text-[#A96A73] hover:bg-[#F7EFF0]'
                        }`}
                    >
                        {tenant.is_active ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center text-xs font-semibold">{t('admin.tenants.colActions')}</div>,
        cell: ({ row }) => {
            const tenant = row.original;

            const handleToggleActive = () => {
                handleAsyncAction(() => routerPromise('post', `/admin/tenants/${tenant.id}/toggle`, {}, { preserveScroll: true }), {
                    loading: `Mengubah status bisnis "${tenant.name}"...`,
                    success: `Status bisnis "${tenant.name}" berhasil diubah!`,
                    error: 'Gagal Mengubah Status',
                });
            };

            return (
                <div className="flex items-center justify-center gap-2">
                    <TooltipProvider delayDuration={150}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(tenant)}
                                    className="h-8 w-8 hover:bg-[#F1EFFD] hover:text-[#5E4BF2]"
                                >
                                    <Edit size={15} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2]"
                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.22)]"
                            >
                                {t('admin.tenants.editTitle')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-[#F1EFFD] hover:text-[#5E4BF2]">
                                    <Link href={`/admin/tenants/${tenant.id}`}>
                                        <Eye size={15} />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2]"
                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.22)]"
                            >
                                {t('admin.tenants.detailTitle')}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleToggleActive}
                                    className="h-8 w-8 text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9]"
                                >
                                    {tenant.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2]"
                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.22)]"
                            >
                                {tenant.is_active ? t('admin.inactive') : t('admin.active')}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            );
        },
    },
];
