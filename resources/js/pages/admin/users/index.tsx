import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { getColumns, type UserItem } from './columns';
import { DataTable } from './data-table';
import { CreateUserDialog } from './create-user-dialog';
import { EditUserDialog } from './edit-user-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Users', href: '/admin/users' },
];

interface Tenant {
    id: number;
    name: string;
}

interface Props {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    tenants: Tenant[];
    filters: {
        search: string;
        tenant_id: string;
    };
}

export default function UsersIndex({ users, tenants, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || 'all');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const handleFilter = () => {
        router.get('/admin/users', {
            search,
            tenant_id: tenantId === 'all' ? '' : tenantId,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleEdit = (user: UserItem) => {
        setEditingUser(user);
        setIsEditOpen(true);
    };

    const columns = getColumns(handleEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pengguna" />
            <div className="flex flex-col gap-0">

                {/* Page Header */}
                <div className="relative overflow-hidden bg-[#0d0d0d] px-6 pt-6 pb-5 md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest uppercase text-[#1a56ff] border border-[#1a56ff]/20">
                                    <Users size={11} />
                                    Platform Admin
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">Daftar Pengguna</h1>
                            <p className="mt-0.5 text-sm text-white/50">Pantau daftar seluruh pengguna yang terdaftar di sistem platform ini.</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-[#1a56ff] hover:bg-[#1a56ff]/90 text-white gap-1.5 shadow-lg shadow-[#1a56ff]/20"
                        >
                            <Plus size={14} /> Tambah Pengguna
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6 px-6 pb-6 pt-4 md:px-8">

                    {/* Filters */}
                <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row items-center shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Cari nama atau email pengguna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="pl-9 rounded-xl w-full"
                        />
                    </div>
                    
                    <div className="w-full sm:w-48">
                        <Select
                            value={tenantId}
                            onValueChange={(val) => setTenantId(val)}
                        >
                            <SelectTrigger className="rounded-xl w-full">
                                <SelectValue placeholder="Semua Tenant" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tenant</SelectItem>
                                {tenants.map((tenant) => (
                                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                                        {tenant.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button onClick={handleFilter} className="rounded-xl w-full sm:w-auto px-6">
                        Filter
                    </Button>
                </div>

                {/* Users DataTable */}
                <div className="space-y-4">
                    <DataTable columns={columns} data={users.data} />

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="border-border flex items-center justify-between border-t bg-card px-4 py-3 rounded-xl border shadow-sm">
                            <p className="text-muted-foreground text-sm">
                                Menampilkan {(users.current_page - 1) * users.per_page + 1}–
                                {Math.min(users.current_page * users.per_page, users.total)} dari{' '}
                                {users.total} pengguna
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? "default" : "outline"}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className="h-8 px-3 rounded-lg text-xs"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>

            {/* Dialogs */}
            <CreateUserDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                tenants={tenants}
            />
            <EditUserDialog
                user={editingUser}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                tenants={tenants}
            />
        </AppLayout>
    );
}
