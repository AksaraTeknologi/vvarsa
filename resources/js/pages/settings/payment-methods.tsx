import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Edit2, Plus, ShieldAlert, Trash2, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Metode Pembayaran',
        href: '/settings/payment-methods',
    },
];

interface PaymentMethod {
    id: number;
    name: string;
    account_name: string | null;
    account_number: string | null;
    is_active: boolean;
}

interface Props {
    paymentMethods: PaymentMethod[];
}

export default function PaymentMethodsSettings({ paymentMethods }: Props) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.roles?.includes('admin') || auth.user?.role === 'admin';
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form to create
    const createForm = useForm({
        name: '',
        account_name: '',
        account_number: '',
    });

    // Form to edit
    const editForm = useForm({
        name: '',
        account_name: '',
        account_number: '',
        is_active: true as boolean,
    });

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route('payment-methods.store'), {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
            },
        });
    };

    const startEditing = (pm: PaymentMethod) => {
        setEditingId(pm.id);
        editForm.setData({
            name: pm.name,
            account_name: pm.account_name ?? '',
            account_number: pm.account_number ?? '',
            is_active: pm.is_active,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        editForm.reset();
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editForm.patch(route('payment-methods.update', id), {
            preserveScroll: true,
            onSuccess: () => {
                setEditingId(null);
            },
        });
    };

    const handleToggleActive = (pm: PaymentMethod) => {
        handleAsyncAction(
            () =>
                routerPromise(
                    'patch',
                    route('payment-methods.update', pm.id),
                    {
                        name: pm.name,
                        account_name: pm.account_name ?? '',
                        account_number: pm.account_number ?? '',
                        is_active: !pm.is_active,
                    },
                    { preserveScroll: true },
                ),
            {
                loading: `Mengubah status "${pm.name}"...`,
                success: `Status metode pembayaran "${pm.name}" berhasil diubah!`,
                error: 'Gagal Mengubah Status',
            },
        );
    };

    const handleDelete = (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) return;
        handleAsyncAction(() => routerPromise('delete', route('payment-methods.destroy', id), {}, { preserveScroll: true }), {
            loading: 'Menghapus metode pembayaran...',
            success: 'Metode pembayaran berhasil dihapus!',
            error: 'Gagal Menghapus',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengaturan Metode Pembayaran" />

            <SettingsLayout>
                <div className="space-y-5">
                    <HeadingSmall
                        title="Metode Pembayaran Toko"
                        description="Kelola rekening bank, e-wallet, atau opsi pembayaran yang dapat dipilih oleh pelanggan saat checkout."
                    />

                    {/* Form Tambah */}
                    {editingId === null && (
                        <form
                            onSubmit={handleCreate}
                            className={cn(
                                'space-y-4 rounded-2xl p-5 md:p-6',
                                isAdmin
                                    ? 'border border-[#DCD8FF] bg-white text-neutral-900 shadow-sm dark:border-[#2b2d4b] dark:bg-[#16172b] dark:text-white'
                                    : 'border border-[#4ec77e]/30 bg-[#0c1d17] shadow-[0_20px_60px_rgba(7,20,15,0.7)]',
                            )}
                        >
                            <h3 className={cn('flex items-center gap-1.5 text-sm font-semibold', isAdmin ? 'text-neutral-900 dark:text-white' : 'text-[#f4fff8]')}>
                                <Plus size={16} className={isAdmin ? 'text-[#5E4BF2] dark:text-[#79D7FF]' : 'text-[#76dba0]'} />
                                Tambah Metode / Rekening Baru
                            </h3>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                        Nama Metode *
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="cth: Transfer Bank BRI, ShopeePay"
                                        value={createForm.data.name}
                                        onChange={(e) => createForm.setData('name', e.target.value)}
                                        required
                                        className={cn(
                                            'h-10 rounded-xl px-3 text-sm border',
                                            isAdmin
                                                ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                        )}
                                    />
                                    <InputError message={createForm.errors.name} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="account_name" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                        Nama Pemilik (a.n.)
                                    </Label>
                                    <Input
                                        id="account_name"
                                        placeholder="cth: Mochi Delight"
                                        value={createForm.data.account_name}
                                        className={cn(
                                            'h-10 rounded-xl px-3 text-sm border',
                                            isAdmin
                                                ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                        )}
                                        onChange={(e) => createForm.setData('account_name', e.target.value)}
                                    />
                                    <InputError message={createForm.errors.account_name} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="account_number" className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                        No. Rekening / HP
                                    </Label>
                                    <Input
                                        id="account_number"
                                        placeholder="cth: 1223-01-xxxx, 0812-xxxx"
                                        value={createForm.data.account_number}
                                        className={cn(
                                            'h-10 rounded-xl px-3 text-sm border',
                                            isAdmin
                                                ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                        )}
                                        onChange={(e) => createForm.setData('account_number', e.target.value)}
                                    />
                                    <InputError message={createForm.errors.account_number} />
                                </div>
                            </div>
                            <div className="flex justify-end pt-1">
                                <Button type="submit" disabled={createForm.processing} variant={isAdmin ? 'admin' : 'owner'} className="rounded-xl">
                                    {createForm.processing ? 'Menyimpan...' : 'Tambah Metode'}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* List/Table */}
                    <div
                        className={cn(
                            'overflow-hidden rounded-2xl border shadow-sm',
                            isAdmin ? 'border-[#DCD8FF] bg-white dark:border-[#2b2d4b] dark:bg-[#16172b]' : 'border-border bg-white',
                        )}
                    >
                        <div
                            className={cn(
                                'border-b p-4',
                                isAdmin ? 'border-[#DCD8FF] bg-[#F4F2FF] dark:border-[#2b2d4b] dark:bg-[#1e1f38]' : 'border-border bg-[#f7fbf8]',
                            )}
                        >
                            <h3 className={cn('text-sm font-semibold', isAdmin ? 'text-neutral-900 dark:text-white' : 'text-[#1f2a23]')}>
                                Daftar Metode Pembayaran Aktif
                            </h3>
                        </div>
                        {paymentMethods.length === 0 ? (
                            <div className="text-muted-foreground space-y-2 py-12 text-center text-sm">
                                <ShieldAlert size={28} className={cn('mx-auto opacity-50', isAdmin ? 'text-[#5E4BF2]' : 'text-owner-accent')} />
                                <p className="text-sm">Belum ada metode pembayaran yang dikonfigurasi.</p>
                                <p className="text-sm">Sistem akan menggunakan fallback bawaan (Tunai, Transfer, QRIS) di kasir.</p>
                            </div>
                        ) : (
                            <div className="divide-border divide-y">
                                {paymentMethods.map((pm) => {
                                    const isEditing = editingId === pm.id;

                                    if (isEditing) {
                                        return (
                                            <form
                                                key={pm.id}
                                                onSubmit={(e) => handleUpdate(e, pm.id)}
                                                className={cn('space-y-4 p-4 md:p-5', isAdmin ? 'bg-[#5E4BF2]/[0.04] dark:bg-[#5E4BF2]/[0.10]' : 'bg-owner-accent/[0.04]')}
                                            >
                                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                    <div className="space-y-1.5">
                                                        <Label className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                                            Nama Metode *
                                                        </Label>
                                                        <Input
                                                            value={editForm.data.name}
                                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                                            required
                                                            className={cn(
                                                                'h-10 rounded-xl px-3 text-sm border',
                                                                isAdmin
                                                                    ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                                    : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                                            )}
                                                        />
                                                        <InputError message={editForm.errors.name} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                                            Nama Pemilik (a.n.)
                                                        </Label>
                                                        <Input
                                                            value={editForm.data.account_name}
                                                            onChange={(e) => editForm.setData('account_name', e.target.value)}
                                                            className={cn(
                                                                'h-10 rounded-xl px-3 text-sm border',
                                                                isAdmin
                                                                    ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                                    : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                                            )}
                                                        />
                                                        <InputError message={editForm.errors.account_name} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className={cn('text-sm font-medium', isAdmin ? 'text-neutral-800 dark:text-white' : 'text-[#f4fff8]')}>
                                                            No. Rekening / HP
                                                        </Label>
                                                        <Input
                                                            value={editForm.data.account_number}
                                                            onChange={(e) => editForm.setData('account_number', e.target.value)}
                                                            className={cn(
                                                                'h-10 rounded-xl px-3 text-sm border',
                                                                isAdmin
                                                                    ? 'border-[#E2DFFA] bg-white text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20 dark:border-[#2f3154] dark:bg-[#1e1f38] dark:text-white dark:placeholder:text-[#8d8ba7]'
                                                                    : 'border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30',
                                                            )}
                                                        />
                                                        <InputError message={editForm.errors.account_number} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Label className="cursor-pointer" htmlFor={`edit-active-${pm.id}`}>
                                                            Status Aktif
                                                        </Label>
                                                        <input
                                                            type="checkbox"
                                                            id={`edit-active-${pm.id}`}
                                                            checked={editForm.data.is_active}
                                                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                                            className={cn(
                                                                'rounded',
                                                                isAdmin
                                                                    ? 'border-[#5E4BF2] text-[#5E4BF2] focus:ring-[#5E4BF2]'
                                                                    : 'border-owner-accent text-owner-accent focus:ring-owner-accent',
                                                            )}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button type="button" variant="outline" size="sm" onClick={cancelEditing} className="rounded-lg">
                                                            <X size={14} className="mr-1" /> Batal
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            disabled={editForm.processing}
                                                            size="sm"
                                                            variant={isAdmin ? 'admin' : 'owner'}
                                                            className="rounded-lg"
                                                        >
                                                            <Check size={14} className="mr-1" /> Simpan
                                                        </Button>
                                                    </div>
                                                </div>
                                            </form>
                                        );
                                    }

                                    return (
                                        <div key={pm.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{pm.name}</span>
                                                </div>
                                                <div className="text-muted-foreground mt-1 space-y-0.5 text-sm">
                                                    {pm.account_number && (
                                                        <div>
                                                            No. Rek: <span className="font-mono">{pm.account_number}</span>
                                                        </div>
                                                    )}
                                                    {pm.account_name && (
                                                        <div>
                                                            Atas Nama: <span className="font-medium">{pm.account_name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Toggle Switch */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-muted-foreground text-sm">{pm.is_active ? 'Aktif' : 'Non-aktif'}</span>
                                                    <button
                                                        type="button"
                                                        role="switch"
                                                        aria-checked={pm.is_active}
                                                        aria-label={`${pm.is_active ? 'Nonaktifkan' : 'Aktifkan'} ${pm.name}`}
                                                        onClick={() => handleToggleActive(pm)}
                                                        className={`payment-method-switch relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-[#db2777] focus-visible:ring-offset-0 focus:outline-none ${
                                                            pm.is_active
                                                                ? isAdmin
                                                                    ? 'bg-[#5E4BF2]'
                                                                    : 'bg-owner-accent'
                                                                : 'bg-slate-200 dark:bg-slate-800'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`payment-method-switch-thumb pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                                pm.is_active ? 'translate-x-4' : 'translate-x-0'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>

                                                <div className="bg-border hidden h-4 w-px sm:block" />

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => startEditing(pm)}
                                                    className="h-8 w-8 text-slate-500 hover:text-slate-700"
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(pm.id)}
                                                    className="h-8 w-8 text-rose-500 hover:text-rose-700"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
