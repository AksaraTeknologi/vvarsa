'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import { Button } from '@/components/ui/button';
import { formatDate, formatRupiah } from '@/lib/utils-mrp';
import { type Order } from '@/types/mrp';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Check, CheckCircle2, Clock, ShoppingBag, XCircle } from 'lucide-react';

const getStatusConfig = (status: string, t: (key: string, options?: any) => string) => {
    const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ElementType }> = {
        pending: { label: t('orders.pending'), color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
        processing: { label: t('orders.inProcess'), color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: ShoppingBag },
        done: { label: t('orders.completed'), color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle2 },
        cancelled: { label: t('orders.cancelled'), color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: XCircle },
    };
    return STATUS_MAP[status];
};

export const columns = (
    updateStatus: (order: Order, status: string) => void,
    cancelOrder: (order: Order) => void,
    openPayModal?: (order: Order) => void,
    t: (key: string, options?: any) => string = (k) => k,
): ColumnDef<Order>[] => [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="font-medium">{index}</div>;
        },
    },
    {
        accessorKey: 'order_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('orders.orderNumber')} />,
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div>
                    <div className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{order.order_number}</div>
                    <div className="text-muted-foreground mt-0.5 text-xs">{formatDate(order.ordered_at)}</div>
                </div>
            );
        },
    },
    {
        accessorKey: 'customer_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('orders.customer')} />,
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{order.customer_name}</div>
                    {order.customer_phone && <div className="text-muted-foreground mt-0.5 text-xs">{order.customer_phone}</div>}
                </div>
            );
        },
    },
    {
        accessorKey: 'items',
        header: t('orders.items'),
        cell: ({ row }) => {
            const order = row.original;
            return (
                <div className="flex max-w-xs flex-wrap gap-1">
                    {(order.items ?? []).map((item, i) => (
                        <span key={i} className="bg-muted rounded-full px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            {item.qty}× {item.variant_name}
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'total',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('common.total')} />,
        cell: ({ row }) => {
            const order = row.original;
            return <div className="text-right text-sm font-bold">{formatRupiah(Number(order.total))}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('orders.orderStatus')} />,
        cell: ({ row }) => {
            const order = row.original;
            const status = getStatusConfig(order.status, t);
            const StatusIcon = status?.icon;
            return status ? (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                    {StatusIcon && <StatusIcon size={11} />}
                    {status.label}
                </span>
            ) : null;
        },
    },
    {
        accessorKey: 'payment_status',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('orders.paymentStatus')} />,
        cell: ({ row }) => {
            const order = row.original;
            return order.payment_status === 'paid' ? (
                <div className="flex flex-col items-center gap-0.5">
                    <span className="bg-emerald-105 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Check size={10} />
                        {t('orders.paid')}
                    </span>
                    {order.payment_method && (
                        <span className="text-muted-foreground block max-w-[120px] truncate text-center text-[10px] font-medium">
                            {order.payment_method}
                        </span>
                    )}
                </div>
            ) : (
                <button
                    onClick={() => openPayModal?.(order)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border-none bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400"
                >
                    {t('orders.unpaid')}
                </button>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('common.actions')}</div>,
        cell: ({ row }) => {
            const order = row.original;
            const canCancel = order.payment_status === 'unpaid' && order.status !== 'cancelled';
            const canPay = order.payment_status === 'unpaid' && order.status !== 'cancelled';
            return (
                <div className="flex items-center justify-center gap-1.5">
                    <Button variant="ghost" size="sm" asChild className="h-8 rounded-lg px-2.5 text-xs">
                        <Link href={`/orders/${order.id}`}>{t('common.detail')}</Link>
                    </Button>

                    {canPay && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openPayModal?.(order)}
                            className="h-8 rounded-lg border-emerald-200 px-2.5 text-xs text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        >
                            {t('orders.markPaid')}
                        </Button>
                    )}

                    {order.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(order, 'processing')}
                            className="h-8 rounded-lg border-blue-200 px-2.5 text-xs text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                            {t('orders.process')}
                        </Button>
                    )}

                    {order.status === 'processing' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(order, 'done')}
                            className="h-8 rounded-lg border-emerald-200 px-2.5 text-xs text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                        >
                            {t('orders.markDone')}
                        </Button>
                    )}

                    {canCancel && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelOrder(order)}
                            className="h-8 rounded-lg px-2.5 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                            {t('orders.cancelOrder')}
                        </Button>
                    )}
                </div>
            );
        },
    },
];
