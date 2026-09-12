import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type ProductVariant } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { FlaskConical, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
    variants: PaginatedData<ProductVariant & { hpp: number; margin: number; profit: number }>;
    filters: { search?: string };
}

export default function VariantsIndex({ variants, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('variants.title', 'Varian Produk'), href: '/variants' }];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/variants', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('variants.title', 'Varian Produk')} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            <FlaskConical className="text-[#3f9567]" size={22} />
                            {t('variants.title', 'Varian Produk')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('variants.subtitle', 'Produk yang dijual beserta resep & kalkulasi HPP otomatis')}</p>
                    </div>
                    <Button asChild variant="owner" className="gap-1.5 rounded-xl">
                        <Link href="/variants/create">
                            <PlusCircle size={16} />
                            {t('variants.addVariant', 'Tambah Varian')}
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
                            placeholder={t('variants.searchPlaceholder', 'Cari varian...')}
                            className="h-10 rounded-xl !border-[#dde9df] !bg-white pl-9 text-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    <Button type="submit" variant="owner" className="h-10 rounded-xl px-4 text-sm">
                        {t('common.search', 'Cari')}
                    </Button>
                </form>

                {/* Data Table */}
                <DataTable columns={columns(t)} data={variants.data} />

                {/* Pagination */}
                {variants.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {variants.links.map((link, i) => (
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
