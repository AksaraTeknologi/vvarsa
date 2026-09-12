import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type ProductCategory } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    categories: ProductCategory[];
}

const UNITS = ['pcs', 'kg', 'gram', 'liter', 'ml', 'box', 'karton', 'porsi', 'gelas', 'botol', 'pak', 'lusin'];

const productSchema = z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    sku: z.string().optional(),
    category_id: z.string().optional(),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    min_stock: z.number().min(0, 'Stok minimum tidak boleh negatif'),
    purchase_price: z.number().min(0, 'Harga beli tidak boleh negatif'),
    purchase_qty: z.number().min(0.001, 'Isi kemasan tidak boleh kosong atau negatif'),
    sell_price: z.number().min(0, 'Harga jual tidak boleh negatif').optional().default(0),
    description: z.string().optional(),
});

export default function InventoryCreate({ categories }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: t('inventory.addProduct'), href: '/inventory/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        sku: '',
        category_id: '',
        unit: 'pcs',
        min_stock: 0,
        purchase_price: 0,
        purchase_qty: 1,
        sell_price: 0,
        description: '',
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

        post('/inventory');
    };

    const costPrice = data.purchase_qty > 0 ? data.purchase_price / data.purchase_qty : 0;
    const margin = data.sell_price > 0 ? Math.round(((data.sell_price - costPrice) / data.sell_price) * 100) : 0;

    const displayError = (field: keyof typeof errors) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.addProduct')} />
            <div className="w-full p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0 rounded-xl">
                        <Link href="/inventory">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">{t('inventory.addProduct')}</h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('inventory.addProductSubtitle')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm md:p-6">
                        <h2 className="text-foreground text-sm font-semibold">{t('inventory.basicInfo')}</h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">{t('inventory.productName')} *</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('inventory.productNamePlaceholder')}
                                className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('name') ? 'border-rose-500' : ''}`}
                                required
                            />
                            {displayError('name') && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                                    <AlertCircle size={12} />
                                    {displayError('name')}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="sku">{t('inventory.sku')}</Label>
                                <Input
                                    id="sku"
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    placeholder={t('inventory.skuPlaceholder')}
                                    className="h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category_id">{t('inventory.category')}</Label>
                                <Select value={data.category_id || undefined} onValueChange={(val) => setData('category_id', val)}>
                                    <SelectTrigger id="category_id" className="h-10 rounded-xl bg-white text-sm">
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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="unit">{t('inventory.unit')} *</Label>
                                <Select value={data.unit} onValueChange={(val) => setData('unit', val)}>
                                    <SelectTrigger id="unit" className="h-10 rounded-xl bg-white text-sm">
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
                                    className="h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                                <p className="text-muted-foreground text-[11px]">{t('inventory.minStockHint')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm md:p-6">
                        <h2 className="text-foreground text-sm font-semibold">{t('inventory.pricingAndPackaging')}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="purchase_price">{t('inventory.purchasePricePkg')} *</Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={formatRupiah(data.purchase_price)}
                                    onChange={(e) => setData('purchase_price', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                    className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('purchase_price') ? 'border-rose-500' : ''}`}
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
                                    className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('purchase_qty') ? 'border-rose-500' : ''}`}
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
                                    className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('sell_price') ? 'border-rose-500' : ''}`}
                                />
                                {displayError('sell_price') && <p className="mt-1 text-xs text-rose-500">{displayError('sell_price')}</p>}
                            </div>
                        </div>
                        {data.purchase_qty > 0 && data.purchase_price > 0 && (
                            <div className="text-muted-foreground rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                                {t('inventory.costPriceEstimate', { unit: data.unit, price: formatRupiah(data.purchase_price / data.purchase_qty) })}
                            </div>
                        )}
                        {data.sell_price > 0 && costPrice > 0 && (
                            <div
                                className={`rounded-xl border p-3 text-sm ${margin >= 20 ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/10 dark:text-emerald-400' : 'border-amber-200 bg-amber-50/60 text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/10 dark:text-amber-400'}`}
                            >
                                {t('inventory.marginProfit', { margin })}
                                {margin < 20 && t('inventory.lowMarginWarning')}
                            </div>
                        )}
                    </div>

                    <div className="bg-card border-border space-y-2 rounded-2xl border p-5 shadow-sm md:p-6">
                        <Label htmlFor="description">{t('inventory.descriptionOptional')}</Label>
                        <Textarea
                            id="description"
                            rows={3}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder={t('inventory.descriptionPlaceholder')}
                            className="min-h-[88px] !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/inventory">{t('common.cancel')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing} variant="owner" className="rounded-xl px-6">
                            {processing ? t('common.saving') : t('inventory.saveProduct')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
