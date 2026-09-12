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
import { type ProductVariant } from '@/types/mrp';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calculator } from 'lucide-react';
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
    variant: ProductVariant & { recipe_id: number | null; recipe_qty: number };
    recipes: Recipe[];
}

export default function VariantEdit({ variant, recipes }: Props) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('variants.title', 'Varian Produk'), href: '/variants' },
        { title: `${t('common.edit', 'Edit')}: ${variant.name}`, href: `/variants/${variant.id}/edit` },
    ];

    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [name, setName] = useState(variant.name);
    const [sku, setSku] = useState(variant.sku ?? '');
    const [sellPrice, setSellPrice] = useState(Number(variant.sell_price));
    const [description, setDescription] = useState(variant.description ?? '');
    const [isActive, setIsActive] = useState(variant.is_active);

    const [recipeId, setRecipeId] = useState<string | number | null>(variant.recipe_id ? String(variant.recipe_id) : null);
    const [recipeQty, setRecipeQty] = useState(Number(variant.recipe_qty));

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
                    'put',
                    `/variants/${variant.id}`,
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
                loading: t('variants.updating', 'Menyimpan perubahan varian...'),
                success: t('variants.updateSuccess', 'Varian berhasil diperbarui!'),
                error: t('common.failed', 'Gagal Menyimpan'),
            },
        ).finally(() => setProcessing(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('variants.editTitle', { name: variant.name, defaultValue: `Edit Varian: ${variant.name}` })} />

            <div className="w-full p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0 rounded-xl">
                        <Link href="/variants">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            {t('variants.editTitle', { name: variant.name, defaultValue: `Edit Varian: ${variant.name}` })}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">
                            {t('variants.editSubtitle', 'Ubah Informasi Penjualan Varian Dan Formulasinya')}
                        </p>
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
                                    className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${formErrors.name ? 'border-rose-500' : ''}`}
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
                                    className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${formErrors.sku ? 'border-rose-500' : ''}`}
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
                                    className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${formErrors.sell_price ? 'border-rose-500' : ''}`}
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
                                    className="min-h-[88px] !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={isActive}
                                    onCheckedChange={(checked) => setIsActive(!!checked)}
                                    className="data-[state=unchecked]:!border-slate-300 data-[state=unchecked]:!bg-white data-[state=checked]:!border-blue-600 data-[state=checked]:!bg-blue-600 data-[state=checked]:!text-white"
                                />
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
                                <Select value={recipeId ? String(recipeId) : ''} onValueChange={(val) => setRecipeId(val)}>
                                    <SelectTrigger className="h-10 rounded-xl bg-white text-sm">
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
                                    className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${formErrors.recipe_qty ? 'border-rose-500' : ''}`}
                                />
                                {formErrors.recipe_qty && <p className="text-xs text-rose-500">{formErrors.recipe_qty}</p>}
                            </div>
                        </div>

                        {selectedRecipe && selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                            <div className="border-border space-y-2 border-t pt-3">
                                <span className="text-muted-foreground block text-sm font-semibold">
                                    {t('variants.estimatedConsumption', { qty: recipeQty, defaultValue: `Estimasi Konsumsi Bahan Baku (kelipatan ${recipeQty}):` })}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRecipe.ingredients.map((ing, i) => (
                                        <span key={i} className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-600">
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
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                        <Calculator size={20} className="text-muted-foreground shrink-0" />
                        <div className="grid flex-1 grid-cols-3 gap-4 text-base">
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-sm">{t('variants.hppCost', 'HPP (Modal Varian)')}</div>
                                <div className="text-foreground font-semibold">{formatRupiah(hpp)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-sm">{t('variants.profitPerVariant', 'Untung/Varian')}</div>
                                <div className="text-muted-foreground font-semibold">{formatRupiah(profit)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-sm">{t('variants.profitMargin', 'Margin Keuntungan')}</div>
                                <div className="text-muted-foreground font-semibold">{margin.toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/variants">{t('common.cancel', 'Batal')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing} variant="owner" className="rounded-xl px-5">
                            {processing ? t('common.saving', 'Menyimpan...') : t('common.saveChanges', 'Simpan Perubahan')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
