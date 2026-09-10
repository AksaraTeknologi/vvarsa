import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Product, type ProductCategory } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    product: Product & { category?: ProductCategory };
    categories: ProductCategory[];
}

const UNITS = ['pcs', 'kg', 'gram', 'liter', 'ml', 'box', 'karton', 'porsi', 'gelas', 'botol', 'pak', 'lusin'];

const productSchema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    sku: z.string().optional(),
    category_id: z.string().optional(),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    min_stock: z.coerce.number().min(0, 'Stok minimum tidak boleh negatif'),
    purchase_price: z.coerce.number().min(0, 'Harga beli tidak boleh negatif'),
    purchase_qty: z.coerce.number().min(0.001, 'Isi kemasan tidak boleh kosong atau negatif'),
    sell_price: z.coerce.number().min(0, 'Harga jual tidak boleh negatif').optional().default(0),
    description: z.string().optional(),
    is_active: z.boolean(),
});

export default function InventoryEdit({ product, categories }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: product.name, href: `/inventory/${product.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        sku: product.sku || '',
        category_id: product.category_id ? String(product.category_id) : '',
        unit: product.unit,
        min_stock: product.min_stock,
        purchase_price: product.purchase_price,
        purchase_qty: product.purchase_qty,
        sell_price: product.sell_price,
        description: product.description || '',
        is_active: product.is_active,
    });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = productSchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        put(`/inventory/${product.id}`);
    };

    const costPrice = data.purchase_qty > 0 ? data.purchase_price / data.purchase_qty : 0;
    const margin = data.sell_price > 0 ? Math.round(((data.sell_price - costPrice) / data.sell_price) * 100) : 0;

    const displayError = (field: keyof typeof data): string | undefined => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('common.edit')} — ${product.name}`} />
            <div className="mx-auto max-w-2xl p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild className="h-9 w-9 rounded-xl">
                        <Link href="/inventory">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('inventory.editProduct')}</h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">
                            {t('inventory.stock')}: <strong>{product.current_stock} {product.unit}</strong> &mdash;{' '}
                            <Link href="/inventory/stock-in" className="text-primary hover:underline">
                                {t('inventory.stockInTitle')}
                            </Link>{' '}
                            /{' '}
                            <Link href="/inventory/stock-out" className="text-primary hover:underline">
                                {t('inventory.stockOutTitle')}
                            </Link>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-foreground text-sm font-semibold">{t('inventory.basicInfo')}</h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">{t('inventory.productName')} *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={displayError('name') ? 'border-rose-500' : ''}
                                required
                            />
                            {displayError('name') && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                                    <AlertCircle size={12} />
                                    {displayError('name')}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sku">{t('inventory.sku')}</Label>
                                <Input id="sku" type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category_id">{t('inventory.category')}</Label>
                                <Select value={data.category_id || undefined} onValueChange={(val) => setData('category_id', val)}>
                                    <SelectTrigger id="category_id" className="rounded-xl">
                                        <SelectValue placeholder={t('inventory.selectCategoryPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="unit">{t('inventory.unit')} *</Label>
                                <Select value={data.unit} onValueChange={(val) => setData('unit', val)}>
                                    <SelectTrigger id="unit" className="rounded-xl">
                                        <SelectValue placeholder={t('inventory.selectUnitPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((u) => (
                                            <SelectItem key={u} value={u}>
                                                {u}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="min_stock">{t('inventory.minStock')}</Label>
                                <Input
                                    id="min_stock"
                                    type="number"
                                    min={0}
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-foreground text-sm font-semibold">{t('inventory.pricingAndPackaging')}</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="purchase_price">{t('inventory.purchasePricePkg')} *</Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={formatRupiah(data.purchase_price)}
                                    onChange={(e) => setData('purchase_price', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                    className={displayError('purchase_price') ? 'border-rose-500' : ''}
                                    required
                                />
                                {displayError('purchase_price') && <p className="mt-1 text-xs text-rose-500">{displayError('purchase_price')}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchase_qty">{t('inventory.purchaseQty')} *</Label>
                                <Input
                                    id="purchase_qty"
                                    type="number"
                                    step="any"
                                    min={0.1}
                                    value={data.purchase_qty}
                                    onChange={(e) => setData('purchase_qty', parseFloat(e.target.value) || 0)}
                                    className={displayError('purchase_qty') ? 'border-rose-500' : ''}
                                    required
                                />
                                {displayError('purchase_qty') && <p className="mt-1 text-xs text-rose-500">{displayError('purchase_qty')}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sell_price">{t('inventory.sellPriceOptional')}</Label>
                                <Input
                                    id="sell_price"
                                    type="text"
                                    value={formatRupiah(data.sell_price)}
                                    onChange={(e) => setData('sell_price', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                    className={displayError('sell_price') ? 'border-rose-500' : ''}
                                />
                                {displayError('sell_price') && <p className="mt-1 text-xs text-rose-500">{displayError('sell_price')}</p>}
                            </div>
                        </div>
                        {data.purchase_qty > 0 && data.purchase_price > 0 && (
                            <div className="text-muted-foreground bg-muted/30 rounded-xl p-3 text-sm">
                                {t('inventory.costPriceEstimate', { unit: data.unit, price: formatRupiah(data.purchase_price / data.purchase_qty) })}
                            </div>
                        )}
                        {data.sell_price > 0 && costPrice > 0 && (
                            <div
                                className={`rounded-xl p-3 text-sm ${margin >= 20 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'}`}
                            >
                                {t('inventory.marginProfit', { margin })}
                                {margin < 20 && t('inventory.lowMarginWarning')}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-foreground text-sm font-semibold">{t('inventory.settings')}</h2>

                        <div className="space-y-2">
                            <Label htmlFor="description">{t('inventory.description')}</Label>
                            <Textarea
                                id="description"
                                rows={3}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('inventory.descriptionPlaceholder')}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', !!checked)} />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                {t('inventory.productActive')}
                            </Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/inventory">{t('common.cancel')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-xl px-6">
                            {processing ? t('common.saving') : t('inventory.saveChanges')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
