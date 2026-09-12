import { Button } from '@/components/ui/button';
import { Supplier } from '@/types/mrp';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit } from 'lucide-react';

export const columns = (t: (key: string, options?: any) => string): ColumnDef<Supplier>[] => {
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

    return [
        {
            accessorKey: 'name',
            header: t('supplier.supplierName'),
        },
        {
            accessorKey: 'business_type',
            header: t('supplier.businessType'),
            cell: ({ row }) => getBusinessTypeLabel(row.original.business_type),
        },
        {
            accessorKey: 'city',
            header: t('supplier.city'),
        },
        {
            accessorKey: 'phone',
            header: t('supplier.phone'),
        },
        {
            id: 'actions',
            header: t('common.actions'),
            cell: ({ row }) => {
                const supplier = row.original;
                return (
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/suppliers/${supplier.id}/edit`}>
                            <Edit size={16} />
                        </Link>
                    </Button>
                );
            },
        },
    ];
};
