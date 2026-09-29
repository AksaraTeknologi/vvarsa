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
    Layers,
    Users,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils-mrp';
import { type AvailablePlan, type SharedData, type UserTenantItem } from '@/types';

// Tipe bisnis dengan ikon dan deskripsi
const BUSINESS_TYPES = [
    {
        value: 'fnb',
        label: 'Food & Beverage',
        icon: UtensilsCrossed,
        desc: 'Restoran, kafe, kuliner',
    },
    {
        value: 'retail',
        label: 'Retail / Toko',
        icon: ShoppingBag,
        desc: 'Minimarket, grosir, toko kelontong',
    },
    {
        value: 'fashion',
        label: 'Fashion & Apparel',
        icon: Shirt,
        desc: 'Butik, distro, pakaian',
    },
    {
        value: 'services',
        label: 'Jasa / Services',
        icon: Wrench,
        desc: 'Salon, bengkel, laundry, jasa',
    },
    {
        value: 'general',
        label: 'Umum / General',
        icon: Layers,
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
                            data-owner-tenant-avatar={isOwner ? '' : undefined}
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
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-[#234738] bg-[#0b1f1a] p-5 text-[#edfdf4] shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-[1.8rem] font-extrabold tracking-tight text-[#ebfff4]">
                            Buat Bisnis / Tenant Baru
                        </DialogTitle>
                        <DialogDescription className="mt-1 text-xs text-[#b9d3c8]">
                            Tambahkan unit bisnis terpisah. Data produk, pesanan, keuangan, supplier, dan tim anggota akan terisolasi mandiri dari bisnis lainnya.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateTenant} className="space-y-4 mt-2">
                        {/* Nama Bisnis */}
                        <div className="space-y-1.5">
                            <Label htmlFor="create-business-name" className="text-xs font-semibold text-[#ebfff4]">
                                Nama Bisnis / Tenant <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="create-business-name"
                                type="text"
                                placeholder="Contoh: Kopi Senja Nusantara"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-11 rounded-2xl border border-[#2a4d42] bg-[#0d251f] px-4 text-sm text-[#ebfff4] placeholder:text-[#8aac9e] focus-visible:ring-2 focus-visible:ring-[#5fe198]/30"
                                required
                            />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>

                        {/* Tipe Bisnis */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-[#ebfff4]">
                                Tipe Bisnis <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {BUSINESS_TYPES.map((bt) => {
                                    const isSelected = data.business_type === bt.value;
                                    const Icon = bt.icon;

                                    return (
                                        <button
                                            key={bt.value}
                                            type="button"
                                            onClick={() => setData('business_type', bt.value)}
                                            className={`flex min-h-[118px] flex-col items-start justify-between gap-2 rounded-2xl border p-3 text-left transition-all ${
                                                isSelected
                                                    ? 'border-[#4ec77e]/60 bg-[#133327] text-[#ebfff4] shadow-[0_0_0_1px_rgba(78,199,126,0.25)]'
                                                    : 'border-[#203d34] bg-[#0f2721] text-[#dcefe5] hover:border-[#2d5446] hover:bg-[#122d26]'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <div
                                                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                                                        isSelected
                                                            ? 'border-[#4ec77e]/40 bg-[#1a4634] text-[#dfffea]'
                                                            : 'border-[#294b42] bg-[#112b26] text-[#b7d9c9]'
                                                    }`}
                                                >
                                                    <Icon className="size-4" />
                                                </div>
                                                {isSelected && <Check className="size-3.5 text-[#8ce7ab]" />}
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-semibold leading-tight">{bt.label}</div>
                                                <div className="text-[10px] text-[#a8c5b7] line-clamp-1">{bt.desc}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.business_type && <p className="text-[11px] text-rose-500">{errors.business_type}</p>}
                        </div>

                        {/* Pilihan Paket Langganan */}
                        <div className="space-y-1.5">
                            <div className="mb-1 flex items-center justify-between gap-2">
                                <Label className="text-xs font-semibold text-[#ebfff4]">
                                    Pilih Paket Langganan <span className="text-rose-500">*</span>
                                </Label>
                            </div>
                            <div className="mb-2 flex justify-end">
                                <span className="text-[11px] font-semibold tracking-[0.01em] text-[#b7e9ca]">Bisa di-upgrade kapan saja</span>
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
                                            className={`relative flex min-h-[180px] flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
                                                isSelected
                                                    ? 'border-[#4ec77e]/60 bg-[#123b2f] text-[#ebfff4] shadow-[0_0_0_1px_rgba(78,199,126,0.25)]'
                                                    : 'border-[#224a3d] bg-[#0d251f] text-[#d9efe4] hover:border-[#3a6d5a] hover:bg-[#102e27]'
                                            }`}
                                        >
                                            {isPro && (
                                                <span className="absolute -top-2 right-3 rounded-full bg-[#8b5cf6] px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
                                                    Populer
                                                </span>
                                            )}
                                            {isEnterprise && (
                                                <span className="absolute -top-2 right-3 rounded-full bg-[#f4b740] px-2 py-0.5 text-[9px] font-bold text-[#1a1a1a] shadow-sm">
                                                    Terlengkap
                                                </span>
                                            )}

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                                                        isSelected
                                                            ? 'border-[#5fe198] bg-[#1a4d3d] text-white'
                                                            : 'border-[#2b4a40] bg-[#112d27] text-white'
                                                    }`}>
                                                        {plan.slug === 'free' ? (
                                                            <Package className="size-3.5" />
                                                        ) : isPro ? (
                                                            <Zap className="size-3.5 text-white" />
                                                        ) : (
                                                            <Sparkles className="size-3.5 text-white" />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-bold text-[#f3fff8]">{plan.name}</span>
                                                </div>

                                                <div className="mt-3 text-lg font-extrabold text-[#f5fff8]">
                                                    {plan.price === 0 ? 'Gratis' : formatCurrency(plan.price)}
                                                    {plan.price > 0 && <span className="ml-1 text-[10px] font-medium text-[#a8c5b7]">/bln</span>}
                                                </div>
                                            </div>

                                            <div className="mt-3 border-t border-[#21473b] pt-2 text-[10px] text-[#c2d9ce] space-y-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <Package className="size-3.5 text-[#a2f2c8]" />
                                                    <span>Maks. {plan.max_products} Produk</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="size-3.5 text-[#a2f2c8]" />
                                                    <span>Maks. {plan.max_users} Anggota Tim</span>
                                                </div>
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
                                <Label htmlFor="create-currency" className="flex items-center gap-1 text-xs font-semibold text-[#ebfff4]">
                                    <Coins className="size-3.5 text-[#a2f2c8]" /> Mata Uang
                                </Label>
                                <Select
                                    value={data.currency}
                                    onValueChange={(value) => setData('currency', value)}
                                >
                                    <SelectTrigger
                                        id="create-currency"
                                        className="h-11 rounded-full border border-[#2d4f42] bg-[#0d251f] px-4 text-sm font-medium text-[#ebfff4] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] focus:border-[#5fe198] focus:ring-2 focus:ring-[#5fe198]/25"
                                    >
                                        <SelectValue placeholder="Pilih mata uang" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border border-[#2d4f42] bg-[#0d251f] text-[#ebfff4] shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                                        <SelectItem value="IDR" className="rounded-lg text-[#ebfff4] focus:bg-[#123b2f] focus:text-[#ebfff4]">IDR (Rp - Rupiah)</SelectItem>
                                        <SelectItem value="USD" className="rounded-lg text-[#ebfff4] focus:bg-[#123b2f] focus:text-[#ebfff4]">USD ($ - US Dollar)</SelectItem>
                                        <SelectItem value="SGD" className="rounded-lg text-[#ebfff4] focus:bg-[#123b2f] focus:text-[#ebfff4]">SGD (S$ - Singapore Dollar)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="create-phone" className="flex items-center gap-1 text-xs font-semibold text-[#ebfff4]">
                                    <Phone className="size-3.5 text-[#a2f2c8]" /> No. Telepon / WhatsApp
                                </Label>
                                <Input
                                    id="create-phone"
                                    type="text"
                                    placeholder="08123456789"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="h-11 rounded-2xl border border-[#2a4d42] bg-[#0d251f] px-4 text-sm text-[#ebfff4] placeholder:text-[#8aac9e] focus-visible:ring-2 focus-visible:ring-[#5fe198]/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="create-address" className="flex items-center gap-1 text-xs font-semibold text-[#ebfff4]">
                                <MapPin className="size-3.5 text-[#a2f2c8]" /> Alamat Usaha (Opsional)
                            </Label>
                            <Input
                                id="create-address"
                                type="text"
                                placeholder="Jl. Sudirman No. 123, Jakarta"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                className="h-11 rounded-2xl border border-[#2a4d42] bg-[#0d251f] px-4 text-sm text-[#ebfff4] placeholder:text-[#8aac9e] focus-visible:ring-2 focus-visible:ring-[#5fe198]/30"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenModal(false)}
                                disabled={processing}
                                className="h-11 rounded-full border border-[#1b1b1b] bg-[#111111] px-6 text-sm font-semibold text-white shadow-sm hover:bg-[#1b1b1b] hover:text-white focus-visible:ring-2 focus-visible:ring-[#5fe198]/30"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.name.trim()}
                                className="h-11 rounded-full bg-[#2f7d57] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,125,87,0.28)] hover:bg-[#256646] disabled:opacity-60"
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
