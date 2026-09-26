import { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    Building2,
    Check,
    ChevronsUpDown,
    PlusCircle,
    Store,
    Sparkles,
    Zap,
    Package,
    Loader2,
    UtensilsCrossed,
    ShoppingBag,
    Shirt,
    Wrench,
    Coins,
    Phone,
    MapPin,
    Layers
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils-mrp';
import { type AvailablePlan, type SharedData, type UserTenantItem } from '@/types';

// Tipe bisnis dengan ikon dan deskripsi
const BUSINESS_TYPES = [
    {
        value: 'fnb',
        label: 'Food & Beverage',
        icon: UtensilsCrossed,
        emoji: '🍜',
        desc: 'Restoran, kafe, kuliner',
    },
    {
        value: 'retail',
        label: 'Retail / Toko',
        icon: ShoppingBag,
        emoji: '🛍️',
        desc: 'Minimarket, grosir, toko kelontong',
    },
    {
        value: 'fashion',
        label: 'Fashion & Apparel',
        icon: Shirt,
        emoji: '👗',
        desc: 'Butik, distro, pakaian',
    },
    {
        value: 'services',
        label: 'Jasa / Services',
        icon: Wrench,
        emoji: '🔧',
        desc: 'Salon, bengkel, laundry, jasa',
    },
    {
        value: 'general',
        label: 'Umum / General',
        icon: Layers,
        emoji: '🏢',
        desc: 'Bisnis umum & perdagangan lainnya',
    },
];

export function TenantSwitcher() {
    const { t } = useTranslation();
    const { auth, tenant, userTenants = [], availablePlans = [] } = usePage<SharedData>().props;
    const isOwner = auth.user?.roles?.includes('owner');
    const isSupervisor = auth.user?.roles?.includes('supervisor');

    const [openDropdown, setOpenDropdown] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [switchingId, setSwitchingId] = useState<string | null>(null);

    // Form data untuk create tenant baru
    const defaultPlan = availablePlans.find((p) => p.slug === 'free') || availablePlans[0];
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        business_type: 'fnb',
        plan_slug: defaultPlan?.slug || 'free',
        currency: 'IDR',
        phone: '',
        address: '',
    });

    // Inisial nama tenant
    const currentInitials = tenant?.name
        ? tenant.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()
        : 'V';

    const handleSwitchTenant = (targetTenant: UserTenantItem) => {
        if (targetTenant.id === tenant?.id || switchingId) return;

        setSwitchingId(targetTenant.id);
        setOpenDropdown(false);

        router.post(
            route('owner.tenants.switch'),
            { tenant_id: targetTenant.id },
            {
                preserveScroll: false,
                onFinish: () => setSwitchingId(null),
            }
        );
    };

    const handleOpenCreateModal = () => {
        setOpenDropdown(false);
        clearErrors();
        setData({
            name: '',
            business_type: 'fnb',
            plan_slug: defaultPlan?.slug || 'free',
            currency: 'IDR',
            phone: '',
            address: '',
        });
        setOpenModal(true);
    };

    const handleCreateTenant = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('owner.tenants.store'), {
            onSuccess: () => {
                setOpenModal(false);
                reset();
            },
        });
    };

    return (
        <>
            <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className={`group relative flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left shadow-2xs transition-all duration-200 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 ${
                            isSupervisor
                                ? 'border-[#bce3f2] bg-[#f0f8fb] hover:border-[#8ecde6] hover:bg-[#e4f3f8] focus-visible:ring-[#2596be]/30 dark:border-[#2596be]/30 dark:bg-[#0e2733]/50 dark:hover:bg-[#133342]'
                                : 'border-[#cfe8da] bg-[#f2f8f4] hover:border-[#a8d9be] hover:bg-[#e7f3ec] focus-visible:ring-[#2f7d57]/30 dark:border-[#2f7d57]/30 dark:bg-[#152e22]/50 dark:hover:bg-[#1a382b]'
                        }`}
                    >
                        <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-2xs ${
                                isSupervisor ? 'bg-[#2596be]' : 'bg-[#2f7d57]'
                            }`}
                        >
                            {currentInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div
                                className={`truncate text-xs font-bold tracking-tight ${
                                    isSupervisor ? 'text-[#123e4f] dark:text-[#bde3f2]' : 'text-[#1e3c2c] dark:text-[#cbf5dc]'
                                }`}
                            >
                                {tenant?.name || 'Pilih Bisnis'}
                            </div>
                            <div
                                className={`flex items-center gap-1.5 text-[10.5px] ${
                                    isSupervisor ? 'text-[#2e6d87] dark:text-[#78b9d1]' : 'text-[#4d7a62] dark:text-[#8acfa9]'
                                }`}
                            >
                                <span className="capitalize">{tenant?.business_type || 'Bisnis'}</span>
                                {tenant?.plan?.name && (
                                    <>
                                        <span className="opacity-40">•</span>
                                        <span
                                            className={`font-semibold ${
                                                isSupervisor ? 'text-[#2596be] dark:text-[#6ec5e6]' : 'text-[#2f7d57] dark:text-[#7ee2ad]'
                                            }`}
                                        >
                                            {tenant.plan.name}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        {switchingId ? (
                            <Loader2 className={`size-4 animate-spin shrink-0 ${isSupervisor ? 'text-[#2596be]' : 'text-[#2f7d57]'}`} />
                        ) : (
                            <ChevronsUpDown
                                className={`size-4 shrink-0 transition-colors ${
                                    isSupervisor
                                        ? 'text-[#4b8fa9] group-hover:text-[#2596be] dark:text-[#78b9d1]'
                                        : 'text-[#608b73] group-hover:text-[#2f7d57] dark:text-[#8acfa9]'
                                }`}
                            />
                        )}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    sideOffset={6}
                    className={`w-[240px] rounded-xl border bg-white p-1.5 shadow-lg backdrop-blur-md ${
                        isSupervisor ? 'border-[#c7e8f5] dark:border-[#2596be]/30 dark:bg-[#0c1f29]' : 'border-[#d6ebe0] dark:border-[#2f7d57]/30 dark:bg-[#12231a]'
                    }`}
                >
                    <div
                        className={`flex items-center justify-between px-2 py-1.5 text-[10px] font-bold tracking-wider uppercase ${
                            isSupervisor ? 'text-[#2e6d87] dark:text-[#78b9d1]' : 'text-[#4d7a62] dark:text-[#8acfa9]'
                        }`}
                    >
                        <span>{t('navigation.tenants') || 'Bisnis Saya'}</span>
                        <Badge
                            variant="secondary"
                            className={`h-4 px-1 text-[10px] font-semibold border-0 ${
                                isSupervisor ? 'bg-[#e4f3f8] text-[#2596be]' : 'bg-[#e7f3ec] text-[#2f7d57]'
                            }`}
                        >
                            {userTenants.length}
                        </Badge>
                    </div>

                    <DropdownMenuGroup className="space-y-1">
                        {userTenants.map((item) => {
                            const isSelected = item.id === tenant?.id;
                            const itemInitials = item.name
                                .split(' ')
                                .map((w) => w[0])
                                .join('')
                                .substring(0, 2)
                                .toUpperCase();

                            return (
                                <DropdownMenuItem
                                    key={item.id}
                                    onClick={() => handleSwitchTenant(item)}
                                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                        isSelected
                                            ? isSupervisor
                                                ? 'bg-[#e6f4f9] font-semibold text-[#123e4f] dark:bg-[#12313f] dark:text-[#a5e1f7]'
                                                : 'bg-[#edf7f1] font-semibold text-[#22573d] dark:bg-[#1e3c2c] dark:text-[#a8eec8]'
                                            : 'text-[#334139] hover:bg-[#f4faf6] dark:text-[#d1e8db] dark:hover:bg-[#172d21]'
                                    }`}
                                >
                                    <div
                                        className={`flex size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                                            isSelected
                                                ? isSupervisor
                                                    ? 'bg-[#2596be] text-white'
                                                    : 'bg-[#2f7d57] text-white'
                                                : isSupervisor
                                                  ? 'bg-[#d8eef6] text-[#24586d] dark:bg-[#193a4a] dark:text-[#9fe0f7]'
                                                  : 'bg-[#e2efe7] text-[#3e6853] dark:bg-[#254736] dark:text-[#a8eec8]'
                                        }`}
                                    >
                                        {itemInitials}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate font-medium">{item.name}</div>
                                        <div
                                            className={`text-[10px] capitalize ${
                                                isSupervisor ? 'text-[#4c879e] dark:text-[#7bbad1]' : 'text-[#6b8e7c] dark:text-[#7ba38f]'
                                            }`}
                                        >
                                            {item.business_type} {item.plan_name ? `• ${item.plan_name}` : ''}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <Check
                                            className={`size-4 shrink-0 ${
                                                isSupervisor ? 'text-[#2596be] dark:text-[#6ec5e6]' : 'text-[#2f7d57] dark:text-[#7ee2ad]'
                                            }`}
                                        />
                                    )}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>

                    {isOwner && (
                        <>
                            <DropdownMenuSeparator className="my-1.5 bg-[#e5f1ea] dark:bg-[#254736]" />

                            <DropdownMenuItem
                                onClick={handleOpenCreateModal}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2f7d57] hover:bg-[#edf7f1] focus:bg-[#edf7f1] focus:text-[#2f7d57] dark:text-[#7ee2ad] dark:hover:bg-[#1e3c2c]"
                            >
                                <PlusCircle className="size-4 shrink-0 text-[#2f7d57] dark:text-[#7ee2ad]" />
                                <span>Buat Tenant Baru</span>
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Modal Pembuatan Tenant Baru */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
                    <DialogHeader className="space-y-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#e7f3ec] text-[#2f7d57] dark:bg-[#1e3c2c] dark:text-[#7ee2ad]">
                            <Building2 className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                Buat Bisnis / Tenant Baru
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Tambahkan unit bisnis terpisah. Data produk, pesanan, keuangan, supplier, dan tim anggota akan terisolasi mandiri dari bisnis lainnya.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleCreateTenant} className="space-y-4 mt-2">
                        {/* Nama Bisnis */}
                        <div className="space-y-1.5">
                            <Label htmlFor="create-business-name" className="text-xs font-semibold">
                                Nama Bisnis / Tenant <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="create-business-name"
                                type="text"
                                placeholder="Contoh: Kopi Senja Nusantara"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-9 text-xs focus-visible:ring-[#2f7d57]"
                                required
                            />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>

                        {/* Tipe Bisnis */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold">
                                Tipe Bisnis <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {BUSINESS_TYPES.map((bt) => {
                                    const isSelected = data.business_type === bt.value;
                                    return (
                                        <button
                                            key={bt.value}
                                            type="button"
                                            onClick={() => setData('business_type', bt.value)}
                                            className={`flex flex-col items-start gap-1 rounded-xl border p-2.5 text-left transition-all ${
                                                isSelected
                                                    ? 'border-[#2f7d57] bg-[#edf7f1] text-[#1e3c2c] ring-2 ring-[#2f7d57]/20 dark:border-[#7ee2ad] dark:bg-[#1e3c2c] dark:text-[#cbf5dc]'
                                                    : 'border-gray-200 bg-white hover:border-[#b5dec8] hover:bg-[#f9fcfa] dark:border-gray-800 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <span className="text-base">{bt.emoji}</span>
                                                {isSelected && <Check className="size-3.5 text-[#2f7d57] dark:text-[#7ee2ad]" />}
                                            </div>
                                            <div className="text-xs font-semibold leading-tight">{bt.label}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{bt.desc}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.business_type && <p className="text-[11px] text-rose-500">{errors.business_type}</p>}
                        </div>

                        {/* Pilihan Paket Langganan */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold">
                                    Pilih Paket Langganan <span className="text-rose-500">*</span>
                                </Label>
                                <span className="text-[10.5px] text-[#2f7d57] dark:text-[#7ee2ad] font-medium">Bisa di-upgrade kapan saja</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                {availablePlans.map((plan) => {
                                    const isSelected = data.plan_slug === plan.slug;
                                    const isPro = plan.slug === 'pro';
                                    const isEnterprise = plan.slug === 'enterprise';

                                    return (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            onClick={() => setData('plan_slug', plan.slug)}
                                            className={`relative flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                                                isSelected
                                                    ? 'border-[#2f7d57] bg-[#edf7f1] ring-2 ring-[#2f7d57]/25 dark:border-[#7ee2ad] dark:bg-[#1a382b]'
                                                    : 'border-gray-200 bg-white hover:border-[#b5dec8] hover:bg-[#f9fcfa] dark:border-gray-800 dark:bg-gray-900'
                                            }`}
                                        >
                                            {isPro && (
                                                <span className="absolute -top-2 right-2 rounded-full bg-[#9333ea] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                                                    Populer
                                                </span>
                                            )}
                                            {isEnterprise && (
                                                <span className="absolute -top-2 right-2 rounded-full bg-[#f59e0b] px-1.5 py-0.5 text-[9px] font-bold text-black shadow-xs">
                                                    Terlengkap
                                                </span>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    {plan.slug === 'free' ? (
                                                        <Package className="size-3.5 text-gray-600 dark:text-gray-300" />
                                                    ) : isPro ? (
                                                        <Zap className="size-3.5 text-[#9333ea]" />
                                                    ) : (
                                                        <Sparkles className="size-3.5 text-[#f59e0b]" />
                                                    )}
                                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{plan.name}</span>
                                                </div>

                                                <div className="mt-1.5 text-sm font-extrabold text-[#1e3c2c] dark:text-[#a8eec8]">
                                                    {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                                                    {plan.price > 0 && <span className="text-[10px] font-normal text-gray-500">/bln</span>}
                                                </div>
                                            </div>

                                            <div className="mt-2 border-t border-gray-100 pt-2 text-[10px] text-gray-600 dark:border-gray-800 dark:text-gray-300 space-y-0.5">
                                                <div>📦 Maks. {plan.max_products} Produk</div>
                                                <div>👥 Maks. {plan.max_users} Anggota Tim</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.plan_slug && <p className="text-[11px] text-rose-500">{errors.plan_slug}</p>}
                        </div>

                        {/* Opsi Tambahan: Mata Uang & Kontak */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                            <div className="space-y-1">
                                <Label htmlFor="create-currency" className="text-xs font-semibold flex items-center gap-1">
                                    <Coins className="size-3.5 text-gray-500" /> Mata Uang
                                </Label>
                                <select
                                    id="create-currency"
                                    value={data.currency}
                                    onChange={(e) => setData('currency', e.target.value)}
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f7d57]"
                                >
                                    <option value="IDR">IDR (Rp - Rupiah)</option>
                                    <option value="USD">USD ($ - US Dollar)</option>
                                    <option value="SGD">SGD (S$ - Singapore Dollar)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="create-phone" className="text-xs font-semibold flex items-center gap-1">
                                    <Phone className="size-3.5 text-gray-500" /> No. Telepon / WhatsApp
                                </Label>
                                <Input
                                    id="create-phone"
                                    type="text"
                                    placeholder="08123456789"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="h-9 text-xs focus-visible:ring-[#2f7d57]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="create-address" className="text-xs font-semibold flex items-center gap-1">
                                <MapPin className="size-3.5 text-gray-500" /> Alamat Usaha (Opsional)
                            </Label>
                            <Input
                                id="create-address"
                                type="text"
                                placeholder="Jl. Sudirman No. 123, Jakarta"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="h-9 text-xs focus-visible:ring-[#2f7d57]"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenModal(false)}
                                disabled={processing}
                                className="text-xs"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.name.trim()}
                                className="bg-[#2f7d57] text-white hover:bg-[#256646] text-xs font-semibold gap-1.5"
                            >
                                {processing && <Loader2 className="size-3.5 animate-spin" />}
                                {processing ? 'Membuat Bisnis...' : 'Buat Bisnis Sekarang'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
