import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Store } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getColumns, Supplier } from './columns';
import { DataTable } from './data-table';

interface Props {
    suppliers: Supplier[];
}

export default function SupplierIndex({ suppliers }: Props) {
    const { t } = useTranslation();
    const columns = getColumns(t);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.dashboard', 'Dasbor'), href: '/admin' },
        { title: t('navigation.suppliers', 'Supplier'), href: '/admin/supplier' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.supplier.title')} />

            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="admin-page-header relative overflow-hidden bg-[#F9F7F4] px-6 py-6 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <Store size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-[#17182A] md:text-2xl">{t('admin.supplier.title')}</h1>
                            <p className="mt-0.5 text-sm text-[#5F6073]">
                                {t('admin.supplier.subtitle')}
                            </p>
                        </div>
                        <Link href="/admin/supplier/create">
                            <Button size="sm" className="admin-primary-button gap-1.5 text-white">
                                <Plus size={14} /> {t('admin.supplier.add')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content flex flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    <DataTable columns={columns} data={suppliers} />
                </div>
            </div>
        </AppLayout>
    );
}
