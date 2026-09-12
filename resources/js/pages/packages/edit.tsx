import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { getCurrencySymbol } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type ProductVariant } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

interface PackageModel {
    id: number;
    name: string;
    capacity: number;
    price: string | number;
    is_active: boolean;
    description: string | null;
    variants?: ProductVariant[];
}

interface Props {
    package: PackageModel;
    variants: ProductVariant[];
}

export default function PackageEdit({ package: pkg, variants }: Props) {
    const { data, setData, put, processing, errors, transform } = useForm({
        name: pkg.name,
        capacity: pkg.capacity,
        price: pkg.price.toString(),
        is_active: pkg.is_active,
        description: pkg.description ?? '',
        variant_ids: (pkg.variants ?? []).map((v) => v.id as string | number),
    });

    const [allVariantsAllowed, setAllVariantsAllowed] = useState(!pkg.variants || pkg.variants.length === 0);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Paket Produk', href: '/packages' },
        { title: `Edit ${pkg.name}`, href: `/packages/${pkg.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            variant_ids: allVariantsAllowed ? [] : data.variant_ids,
        }));

        put(`/packages/${pkg.id}`);
    };

    const handleCheckboxChange = (id: string | number, checked: boolean) => {
        if (checked) {
            setData('variant_ids', [...data.variant_ids, id]);
        } else {
            setData(
                'variant_ids',
                data.variant_ids.filter((vId) => String(vId) !== String(id)),
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Paket ${pkg.name}`} />

            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-xl">
                        <Link href="/packages">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            Edit Paket Produk
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">Ubah Pengaturan Paket Harga Atau Batasan Rasanya</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        {/* Name */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="name">Nama Paket *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="cth: Paket 3 Mix Mochi"
                                required
                                className="h-10 rounded-xl !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                            />
                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                        </div>

                        {/* Capacity & Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="capacity">Kapasitas Isi (Pcs) *</Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', parseInt(e.target.value) || 0)}
                                    required
                                    className="h-10 rounded-xl !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                                {errors.capacity && <p className="text-xs text-rose-500">{errors.capacity}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="price">Harga Bundle ({getCurrencySymbol()}) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min={0}
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="cth: 18000"
                                    required
                                    className="h-10 rounded-xl !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                                {errors.price && <p className="text-xs text-rose-500">{errors.price}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="grid gap-1.5">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Catatan opsional mengenai paket..."
                                className="min-h-[88px] rounded-xl !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                            />
                            {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer">
                                Paket aktif dan dapat dipilih di Kasir
                            </Label>
                        </div>
                    </div>

                    {/* Varian Mochi Pembatas */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold">Batasan Varian Rasa</h2>
                                <p className="text-muted-foreground mt-0.5 text-xs">
                                    Pilih rasa mochi apa saja yang diperbolehkan di dalam paket ini
                                </p>
                            </div>
                        </div>

                        {/* Toggle All Allowed */}
                        <div className="border-border flex items-center gap-2 border-b pb-3">
                            <input
                                id="all_allowed"
                                type="checkbox"
                                checked={allVariantsAllowed}
                                onChange={(e) => setAllVariantsAllowed(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="all_allowed" className="cursor-pointer text-sm font-semibold">
                                Bebas Mix (Semua rasa diperbolehkan)
                            </Label>
                        </div>

                        {/* Checkbox List of variants */}
                        {!allVariantsAllowed && (
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                {variants.map((v) => (
                                    <div key={v.id} className="hover:bg-muted/40 flex items-center gap-2 rounded-xl p-2 transition-colors">
                                        <input
                                            id={`var-${v.id}`}
                                            type="checkbox"
                                            checked={data.variant_ids.some((vId) => String(vId) === String(v.id))}
                                            onChange={(e) => handleCheckboxChange(v.id, e.target.checked)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor={`var-${v.id}`} className="cursor-pointer text-sm leading-tight">
                                            {v.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {errors.variant_ids && <p className="text-xs text-rose-500">{errors.variant_ids}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" className="rounded-xl">
                            <Link href="/packages">Batal</Link>
                        </Button>
                        <Button type="submit" disabled={processing} variant="owner" className="gap-1.5 rounded-xl">
                            <Save size={16} />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
