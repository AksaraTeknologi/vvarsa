import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type Supplier } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Edit, MapPin, Phone, Plus, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Supplier', href: '/suppliers' }];

const BUSINESS_TYPE_LABELS: Record<string, string> = {
    fnb: 'Food & Beverage',
    retail: 'Retail / Toko',
    fashion: 'Fashion & Tekstil',
    services: 'Jasa / Services',
    general: 'Manufaktur / Umum',
};

interface Props {
    suppliers: PaginatedData<Supplier>;
    cities: string[];
    filters: { search?: string; city?: string };
    business_type: string; // Business type dari tenant
}

export default function SuppliersIndex({ suppliers, cities, filters, business_type }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');

    const applyFilter = () => {
        router.get('/suppliers', { search, city }, { preserveState: true, replace: true });
    };

    const businessTypeLabel = BUSINESS_TYPE_LABELS[business_type] ?? business_type;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rekomendasi Supplier" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header & Add Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Rekomendasi Supplier</h1>
                        <p className="text-muted-foreground text-sm">
                            Supplier untuk kategori bisnis: <span className="text-foreground font-semibold">{businessTypeLabel}</span>
                        </p>
                    </div>
                    <Link
                        href="/suppliers/create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
                    >
                        <Plus size={16} /> Tambah Supplier
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-2.5 left-3" size={16} />
                        <input
                            className="w-full rounded-xl border px-9 py-2 text-sm"
                            placeholder="Cari supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                        />
                    </div>
                    <select className="rounded-xl border px-4 py-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
                        <option value="">Semua Kota</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <Button onClick={() => applyFilter()}>Cari</Button>
                </div>

                {/* Grid Cards */}
                {suppliers.data.length === 0 ? (
                    <div className="bg-card text-muted-foreground rounded-2xl border py-20 text-center">Tidak ada data ditemukan.</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {suppliers.data.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="bg-card flex flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold">
                                            {supplier.name}
                                            {supplier.is_verified && <CheckCircle size={14} className="text-blue-500" />}
                                        </h3>
                                        <p className="text-muted-foreground text-xs">{supplier.business_type}</p>
                                    </div>
                                    <Link href={`/suppliers/${supplier.id}/edit`} className="hover:bg-muted rounded-lg p-2">
                                        <Edit size={16} />
                                    </Link>
                                </div>
                                <div className="text-muted-foreground space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} /> {supplier.city}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} /> {supplier.phone}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginasi */}
                {suppliers.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-1">
                        {suppliers.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                className="h-8 px-3"
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
