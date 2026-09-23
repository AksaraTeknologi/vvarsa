'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, Edit, Shield, User as UserIcon } from 'lucide-react';

interface Tenant {
    id: number;
    name: string;
}

export interface UserItem {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: { name: string }[];
    tenant?: Tenant | null;
}

export const getColumns = (
    onEdit: (user: UserItem) => void,
    t: (key: string, options?: any) => string = (k) => k
): ColumnDef<UserItem>[] => [
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.users.colNameEmail')} />,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-foreground text-sm font-semibold">{user.name}</div>
                        <span className="text-muted-foreground text-xs">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'tenant',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.users.colTenant')} />,
        cell: ({ row }) => {
            const tenant = row.original.tenant;
            return tenant ? (
                <span className="text-foreground text-sm font-medium">{tenant.name}</span>
            ) : (
                <Badge variant="outline" className="dark:text-slate-350 bg-slate-100 text-slate-700 dark:bg-slate-800">
                    {t('admin.platformAdmin')}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.users.colRole')} centered />,
        cell: ({ row }) => {
            const role = row.original.roles[0]?.name || 'staff';
            return (
                <div className="flex w-full justify-center">
                    <Badge
                        variant={role === 'admin' ? 'destructive' : role === 'owner' ? 'default' : 'outline'}
                        className={`border-transparent capitalize ${
                            role === 'admin'
                                ? 'bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'
                                : role === 'owner'
                                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                    >
                        {role === 'admin' ? (
                            <span className="flex items-center gap-1">
                                <Shield size={12} />
                                Admin
                            </span>
                        ) : role === 'owner' ? (
                            <span className="flex items-center gap-1">
                                <Shield size={12} />
                                Owner
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <UserIcon size={12} />
                                Staff
                            </span>
                        )}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.users.colJoinedDate')} />,
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <Calendar size={14} className="opacity-60" />
                    <span>
                        {new Date(row.original.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('admin.users.colActions')}</div>,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <TooltipProvider delayDuration={150}>
                    <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(user)}
                                    className="h-8 w-8 text-[#5E4BF2] hover:bg-[#F1EFFD] hover:text-[#4938D9] dark:text-[#A78BFA] dark:hover:bg-[#8B5CF6]/20 dark:hover:text-[#C4B5FD]"
                                    title={t('admin.users.editTitle')}
                                >
                                    <Edit size={15} className="text-[#5E4BF2] dark:text-[#A78BFA]" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                arrowClassName="bg-[#5E4BF2] fill-[#5E4BF2] dark:bg-[#7C3AED] dark:fill-[#7C3AED]"
                                className="border-[#DCD8FF] bg-[#5E4BF2] text-white shadow-[0_8px_18px_rgba(94,75,242,0.25)] font-semibold dark:border-purple-400/40 dark:bg-[#7C3AED]"
                            >
                                {t('admin.users.editTitle')}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
            );
        },
    },
];
