import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type Supplier } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Edit, MapPin, Phone, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    suppliers: PaginatedData<Supplier>;
    cities: string[];
    filters: { search?: string; city?: string };
    business_type: string; // Business type dari tenant
}

export default function SuppliersIndex({ suppliers, cities, filters, business_type }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [city, setCity] = useState(filters.city || '');

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('navigation.suppliers'), href: '/suppliers' }];

    const getBusinessTypeLabel = (type?: string | null) => {
        if (!type) return '';
        const normalized = type.toLowerCase();
        if (normalized.includes('fnb') || normalized.includes('food') || normalized.includes('makanan')) return t('supplier.businessTypes.fnb', 'Food & Beverage');
        if (normalized.includes('retail') || normalized.includes('toko')) return t('supplier.businessTypes.retail', 'Retail / Toko');
        if (normalized.includes('fashion') || normalized.includes('tekstil')) return t('supplier.businessTypes.fashion', 'Fashion & Tekstil');
        if (normalized.includes('service') || normalized.includes('jasa')) return t('supplier.businessTypes.services', 'Jasa / Services');
        if (normalized.includes('general') || normalized.includes('manufaktur') || normalized.includes('umum') || normalized.includes('grosir')) return t('supplier.businessTypes.general', 'Manufaktur / Umum');
        return type;
    };

    const applyFilter = () => {
        router.get('/suppliers', { search, city }, { preserveState: true, replace: true });
    };

    const handleCityChange = (value: string) => {
        setCity(value);
        router.get('/suppliers', { search, city: value }, { preserveState: true, replace: true });
    };

    const businessTypeLabel = getBusinessTypeLabel(business_type);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('supplier.recommendations')} />
            <div className="business-page supplier-page flex flex-col gap-6 p-4 md:p-6">
                {/* Header & Add Button */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">{t('supplier.recommendations')}</h1>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">
                            {t('supplier.categorySubtitle')}{' '}
                            <span className="text-foreground font-semibold">{businessTypeLabel}</span>
                        </p>
                    </div>
                    <Button asChild variant="owner" className="rounded-xl">
                        <Link href="/suppliers/create">
                            <Plus size={16} />
                            {t('supplier.addSupplier')}
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-2.5 left-3" size={16} />
                        <input
                            className="h-10 w-full rounded-xl border border-[#d9e5dd] bg-white px-9 py-2 text-sm text-slate-700 outline-none transition focus:border-owner-accent focus:ring-2 focus:ring-owner-accent/20"
                            placeholder={t('supplier.searchPlaceholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                        />
                    </div>
                    <Select value={city || 'all'} onValueChange={(value) => handleCityChange(value === 'all' ? '' : value)}>
                        <SelectTrigger className="h-10 w-full rounded-xl border-[#d9e5dd] bg-white text-sm text-slate-700 focus:border-owner-accent focus:ring-owner-accent/20 sm:w-[180px]">
                            <SelectValue placeholder={t('supplier.allCities')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('supplier.allCities')}</SelectItem>
                            {cities.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Grid Cards */}
                {suppliers.data.length === 0 ? (
                    <div className="bg-card text-muted-foreground rounded-2xl border py-20 text-center">{t('supplier.noData')}</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 [perspective:1200px] md:grid-cols-2 lg:grid-cols-3">
                        {suppliers.data.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="bg-card group flex flex-col gap-3 rounded-2xl border p-5 shadow-sm [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-owner-accent/45 hover:shadow-[10px_16px_26px_rgba(90,166,122,0.16)] hover:[transform:rotateX(-2deg)_rotateY(1.5deg)_translateZ(5px)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:transform-none"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="flex items-center gap-2 font-semibold">
                                            {supplier.name}
                                            {supplier.is_verified && <CheckCircle size={14} className="text-owner-accent" />}
                                        </h3>
                                        <p className="text-muted-foreground text-xs">{getBusinessTypeLabel(supplier.business_type)}</p>
                                    </div>
                                    <Link href={`/suppliers/${supplier.id}/edit`} className="hover:bg-muted flex size-9 items-center justify-center rounded-xl transition-colors">
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
                                variant={link.active ? 'owner' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true, replace: true })}
                                className="h-8 rounded-xl px-3"
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
