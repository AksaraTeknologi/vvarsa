'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Mail, Shield, ShieldCheck, Trash2, User as UserIcon } from 'lucide-react';

export interface Member {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
}

const ROLE_BADGE: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    owner: {
        label: 'Owner',
        className: 'bg-owner-accent/10 text-owner-accent hover:bg-owner-accent/10',
        icon: <Shield size={12} />,
    },
    supervisor: {
        label: 'Supervisor',
        className: 'bg-owner-accent/10 text-owner-accent hover:bg-owner-accent/10',
        icon: <ShieldCheck size={12} />,
    },
    staff: {
        label: 'Staff',
        className: 'bg-owner-accent/10 text-owner-accent hover:bg-owner-accent/10',
        icon: <UserIcon size={12} />,
    },
};

const ROLE_CYCLE: Record<string, string> = {
    owner: 'supervisor',
    supervisor: 'staff',
    staff: 'owner',
};

export const getColumns = (
    authUserId: number,
    authRole: string,
    hasSupervisor: boolean,
    onUpdateRole: (memberId: number, currentRole: string) => void,
    onDeleteMember: (memberId: number, name: string) => void,
    isUpdateProcessing: boolean,
    isDeleteProcessing: boolean,
    t: (key: string, options?: any) => string,
): ColumnDef<Member>[] => [
    {
        id: 'no',
        header: () => <div className="text-center text-sm font-semibold">No.</div>,
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="text-center text-sm font-medium text-slate-600">{index}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('members.nameAndEmail')} className="text-sm normal-case tracking-normal" />,
        cell: ({ row }) => {
            const member = row.original;
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-owner-accent/10 font-bold text-owner-accent">
                        {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-foreground flex items-center gap-1.5 text-sm font-medium">
                            {member.name}
                            {member.id === authUserId && (
                                <Badge variant="outline" className="border-transparent bg-owner-accent/10 px-2 py-0.5 text-sm text-owner-accent hover:bg-owner-accent/10">
                                    {t('members.you')}
                                </Badge>
                            )}
                        </div>
                        <span className="text-muted-foreground text-sm">{member.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('members.contact')} className="text-sm normal-case tracking-normal" />,
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <Mail size={14} className="opacity-60" />
                    {row.original.email}
                </div>
            );
        },
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('members.role')} className="text-sm normal-case tracking-normal" />,
        cell: ({ row }) => {
            const role = row.original.roles[0]?.name || 'staff';
            const meta = ROLE_BADGE[role] ?? ROLE_BADGE.staff;
            return (
                <Badge variant="outline" className={`border-transparent px-2.5 py-1 text-sm capitalize ${meta.className}`}>
                    <span className="flex items-center gap-1.5">
                        {meta.icon}
                        {meta.label}
                    </span>
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('common.actions')}</div>,
        cell: ({ row }) => {
            const member = row.original;
            const role = member.roles[0]?.name || 'staff';
            const isOwnerViewer = authRole === 'owner';
            let nextRole = ROLE_CYCLE[role] ?? 'staff';
            if (nextRole === 'supervisor' && hasSupervisor && role !== 'supervisor') {
                nextRole = ROLE_CYCLE['supervisor'] ?? 'staff';
            }
            const nextRoleMeta = ROLE_BADGE[nextRole];

            return (
                <div className="flex items-center justify-center gap-2">
                    {member.id !== authUserId ? (
                        isOwnerViewer ? (
                            <>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onUpdateRole(member.id, role)}
                                    disabled={isUpdateProcessing}
                                    className="h-9 rounded-xl bg-owner-accent text-sm text-white shadow-sm hover:opacity-90"
                                    title={t('members.changeTo', { role: nextRoleMeta?.label ?? nextRole })}
                                >
                                    → {nextRoleMeta?.label ?? nextRole}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDeleteMember(member.id, member.name)}
                                    disabled={isDeleteProcessing}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 hover:cursor-pointer"
                                >
                                    <Trash2 size={15} />
                                </Button>
                            </>
                        ) : (
                            <span className="text-muted-foreground text-sm">{t('members.onlyOwner')}</span>
                        )
                    ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                    )}
                </div>
            );
        },
    },
];
