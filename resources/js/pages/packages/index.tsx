import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type ProductVariant } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { Package, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { columns } from './columns';
import { DataTable } from './data-table';

interface PackageModel {
    id: number;
    name: string;
    capacity: number;
    price: string | number;
    is_active: boolean;
    description: string | null;
    variants?: ProductVariant[];
}

interface Props {
    packages: PaginatedData<PackageModel>;
    filters: { search?: string };
}

export default function PackagesIndex({ packages, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('packages.title', 'Manajemen Paket Produk'), href: '/packages' }];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/packages', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('packages.title', 'Manajemen Paket Produk')} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <Package className="text-indigo-500" size={26} />
                            {t('packages.title', 'Manajemen Paket Produk')}
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {t('packages.subtitle', 'Konfigurasi paket isi mochi (kapasitas, harga bundle, dan batas varian)')}
                        </p>
                    </div>
                    <Button asChild className="gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                        <Link href="/packages/create">
                            <PlusCircle size={16} />
                            {t('packages.addPackage', 'Tambah Paket')}
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" size={14} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('packages.searchPlaceholder', 'Cari paket...')}
                            className="h-9 rounded-xl pl-9 text-sm"
                        />
                    </div>
                </form>

                {/* Data Table */}
                <DataTable columns={columns(t)} data={packages.data} />

                {/* Pagination */}
                {packages.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {packages.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className="h-8 rounded-lg px-3 text-xs"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
