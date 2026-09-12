import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getColumns, type UserItem } from './columns';
import { CreateUserDialog } from './create-user-dialog';
import { DataTable } from './data-table';
import { EditUserDialog } from './edit-user-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.users', href: '/admin/users' },
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
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [tenantId, setTenantId] = useState(filters.tenant_id || 'all');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);

    const handleFilter = () => {
        router.get(
            '/admin/users',
            {
                search,
                tenant_id: tenantId === 'all' ? '' : tenantId,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleEdit = (user: UserItem) => {
        setEditingUser(user);
        setIsEditOpen(true);
    };

    const columns = getColumns(handleEdit, t);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.users.title')} />
            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="admin-page-header relative overflow-hidden bg-[#F9F7F4] px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <Users size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#17182A] md:text-2xl">{t('admin.users.title')}</h1>
                            <p className="mt-0.5 text-sm text-[#5F6073]">{t('admin.users.subtitle')}</p>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setIsCreateOpen(true)}
                            className="admin-primary-button gap-1.5 text-white"
                        >
                            <Plus size={14} /> {t('admin.users.addUser')}
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content flex flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    {/* Filters */}
                    <div className="admin-filter-panel bg-card border-border flex flex-col items-center gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row">
                        <div className="relative w-full flex-1">
                            <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder={t('admin.users.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full rounded-xl pl-9"
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <Select value={tenantId} onValueChange={(val) => setTenantId(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={`Semua Tenant`} />
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

                        <Button size="sm" onClick={handleFilter} className="admin-primary-button w-full px-5 sm:w-auto">
                            {t('common.filter')}
                        </Button>
                    </div>

                    {/* Users DataTable */}
                    <div className="space-y-4">
                        <DataTable columns={columns} data={users.data} />

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                                <p className="text-muted-foreground text-sm">
                                    Menampilkan {(users.current_page - 1) * users.per_page + 1}–
                                    {Math.min(users.current_page * users.per_page, users.total)} dari {users.total} pengguna
                                </p>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className="h-8 rounded-lg px-3 text-xs"
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
            <CreateUserDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} tenants={tenants} />
            <EditUserDialog user={editingUser} open={isEditOpen} onOpenChange={setIsEditOpen} tenants={tenants} />
        </AppLayout>
    );
}
