import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type ProductVariant } from '@/types/mrp';
import { Head } from '@inertiajs/react';
import { Banknote, Check, CreditCard, Minus, Package, Plus, ShoppingBag, ShoppingCart, Smartphone, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pesanan', href: '/orders' },
    { title: 'POS Kasir', href: '/pos' },
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
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeCartItemId, setActiveCartItemId] = useState<number | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');

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

    // Sync activeCartItemId: if the current active package is deleted or cart becomes empty
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

    // Calculate subtotal & HPP
    const subtotal = cart.reduce((sum, item) => sum + item.harga, 0);

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

        if (selected.length === 0) return 'Belum ada rasa dipilih';
        return selected.join(', ');
    };

    const totalHpp = cart.reduce((sum, item) => sum + getCartItemHpp(item), 0);
    const change = cashReceived - subtotal;

    // Check if all packages in cart are full
    const isCartComplete =
        cart.length > 0 &&
        cart.every((item) => {
            if (item.package_id === 0) return true; // Direct variant is always complete
            const selectedQty = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
            return selectedQty === item.isi;
        });

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
                    toast.warning('Paket terpilih sudah penuh! Silakan buat atau klik paket lain di keranjang.');
                }
            } else {
                toast.warning('Silakan pilih/klik paket di keranjang terlebih dahulu untuk mengisi rasa!');
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
                const newQty = Math.max(0, currentQty + delta);

                const currentTotal = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
                const newTotal = currentTotal - currentQty + newQty;

                if (newTotal > item.isi) return item;

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
                const newQty = Math.max(0, currentQty + delta);
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
        setNotes('');
        setCashReceived(0);
        setSuccessOrder(null);
    };

    const handleCheckout = () => {
        if (!customerName.trim() || cart.length === 0 || !isCartComplete) return;
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

        handleAsyncAction(
            () =>
                routerPromise(
                    'post',
                    '/orders',
                    {
                        customer_name: customerName,
                        customer_phone: customerPhone,
                        notes: notes,
                        payment_method: paymentMethod,
                        items: items,
                    },
                    {
                        onSuccess: (page: any) => {
                            setProcessing(false);
                            const flash = (page.props as any).flash;
                            setSuccessOrder(flash?.success ?? 'Pesanan berhasil dibuat!');
                            setTimeout(() => {
                                clearCart();
                            }, 3000);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS Kasir" />

            <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                {/* Left: Product & Package Grid */}
                <div className="bg-background min-w-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
                    <div className="mb-4">
                        <h1 className="flex items-center gap-2 text-xl font-bold">
                            <ShoppingBag className="text-indigo-500" size={22} />
                            POS Kasir
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {packages.length > 0 ? 'Pilih paket di bawah, lalu isi varian rasanya' : 'Pilih varian rasa langsung untuk memesan'}
                        </p>
                    </div>

                    {/* Section 1: Pilih Paket (hanya muncul jika ada paket aktif) */}
                    {packages.length > 0 && (
                        <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                            <h2 className="flex items-center gap-1.5 text-sm font-semibold">
                                <Package className="text-indigo-500" size={16} />
                                Pilih Paket Mochi
                            </h2>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                {packages.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        type="button"
                                        onClick={() => addPackageToCart(pkg)}
                                        className="group border-border bg-muted flex flex-col items-center gap-1 rounded-2xl border p-4 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                                    >
                                        <Package size={18} className="text-muted-foreground mb-1 transition-colors group-hover:text-indigo-500" />
                                        <span className="max-w-full truncate text-sm font-bold">{pkg.name}</span>
                                        <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                                            Isi {pkg.capacity} Pcs
                                        </span>
                                        {pkg.description && (
                                            <span className="text-muted-foreground/80 line-clamp-2 max-w-full px-1 text-[10px] leading-snug">
                                                {pkg.description}
                                            </span>
                                        )}
                                        <span className="mt-1 text-sm font-bold text-indigo-600">{formatRupiah(Number(pkg.price))}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section 2: Varian Rasa */}
                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div className="border-border flex flex-col justify-between gap-2 border-b pb-3 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-sm font-semibold">Pilih Varian Rasa</h2>
                                <p className="text-muted-foreground text-xs">Klik varian di bawah untuk mengisi rasa paket</p>
                            </div>
                            {packages.length > 0 &&
                                (() => {
                                    const activeItem = cart.find((c) => c.id === activeCartItemId);
                                    if (!activeItem) return null;
                                    const totalSelectedInActive = Object.values(activeItem.quantities).reduce((sum, q) => sum + q, 0);
                                    const isComplete = totalSelectedInActive === activeItem.isi;
                                    return (
                                        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs dark:border-indigo-800 dark:bg-indigo-950/50">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeItem.name}:</span>
                                            <span
                                                className="text-foreground max-w-[200px] truncate font-medium sm:max-w-[260px]"
                                                title={getVariantSummary(activeItem)}
                                            >
                                                {getVariantSummary(activeItem)}
                                            </span>
                                            <span
                                                className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${isComplete ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'}`}
                                            >
                                                {totalSelectedInActive}/{activeItem.isi}
                                            </span>
                                        </div>
                                    );
                                })()}
                        </div>
                        {variants.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center py-10 text-center">
                                <ShoppingBag size={40} className="mb-3 opacity-30" />
                                <p>Belum ada varian produk aktif.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                                {variants.map((v) => {
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
                                            className={`group relative rounded-xl border p-3.5 text-left transition-all select-none ${
                                                currentQty > 0
                                                    ? 'border-indigo-300 bg-indigo-50/80 shadow-sm dark:border-indigo-600 dark:bg-indigo-900/30'
                                                    : 'bg-card border-border cursor-pointer hover:border-indigo-200 hover:shadow-sm'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                                                    <ShoppingBag size={14} className="text-indigo-500" />
                                                </div>
                                                {currentQty > 0 && packages.length > 0 && (
                                                    <div
                                                        className="flex items-center gap-1 rounded-lg bg-indigo-600 p-0.5 text-white shadow-sm"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (activeCartItemId !== null) {
                                                                    adjustQty(activeCartItemId, v.id, -1);
                                                                }
                                                            }}
                                                            className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold transition-colors hover:bg-indigo-700 active:bg-indigo-800"
                                                            title="Kurangi varian"
                                                        >
                                                            <Minus size={11} />
                                                        </button>
                                                        <span className="min-w-[1rem] px-1 text-center text-xs font-bold">{currentQty}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVariantClick(v)}
                                                            disabled={isPackageFull}
                                                            className="flex h-5 w-5 items-center justify-center rounded text-xs font-bold transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40"
                                                            title="Tambah varian"
                                                        >
                                                            <Plus size={11} />
                                                        </button>
                                                    </div>
                                                )}
                                                {currentQty > 0 && packages.length === 0 && (
                                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                                        {currentQty}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-1 truncate text-xs leading-tight font-medium">{v.name.replace('Mochi ', '')}</div>
                                            <div className="text-xs font-bold text-indigo-600">{formatRupiah(v.sell_price)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart & Checkout */}
                <div className="border-border bg-card flex w-full shrink-0 flex-col border-l sm:w-[22rem] lg:w-[26rem] xl:w-[30rem]">
                    {/* Cart Header */}
                    <div className="border-border flex items-center justify-between border-b p-4">
                        <h2 className="flex items-center gap-2 font-semibold">
                            <ShoppingCart size={16} />
                            Keranjang
                            {cart.length > 0 && (
                                <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs text-white">
                                    {packages.length > 0
                                        ? `${cart.length} paket`
                                        : `${cart.reduce((s, i) => s + (i.quantities[Object.keys(i.quantities)[0]] ?? 0), 0)} item`}
                                </span>
                            )}
                        </h2>
                        {cart.length > 0 && (
                            <button onClick={clearCart} className="text-xs font-medium text-rose-400 hover:text-rose-600">
                                Kosongkan
                            </button>
                        )}
                    </div>

                    {/* Success Banner */}
                    {successOrder && (
                        <div className="m-3 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <Check size={15} className="mt-0.5 shrink-0" />
                            {successOrder}
                        </div>
                    )}

                    {/* Cart Items */}
                    <div className="flex-1 space-y-3 overflow-y-auto p-3.5">
                        {cart.length === 0 && !successOrder && (
                            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center text-sm">
                                <ShoppingCart size={28} className="mb-2 opacity-30" />
                                Keranjang kosong.
                                <br />
                                {packages.length > 0 ? 'Pilih paket di kiri untuk memulai.' : 'Pilih varian rasa di kiri untuk memulai.'}
                            </div>
                        )}

                        {cart.map((item) => {
                            if (item.package_id === 0) {
                                // Direct variant item layout
                                const variantId = Object.keys(item.quantities)[0];
                                const qty = item.quantities[variantId];
                                const v = findVariant(variantId);
                                if (!v) return null;

                                return (
                                    <div key={item.id} className="bg-background border-border flex flex-col gap-2.5 rounded-xl border p-3.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium">{v.name.replace('Mochi ', '')}</div>
                                                <div className="text-muted-foreground mt-0.5 text-xs">{formatRupiah(Number(v.sell_price))}/pcs</div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(item.id);
                                                }}
                                                className="shrink-0 p-0.5 text-rose-400 hover:text-rose-600"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        adjustDirectQty(item.id, variantId, -1);
                                                    }}
                                                    className="bg-muted hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        adjustDirectQty(item.id, variantId, 1);
                                                    }}
                                                    className="bg-muted hover:bg-muted/80 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <div className="text-sm font-semibold">{formatRupiah(item.harga)}</div>
                                        </div>
                                    </div>
                                );
                            }

                            // Package item layout
                            const isActive = item.id === activeCartItemId;
                            const totalSelected = Object.values(item.quantities).reduce((sum, q) => sum + q, 0);
                            const isComplete = totalSelected === item.isi;

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveCartItemId(item.id)}
                                    className={`flex cursor-pointer flex-col gap-2.5 rounded-xl border p-3.5 transition-all ${
                                        isActive
                                            ? 'border-indigo-500 bg-indigo-50/30 shadow-sm dark:bg-indigo-950/20'
                                            : 'border-border bg-background hover:border-indigo-200'
                                    }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex min-w-0 items-center gap-1.5">
                                            <span
                                                className={`shrink-0 rounded px-2 py-0.5 text-xs font-bold ${
                                                    isActive ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {item.name}
                                            </span>
                                            <span className="text-foreground truncate text-xs font-semibold">{formatRupiah(item.harga)}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeItem(item.id);
                                            }}
                                            className="shrink-0 p-0.5 text-rose-400 transition-colors hover:text-rose-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Detail Varian Summary Badge */}
                                    <div className="bg-muted/50 dark:bg-muted/30 border-border/40 rounded-lg border p-2 text-xs">
                                        <span className="text-muted-foreground mb-0.5 block text-[10px] font-bold tracking-wider uppercase">
                                            Detail Rasa Varian:
                                        </span>
                                        <span
                                            className={`text-xs font-semibold ${totalSelected > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground/70 font-normal italic'}`}
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
                                                    className="bg-muted/40 border-border/40 flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs"
                                                >
                                                    <span className="truncate font-medium">{v.name.replace('Mochi ', '')}</span>
                                                    <div className="flex shrink-0 items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                adjustQty(item.id, v.id, -1);
                                                            }}
                                                            className="bg-background hover:bg-muted border-border flex h-5 w-5 items-center justify-center rounded border text-[10px]"
                                                            title="Kurangi 1"
                                                        >
                                                            <Minus size={10} />
                                                        </button>
                                                        <span className="w-4 text-center font-bold">{qty}</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                adjustQty(item.id, v.id, 1);
                                                            }}
                                                            disabled={isComplete}
                                                            className="bg-background hover:bg-muted border-border flex h-5 w-5 items-center justify-center rounded border text-[10px] disabled:opacity-40"
                                                            title="Tambah 1"
                                                        >
                                                            <Plus size={10} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeVariantFromPackage(item.id, v.id);
                                                            }}
                                                            className="ml-1 p-0.5 text-rose-400 transition-colors hover:text-rose-600"
                                                            title="Hapus varian ini"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Status */}
                                    <div className="border-border mt-0.5 flex items-center justify-between border-t border-dashed pt-2 text-[10px]">
                                        <span className={isComplete ? 'font-semibold text-emerald-600' : 'font-semibold text-amber-600'}>
                                            {isComplete ? '✓ Lengkap' : `⚠ Kurang ${item.isi - totalSelected} Pcs`} ({totalSelected}/{item.isi})
                                        </span>
                                        {isActive && !isComplete && <span className="animate-pulse font-medium text-indigo-600">Pilih rasa...</span>}
                                        {!isActive && !isComplete && <span className="text-muted-foreground">Klik untuk isi rasa</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Customer & Payment */}
                    {cart.length > 0 && (
                        <div className="border-border max-h-[55vh] space-y-4 overflow-y-auto border-t p-4">
                            {/* Customer */}
                            <div className="space-y-2">
                                <Input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Nama pelanggan *"
                                    className="h-9 rounded-xl text-sm"
                                />
                                <Input
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    placeholder="No. HP (opsional)"
                                    className="h-9 rounded-xl text-sm"
                                />
                                <Input
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Catatan (opsional)"
                                    className="h-9 rounded-xl text-sm"
                                />
                            </div>

                            {/* Payment Method */}
                            <div>
                                <Label className="text-muted-foreground mb-1.5 block text-xs">Metode Pembayaran</Label>
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
                                                          lowerName.includes('wallet')
                                                        ? Smartphone
                                                        : CreditCard;

                                              const value = pm.account_number ? `${pm.name} (${pm.account_number})` : pm.name;

                                              return (
                                                  <button
                                                      key={pm.id}
                                                      type="button"
                                                      onClick={() => setPaymentMethod(value)}
                                                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border p-2.5 text-center text-[11px] font-medium transition-all ${
                                                          paymentMethod === value
                                                              ? 'border-indigo-600 bg-indigo-600 text-white'
                                                              : 'bg-muted hover:bg-muted/80 border-border'
                                                      }`}
                                                  >
                                                      <Icon size={14} />
                                                      <span className="line-clamp-1">{pm.name}</span>
                                                      {pm.account_number && (
                                                          <span className="block max-w-full truncate font-mono text-[9px] opacity-80">
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
                                                      className={`flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                                                          paymentMethod === method.key
                                                              ? 'border-indigo-600 bg-indigo-600 text-white'
                                                              : 'bg-muted hover:bg-muted/80 border-border'
                                                      }`}
                                                  >
                                                      <Icon size={14} />
                                                      {method.label}
                                                  </button>
                                              );
                                          })}
                                </div>
                            </div>

                            {/* Cash Received (for cash payment) */}
                            {isCash && (
                                <div className="space-y-1.5">
                                    <Label className="text-muted-foreground text-xs">Uang Diterima (Rp)</Label>
                                    <Input
                                        type="text"
                                        value={cashReceived > 0 ? formatRupiah(cashReceived) : ''}
                                        onChange={(e) => setCashReceived(parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0)}
                                        placeholder={`Min: ${formatRupiah(subtotal)}`}
                                        className="h-9 rounded-xl text-sm"
                                    />
                                    {cashReceived >= subtotal && (
                                        <div className="text-sm font-semibold text-emerald-600">Kembalian: {formatRupiah(change)}</div>
                                    )}
                                </div>
                            )}

                            {/* Total */}
                            <div className="bg-muted/50 space-y-1.5 rounded-xl p-3.5">
                                <div className="text-muted-foreground flex justify-between text-sm">
                                    <span>
                                        Subtotal (
                                        {packages.length > 0
                                            ? `${cart.length} paket`
                                            : `${cart.reduce((s, i) => s + (i.quantities[Object.keys(i.quantities)[0]] ?? 0), 0)} item`}
                                        )
                                    </span>
                                    <span>{formatRupiah(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-indigo-600">{formatRupiah(subtotal)}</span>
                                </div>
                                {totalHpp > 0 && (
                                    <div className="flex justify-between pt-0.5 text-xs text-emerald-600">
                                        <span>Est. Untung</span>
                                        <span>+{formatRupiah(subtotal - totalHpp)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Checkout Button */}
                            <Button
                                onClick={handleCheckout}
                                disabled={processing || !customerName.trim() || !isCartComplete}
                                className="h-11 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                {processing ? 'Memproses...' : `Buat Pesanan — ${formatRupiah(subtotal)}`}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
