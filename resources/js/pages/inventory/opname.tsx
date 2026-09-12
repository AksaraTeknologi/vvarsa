import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/mrp';
import { Head, Link } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    products: Product[];
}

interface OpnameItem {
    product_id: string | number;
    actual_stock: number;
    note: string;
}

const opnameSchema = z.object({
    opname_date: z.string().min(1, 'Tanggal opname wajib diisi'),
    items: z.array(
        z.object({
            product_id: z.union([z.string().min(1), z.number()]),
            actual_stock: z.number().min(0, 'Stok aktual tidak boleh negatif'),
            note: z.string().optional(),
        }),
    ),
});

export default function Opname({ products }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('navigation.inventory'), href: '/inventory' },
        { title: t('inventory.opnameTitle'), href: '/inventory/opname' },
    ];

    const [items, setItems] = useState<OpnameItem[]>(
        products.map((p) => ({
            product_id: p.id,
            actual_stock: p.current_stock,
            note: '',
        })),
    );
    const [opname_date, setOpnameDate] = useState(new Date().toISOString().split('T')[0]);
    const [processing, setProcessing] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const updateItem = (productId: string | number, field: keyof OpnameItem, value: number | string) => {
        setItems((prev) => prev.map((item) => (String(item.product_id) === String(productId) ? { ...item, [field]: value } : item)));
    };

    const getDifference = (productId: string | number) => {
        const product = products.find((p) => String(p.id) === String(productId));
        const item = items.find((i) => String(i.product_id) === String(productId));
        if (!product || !item) return 0;
        return item.actual_stock - product.current_stock;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = opnameSchema.safeParse({ opname_date, items });
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.');
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        setProcessing(true);
        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/inventory/opname',
                    { items: items as any, opname_date },
                    {
                        onFinish: () => setProcessing(false),
                    },
                ),
            {
                loading: t('inventory.savingOpname'),
                success: t('inventory.opnameSuccess'),
                error: t('inventory.opnameError'),
            },
        ).finally(() => setProcessing(false));
    };

    const changedCount = items.filter((item) => {
        const product = products.find((p) => String(p.id) === String(item.product_id));
        return product && item.actual_stock !== product.current_stock;
    }).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('inventory.opnameTitle')} />
            <div className="p-4 md:p-6">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div>
                            <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                                {t('inventory.opnameTitle')}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('inventory.opnameSubtitle')}</p>
                        </div>
                    </div>
                    <div className="flex w-full items-center gap-3 sm:w-auto">
                        <DatePicker value={opname_date} onChange={(val) => setOpnameDate(val)} />
                    </div>
                </div>

                {changedCount > 0 && (
                    <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/20 dark:text-rose-400">
                        {t('inventory.changedProductsCount', { count: changedCount })}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border bg-slate-50/70 hover:bg-slate-50/70">
                                    <TableHead className="text-muted-foreground px-4 py-2.5 text-xs font-bold tracking-[0.06em] uppercase">
                                        {t('inventory.product')}
                                    </TableHead>
                                    <TableHead className="text-muted-foreground px-4 py-2.5 text-center text-xs font-bold tracking-[0.06em] uppercase">
                                        {t('inventory.systemStock')}
                                    </TableHead>
                                    <TableHead className="text-muted-foreground px-4 py-2.5 text-center text-xs font-bold tracking-[0.06em] uppercase">
                                        {t('inventory.actualStock')}
                                    </TableHead>
                                    <TableHead className="text-muted-foreground px-4 py-2.5 text-center text-xs font-bold tracking-[0.06em] uppercase">
                                        {t('inventory.difference')}
                                    </TableHead>
                                    <TableHead className="text-muted-foreground px-4 py-2.5 text-xs font-bold tracking-[0.06em] uppercase">
                                        {t('common.notes')}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product, idx) => {
                                    const item = items.find((i) => String(i.product_id) === String(product.id))!;
                                    const diff = getDifference(product.id);
                                    return (
                                        <TableRow
                                            key={product.id}
                                            className={`${diff !== 0 ? 'bg-rose-50/40 dark:bg-rose-900/10' : ''} hover:bg-[#edf8f1]/70`}
                                        >
                                            <TableCell className="px-4 py-3">
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-muted-foreground text-xs">{product.category?.name}</p>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span className="text-muted-foreground text-sm">
                                                    {product.current_stock} {product.unit}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={item.actual_stock}
                                                    onChange={(e) => updateItem(product.id, 'actual_stock', parseInt(e.target.value) || 0)}
                                                    className="mx-auto h-9 w-24 rounded-xl !bg-white !text-center !text-sm !text-slate-700 placeholder:text-slate-400"
                                                />
                                                {clientErrors[`items.${idx}.actual_stock`] && (
                                                    <p className="mt-1 text-xs text-rose-500">{clientErrors[`items.${idx}.actual_stock`]}</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-center">
                                                <span
                                                    className={`text-sm font-semibold ${diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-rose-600' : 'text-muted-foreground'}`}
                                                >
                                                    {diff > 0 ? `+${diff}` : diff === 0 ? '—' : diff}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3">
                                                <Input
                                                    type="text"
                                                    value={item.note}
                                                    onChange={(e) => updateItem(product.id, 'note', e.target.value)}
                                                    placeholder={t('inventory.notePlaceholder')}
                                                    className="h-9 w-full rounded-xl !bg-white !text-sm !text-slate-700 placeholder:text-slate-400"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/inventory">{t('common.cancel')}</Link>
                        </Button>
                        <Button type="submit" variant="owner" disabled={processing || changedCount === 0} className="inline-flex items-center gap-2 rounded-xl">
                            <Save size={16} />
                            {processing ? t('common.saving') : t('inventory.saveOpnameCount', { count: changedCount })}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
