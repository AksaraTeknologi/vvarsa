import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah, getCurrencySymbol } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/mrp';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    products: Product[];
}

const stockInSchema = z.object({
    product_id: z.string().min(1, 'Produk wajib dipilih'),
    qty: z.coerce.number().min(1, 'Jumlah masuk minimal 1'),
    unit_cost: z.coerce.number().min(0, 'Harga modal/unit tidak boleh negatif'),
    reference: z.string().optional(),
    note: z.string().optional(),
    movement_date: z.string().min(1, 'Tanggal wajib diisi'),
});

export default function StockIn({ products }: Props) {
    const { t } = useTranslation();
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: t('inventory.stockInTitle'), href: '/inventory/stock-in' },
    ];

    const { data, setData, errors } = useForm({
        product_id: '',
        qty: 1,
        unit_cost: 0,
        reference: '',
        note: '',
        movement_date: new Date().toISOString().split('T')[0],
    });

    const [processing, setProcessing] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const selectedProduct = products.find((p) => String(p.id) === data.product_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = stockInSchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        setProcessing(true);
        handleAsyncAction(
            () =>
                routerPromise('post', '/inventory/stock-in', data, {
                    onFinish: () => setProcessing(false),
                }),
            {
                loading: t('inventory.recordingStockIn'),
                success: t('inventory.stockInSuccess'),
                error: t('inventory.stockInError'),
            },
        ).finally(() => setProcessing(false));
    };

    const displayError = (field: keyof typeof errors) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.stockInTitle')} />
            <div className="w-full p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl">
                        <Link href="/inventory">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            {t('inventory.stockInTitle')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('inventory.stockInSubtitle')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                        <div className="p-5 md:p-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="product_id" className="mb-1.5 block">
                                    {t('inventory.product')} *
                                </Label>
                                <Select
                                    value={data.product_id}
                                    onValueChange={(val) => {
                                        setData('product_id', val);
                                        const p = products.find((x) => String(x.id) === val);
                                        if (p) setData('unit_cost', p.cost_price);
                                    }}
                                >
                                    <SelectTrigger
                                        id="product_id"
                                        className={`h-10 rounded-xl text-sm ${displayError('product_id') ? 'border-rose-500' : ''}`}
                                    >
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
                                <div className="rounded-xl bg-blue-50 p-3.5 text-sm dark:bg-blue-900/20">
                                    <p className="font-medium text-blue-700 dark:text-blue-400">{selectedProduct.name}</p>
                                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                                        {t('inventory.currentStockLabel', { stock: selectedProduct.current_stock, unit: selectedProduct.unit, min: selectedProduct.min_stock })}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="qty" className="mb-1 block text-sm font-medium">
                                        {t('inventory.qtyIn')} *
                                    </Label>
                                    <Input
                                        id="qty"
                                        type="number"
                                        min={1}
                                        value={data.qty}
                                        onChange={(e) => setData('qty', parseInt(e.target.value) || 1)}
                                        className={`h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('qty') ? 'border-rose-500' : ''}`}
                                    />
                                    {selectedProduct && (
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {t('inventory.stockAfter', { stock: selectedProduct.current_stock + (data.qty || 0), unit: selectedProduct.unit })}
                                        </p>
                                    )}
                                    {displayError('qty') && <p className="mt-1 text-xs text-rose-500">{displayError('qty')}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="unit_cost" className="mb-1 block text-sm font-medium">
                                        {t('inventory.unitCost')} ({getCurrencySymbol()})
                                    </Label>
                                    <Input
                                        id="unit_cost"
                                        type="text"
                                        value={formatRupiah(data.unit_cost)}
                                        onChange={(e) => setData('unit_cost', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                        className="h-10 !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1">
                                    <Label htmlFor="movement_date" className="block text-sm font-medium">
                                        {t('common.date')} *
                                    </Label>
                                    <DatePicker value={data.movement_date} onChange={(val) => setData('movement_date', val)} />
                                    {displayError('movement_date') && <p className="mt-1 text-xs text-rose-500">{displayError('movement_date')}</p>}
                                </div>

                                <div>
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
                            </div>

                            <div>
                                <Label htmlFor="note" className="mb-1 block text-sm font-medium">
                                    {t('inventory.notes')}
                                </Label>
                                <Textarea
                                    id="note"
                                    rows={3}
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder={t('inventory.notesPlaceholder')}
                                    className="min-h-[88px] !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="mt-2 flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/inventory">{t('Inventory.Cancel')}</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-emerald-600 px-5 text-white hover:bg-emerald-700 disabled:opacity-70"
                        >
                            {processing ? t('inventory.saving') : t('inventory.saveStockIn')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
