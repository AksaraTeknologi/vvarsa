import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type ProductCategory } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Info } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    categories: ProductCategory[];
}

const UNITS = ['pcs', 'kg', 'gram', 'liter', 'ml', 'box', 'karton', 'porsi', 'gelas', 'botol', 'pak', 'lusin'];

const productSchema = z.object({
    name: z.string().min(1, 'Nama produk/bahan wajib diisi'),
    sku: z.string().optional(),
    category_id: z.string().optional(),
    unit: z.string().min(1, 'Satuan wajib diisi'),
    min_stock: z.coerce.number().min(0, 'Stok minimum tidak boleh negatif'),
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

    const displayError = (field: keyof typeof data): string | undefined => clientErrors[field] || errors[field];

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

                {/* Info Alert explaining Stock In pricing logic */}
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300">
                    <Info className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm mb-0.5">Informasi Pembelian &amp; Harga Bahan Pokok</p>
                        <p className="leading-relaxed">
                            Harga beli dan stok awal tidak diinput di sini karena harga bahan pokok dapat berubah-ubah.
                            Catat harga modal per unit dan jumlah pembelian terbaru melalui menu <strong>Stok Masuk (Stock In)</strong> saat barang datang.
                        </p>
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
