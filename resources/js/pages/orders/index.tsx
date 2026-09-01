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
import { columns } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pesanan', href: '/orders' }];

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
    const [showPayModal, setShowPayModal] = useState<Order | null>(null);
    const [payData, setPayDataState] = useState({ payment_method: '' });
    const setPayData = (field: string, value: string) => setPayDataState((prev) => ({ ...prev, [field]: value }));

    const applyFilter = (key: string, value: string) => {
        router.get('/orders', { ...filters, [key]: value === 'all' ? undefined : value }, { preserveState: true });
    };

    const updateStatus = (order: Order, status: string) => {
        handleAsyncAction(() => routerPromise('patch', `/orders/${order.id}/status`, { status }), {
            loading: 'Memperbarui status pesanan...',
            success: 'Status pesanan berhasil diperbarui!',
            error: 'Gagal Memperbarui Status',
        });
    };

    const cancelOrder = (order: Order) => {
        if (!confirm(`Batalkan pesanan ${order.order_number}?`)) return;
        handleAsyncAction(() => routerPromise('delete', `/orders/${order.id}`), {
            loading: 'Membatalkan pesanan...',
            success: 'Pesanan berhasil dibatalkan!',
            error: 'Gagal Membatalkan Pesanan',
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
                loading: 'Memproses pembayaran...',
                success: 'Pesanan berhasil ditandai lunas!',
                error: 'Gagal Memproses Pembayaran',
            },
        );
    };

    const tableColumns = columns(updateStatus, cancelOrder, openPayModal);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pesanan" />

            <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                            <ClipboardList className="text-indigo-500" size={26} />
                            Daftar Pesanan
                        </h1>
                        <p className="text-muted-foreground mt-0.5 text-sm">Kelola pesanan masuk & status pembayaran</p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" className="gap-1.5 rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                            <Link href="/pos">
                                <ShoppingBag size={15} />
                                POS Kasir
                            </Link>
                        </Button>
                        <Button asChild className="gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                            <Link href="/orders/create">
                                <PlusCircle size={16} />
                                Buat Pesanan
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Order Summary */}
                {summary.length > 0 && (
                    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 dark:border-indigo-800 dark:from-indigo-900/20 dark:to-violet-900/20">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertCircle size={15} className="text-indigo-500" />
                            <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Ringkasan Produksi — Pesanan Aktif</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {summary.map((item) => (
                                <div
                                    key={item.variant_id ?? item.variant_name}
                                    className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 shadow-sm dark:border-indigo-800 dark:bg-indigo-900/40"
                                >
                                    <span className="text-lg leading-none font-semibold text-indigo-700 dark:text-indigo-300">{item.total_qty}×</span>
                                    <span className="text-foreground text-sm">{item.variant_name}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-muted-foreground mt-2 text-xs">
                            Total per varian dari semua pesanan pending & diproses yang belum selesai
                        </p>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <Select value={filters.status ?? 'all'} onValueChange={(v) => applyFilter('status', v)}>
                        <SelectTrigger className="h-9 w-40 rounded-xl text-sm">
                            <SelectValue placeholder="Semua Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Diproses</SelectItem>
                            <SelectItem value="done">Selesai</SelectItem>
                            <SelectItem value="cancelled">Dibatalkan</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.payment_status ?? 'all'} onValueChange={(v) => applyFilter('payment_status', v)}>
                        <SelectTrigger className="h-9 w-44 rounded-xl text-sm">
                            <SelectValue placeholder="Semua Pembayaran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Pembayaran</SelectItem>
                            <SelectItem value="unpaid">Belum Dibayar</SelectItem>
                            <SelectItem value="paid">Lunas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                {orders.data.length === 0 ? (
                    <div className="bg-card border-border flex flex-col items-center justify-center overflow-hidden rounded-2xl border py-16 text-center shadow-sm">
                        <ClipboardList size={40} className="text-muted-foreground mb-3 opacity-40" />
                        <p className="text-muted-foreground font-medium">Belum ada pesanan</p>
                        <Button asChild className="mt-4 rounded-xl" variant="outline">
                            <Link href="/orders/create">+ Buat Pesanan Pertama</Link>
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
                        <h2 className="mb-1 text-lg font-bold">Tandai Pesanan Lunas</h2>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Total: <span className="text-foreground font-semibold">{formatRupiah(Number(showPayModal.total))}</span>
                        </p>
                        <form onSubmit={handleMarkPaid} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Metode Pembayaran</label>
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
                                                              ? 'border-indigo-600 bg-indigo-600 text-white'
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
                                              { key: 'cash', label: 'Tunai', icon: Banknote },
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
                                                              ? 'border-indigo-600 bg-indigo-600 text-white'
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
                                    Batal
                                </Button>
                                <Button type="submit" className="flex-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                                    Konfirmasi Lunas
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
