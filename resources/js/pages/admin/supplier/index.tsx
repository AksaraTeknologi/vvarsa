import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus, Store } from 'lucide-react';
import { columns, Supplier } from './columns';
import { DataTable } from './data-table';

// Definisikan breadcrumbs untuk halaman ini
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin' },
    { title: 'Supplier', href: '/admin/suppliers' },
];

interface Props {
    suppliers: Supplier[];
}

export default function SupplierIndex({ suppliers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kelola Supplier" />

            <div className="flex flex-col gap-0">
                {/* Page Header */}
                <div className="relative overflow-hidden bg-[#0d0d0d] px-6 pt-6 pb-5 md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <Store size={11} />
                                    Platform Admin
                                </span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">Kelola Supplier</h1>
                            <p className="mt-0.5 text-sm text-white/50">
                                Kelola semua data supplier, kontak, dan status operasional mereka untuk sistem ini.
                            </p>
                        </div>
                        <Link href="/admin/supplier/create">
                            <Button size="sm" className="gap-1.5 bg-[#1a56ff] text-white shadow-lg shadow-[#1a56ff]/20 hover:bg-[#1a56ff]/90">
                                <Plus size={14} /> Tambah Supplier
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6 px-6 pt-4 pb-6 md:px-8">
                    <DataTable columns={columns} data={suppliers} />
                </div>
            </div>
        </AppLayout>
    );
}
