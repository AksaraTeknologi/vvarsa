import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    products: Product[];
}

const stockOutSchema = z.object({
    product_id: z.string().min(1, 'Produk wajib dipilih'),
    qty: z.coerce.number().min(1, 'Jumlah keluar minimal 1'),
    reference: z.string().optional(),
    note: z.string().optional(),
    movement_date: z.string().min(1, 'Tanggal wajib diisi'),
});

export default function StockOut({ products }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: t('inventory.stockOutTitle'), href: '/inventory/stock-out' },
    ];

    const { data, setData, errors } = useForm({
        product_id: '',
        qty: 1,
        reference: '',
        note: '',
        movement_date: new Date().toISOString().split('T')[0],
    });

    const [processing, setProcessing] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const selectedProduct = products.find((p) => String(p.id) === data.product_id);
    const isInsufficientStock = selectedProduct && data.qty > selectedProduct.current_stock;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = stockOutSchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        if (isInsufficientStock) {
            setClientErrors((prev) => ({ ...prev, qty: t('inventory.insufficientStock') }));
            return;
        }

        setProcessing(true);
        handleAsyncAction(
            () =>
                routerPromise('post', '/inventory/stock-out', data, {
                    onFinish: () => setProcessing(false),
                }),
            {
                loading: t('inventory.savingStockOut'),
                success: t('inventory.stockOutSuccess'),
                error: t('inventory.stockOutError'),
            },
        ).finally(() => setProcessing(false));
    };

    const displayError = (field: keyof typeof errors) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.stockOutTitle')} />
            <div className="w-full p-4 md:p-6">
                <div className="mb-6">
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            {t('inventory.stockOutTitle')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('inventory.stockOutSubtitle')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                        <div className="p-5 md:p-6">
                        <div className="space-y-4">
                        <div>
                            <Label htmlFor="product_id" className="mb-1.5 block text-sm font-medium">
                                {t('inventory.product')} *
                            </Label>
                            <Select value={data.product_id} onValueChange={(val) => setData('product_id', val)}>
                                <SelectTrigger id="product_id" className={`h-10 rounded-xl text-sm ${displayError('product_id') ? 'border-rose-500' : ''}`}>
                                    <SelectValue placeholder={t('inventory.selectProductPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name} ({t('inventory.stock')}: {p.current_stock} {p.unit})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {displayError('product_id') && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-rose-500">
                                    <AlertCircle size={12} />
                                    {displayError('product_id')}
                                </p>
                            )}
                        </div>

                        {selectedProduct && (
                            <div
                                className={`rounded-xl p-3.5 text-sm ${isInsufficientStock ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-slate-50 dark:bg-slate-800/50'}`}
                            >
                                <p className={`font-medium ${isInsufficientStock ? 'text-rose-700 dark:text-rose-400' : ''}`}>
                                    {selectedProduct.name}
                                </p>
                                <p className={`mt-0.5 text-xs ${isInsufficientStock ? 'text-rose-600 dark:text-rose-300' : 'text-muted-foreground'}`}>
                                    {t('inventory.availableStock')}: {selectedProduct.current_stock} {selectedProduct.unit}
                                    {isInsufficientStock && ` — ${t('inventory.insufficientStock')}`}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="qty" className="mb-1 block text-sm font-medium">
                                    {t('inventory.qtyOut')} *
                                </Label>
                                <Input
                                    id="qty"
                                    type="number"
                                    min={1}
                                    max={selectedProduct?.current_stock}
                                    value={data.qty}
                                    onChange={(e) => setData('qty', parseInt(e.target.value) || 1)}
                                    className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('qty') ? 'border-rose-500' : ''}`}
                                />
                                {selectedProduct && (
                                    <p className="text-muted-foreground mt-1 text-xs">
                                        {t('inventory.stockAfter')}: {Math.max(0, selectedProduct.current_stock - (data.qty || 0))} {selectedProduct.unit}
                                    </p>
                                )}
                                {displayError('qty') && <p className="mt-1 text-xs text-rose-500">{displayError('qty')}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="movement_date" className="block text-sm font-medium">
                                    {t('common.date')} *
                                </Label>
                                <DatePicker value={data.movement_date} onChange={(val) => setData('movement_date', val)} />
                                {displayError('movement_date') && <p className="mt-1 text-xs text-rose-500">{displayError('movement_date')}</p>}
                            </div>
                        </div>

                        <div className="md:w-1/2">
                            <Label htmlFor="reference" className="mb-1 block text-sm font-medium">
                                {t('inventory.reference')}
                            </Label>
                            <Input
                                id="reference"
                                type="text"
                                value={data.reference}
                                onChange={(e) => setData('reference', e.target.value)}
                                placeholder={t('inventory.referencePlaceholder')}
                                className="h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        <div>
                            <Label htmlFor="note" className="mb-1 block text-sm font-medium">
                                {t('common.notes')}
                            </Label>
                            <Textarea
                                id="note"
                                rows={3}
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                placeholder={t('inventory.stockOutNotePlaceholder')}
                                className="min-h-[88px] !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/inventory">{t('common.cancel')}</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.product_id || !!isInsufficientStock}
                            className="rounded-xl bg-rose-600 px-5 text-white hover:bg-rose-700 disabled:opacity-70"
                        >
                            {processing ? t('common.saving') : t('inventory.saveStockOut')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
