import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Building2, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getColumns, type Tenant } from './columns';
import { DataTable } from './data-table';
import { EditTenantDialog } from './edit-tenant-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.tenants', href: '/admin/tenants' },
];

interface Plan {
    id: number;
    name: string;
}

interface Props {
    tenants: {
        data: Tenant[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    plans: Plan[];
    filters: {
        search: string;
        plan_id: string;
    };
}

export default function TenantsIndex({ tenants, plans, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [planId, setPlanId] = useState(filters.plan_id || 'all');

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

    const handleFilter = () => {
        router.get(
            '/admin/tenants',
            {
                search,
                plan_id: planId === 'all' ? '' : planId,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleEdit = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setIsEditOpen(true);
    };

    const columns = getColumns(handleEdit, t);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.tenants.title')} />
            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="admin-page-header relative overflow-hidden bg-[#F9F7F4] px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <Building2 size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#17182A] md:text-2xl">{t('admin.tenants.title')}</h1>
                            <p className="mt-0.5 text-sm text-[#5F6073]">
                                {t('admin.tenants.subtitle')}
                            </p>
                        </div>
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
                                placeholder={t('admin.tenants.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full rounded-xl pl-9"
                            />
                        </div>

                        <div className="w-full sm:w-48">
                            <Select value={planId} onValueChange={(val) => setPlanId(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('admin.tenants.allPlans')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.tenants.allPlans')}</SelectItem>
                                    {plans.map((plan) => (
                                        <SelectItem key={plan.id} value={plan.id.toString()}>
                                            {plan.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button size="sm" onClick={handleFilter} className="admin-primary-button w-full px-5 sm:w-auto">
                            {t('common.filter')}
                        </Button>
                    </div>

                    {/* Tenants DataTable */}
                    <div className="space-y-4">
                        <DataTable columns={columns} data={tenants.data} />

                        {/* Pagination */}
                        {tenants.last_page > 1 && (
                            <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                                <p className="text-muted-foreground text-sm">
                                    {t('admin.tenants.showing', {
                                        from: (tenants.current_page - 1) * tenants.per_page + 1,
                                        to: Math.min(tenants.current_page * tenants.per_page, tenants.total),
                                        total: tenants.total,
                                    })}
                                </p>
                                <div className="flex gap-1">
                                    {tenants.links.map((link, i) => (
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
            <EditTenantDialog tenant={editingTenant} open={isEditOpen} onOpenChange={setIsEditOpen} plans={plans} />
        </AppLayout>
    );
}
