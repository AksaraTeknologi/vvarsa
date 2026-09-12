import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type Order, type OrderSummaryItem, type PaginatedData } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, Banknote, ClipboardList, CreditCard, PlusCircle, ShoppingBag, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { columns } from './columns';
import { DataTable } from './data-table';

interface PaymentMethod {
    id: number;
    name: string;
    account_name: string | null;
    account_number: string | null;
    is_active: boolean;
}

interface Props {
    orders: PaginatedData<Order>;
    summary: OrderSummaryItem[];
    filters: { status?: string; payment_status?: string; from?: string; to?: string };
    paymentMethods: PaymentMethod[];
}

export default function OrdersIndex({ orders, summary, filters, paymentMethods = [] }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('navigation.orders'), href: '/orders' }];

    const [showPayModal, setShowPayModal] = useState<Order | null>(null);
    const [payData, setPayDataState] = useState({ payment_method: '' });
    const setPayData = (field: string, value: string) => setPayDataState((prev) => ({ ...prev, [field]: value }));

    const applyFilter = (key: string, value: string) => {
        router.get('/orders', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const updateStatus = (order: Order, status: string) => {
        handleAsyncAction(() => routerPromise('patch', `/orders/${order.id}/status`, { status }), {
            loading: t('orders.updatingStatus'),
            success: t('orders.statusUpdated'),
            error: t('orders.statusUpdateFailed'),
        });
    };

    const cancelOrder = (order: Order) => {
        if (!confirm(t('orders.cancelConfirm', { number: order.order_number }))) return;
        handleAsyncAction(() => routerPromise('delete', `/orders/${order.id}`), {
            loading: t('orders.cancellingOrder'),
            success: t('orders.orderCancelled'),
            error: t('orders.orderCancelFailed'),
        });
    };

    const openPayModal = (order: Order) => {
        const defaultPayment =
            paymentMethods.length > 0
                ? paymentMethods[0].account_number
                    ? `${paymentMethods[0].name} (${paymentMethods[0].account_number})`
                    : paymentMethods[0].name
                : 'Tunai (Cash)';

        setPayData('payment_method', defaultPayment);
        setShowPayModal(order);
    };

    const handleMarkPaid = (e: React.FormEvent) => {
        e.preventDefault();
        if (!showPayModal) return;
        handleAsyncAction(
            () =>
                routerPromise(
                    'patch',
                    `/orders/${showPayModal.id}/pay`,
                    { payment_method: payData.payment_method },
                    {
                        preserveScroll: true,
                        onSuccess: () => setShowPayModal(null),
                    },
                ),
            {
                loading: t('orders.processingPayment'),
                success: t('orders.paidSuccess'),
                error: t('orders.paymentFailed'),
            },
        );
    };

    const tableColumns = columns(updateStatus, cancelOrder, openPayModal, t);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('navigation.orders')} />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            <ClipboardList className="text-[#3f9567]" size={22} />
                            {t('orders.listTitle')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('orders.subtitle')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="gap-1.5 rounded-xl border-[#c7e0ce] text-[#3f9567] hover:bg-[#edf8f1]">
                            <Link href="/pos">
                                <ShoppingBag size={15} />
                                {t('orders.posButton')}
                            </Link>
                        </Button>
                        <Button asChild variant="owner" className="gap-1.5 rounded-xl">
                            <Link href="/orders/create">
                                <PlusCircle size={16} />
                                {t('orders.createOrder')}
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                {summary.length > 0 && (
                    <div className="rounded-2xl border border-[#c7e0ce] bg-[#edf8f1] p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertCircle size={15} className="text-[#3f9567]" />
                            <span className="text-sm font-semibold text-[#315d45]">{t('orders.productionSummary')}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {summary.map((item) => (
                                <div
                                    key={item.variant_id ?? item.variant_name}
                                    className="flex items-center gap-2 rounded-xl border border-[#d4e8da] bg-white px-3 py-2 shadow-sm"
                                >
                                    <span className="text-lg leading-none font-semibold text-[#3f9567]">{item.total_qty}×</span>
                                    <span className="text-foreground text-sm">{item.variant_name}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs">
                            {t('orders.productionSummaryHint')}
                        </p>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <Select value={filters.status ?? 'all'} onValueChange={(v) => applyFilter('status', v)}>
                        <SelectTrigger className="h-9 w-40 rounded-xl text-sm">
                            <SelectValue placeholder={t('orders.allStatuses')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('orders.allStatuses')}</SelectItem>
                            <SelectItem value="pending">{t('orders.pending')}</SelectItem>
                            <SelectItem value="processing">{t('orders.inProcess')}</SelectItem>
                            <SelectItem value="done">{t('orders.completed')}</SelectItem>
                            <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.payment_status ?? 'all'} onValueChange={(v) => applyFilter('payment_status', v)}>
                        <SelectTrigger className="h-9 w-44 rounded-xl text-sm">
                            <SelectValue placeholder={t('orders.allPayments')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('orders.allPayments')}</SelectItem>
                            <SelectItem value="unpaid">{t('orders.unpaid')}</SelectItem>
                            <SelectItem value="paid">{t('orders.paid')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {orders.data.length === 0 ? (
                    <div className="bg-card border-border flex flex-col items-center justify-center overflow-hidden rounded-2xl border py-16 text-center shadow-sm">
                        <ClipboardList size={40} className="text-muted-foreground mb-3 opacity-40" />
                        <p className="text-muted-foreground font-medium">{t('orders.noOrders')}</p>
                        <Button asChild className="mt-4 rounded-xl" variant="outline">
                            <Link href="/orders/create">{t('orders.createFirstOrder')}</Link>
                        </Button>
                    </div>
                ) : (
                    <DataTable columns={tableColumns} data={orders.data} />
                )}

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {orders.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className="h-8 rounded-lg px-3 text-xs"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Modal Tandai Lunas ── */}
            {showPayModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-card border-border text-foreground w-full max-w-sm rounded-2xl border p-6 shadow-xl">
                        <h2 className="mb-1 text-lg font-bold">{t('orders.markPaidTitle')}</h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            {t('common.total')}: <span className="text-foreground font-semibold">{formatRupiah(Number(showPayModal.total))}</span>
                        </p>
                        <form onSubmit={handleMarkPaid} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('pos.paymentMethod')}</label>
                                <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
                                    {paymentMethods.length > 0
                                        ? paymentMethods.map((pm) => {
                                              const lowerName = pm.name.toLowerCase();
                                              const Icon =
                                                  lowerName.includes('tunai') || lowerName.includes('cash')
                                                      ? Banknote
                                                      : lowerName.includes('qris') ||
                                                          lowerName.includes('shopee') ||
                                                          lowerName.includes('gopay') ||
                                                          lowerName.includes('ovo') ||
                                                          lowerName.includes('wallet')
                                                        ? Smartphone
                                                        : CreditCard;

                                              const value = pm.account_number ? `${pm.name} (${pm.account_number})` : pm.name;

                                              return (
                                                  <button
                                                      key={pm.id}
                                                      type="button"
                                                      onClick={() => setPayData('payment_method', value)}
                                                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                                                          payData.payment_method === value
                                                              ? 'border-[#3f9567] bg-[#3f9567] text-white'
                                                              : 'bg-muted hover:bg-muted/80 border-border'
                                                      }`}
                                                  >
                                                      <Icon size={16} />
                                                      <span className="line-clamp-1">{pm.name}</span>
                                                      {pm.account_number && (
                                                          <span className="block max-w-full truncate font-mono text-[10px] opacity-80">
                                                              {pm.account_number}
                                                          </span>
                                                      )}
                                                  </button>
                                              );
                                          })
                                        : [
                                              { key: 'cash', label: t('pos.cash'), icon: Banknote },
                                              { key: 'transfer', label: 'Transfer', icon: CreditCard },
                                              { key: 'qris', label: 'QRIS', icon: Smartphone },
                                          ].map((method) => {
                                              const Icon = method.icon;
                                              return (
                                                  <button
                                                      key={method.key}
                                                      type="button"
                                                      onClick={() => setPayData('payment_method', method.key)}
                                                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                                                          payData.payment_method === method.key
                                                              ? 'border-[#3f9567] bg-[#3f9567] text-white'
                                                              : 'bg-muted hover:bg-muted/80 border-border'
                                                      }`}
                                                  >
                                                      <Icon size={18} />
                                                      {method.label}
                                                  </button>
                                              );
                                          })}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setShowPayModal(null)}>
                                    {t('common.cancel')}
                                </Button>
                                <Button type="submit" className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                                    {t('orders.confirmPaid')}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
