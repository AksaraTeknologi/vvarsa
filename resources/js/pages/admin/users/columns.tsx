'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="font-medium">{index}</div>;
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
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('admin.users.colRole')} />,
        cell: ({ row }) => {
            const role = row.original.roles[0]?.name || 'staff';
            return (
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
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(user)} className="hover:bg-muted h-8 w-8" title={t('admin.users.editTitle')}>
                        <Edit size={15} />
                    </Button>
                </div>
            );
        },
    },
];
