import DeleteConfirmDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah, getCurrencySymbol } from '@/lib/utils-mrp';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type ProductVariant } from '@/types/mrp';
import { Head, usePage } from '@inertiajs/react';
import {
    Banknote,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    CreditCard,
    Loader2,
    Mail,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.orders', href: '/orders' },
    { title: 'navigation.pos', href: '/pos' },
];

interface PackageModel {
    id: number;
    name: string;
    capacity: number;
    price: string | number;
    is_active: boolean;
    description: string | null;
    variants?: ProductVariant[];
}

interface CartItem {
    id: number; // key unik tiap baris cart
    package_id: number; // id paket dari database (atau 0 jika direct variant)
    name: string;
    isi: number;
    harga: number;
    quantities: Record<string | number, number>; // variant_id -> qty
}

interface PaymentMethod {
    id: number;
    name: string;
    account_name: string | null;
    account_number: string | null;
    is_active: boolean;
}

interface Props {
    variants: (ProductVariant & { hpp: number; margin: number; profit: number })[];
    packages: PackageModel[];
    paymentMethods: PaymentMethod[];
}

export default function PosPage({ variants, packages, paymentMethods = [] }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const isOwner = auth.user?.roles?.includes('owner') ?? false;
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCartItemId, setActiveCartItemId] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [notes, setNotes] = useState('');

    // Status pesanan: default 'done' (Selesai), opsi: 'pending' (Menunggu), 'processing' (Diproses)
    const [orderStatus, setOrderStatus] = useState<'done' | 'processing' | 'pending'>('done');

    // Diskon state: 'nominal' (Rp) atau 'percent' (%)
    const [discountType, setDiscountType] = useState<'nominal' | 'percent'>('nominal');
    const [discountInput, setDiscountInput] = useState<string>('');

    // Mobile & UI states
    const [mobileCartOpen, setMobileCartOpen] = useState(false);
    const [showCustomerFields, setShowCustomerFields] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const defaultPayment =
        paymentMethods.length > 0
            ? paymentMethods[0].account_number
                ? `${paymentMethods[0].name} (${paymentMethods[0].account_number})`
                : paymentMethods[0].name
            : 'Tunai (Cash)';

    const [paymentMethod, setPaymentMethod] = useState(defaultPayment);
    const isCash = paymentMethod.toLowerCase().includes('tunai') || paymentMethod.toLowerCase().includes('cash');

    const [cashReceived, setCashReceived] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [successOrder, setSuccessOrder] = useState<string | null>(null);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [lastOrderEmail, setLastOrderEmail] = useState<string | null>(null);
    const [lastCashReceived, setLastCashReceived] = useState<number | null>(null);
    const [lastChange, setLastChange] = useState<number | null>(null);
    const [lastOrderStatus, setLastOrderStatus] = useState<string | null>(null);
    const [sendingReceipt, setSendingReceipt] = useState(false);
    const [receiptSent, setReceiptSent] = useState(false);

    // Helper: Find variant by ID (supports string/UUID and numbers)
    const findVariant = (vId: string | number, packageId?: number) => {
        let v = variants.find((vv) => String(vv.id) === String(vId));
        if (!v && packageId && packageId > 0) {
            const pkg = packages.find((p) => String(p.id) === String(packageId));
            if (pkg?.variants) {
                v = pkg.variants.find((vv) => String(vv.id) === String(vId)) as any;
            }
        }
        return v;
    };

    // Auto select next active item if current one is removed
    useEffect(() => {
        if (cart.length === 0) {
            setActiveCartItemId(null);
            return;
        }
        if (activeCartItemId !== null && !cart.some((item) => item.id === activeCartItemId)) {
            // Only set next active item if there are package items
            const packageItems = cart.filter((item) => item.package_id > 0);
            if (packageItems.length > 0) {
                setActiveCartItemId(packageItems[packageItems.length - 1].id);
            } else {
                setActiveCartItemId(null);
            }
        }
    }, [cart, activeCartItemId]);

    // Format Rupiah inside input/display
    const formatInputRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID').format(val);
    };

    // Calculate subtotal & HPP
    const subtotal = cart.reduce((sum, item) => sum + item.harga, 0);

    // Calculate discount amount
    const parsedDiscount = parseFloat(discountInput) || 0;
    const discountAmount =
        subtotal > 0
            ? discountType === 'percent'
                ? Math.min(subtotal, Math.round((subtotal * Math.min(100, Math.max(0, parsedDiscount))) / 100))
                : Math.min(subtotal, Math.max(0, parsedDiscount))
            : 0;

    const finalTotal = Math.max(0, subtotal - discountAmount);

    const getCartItemHpp = (item: CartItem) => {
        let total = 0;
        Object.entries(item.quantities).forEach(([vId, qty]) => {
            const v = findVariant(vId, item.package_id);
            if (v) {
                total += (v.hpp ?? 0) * qty;
            }
        });
        return total;
    };

    const getVariantSummary = (item: CartItem) => {
        const selected = Object.entries(item.quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([vId, qty]) => {
                const v = findVariant(vId, item.package_id);
                const name = v ? v.name.replace('Mochi ', '') : `Varian #${vId}`;
                return `${qty}x ${name}`;
            });

        if (selected.length === 0) return t('orders.noFlavorSelected');
        return selected.join(', ');
    };

    const totalHpp = cart.reduce((sum, item) => sum + getCartItemHpp(item), 0);
    const change = cashReceived - finalTotal;

    // Check if all packages in cart are full
    const isCartComplete =
        cart.length > 0 &&
        cart.every((item) => {
            if (item.package_id === 0) return true; // Direct variant is always complete
            const selectedQty = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
            return selectedQty === item.isi;
        });

    // Package & Cart derived status
    const packageCartItems = cart.filter((item) => item.package_id > 0);
    const activePackageItem = cart.find((c) => c.id === activeCartItemId);
    const activePackageTotal = activePackageItem ? Object.values(activePackageItem.quantities).reduce((sum, q) => sum + q, 0) : 0;
    const activePackageRemaining = activePackageItem ? Math.max(0, activePackageItem.isi - activePackageTotal) : 0;

    const cartItemCount = packages.length > 0 ? cart.length : cart.reduce((s, i) => s + (i.quantities[Object.keys(i.quantities)[0]] ?? 0), 0);

    const filteredVariants = variants.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const addPackageToCart = (pkg: PackageModel) => {
        const allowed = pkg.variants && pkg.variants.length > 0 ? pkg.variants : variants.filter((v) => Number(v.recipe_qty) === 1);

        const initialQuantities: Record<string | number, number> = {};
        allowed.forEach((v) => {
            initialQuantities[v.id] = 0;
        });

        const newId = Date.now() + Math.random();

        setCart((prev) => [
            ...prev,
            {
                id: newId,
                package_id: pkg.id,
                name: pkg.name,
                isi: pkg.capacity,
                harga: Number(pkg.price),
                quantities: initialQuantities,
            },
        ]);
        setActiveCartItemId(newId);
    };

    const handleVariantClick = (variant: (typeof variants)[number]) => {
        if (packages.length > 0) {
            // Package-based mode: User must select a package first
            let targetItemIdx = -1;
            if (activeCartItemId !== null) {
                targetItemIdx = cart.findIndex((item) => item.id === activeCartItemId);
            }

            if (targetItemIdx >= 0) {
                const item = cart[targetItemIdx];
                const currentTotal = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
                if (currentTotal < item.isi) {
                    setCart((prev) =>
                        prev.map((c, idx) => {
                            if (idx !== targetItemIdx) return c;
                            return {
                                ...c,
                                quantities: {
                                    ...c.quantities,
                                    [variant.id]: (c.quantities[variant.id] ?? 0) + 1,
                                },
                            };
                        }),
                    );
                } else {
                    toast.warning(t('pos.packageFullNotice'));
                }
            } else {
                toast.warning(t('pos.selectPackageNotice'));
            }
        } else {
            // Direct mode: No packages exist, direct add variant
            setCart((prev) => {
                const existingIdx = prev.findIndex((item) => item.package_id === 0 && item.quantities[variant.id] !== undefined);
                if (existingIdx >= 0) {
                    const updated = [...prev];
                    const item = updated[existingIdx];
                    const newQty = (item.quantities[variant.id] ?? 0) + 1;
                    updated[existingIdx] = {
                        ...item,
                        harga: Number(variant.sell_price) * newQty,
                        quantities: {
                            [variant.id]: newQty,
                        },
                    };
                    return updated;
                } else {
                    const newId = Date.now() + Math.random();
                    return [
                        ...prev,
                        {
                            id: newId,
                            package_id: 0,
                            name: variant.name,
                            isi: 1,
                            harga: Number(variant.sell_price),
                            quantities: {
                                [variant.id]: 1,
                            },
                        },
                    ];
                }
            });
        }
    };

    const adjustQty = (cartId: number, variantId: string | number, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id !== cartId) return item;

                const currentQty = item.quantities[variantId] ?? 0;
                const newQty = currentQty + delta;
                if (newQty < 0) return item;

                const currentTotal = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
                if (delta > 0 && currentTotal >= item.isi) return item;

                return {
                    ...item,
                    quantities: {
                        ...item.quantities,
                        [variantId]: newQty,
                    },
                };
            }),
        );
    };

    const removeVariantFromPackage = (cartId: number, variantId: string | number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.id !== cartId) return item;
                return {
                    ...item,
                    quantities: {
                        ...item.quantities,
                        [variantId]: 0,
                    },
                };
            }),
        );
    };

    const adjustDirectQty = (cartId: number, variantId: string | number, delta: number) => {
        setCart((prev) => {
            const updated = prev.map((item) => {
                if (item.id !== cartId) return item;
                const v = findVariant(variantId);
                if (!v) return item;
                const currentQty = item.quantities[variantId] ?? 0;
                const newQty = currentQty + delta;
                if (newQty <= 0) return item;
                return {
                    ...item,
                    harga: Number(v.sell_price) * newQty,
                    quantities: {
                        [variantId]: newQty,
                    },
                };
            });
            return updated.filter((item) => {
                const vId = Object.keys(item.quantities)[0];
                return (item.quantities[vId] ?? 0) > 0;
            });
        });
    };

    const removeItem = (cartId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== cartId));
    };

    const clearCart = () => {
        setCart([]);
        setActiveCartItemId(null);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setNotes('');
        setOrderStatus('done');
        setDiscountType('nominal');
        setDiscountInput('');
        setCashReceived(0);
        setSuccessOrder(null);
        setLastOrderId(null);
        setLastOrderEmail(null);
        setLastCashReceived(null);
        setLastChange(null);
        setLastOrderStatus(null);
        setReceiptSent(false);
        setSendingReceipt(false);
        setShowCustomerFields(false);
        setSearchQuery('');
    };

    const handleCheckout = () => {
        if (cart.length === 0 || !isCartComplete) return;

        if (isCash && cashReceived < finalTotal) {
            toast.error(
                t('pos.insufficientCashToast', {
                    cash: formatRupiah(cashReceived),
                    total: formatRupiah(finalTotal),
                    defaultValue: `Uang diterima (${formatRupiah(cashReceived)}) kurang dari total belanja (${formatRupiah(finalTotal)})!`,
                }),
            );
            return;
        }

        setProcessing(true);

        const items = cart.flatMap((item) => {
            const result: { variant_id: string | number; qty: number; paket_isi: number; paket_harga: number }[] = [];
            Object.entries(item.quantities).forEach(([vId, qty]) => {
                for (let i = 0; i < qty; i++) {
                    result.push({
                        variant_id: vId,
                        qty: 1,
                        paket_isi: item.isi,
                        paket_harga: item.package_id === 0 ? item.harga / qty : item.harga,
                    });
                }
            });
            return result;
        });

        const calculatedChange = isCash ? Math.max(0, cashReceived - finalTotal) : 0;
        const sentCashReceived = isCash ? cashReceived : 0;
        const currentStatus = orderStatus;

        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/orders',
                    {
                        customer_name: customerName.trim() || t('pos.generalCustomer', 'Pelanggan Umum'),
                        customer_phone: customerPhone,
                        customer_email: customerEmail,
                        status: currentStatus,
                        discount: discountAmount,
                        cash_received: sentCashReceived,
                        change_amount: calculatedChange,
                        notes: notes,
                        payment_method: paymentMethod,
                        items: items,
                    },
                    {
                        onSuccess: (page: any) => {
                            setProcessing(false);
                            const flash = (page.props as any).flash;
                            setSuccessOrder(flash?.success ?? 'Pesanan berhasil dibuat!');
                            setLastOrderId(flash?.last_order_id ?? null);
                            setLastOrderEmail(flash?.last_order_email ?? null);
                            setLastCashReceived(sentCashReceived);
                            setLastChange(calculatedChange);
                            setLastOrderStatus(currentStatus);
                            setReceiptSent(false);
                        },
                        onError: () => setProcessing(false),
                    },
                ),
            {
                loading: 'Memproses pesanan...',
                success: 'Pesanan berhasil dibuat!',
                error: 'Gagal Membuat Pesanan',
            },
        ).finally(() => setProcessing(false));
    };

    const handleSendReceipt = async () => {
        if (!lastOrderId || sendingReceipt || receiptSent) return;
        setSendingReceipt(true);

        // Baca XSRF-TOKEN dari cookie yang di-set otomatis oleh Laravel
        const xsrfToken = decodeURIComponent(
            document.cookie
                .split('; ')
                .find((row) => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );

        try {
            const res = await fetch(`/orders/${lastOrderId}/send-receipt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrfToken,
                    Accept: 'application/json',
                },
            });
            const data = await res.json();
            if (data.success) {
                setReceiptSent(true);
                toast.success(data.message ?? 'Struk berhasil dikirim!');
            } else {
                toast.error(data.message ?? 'Gagal mengirim struk.');
            }
        } catch {
            toast.error('Terjadi kesalahan saat mengirim struk.');
        } finally {
            setSendingReceipt(false);
        }
    };

    // Shared Cart & Checkout Content for Desktop Sidebar & Mobile Sheet
    const renderCartContent = (options?: { isMobile?: boolean; onClose?: () => void }) => {
        const isCustomerActive = showCustomerFields || Boolean(customerName || customerPhone || customerEmail || notes);

        return (
            <div className="pos-cart-content flex h-full min-h-0 w-full flex-col bg-white">
                {/* Cart Header */}
                <div className="border-border relative flex shrink-0 items-center justify-between border-b bg-white px-4 py-3.5 sm:px-5 sm:py-4">
                    <h2 className="text-foreground flex items-center gap-3 text-xs font-semibold">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-[#e8f6ed] text-[#3f9567] shadow-[inset_0_0_0_1px_#c7e0ce]">
                            <ShoppingCart size={17} />
                        </span>
                        <span className="flex flex-col gap-0.5">
                            <span className="text-xs leading-tight font-bold">{t('pos.cart')}</span>
                            <span className="text-[10px] font-medium tracking-[0.08em] text-[#718178] uppercase">{t('pos.cartTitle')}</span>
                        </span>
                        {cart.length > 0 && (
                            <span className="rounded-full border border-[#c7e0ce] bg-[#f4faf6] px-2 py-1 text-xs font-bold text-[#3f9567]">
                                {packages.length > 0 ? t('pos.packageCount', { count: cart.length }) : t('pos.itemCount', { count: cartItemCount })}
                            </span>
                        )}
                    </h2>
                    <div className={`flex items-center gap-2 ${options?.isMobile ? 'mr-9' : ''}`}>
                        {cart.length > 0 && !successOrder && (
                            <DeleteConfirmDialog
                                trigger={
                                    <button
                                        type="button"
                                        className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 px-2.5 py-1 text-xs font-semibold text-rose-600 shadow-2xs transition-all hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 active:scale-95 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                                    >
                                        <Trash2 size={12} className="shrink-0 text-rose-500" />
                                        <span>{t('pos.clear')}</span>
                                    </button>
                                }
                                title={t('pos.confirmClearTitle')}
                                description={t('pos.confirmClearDesc')}
                                itemName={
                                    packages.length > 0
                                        ? `${t('pos.packageCount', { count: cart.length })} (${formatRupiah(subtotal)})`
                                        : `${t('pos.itemCount', { count: cartItemCount })} (${formatRupiah(subtotal)})`
                                }
                                onConfirm={clearCart}
                            />
                        )}
                    </div>
                </div>

                {/* State A: Order Success View */}
                {successOrder ? (
                    <div className="bg-card flex min-h-0 flex-1 flex-col justify-between overflow-y-auto overscroll-contain scroll-auto p-4 sm:p-6">
                        <div className="space-y-5">
                            <div className="space-y-2 pt-2 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c7e0ce] bg-[#f4faf6] text-[#3f9567] shadow-sm">
                                    <Check size={28} className="stroke-[2.5]" />
                                </div>
                                <h3 className="text-foreground text-lg font-bold">{t('pos.orderSuccess')}</h3>
                                <p className="text-muted-foreground text-xs">{successOrder}</p>
                                {lastOrderStatus && (
                                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                        {t('common.status')}:{' '}
                                        {lastOrderStatus === 'done'
                                            ? t('pos.statusDone')
                                            : lastOrderStatus === 'processing'
                                              ? t('pos.statusProcessing')
                                              : t('pos.statusPending')}
                                    </div>
                                )}
                            </div>

                            {/* Ringkasan Pembayaran Kasir */}
                            {lastCashReceived !== null && lastCashReceived > 0 && (
                                <div className="bg-card space-y-2 rounded-2xl border border-emerald-200 p-3.5 text-xs shadow-xs dark:border-emerald-800">
                                    <div className="text-muted-foreground flex justify-between">
                                        <span>{t('pos.cashReceived')}</span>
                                        <span className="text-foreground font-semibold">{formatRupiah(lastCashReceived)}</span>
                                    </div>
                                    <div className="border-border/50 flex justify-between border-t pt-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                        <span>{t('pos.change')}</span>
                                        <span>{formatRupiah(lastChange ?? 0)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Send Receipt Section */}
                            {lastOrderId && lastOrderEmail && (
                                <div className="bg-card space-y-3 rounded-2xl border border-emerald-200 p-4 shadow-xs dark:border-emerald-800">
                                    <div className="space-y-1">
                                        <Label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                                            <Mail size={14} className="text-[#3f9567]" />
                                            {t('pos.digitalReceipt')}
                                        </Label>
                                        <p className="text-muted-foreground text-xs">{t('pos.sendReceiptTo', { email: lastOrderEmail })}</p>
                                    </div>
                                    <button
                                        type="button"
                                        id="send-receipt-btn"
                                        onClick={handleSendReceipt}
                                        disabled={sendingReceipt || receiptSent}
                                        className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all ${
                                            receiptSent
                                                ? 'cursor-default border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                                                : 'bg-[#3f9567] text-white hover:bg-[#327d55] disabled:opacity-60'
                                        }`}
                                    >
                                        {sendingReceipt ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" /> {t('pos.sendingReceipt')}
                                            </>
                                        ) : receiptSent ? (
                                            <>
                                                <Check size={14} /> {t('pos.receiptSent')}
                                            </>
                                        ) : (
                                            <>
                                                <Mail size={14} /> {t('pos.sendReceipt')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Download PDF Receipt Link */}
                            {lastOrderId && (
                                <a
                                    href={`/orders/${lastOrderId}/receipt`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#c7e0ce] px-4 py-2.5 text-xs font-semibold text-[#3f9567] shadow-xs transition-all hover:bg-[#edf8f1]"
                                >
                                    <Package size={14} /> {t('pos.downloadPdf')}
                                </a>
                            )}
                        </div>

                        {/* New Order Button */}
                        <div className="border-border mt-4 border-t pt-4">
                            <Button
                                type="button"
                                id="new-order-btn"
                                onClick={() => {
                                    clearCart();
                                    if (options?.onClose) options.onClose();
                                }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-xs"
                            >
                                <ShoppingCart size={16} /> {t('pos.newTransaction')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* State B: Scrollable Cart & Checkout Items */}
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain scroll-auto bg-white p-3.5 sm:p-4">
                            {cart.length === 0 ? (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center text-sm">
                                    <div className="bg-muted/60 mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                                        <ShoppingCart size={22} className="opacity-40" />
                                    </div>
                                    <span className="text-foreground font-semibold">{t('pos.emptyCart')}</span>
                                    <span className="text-muted-foreground mt-1 max-w-[15rem] text-xs">
                                        {packages.length > 0 ? t('orders.selectPackageFirst') : t('orders.selectFlavorFirst')}
                                    </span>
                                    {options?.isMobile && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={options.onClose}
                                            className="mt-4 cursor-pointer rounded-xl text-xs"
                                        >
                                            {t('orders.selectFlavorTitle')}
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Items List */}
                                    <div className="space-y-3">
                                        {cart.map((item) => {
                                            if (item.package_id === 0) {
                                                // Direct variant item layout
                                                const variantId = Object.keys(item.quantities)[0];
                                                const qty = item.quantities[variantId];
                                                const v = findVariant(variantId);
                                                if (!v) return null;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex flex-col gap-2.5 overflow-hidden rounded-2xl border-2 border-[#d9e0dc] bg-white p-3.5 shadow-[0_2px_8px_rgb(31_42_35_/_0.06)]"
                                                    >
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <div className="text-foreground truncate text-xs font-semibold">
                                                                    {v.name.replace('Mochi ', '')}
                                                                </div>
                                                                <div className="text-muted-foreground mt-0.5 text-xs">
                                                                    {formatRupiah(Number(v.sell_price))}/pcs
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeItem(item.id);
                                                                }}
                                                                className="shrink-0 cursor-pointer p-1 text-rose-400 transition-colors hover:text-rose-600"
                                                                title={t('pos.removeItem', 'Hapus item')}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        adjustDirectQty(item.id, variantId, -1);
                                                                    }}
                                                                    className="bg-muted hover:bg-muted/80 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-xs font-bold"
                                                                >
                                                                    <Minus size={12} />
                                                                </button>
                                                                <span className="w-8 text-center text-xs font-bold">{qty}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        adjustDirectQty(item.id, variantId, 1);
                                                                    }}
                                                                    className="bg-muted hover:bg-muted/80 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-xs font-bold"
                                                                >
                                                                    <Plus size={12} />
                                                                </button>
                                                            </div>
                                                            <div className="text-foreground text-xs font-bold">{formatRupiah(item.harga)}</div>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // Package item layout
                                            const totalSelected = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
                                            const isComplete = totalSelected === item.isi;
                                            const isActive = item.id === activeCartItemId;

                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setActiveCartItemId(item.id)}
                                                    className={`flex cursor-pointer flex-col gap-2.5 overflow-hidden rounded-2xl border-2 p-3.5 shadow-[0_2px_8px_rgb(31_42_35_/_0.06)] transition-all ${
                                                        isActive
                                                            ? 'border-[#76b58e] bg-[#f7fbf8]'
                                                            : 'border-[#d9e0dc] bg-white hover:border-[#a9cdb4] hover:shadow-[0_4px_12px_rgb(31_42_35_/_0.09)]'
                                                    }`}
                                                >
                                                    {/* Header */}
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex min-w-0 items-center gap-1.5">
                                                            <span
                                                                className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
                                                                    isActive
                                                                        ? 'border border-[#c7e0ce] bg-[#f4faf6] text-[#3f9567]'
                                                                        : 'bg-muted text-muted-foreground'
                                                                }`}
                                                            >
                                                                {item.name}
                                                            </span>
                                                            <span className="text-foreground truncate text-sm font-semibold">
                                                                #
                                                                {(() => {
                                                                    const pkgIdx = cart
                                                                        .filter((c) => c.package_id > 0)
                                                                        .findIndex((c) => c.id === item.id);
                                                                    return pkgIdx >= 0 ? pkgIdx + 1 : cart.findIndex((c) => c.id === item.id) + 1;
                                                                })()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-[#3f9567]">{formatRupiah(item.harga)}</span>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeItem(item.id);
                                                                }}
                                                                className="shrink-0 cursor-pointer p-1 text-rose-400 transition-colors hover:text-rose-600"
                                                                title={t('pos.removePackage', 'Hapus paket')}
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Detail Varian Summary Badge */}
                                                    <div className="bg-muted/50 dark:bg-muted/30 border-border/40 rounded-lg border p-2 text-xs">
                                                        <span className="text-muted-foreground mb-0.5 block text-xs font-bold tracking-wider uppercase">
                                                            {t('pos.selectedFlavorDetail')}
                                                        </span>
                                                        <span
                                                            className={`text-xs font-semibold ${totalSelected > 0 ? 'text-[#3f9567]' : 'text-muted-foreground/70 font-normal italic'}`}
                                                        >
                                                            {getVariantSummary(item)}
                                                        </span>
                                                    </div>

                                                    {/* Selected Flavor Counts */}
                                                    <div className="space-y-1.5">
                                                        {Object.entries(item.quantities).map(([vId, qty]) => {
                                                            if (qty === 0) return null;
                                                            const v = findVariant(vId, item.package_id);
                                                            if (!v) return null;
                                                            return (
                                                                <div
                                                                    key={vId}
                                                                    className="bg-muted/40 border-border/40 flex items-center justify-between gap-2 rounded-xl border px-2.5 py-1 text-xs"
                                                                >
                                                                    <span className="truncate font-medium">{v.name.replace('Mochi ', '')}</span>
                                                                    <div className="flex shrink-0 items-center gap-1.5">
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                adjustQty(item.id, v.id, -1);
                                                                            }}
                                                                            className="bg-background hover:bg-muted border-border flex h-6 w-6 cursor-pointer items-center justify-center rounded border text-xs font-bold"
                                                                            title={t('pos.minusOne', 'Kurangi 1')}
                                                                        >
                                                                            <Minus size={11} />
                                                                        </button>
                                                                        <span className="w-4 text-center font-bold">{qty}</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                adjustQty(item.id, v.id, 1);
                                                                            }}
                                                                            disabled={isComplete}
                                                                            className="bg-background hover:bg-muted border-border flex h-6 w-6 cursor-pointer items-center justify-center rounded border text-xs font-bold disabled:opacity-30"
                                                                            title={t('pos.addOne', 'Tambah 1')}
                                                                        >
                                                                            <Plus size={11} />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeVariantFromPackage(item.id, v.id);
                                                                            }}
                                                                            className="text-muted-foreground ml-1 cursor-pointer p-0.5 hover:text-rose-500"
                                                                            title={t('pos.removeFlavor', 'Hapus rasa ini')}
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Progress / Status Footer */}
                                                    <div className="border-border/60 flex items-center justify-between border-t pt-2 text-xs">
                                                        <span className="text-muted-foreground text-[10px]">
                                                            <b className="text-foreground">{totalSelected}</b> / {item.isi} pcs
                                                        </span>
                                                        {isComplete ? (
                                                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                                <Check size={12} /> {t('orders.complete')}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-semibold text-amber-500">
                                                                {t('orders.missingPcs', { count: item.isi - totalSelected })}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Status Pesanan Selector */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-muted-foreground text-sm font-medium">{t('pos.orderStatus')}</Label>
                                        </div>
                                        <div className="border-border bg-muted/30 grid grid-cols-3 gap-1 rounded-xl border p-1">
                                            <button
                                                type="button"
                                                onClick={() => setOrderStatus('done')}
                                                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                                    orderStatus === 'done'
                                                        ? 'bg-background border border-emerald-300 text-emerald-700 shadow-xs dark:border-emerald-700 dark:text-emerald-400'
                                                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                                }`}
                                            >
                                                <Check size={13} /> {t('pos.statusDone')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOrderStatus('processing')}
                                                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                                    orderStatus === 'processing'
                                                        ? 'bg-background border border-amber-300 text-amber-700 shadow-xs dark:border-amber-700 dark:text-amber-400'
                                                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                                }`}
                                            >
                                                <Loader2 size={13} /> {t('pos.statusProcessing')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setOrderStatus('pending')}
                                                className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                                                    orderStatus === 'pending'
                                                        ? 'bg-background border border-slate-300 text-slate-700 shadow-xs dark:border-slate-600 dark:text-slate-300'
                                                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                                                }`}
                                            >
                                                <Clock size={13} /> {t('pos.statusPending')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Collapsible Customer Info & Notes */}
                                    <div className="border-border/70 bg-muted/20 overflow-hidden rounded-xl border">
                                        <button
                                            type="button"
                                            onClick={() => setShowCustomerFields(!showCustomerFields)}
                                            className="hover:bg-muted/40 flex w-full cursor-pointer items-center justify-between p-3 text-left transition-colors"
                                        >
                                            <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
                                                <User size={14} className="text-[#3f9567]" />
                                                <span>{t('pos.customerInfo')}</span>
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                {(customerName || customerPhone || customerEmail || notes) && (
                                                    <span className="h-2 w-2 rounded-full bg-[#3f9567]" />
                                                )}
                                                {isCustomerActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </div>
                                        </button>

                                        {isCustomerActive && (
                                            <div className="border-border/40 space-y-2 border-t p-3 pt-0">
                                                <Input
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder={t('pos.customerNamePlaceholder')}
                                                    className="h-9 rounded-xl text-xs"
                                                />
                                                <Input
                                                    value={customerPhone}
                                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                                    placeholder={t('pos.customerPhonePlaceholder')}
                                                    className="h-9 rounded-xl text-xs"
                                                />
                                                <Input
                                                    type="email"
                                                    value={customerEmail}
                                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                                    placeholder={t('pos.customerEmailPlaceholder')}
                                                    className="h-9 rounded-xl text-xs"
                                                />
                                                <Input
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder={t('pos.orderNotesPlaceholder')}
                                                    className="h-9 rounded-xl text-xs"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Potongan / Diskon */}
                                    <div className="border-border/80 bg-muted/30 space-y-1.5 rounded-xl border p-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                                                <Tag size={13} className="text-[#3f9567]" />
                                                {t('pos.discount')}
                                            </Label>
                                            {/* Toggle Tipe Diskon: Nominal vs Persen */}
                                            <div className="border-border bg-muted/80 inline-flex rounded-lg border p-0.5 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDiscountType('nominal');
                                                        setDiscountInput('');
                                                    }}
                                                    className={`cursor-pointer rounded-md px-2 py-0.5 font-semibold transition-all ${
                                                        discountType === 'nominal'
                                                            ? 'bg-background text-foreground shadow-xs'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    Nominal ({getCurrencySymbol()})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDiscountType('percent');
                                                        setDiscountInput('');
                                                    }}
                                                    className={`cursor-pointer rounded-md px-2 py-0.5 font-semibold transition-all ${
                                                        discountType === 'percent'
                                                            ? 'bg-background text-foreground shadow-xs'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    Persen (%)
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Input
                                                type="text"
                                                value={
                                                    discountType === 'nominal'
                                                        ? discountInput
                                                            ? formatInputRupiah(parseInt(discountInput, 10))
                                                            : ''
                                                        : discountInput
                                                }
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/[^0-9]/g, '');
                                                    if (!raw) {
                                                        setDiscountInput('');
                                                        return;
                                                    }
                                                    const num = parseInt(raw, 10);
                                                    if (discountType === 'percent') {
                                                        setDiscountInput(String(Math.min(100, num)));
                                                    } else {
                                                        setDiscountInput(String(num));
                                                    }
                                                }}
                                                placeholder={discountType === 'nominal' ? 'Contoh: 10.000 (opsional)' : 'Contoh: 10% (opsional)'}
                                                className="!bg-background h-9 rounded-xl pr-10 text-xs"
                                            />
                                            <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold">
                                                {discountType === 'nominal' ? 'Rp' : '%'}
                                            </div>
                                        </div>

                                        {discountAmount > 0 && (
                                            <div className="flex items-center justify-between pt-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                <span>{t('pos.discount')}:</span>
                                                <span className="font-semibold">-{formatRupiah(discountAmount)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <Label className="text-muted-foreground mb-1.5 block text-xs">{t('pos.paymentMethod')}</Label>
                                        <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
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
                                                                  lowerName.includes('dana')
                                                                ? Smartphone
                                                                : CreditCard;

                                                      const value = pm.account_number ? `${pm.name} (${pm.account_number})` : pm.name;

                                                      return (
                                                          <button
                                                              key={pm.id}
                                                              type="button"
                                                              onClick={() => setPaymentMethod(value)}
                                                              className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-xs font-medium transition-all ${
                                                                  paymentMethod === value
                                                                      ? 'border-[#3f9567] bg-[#3f9567] text-white shadow-xs'
                                                                      : 'bg-muted hover:bg-muted/80 border-border text-foreground'
                                                              }`}
                                                          >
                                                              <Icon size={14} />
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
                                                              onClick={() => setPaymentMethod(method.key)}
                                                              className={`flex cursor-pointer flex-col items-center gap-1 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                                                                  paymentMethod === method.key
                                                                      ? 'border-[#3f9567] bg-[#3f9567] text-white shadow-xs'
                                                                      : 'bg-muted hover:bg-muted/80 border-border text-foreground'
                                                              }`}
                                                          >
                                                              <Icon size={14} />
                                                              {method.label}
                                                          </button>
                                                      );
                                                  })}
                                        </div>
                                    </div>

                                    {/* Cash Received (if cash) */}
                                    {isCash && (
                                        <div className="border-border/80 bg-muted/20 space-y-2 rounded-xl border p-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-muted-foreground text-xs font-medium">
                                                    {t('pos.cashReceived')} ({getCurrencySymbol()})
                                                </Label>
                                                {cashReceived > 0 && cashReceived < finalTotal && (
                                                    <span className="text-[11px] font-semibold text-rose-500">
                                                        {t('pos.insufficientCash', { amount: formatRupiah(finalTotal - cashReceived) })}
                                                    </span>
                                                )}
                                            </div>
                                            <Input
                                                type="text"
                                                value={cashReceived > 0 ? formatRupiah(cashReceived) : ''}
                                                onChange={(e) => setCashReceived(parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                                placeholder={`Min: ${formatRupiah(finalTotal)}`}
                                                className={`!bg-background h-9 rounded-xl text-xs ${
                                                    cashReceived > 0 && cashReceived < finalTotal
                                                        ? 'border-rose-400 focus-visible:ring-rose-400 dark:border-rose-600'
                                                        : ''
                                                }`}
                                            />

                                            {/* Quick Cash Buttons */}
                                            <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setCashReceived(finalTotal)}
                                                    className={`cursor-pointer truncate rounded-lg border px-1 py-1.5 text-center text-[11px] font-semibold transition-all ${
                                                        cashReceived === finalTotal && finalTotal > 0
                                                            ? 'border-[#3f9567] bg-[#3f9567] text-white shadow-xs'
                                                            : 'bg-background hover:bg-muted text-foreground border-border'
                                                    }`}
                                                >
                                                    Exact
                                                </button>
                                                {[10000, 20000, 50000, 100000].map((nominal) => (
                                                    <button
                                                        key={nominal}
                                                        type="button"
                                                        onClick={() => setCashReceived(nominal)}
                                                        className={`cursor-pointer truncate rounded-lg border px-1 py-1.5 text-center text-[11px] font-semibold transition-all ${
                                                            cashReceived === nominal
                                                                ? 'border-[#3f9567] bg-[#3f9567] text-white shadow-xs'
                                                                : 'bg-background hover:bg-muted text-foreground border-border'
                                                        }`}
                                                    >
                                                        {nominal >= 1000 ? `${nominal / 1000}k` : nominal}
                                                    </button>
                                                ))}
                                            </div>

                                            {cashReceived >= finalTotal && cashReceived > 0 && (
                                                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-950/30">
                                                    <span className="text-xs">{t('pos.change')}:</span>
                                                    <span>{formatRupiah(change)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Cost Breakdown Details */}
                                    <div className="bg-muted/40 border-border/50 space-y-1.5 rounded-xl border p-3 text-xs">
                                        <div className="text-muted-foreground flex justify-between">
                                            <span>
                                                {t('pos.subtotal')} ({cartItemCount} item)
                                            </span>
                                            <span className="text-foreground font-medium">{formatRupiah(subtotal)}</span>
                                        </div>

                                        {discountAmount > 0 && (
                                            <div className="flex justify-between font-medium text-rose-500 dark:text-rose-400">
                                                <span>
                                                    {t('pos.discount')} {discountType === 'percent' ? `(${discountInput}%)` : ''}
                                                </span>
                                                <span>-{formatRupiah(discountAmount)}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sticky Bottom Action Footer */}
                        {cart.length > 0 && (
                            <div className="border-border bg-card shrink-0 space-y-2.5 border-t p-3.5 sm:p-4">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-muted-foreground text-xs">{t('pos.total')}</span>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-[#3f9567]">{formatRupiah(finalTotal)}</span>
                                        {discountAmount > 0 && (
                                            <span className="block text-[11px] text-rose-500 line-through">{formatRupiah(subtotal)}</span>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    disabled={processing || !isCartComplete || (isCash && cashReceived < finalTotal)}
                                    className="h-11 w-full cursor-pointer rounded-xl bg-[#3f9567] text-sm font-semibold text-white shadow-xs hover:bg-[#327d55] disabled:opacity-50"
                                >
                                    {processing
                                        ? t('common.saving')
                                        : !isCartComplete
                                          ? t('pos.subtitleWithPackages')
                                          : isCash && cashReceived > 0 && cashReceived < finalTotal
                                            ? t('pos.insufficientCash', { amount: formatRupiah(finalTotal - cashReceived) })
                                            : isCash && cashReceived === 0
                                              ? t('pos.enterCashReceived')
                                              : t('pos.createOrderTotal', { total: formatRupiah(finalTotal) })}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('pos.title')} />

            <div className="pos-page relative flex h-[calc(100vh-4rem)] min-h-0 w-full overflow-hidden bg-transparent">
                {/* Left: Product & Package Grid */}
                <div className="min-h-0 min-w-0 flex-1 space-y-5 overflow-y-auto bg-transparent p-4 pb-28 md:p-6 lg:pb-6">
                    {/* Header with Mobile Cart Trigger */}
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div>
                                <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                                    {t('pos.title')}
                                </h1>
                                <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">
                                    {packages.length > 0 ? t('pos.subtitleWithPackages') : t('pos.subtitleDirect')}
                                </p>
                            </div>
                        </div>

                        {/* Top Cart Button for Mobile (< lg) */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setMobileCartOpen(true)}
                            className="bg-card relative flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-xl border-[#c7e0ce] px-3 text-[#3f9567] hover:bg-[#f4faf6] lg:hidden"
                        >
                            <ShoppingCart size={15} />
                            <span className="text-xs font-semibold">{t('pos.cart')}</span>
                            {cart.length > 0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#3f9567] px-1 text-[10px] font-bold text-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Section 1: Packages (if available) */}
                    {packages.length > 0 && (
                        <div>
                            <div className="mb-2.5 flex items-center justify-between">
                                <h2 className="text-foreground flex items-center gap-1.5 text-xs font-semibold sm:text-sm">
                                    <Package size={15} className="text-[#3f9567]" />
                                    {t('pos.selectPackage')}
                                </h2>
                                <span className="text-muted-foreground text-[11px]">{t('pos.clickToAddPackage')}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                                {packages.map((pkg) => {
                                    const pkgVariantIds = pkg.variants?.map((v) => v.id) || [];
                                    const availableVariantsCount =
                                        pkgVariantIds.length > 0 ? pkgVariantIds.length : variants.filter((v) => Number(v.recipe_qty) === 1).length;

                                    return (
                                        <div
                                            key={pkg.id}
                                            onClick={() => addPackageToCart(pkg)}
                                            className="group border-border bg-card relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 shadow-2xs transition-all hover:border-[#8fc7a5] hover:shadow-sm active:scale-[0.99] sm:p-4"
                                        >
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="bg-muted rounded-md px-2 py-0.5 text-[11px] font-bold text-[#3f9567]">
                                                        {t('pos.capacityPcs', { capacity: pkg.capacity })}
                                                    </span>
                                                    <div
                                                        className={`flex size-7 items-center justify-center rounded-full !p-1 text-white transition-colors ${
                                                            isOwner
                                                                ? '!bg-[#3f9567] group-hover:!bg-[#327d55]'
                                                                : '!bg-[#2596BE] group-hover:!bg-[#1f83a8]'
                                                        }`}
                                                    >
                                                        <Plus size={13} />
                                                    </div>
                                                </div>
                                                <h3 className="text-foreground line-clamp-1 text-xs font-semibold transition-colors group-hover:text-[#3f9567] sm:text-sm">
                                                    {pkg.name}
                                                </h3>
                                                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px] sm:line-clamp-2">
                                                    {pkg.description || `${availableVariantsCount} pilihan varian rasa.`}
                                                </p>
                                            </div>
                                            <div className="border-border/60 mt-2.5 flex items-baseline justify-between border-t pt-2">
                                                <span className="text-muted-foreground text-[10px]">Harga</span>
                                                <span className="text-xs font-bold text-[#3f9567] sm:text-sm">{formatRupiah(Number(pkg.price))}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section 1.5: Active Package Switcher Chips (When packages in cart) */}
                    {packages.length > 0 && packageCartItems.length > 0 && (
                        <div className="border-border bg-card flex flex-col gap-2 rounded-xl border p-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 font-semibold text-[#315d45]">
                                    <Package size={13} className="text-[#3f9567]" />
                                    {t('pos.packageBeingFilled')}
                                </span>
                                <span className="text-[11px]">
                                    {activePackageRemaining === 0 ? (
                                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                                            <Check size={12} /> {t('orders.complete')} ({activePackageTotal}/{activePackageItem?.isi})
                                        </span>
                                    ) : (
                                        <span className="font-medium text-amber-600 dark:text-amber-400">
                                            {t('orders.missingPcs', { count: activePackageRemaining })} ({activePackageTotal}/{activePackageItem?.isi}
                                            )
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* Horizontal scrollable chips for switching active package */}
                            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                                {packageCartItems.map((pkgItem, index) => {
                                    const count = Object.values(pkgItem.quantities).reduce((s, q) => s + q, 0);
                                    const isDone = count === pkgItem.isi;
                                    const isCurrent = pkgItem.id === activeCartItemId;

                                    return (
                                        <button
                                            key={pkgItem.id}
                                            type="button"
                                            onClick={() => setActiveCartItemId(pkgItem.id)}
                                            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                                                isCurrent
                                                    ? 'bg-[#3f9567] text-white shadow-xs ring-2 ring-[#a9d4b6]'
                                                    : 'bg-background hover:bg-muted text-foreground border-border border'
                                            }`}
                                        >
                                            <span>
                                                #{index + 1} {pkgItem.name}
                                            </span>
                                            <span
                                                className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                                                    isCurrent
                                                        ? isDone
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-white/25 text-white'
                                                        : isDone
                                                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                          : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {count}/{pkgItem.isi}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Product Variants */}
                    <div>
                        <div className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-foreground flex items-center gap-1.5 text-xs font-semibold sm:text-sm">
                                    <ShoppingBag size={15} className="text-[#3f9567]" />
                                    {packages.length > 0 ? t('orders.selectFlavorTitle') : t('pos.variantListTitle')}
                                </h2>
                                {packages.length > 0 && activeCartItemId !== null && (
                                    <span className="bg-muted hidden rounded-full px-2 py-0.5 text-[11px] font-medium text-[#3f9567] sm:inline-block">
                                        {t('pos.fillingPackage', {
                                            name: cart.find((c) => c.id === activeCartItemId)?.name,
                                            num: cart.findIndex((c) => c.id === activeCartItemId) + 1,
                                        })}
                                    </span>
                                )}
                            </div>

                            {/* Search Filter Input */}
                            <div className="relative w-full sm:w-56">
                                <Search className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2" size={13} />
                                <Input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('pos.searchMochiPlaceholder')}
                                    className="!bg-background h-8 rounded-xl pr-7 pl-8 text-sm"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
                                    >
                                        <X size={13} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {filteredVariants.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center text-xs">
                                <ShoppingBag size={32} className="mb-2 opacity-30" />
                                <p>{searchQuery ? t('pos.noVariantMatch', { query: searchQuery }) : t('pos.noActiveVariants')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-2.5 xl:grid-cols-4">
                                {filteredVariants.map((v) => {
                                    // Calculate quantity in cart
                                    let currentQty = 0;
                                    if (packages.length > 0) {
                                        const activeItem = cart.find((c) => c.id === activeCartItemId);
                                        currentQty = activeItem?.quantities[v.id] ?? 0;
                                    } else {
                                        cart.forEach((item) => {
                                            if (item.package_id === 0) {
                                                currentQty += item.quantities[v.id] ?? 0;
                                            }
                                        });
                                    }

                                    const activeItem = cart.find((c) => c.id === activeCartItemId);
                                    const totalSelectedInActive = activeItem
                                        ? Object.values(activeItem.quantities).reduce((sum, q) => sum + q, 0)
                                        : 0;
                                    const isPackageFull = activeItem ? totalSelectedInActive >= activeItem.isi : false;

                                    return (
                                        <div
                                            key={v.id}
                                            onClick={() => handleVariantClick(v)}
                                            className={`group relative rounded-xl border p-3 text-left shadow-2xs transition-all select-none active:scale-[0.99] ${
                                                currentQty > 0
                                                    ? 'pos-selection-pop border-[#8fc7a5] bg-[#f4faf6] shadow-xs'
                                                    : 'bg-card border-border cursor-pointer hover:border-[#a9d4b6] hover:shadow-xs'
                                            }`}
                                        >
                                            <div className="mb-1.5 flex items-start justify-between">
                                                <div className="bg-muted flex h-7 w-7 items-center justify-center rounded-lg">
                                                    <ShoppingBag size={13} className="text-[#3f9567]" />
                                                </div>
                                                {currentQty > 0 && packages.length > 0 && (
                                                    <div
                                                        className="flex items-center gap-1 rounded-lg bg-[#3f9567] p-0.5 text-white shadow-xs"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (activeCartItemId) {
                                                                    adjustQty(activeCartItemId, v.id, -1);
                                                                }
                                                            }}
                                                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-xs font-bold transition-colors hover:bg-[#327d55] active:bg-[#286b47]"
                                                            title={t('pos.variantCard.reduceVariant', 'Kurangi varian')}
                                                        >
                                                            <Minus size={11} />
                                                        </button>
                                                        <span className="min-w-[1rem] px-1 text-center text-xs font-bold">{currentQty}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVariantClick(v)}
                                                            disabled={isPackageFull}
                                                            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-xs font-bold transition-colors hover:bg-[#327d55] active:bg-[#286b47] disabled:opacity-40"
                                                            title={t('pos.variantCard.addVariant', 'Tambah varian')}
                                                        >
                                                            <Plus size={11} />
                                                        </button>
                                                    </div>
                                                )}
                                                {currentQty > 0 && packages.length === 0 && (
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3f9567] text-[10px] font-bold text-white">
                                                        {currentQty}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-foreground mb-0.5 truncate text-xs leading-tight font-semibold">
                                                {v.name.replace('Mochi ', '')}
                                            </div>
                                            <div className="text-[11px] font-bold text-[#3f9567]">
                                                {packages.length === 0
                                                    ? formatRupiah(Number(v.sell_price))
                                                    : `${v.recipe_qty ?? 1} ${t('pos.variantCard.pcsPerRecipe', 'pcs/resep')}`}
                                            </div>
                                            <div className="text-muted-foreground mt-1 flex items-center justify-between text-[10px]">
                                                <span>
                                                    {t('pos.variantCard.hpp', 'HPP')}: {formatRupiah(Number(v.hpp ?? 0))}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Desktop: Cart & Checkout (Visible only on lg and above) */}
                <div className="border-border hidden h-full w-[24rem] shrink-0 flex-col overflow-hidden rounded-l-2xl border bg-white shadow-sm lg:flex xl:w-[28rem] 2xl:w-[30rem]">
                    {renderCartContent()}
                </div>
            </div>

            {/* Mobile Sticky Floating Bottom Bar (Visible on screens < lg) */}
            <div className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-30 border-t p-3 shadow-lg backdrop-blur-md lg:hidden">
                <div className="flex items-center justify-between gap-2.5">
                    <button
                        type="button"
                        onClick={() => setMobileCartOpen(true)}
                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-left transition-opacity active:opacity-75"
                    >
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c7e0ce] bg-[#f4faf6] text-[#3f9567] shadow-xs">
                            <ShoppingCart size={18} />
                            {cart.length > 0 && (
                                <span className="ring-background absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                <span className="truncate">
                                    {cart.length === 0
                                        ? t('pos.emptyCart', 'Keranjang Kosong')
                                        : packages.length > 0
                                          ? `${cart.length} ${t('pos.packageUnit', 'Paket')}`
                                          : `${cartItemCount} ${t('pos.itemUnit', 'Item')}`}
                                </span>
                                {cart.length > 0 && (
                                    <span
                                        className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
                                            isCartComplete
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                        }`}
                                    >
                                        {isCartComplete ? t('pos.complete', 'Lengkap') : t('pos.incomplete', 'Belum Lengkap')}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm font-bold text-[#3f9567]">{formatRupiah(finalTotal)}</div>
                        </div>
                    </button>

                    <Button
                        type="button"
                        onClick={() => setMobileCartOpen(true)}
                        disabled={cart.length === 0}
                        className="h-10 shrink-0 cursor-pointer rounded-xl bg-[#3f9567] px-4 font-semibold text-white shadow-xs hover:bg-[#327d55]"
                    >
                        {isCartComplete ? t('pos.payOrCheck', 'Bayar / Periksa') : t('pos.viewCart', 'Lihat Keranjang')}
                    </Button>
                </div>
            </div>

            {/* Mobile Cart Sheet / Drawer (< lg) */}
            <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
                <SheetContent side="right" className="border-border bg-card z-50 flex h-full w-full flex-col border-l p-0 sm:max-w-md">
                    <SheetHeader className="sr-only">
                        <SheetTitle>{t('pos.cartAndCheckout', 'Keranjang dan Pembayaran Kasir')}</SheetTitle>
                        <SheetDescription>{t('pos.mobileCartDescription', 'Daftar pesanan dan form pembayaran kasir POS')}</SheetDescription>
                    </SheetHeader>
                    {renderCartContent({
                        isMobile: true,
                        onClose: () => setMobileCartOpen(false),
                    })}
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
