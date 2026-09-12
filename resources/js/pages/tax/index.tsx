import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type TaxReport } from '@/types/mrp';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
    reports: PaginatedData<TaxReport>;
}

const TAX_TYPES = ['PPh 21', 'PPh 23', 'PPh Final UMKM (0.5%)', 'PPN', 'PPnBM'];

const taxSchema = z.object({
    period: z.string().min(1, 'Periode wajib diisi'),
    tax_type: z.string().min(1, 'Jenis pajak wajib diisi'),
    gross_amount: z.number().min(0, 'Omzet bruto tidak boleh negatif'),
    tax_amount: z.number().min(0, 'Jumlah pajak tidak boleh negatif'),
    status: z.enum(['draft', 'submitted', 'paid']),
    notes: z.string().optional(),
    due_date: z.string().optional(),
});

export default function TaxIndex({ reports }: Props) {
    const { t } = useTranslation();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('navigation.tax'), href: '/tax' }];

    const { data, setData, post, processing, errors, reset } = useForm({
        period: '',
        tax_type: 'PPh Final UMKM (0.5%)',
        gross_amount: 0,
        tax_amount: 0,
        status: 'draft',
        notes: '',
        due_date: '',
    });

    const calculateTax = () => {
        const rate = data.tax_type === 'PPh Final UMKM (0.5%)' ? 0.005 : data.tax_type === 'PPN' ? 0.11 : 0;
        if (rate > 0) setData('tax_amount', Math.round(data.gross_amount * rate));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = taxSchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                if (path === 'period') newErrors.period = t('tax.validation.periodRequired', 'Periode wajib diisi');
                else if (path === 'tax_type') newErrors.tax_type = t('tax.validation.taxTypeRequired', 'Jenis pajak wajib diisi');
                else if (path === 'gross_amount') newErrors.gross_amount = t('tax.validation.grossAmountMin', 'Omzet bruto tidak boleh negatif');
                else if (path === 'tax_amount') newErrors.tax_amount = t('tax.validation.taxAmountMin', 'Jumlah pajak tidak boleh negatif');
                else newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        post('/tax', {
            onSuccess: () => {
                reset();
                setIsAddOpen(false);
            },
        });
    };

    const displayError = (field: keyof typeof errors) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('tax.reports')} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">{t('tax.reports')}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">{t('tax.subtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/tax/consultation">{t('tax.consultation')}</Link>
                        </Button>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="inline-flex items-center gap-2 rounded-xl">
                                    <Plus size={16} /> {t('tax.newReport')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>{t('tax.dialogCreateTitle')}</DialogTitle>
                                        <DialogDescription>{t('tax.dialogCreateDesc')}</DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="period">{t('tax.period')}</Label>
                                                <Input
                                                    id="period"
                                                    type="text"
                                                    value={data.period}
                                                    onChange={(e) => setData('period', e.target.value)}
                                                    placeholder="2026-06"
                                                    className={displayError('period') ? 'border-rose-500' : ''}
                                                    required
                                                />
                                                {displayError('period') && <p className="text-xs text-rose-500">{displayError('period')}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <Label htmlFor="tax_type">{t('tax.taxType')}</Label>
                                                <Select value={data.tax_type} onValueChange={(val) => setData('tax_type', val)}>
                                                    <SelectTrigger id="tax_type" className="h-9 rounded-xl">
                                                        <SelectValue placeholder={t('tax.taxType')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TAX_TYPES.map((taxItem) => (
                                                            <SelectItem key={taxItem} value={taxItem}>
                                                                {taxItem}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="gross_amount">{t('tax.grossAmount')}</Label>
                                            <Input
                                                id="gross_amount"
                                                type="text"
                                                value={formatRupiah(data.gross_amount)}
                                                onChange={(e) => setData('gross_amount', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                                onBlur={calculateTax}
                                                className={displayError('gross_amount') ? 'border-rose-500' : ''}
                                                required
                                            />
                                            {displayError('gross_amount') && <p className="text-xs text-rose-500">{displayError('gross_amount')}</p>}
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="tax_amount">{t('tax.taxAmount')}</Label>
                                            <Input
                                                id="tax_amount"
                                                type="text"
                                                value={formatRupiah(data.tax_amount)}
                                                onChange={(e) => setData('tax_amount', parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                                className={displayError('tax_amount') ? 'border-rose-500' : ''}
                                                required
                                            />
                                            {displayError('tax_amount') && <p className="text-xs text-rose-500">{displayError('tax_amount')}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <Label htmlFor="status">{t('common.status')}</Label>
                                                <Select value={data.status} onValueChange={(val) => setData('status', val as any)}>
                                                    <SelectTrigger id="status" className="h-9 rounded-xl">
                                                        <SelectValue placeholder={t('common.status')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">{t('tax.status.draft')}</SelectItem>
                                                        <SelectItem value="submitted">{t('tax.status.submitted')}</SelectItem>
                                                        <SelectItem value="paid">{t('tax.status.paid')}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="flex flex-col justify-end space-y-1.5">
                                                <Label htmlFor="due_date" className="mb-0.5">
                                                    {t('tax.dueDate')}
                                                </Label>
                                                <DatePicker value={data.due_date} onChange={(val) => setData('due_date', val)} />
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddOpen(false);
                                                reset();
                                            }}
                                            className="rounded-xl"
                                        >
                                            {t('common.cancel')}
                                        </Button>
                                        <Button type="submit" disabled={processing} className="rounded-xl px-6">
                                            {processing ? t('common.saving') : t('common.save')}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Tax Info Banner */}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 dark:border-indigo-900/30 dark:bg-indigo-950/10">
                    <h2 className="font-semibold text-indigo-700 dark:text-indigo-400">{t('tax.infoBannerTitle')}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{t('tax.infoBannerDescText')}</p>
                </div>

                {/* Reports table */}
                <div className="space-y-4">
                    <DataTable columns={columns(t)} data={reports.data} />

                    {/* Pagination */}
                    {reports.last_page > 1 && (
                        <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                            <p className="text-muted-foreground text-sm">
                                {t('tax.paginationShowing', {
                                    from: (reports.current_page - 1) * reports.per_page + 1,
                                    to: Math.min(reports.current_page * reports.per_page, reports.total),
                                    total: reports.total,
                                    defaultValue: `Menampilkan ${(reports.current_page - 1) * reports.per_page + 1}–${Math.min(reports.current_page * reports.per_page, reports.total)} dari ${reports.total} laporan`,
                                })}
                            </p>
                            <div className="flex gap-1">
                                {reports.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className="h-8 rounded-lg px-3 text-xs"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
