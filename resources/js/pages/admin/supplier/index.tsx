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

            <div className="relative isolate flex min-h-[calc(100vh-5rem)] w-full flex-col gap-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)]">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>
                {/* Page Header */}
                <div className="admin-page-header relative z-10 overflow-hidden bg-transparent px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <Store size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A] md:text-[2.1rem]">
                                {t('admin.supplier.title')}
                            </h1>
                            <p className="mt-3 text-sm leading-relaxed text-[#5F6073] md:text-[0.95rem]">{t('admin.supplier.subtitle')}</p>
                        </div>
                        <Link href="/admin/supplier/create">
                            <Button className="admin-primary-button inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white">
                                <Plus size={16} /> {t('admin.supplier.add')}
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content relative z-10 flex flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    <DataTable columns={columns} data={suppliers} />
                </div>
            </div>
        </AppLayout>
    );
}
