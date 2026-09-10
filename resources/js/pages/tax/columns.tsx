'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { formatDate, formatRupiah } from '@/lib/utils-mrp';
import { type TaxReport } from '@/types/mrp';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, FileText } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700 hover:bg-slate-150',
    submitted: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    paid: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
};

export const columns = (t: (key: string, options?: any) => string): ColumnDef<TaxReport>[] => [
    {
        accessorKey: 'period',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('tax.period')} />,
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-slate-100 p-1.5 text-slate-500">
                        <FileText size={16} />
                    </div>
                    <div className="text-foreground text-sm font-semibold">{row.original.period}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'tax_type',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('tax.taxType')} />,
        cell: ({ row }) => {
            return <span className="text-sm font-medium">{row.original.tax_type}</span>;
        },
    },
    {
        accessorKey: 'gross_amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('tax.grossAmountLabel')} />,
        cell: ({ row }) => {
            return <div className="text-right text-sm">{formatRupiah(row.original.gross_amount)}</div>;
        },
    },
    {
        accessorKey: 'tax_amount',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('tax.taxAmountLabel')} />,
        cell: ({ row }) => {
            return <div className="text-foreground text-right text-sm font-bold">{formatRupiah(row.original.tax_amount)}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.status')} />,
        cell: ({ row }) => {
            const status = row.original.status;
            const statusLabel =
                status === 'draft'
                    ? t('tax.status.draft')
                    : status === 'submitted'
                      ? t('tax.status.submitted')
                      : status === 'paid'
                        ? t('tax.status.paid')
                        : status;
            return (
                <div className="text-center">
                    <Badge variant="outline" className={`border-transparent capitalize ${STATUS_STYLES[status]}`}>
                        {statusLabel}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: 'due_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('tax.dueDate')} />,
        cell: ({ row }) => {
            const dueDate = row.original.due_date;
            return (
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                    <Calendar size={14} className="opacity-60" />
                    <span>{dueDate ? formatDate(dueDate, { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
                </div>
            );
        },
    },
];
