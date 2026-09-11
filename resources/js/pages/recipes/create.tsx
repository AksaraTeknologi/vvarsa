import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/mrp';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Calculator, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Resep (BOM)', href: '/recipes' },
    { title: 'Tambah Resep', href: '/recipes/create' },
];

interface RecipeIngredientRow {
    ingredient_id: string | number | null;
    ingredient_name: string;
    qty: number;
    unit: string;
    ingredient_cost: number;
    isFromInventory: boolean;
}

interface Props {
    ingredients: Product[];
}

export default function RecipeCreate({ ingredients }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [portionQty, setPortionQty] = useState(12);
    const [recipes, setRecipes] = useState<RecipeIngredientRow[]>([
        { ingredient_id: null, ingredient_name: '', qty: 1, unit: 'gram', ingredient_cost: 0, isFromInventory: false },
    ]);
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const totalCost = recipes.reduce((sum, r) => sum + r.ingredient_cost * r.qty, 0);
    const hpp = portionQty > 0 ? totalCost / portionQty : totalCost;

    const addRecipe = () => {
        setRecipes([...recipes, { ingredient_id: null, ingredient_name: '', qty: 1, unit: 'gram', ingredient_cost: 0, isFromInventory: false }]);
    };

    const removeRecipe = (index: number) => {
        setRecipes(recipes.filter((_, i) => i !== index));
    };

    const updateRecipe = (index: number, field: keyof RecipeIngredientRow, value: string | number | boolean | null) => {
        const updated = [...recipes];
        (updated[index] as any)[field] = value;
        setRecipes(updated);
    };

    const selectIngredient = (index: number, productId: string) => {
        if (productId === 'custom') {
            updateRecipe(index, 'ingredient_id', null);
            updateRecipe(index, 'isFromInventory', false);
            updateRecipe(index, 'ingredient_name', '');
            updateRecipe(index, 'ingredient_cost', 0);
            updateRecipe(index, 'unit', 'gram');
        } else {
            const product = ingredients.find((p) => String(p.id) === productId);
            if (product) {
                updateRecipe(index, 'ingredient_id', product.id);
                updateRecipe(index, 'ingredient_name', product.name);
                updateRecipe(index, 'ingredient_cost', Number(product.cost_price));
                updateRecipe(index, 'unit', product.unit);
                updateRecipe(index, 'isFromInventory', true);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/recipes',
                    {
                        name,
                        description,
                        portion_qty: portionQty,
                        ingredients: recipes.map((r) => ({
                            ingredient_id: r.ingredient_id,
                            ingredient_name: r.ingredient_name,
                            qty: r.qty,
                            unit: r.unit,
                            ingredient_cost: r.ingredient_cost,
                        })),
                    },
                    {
                        onError: (errors) => setFormErrors(errors),
                        onFinish: () => setProcessing(false),
                    },
                ),
            {
                loading: 'Menyimpan resep baru...',
                success: 'Resep berhasil disimpan!',
                error: 'Gagal Menyimpan',
            },
        ).finally(() => setProcessing(false));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Resep Baru" />

            <div className="mx-auto max-w-3xl p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/recipes">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <BookOpen className="text-violet-500" size={22} />
                            Tambah Resep Baru
                        </h1>
                        <p className="text-muted-foreground text-sm">Buat formula resep dasar dengan kalkulasi HPP otomatis</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Info Resep */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <h2 className="text-sm font-semibold">Informasi Resep</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <Label htmlFor="name">Nama Resep *</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Contoh: Resep Mochi Strawberry Choco"
                                        required
                                        className={formErrors.name ? 'border-rose-500' : ''}
                                    />
                                    {formErrors.name && <p className="text-xs text-rose-500">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="portion_qty">Porsi Hasil (Pcs) *</Label>
                                    <Input
                                        id="portion_qty"
                                        type="number"
                                        min={1}
                                        value={portionQty}
                                        onChange={(e) => setPortionQty(parseInt(e.target.value) || 0)}
                                        required
                                        className={formErrors.portion_qty ? 'border-rose-500' : ''}
                                    />
                                    {formErrors.portion_qty && <p className="text-xs text-rose-500">{formErrors.portion_qty}</p>}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description">Deskripsi / Catatan Resep</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Masukkan detail pembuatan resep atau porsi dasar resep ini..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Resep / BOM */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Bahan-Bahan Resep *</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addRecipe} className="h-8 gap-1 rounded-xl text-xs">
                                <Plus size={12} />
                                Tambah Bahan
                            </Button>
                        </div>

                        {formErrors.ingredients && <p className="text-xs text-rose-500">{formErrors.ingredients}</p>}

                        <div className="space-y-3">
                            {recipes.map((recipe, i) => (
                                <div key={i} className="flex items-end gap-2">
                                    {/* Pilih Bahan */}
                                    <div className="min-w-[120px] flex-[3] space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">Pilih Bahan</Label>}
                                        <Select
                                            value={recipe.ingredient_id ? String(recipe.ingredient_id) : 'custom'}
                                            onValueChange={(v) => selectIngredient(i, v)}
                                        >
                                            <SelectTrigger className="h-9 rounded-xl text-xs">
                                                <SelectValue placeholder="Dari inventori / custom" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="custom">✏️ Input Manual</SelectItem>
                                                {ingredients.map((ing) => (
                                                    <SelectItem key={ing.id} value={String(ing.id)}>
                                                        {ing.name} ({ing.unit})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {/* Nama Bahan */}
                                    <div className="min-w-[90px] flex-[2] space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">Nama Bahan</Label>}
                                        <Input
                                            value={recipe.ingredient_name}
                                            onChange={(e) => updateRecipe(i, 'ingredient_name', e.target.value)}
                                            placeholder="Nama bahan"
                                            readOnly={recipe.isFromInventory}
                                            className={`h-9 rounded-xl text-xs ${recipe.isFromInventory ? 'bg-muted' : ''}`}
                                        />
                                    </div>
                                    {/* Qty */}
                                    <div className="w-20 shrink-0 space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">Qty</Label>}
                                        <Input
                                            type="number"
                                            min={0.1}
                                            step={0.1}
                                            value={recipe.qty}
                                            onChange={(e) => updateRecipe(i, 'qty', parseFloat(e.target.value) || 0)}
                                            className="h-9 rounded-xl text-xs"
                                        />
                                    </div>
                                    {/* Satuan */}
                                    <div className="w-16 shrink-0 space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">Satuan</Label>}
                                        <Input
                                            value={recipe.unit}
                                            onChange={(e) => updateRecipe(i, 'unit', e.target.value)}
                                            placeholder="gr"
                                            readOnly={recipe.isFromInventory}
                                            className={`h-9 rounded-xl text-xs ${recipe.isFromInventory ? 'bg-muted' : ''}`}
                                        />
                                    </div>
                                    {/* HPP/Unit */}
                                    <div className="w-24 shrink-0 space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">HPP/Unit</Label>}
                                        <Input
                                            type="text"
                                            value={recipe.ingredient_cost > 0 ? formatRupiah(recipe.ingredient_cost) : ''}
                                            onChange={(e) =>
                                                updateRecipe(i, 'ingredient_cost', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)
                                            }
                                            readOnly={recipe.isFromInventory}
                                            className={`h-9 rounded-xl text-xs ${recipe.isFromInventory ? 'bg-muted' : ''}`}
                                            placeholder={formatRupiah(0)}
                                        />
                                    </div>
                                    {/* Total HPP */}
                                    <div className="w-28 shrink-0 space-y-1">
                                        {i === 0 && <Label className="text-muted-foreground text-xs">Total HPP</Label>}
                                        <Input
                                            type="text"
                                            value={recipe.qty * recipe.ingredient_cost > 0 ? formatRupiah(recipe.qty * recipe.ingredient_cost) : ''}
                                            readOnly
                                            className="bg-muted h-9 rounded-xl text-xs font-medium"
                                            placeholder={formatRupiah(0)}
                                        />
                                    </div>
                                    {/* Hapus */}
                                    <div className="w-9 shrink-0">
                                        {i === 0 && <div className="mb-1 text-xs text-transparent">-</div>}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={recipes.length === 1}
                                            onClick={() => removeRecipe(i)}
                                            className="h-9 w-full rounded-xl text-rose-500 hover:bg-rose-50"
                                        >
                                            <Trash2 size={13} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* HPP Preview */}
                    <div className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:bg-violet-950/20">
                        <Calculator size={20} className="shrink-0 text-violet-600" />
                        <div className="grid flex-1 grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-xs">Total HPP 1 Adonan / Resep</div>
                                <div className="text-lg font-bold text-violet-700 dark:text-violet-400">{formatRupiah(totalCost)}</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-0.5 text-xs">HPP per Pcs (Hasil Porsi)</div>
                                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(hpp)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/recipes">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700">
                            {processing ? 'Menyimpan...' : 'Simpan Resep'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
