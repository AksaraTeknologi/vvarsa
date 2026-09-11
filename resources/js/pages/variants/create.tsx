import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calculator, FlaskConical } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Recipe {
    id: number;
    name: string;
    hpp: number;
    ingredients?: {
        ingredient_name: string;
        qty: number;
        unit: string;
    }[];
}

interface Props {
    recipes: Recipe[];
}

export default function VariantCreate({ recipes }: Props) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('variants.title', 'Varian Produk'), href: '/variants' },
        { title: t('variants.addVariant', 'Tambah Varian'), href: '/variants/create' },
    ];

    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [sellPrice, setSellPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    const [recipeId, setRecipeId] = useState<string | null>(null);
    const [recipeQty, setRecipeQty] = useState(1.0);

    const selectedRecipe = recipes.find((r) => String(r.id) === String(recipeId));

    // HPP = selectedRecipe.hpp * recipeQty
    const hpp = selectedRecipe ? selectedRecipe.hpp * recipeQty : 0;
    const margin = sellPrice > 0 ? ((sellPrice - hpp) / sellPrice) * 100 : 0;
    const profit = sellPrice - hpp;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/variants',
                    {
                        name,
                        sku,
                        sell_price: sellPrice,
                        description,
                        is_active: isActive,
                        recipe_id: recipeId,
                        recipe_qty: recipeQty,
                    },
                    {
                        onError: (errors) => setFormErrors(errors),
                        onFinish: () => setProcessing(false),
                    },
                ),
            {
                loading: t('variants.saving', 'Menyimpan varian baru...'),
                success: t('variants.saveSuccess', 'Varian berhasil disimpan!'),
                error: t('common.failed', 'Gagal Menyimpan'),
            },
        ).finally(() => setProcessing(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('variants.createTitle', 'Tambah Varian Produk')} />

            <div className="mx-auto max-w-3xl p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/variants">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <FlaskConical className="text-violet-500" size={22} />
                            {t('variants.createTitle', 'Tambah Varian Produk')}
                        </h1>
                        <p className="text-muted-foreground text-sm">{t('variants.createSubtitle', 'Buat varian baru untuk dijual dan hubungkan dengan resep dasar')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Informasi Varian */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-sm font-semibold">{t('variants.salesInfo', 'Informasi Penjualan Varian')}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="name">{t('variants.variantName', 'Nama Varian')} *</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('variants.namePlaceholder', 'Contoh: Mochi Strawberry Choco (3 pcs)')}
                                    required
                                    className={formErrors.name ? 'border-rose-500' : ''}
                                />
                                {formErrors.name && <p className="text-xs text-rose-500">{formErrors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="sku">{t('variants.skuCode', 'SKU (Kode Produk)')}</Label>
                                <Input
                                    id="sku"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    placeholder={t('variants.skuPlaceholder', 'Contoh: VAR-STRW-CHOCO-3')}
                                    className={formErrors.sku ? 'border-rose-500' : ''}
                                />
                                {formErrors.sku && <p className="text-xs text-rose-500">{formErrors.sku}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="sell_price">{t('variants.sellPriceLabel', 'Harga Jual (Rp) *')}</Label>
                                <Input
                                    id="sell_price"
                                    type="text"
                                    value={sellPrice > 0 ? formatRupiah(sellPrice) : ''}
                                    onChange={(e) => setSellPrice(parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                    placeholder={formatRupiah(18000)}
                                    required
                                    className={formErrors.sell_price ? 'border-rose-500' : ''}
                                />
                                {formErrors.sell_price && <p className="text-xs text-rose-500">{formErrors.sell_price}</p>}
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="description">{t('variants.description', 'Deskripsi Penjualan')}</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder={t('variants.descriptionPlaceholder', 'Masukkan penjelasan produk untuk slip penjualan atau menu kasir...')}
                                    rows={2}
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <Checkbox id="is_active" checked={isActive} onCheckedChange={(checked) => setIsActive(!!checked)} />
                                <Label htmlFor="is_active" className="cursor-pointer text-sm font-normal">
                                    {t('variants.activeCheckbox', 'Varian ini aktif dan tampil di POS kasir')}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Penghubung Resep */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-sm font-semibold">{t('variants.recipeFormula', 'Formula / Resep Acuan')}</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="recipe_id">{t('variants.selectRecipe', 'Pilih Resep Acuan *')}</Label>
                                <Select value={recipeId || ''} onValueChange={(val) => setRecipeId(val)}>
                                    <SelectTrigger className="h-10 rounded-xl">
                                        <SelectValue placeholder={t('variants.recipePlaceholder', 'Pilih resep dasar...')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {recipes.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {r.name} ({formatRupiah(r.hpp)} / unit)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.recipe_id && <p className="text-xs text-rose-500">{formErrors.recipe_id}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="recipe_qty">{t('variants.recipeQty', 'Porsi / Kelipatan Resep *')}</Label>
                                <Input
                                    id="recipe_qty"
                                    type="number"
                                    min={0.1}
                                    step={0.1}
                                    value={recipeQty}
                                    onChange={(e) => setRecipeQty(parseFloat(e.target.value) || 0)}
                                    required
                                    className={formErrors.recipe_qty ? 'border-rose-500' : ''}
                                />
                                {formErrors.recipe_qty && <p className="text-xs text-rose-500">{formErrors.recipe_qty}</p>}
                            </div>
                        </div>

                        {selectedRecipe && selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                            <div className="border-border space-y-2 border-t pt-3">
                                <span className="text-muted-foreground block text-xs font-semibold">
                                    {t('variants.estimatedConsumption', { qty: recipeQty, defaultValue: `Estimasi Konsumsi Bahan Baku (kelipatan ${recipeQty}):` })}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedRecipe.ingredients.map((ing, i) => (
                                        <span key={i} className="bg-muted text-muted-foreground rounded-lg px-2 py-1 text-xs">
                                            {ing.ingredient_name}:{' '}
                                            <strong>
                                                {(ing.qty * recipeQty).toFixed(3).replace(/\.?0+$/, '')} {ing.unit}
                                            </strong>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* HPP & Margin Preview */}
                    <div
                        className={`flex items-center gap-4 rounded-2xl border p-5 ${margin >= 20 ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20' : margin >= 10 ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' : 'border-rose-200 bg-rose-50 dark:bg-rose-900/20'}`}
                    >
                        <Calculator size={20} className="text-muted-foreground shrink-0" />
                        <div className="grid flex-1 grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-xs">{t('variants.hppCost', 'HPP (Modal Varian)')}</div>
                                <div className="font-semibold text-violet-700 dark:text-violet-400">{formatRupiah(hpp)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-xs">{t('variants.profitPerVariant', 'Untung/Varian')}</div>
                                <div className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatRupiah(profit)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-xs">{t('variants.profitMargin', 'Margin Keuntungan')}</div>
                                <div
                                    className={`font-semibold ${margin >= 20 ? 'text-emerald-600' : margin >= 10 ? 'text-amber-600' : 'text-rose-600'}`}
                                >
                                    {margin.toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/variants">{t('common.cancel', 'Batal')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700">
                            {processing ? t('common.saving', 'Menyimpan...') : t('variants.addVariant', 'Tambah Varian')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
