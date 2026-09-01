import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Clock, ShieldCheck, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { getColumns, type Member } from './columns';
import { DataTable } from './data-table';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Anggota Tim', href: '/members' }];

interface Role {
    id: number;
    name: string;
}

interface PendingRequest {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    requested_by: { id: string; name: string; email: string };
    created_at: string;
}

interface Props {
    members: Member[];
    roles: Role[];
    limit: number;
    member_count: number;
    pending_requests: PendingRequest[];
    is_supervisor: boolean;
    is_owner: boolean;
}

const getMemberSchema = (isOwner: boolean) =>
    z.object({
        name: z.string().min(1, 'Nama wajib diisi'),
        email: z.string().email('Email tidak valid'),
        password: z.string().min(8, 'Password minimal 8 karakter'),
        role: isOwner ? z.enum(['supervisor', 'staff']) : z.enum(['staff']),
    });

const ROLE_LABELS: Record<string, string> = {
    owner: 'Owner',
    supervisor: 'Supervisor',
    staff: 'Staff',
};

export default function MembersIndex({ members, roles, limit, member_count, pending_requests, is_supervisor, is_owner }: Props) {
    const { auth } = usePage<SharedData>().props;
    const authUserId = auth.user.id;
    const authRole = is_owner ? 'owner' : is_supervisor ? 'supervisor' : 'staff';

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        role: 'staff',
    });

    const updateForm = useForm({ role: 'staff' });
    const deleteForm = useForm({});
    const approveForm = useForm({});
    const rejectForm = useForm({});

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const schema = getMemberSchema(is_owner);
        const result = schema.safeParse(addForm.data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        addForm.post('/members', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    // Owner: role cycle owner → supervisor → staff → owner
    const ROLE_CYCLE: Record<string, string> = {
        owner: 'supervisor',
        supervisor: 'staff',
        staff: 'owner',
    };

    const handleUpdateRole = (memberId: number, currentRole: string) => {
        const newRole = ROLE_CYCLE[currentRole] ?? 'staff';
        updateForm.transform((data) => ({ ...data, role: newRole }));
        updateForm.put(`/members/${memberId}`, { preserveScroll: true });
    };

    const handleDeleteMember = (memberId: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${name} dari tim?`)) {
            deleteForm.delete(`/members/${memberId}`, { preserveScroll: true });
        }
    };

    const handleApprove = (requestId: string) => {
        approveForm.post(`/members/requests/${requestId}/approve`, { preserveScroll: true });
    };

    const handleReject = (requestId: string, name: string) => {
        if (confirm(`Tolak permintaan penambahan ${name}?`)) {
            rejectForm.post(`/members/requests/${requestId}/reject`, { preserveScroll: true });
        }
    };

    const capacityPercent = Math.round((member_count / limit) * 100);

    const columns = getColumns(authUserId, authRole, handleUpdateRole, handleDeleteMember, updateForm.processing, deleteForm.processing);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Anggota Tim" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">Anggota Tim</h1>
                        <p className="text-muted-foreground text-sm">Kelola pengguna dan hak akses operasional untuk bisnis Anda.</p>
                    </div>

                    {/* Tombol Tambah Anggota */}
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="inline-flex items-center gap-2 rounded-xl" disabled={member_count >= limit}>
                                <UserPlus size={16} />
                                Tambah Anggota
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleAddMember}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Anggota Baru</DialogTitle>
                                    <DialogDescription>
                                        {is_supervisor
                                            ? 'Permintaan akan dikirim ke owner untuk disetujui sebelum akun aktif.'
                                            : 'Masukkan detail akun untuk mengundang anggota baru ke dashboard bisnis Anda.'}
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Banner info untuk supervisor */}
                                {is_supervisor && (
                                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
                                        <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                                        <span>
                                            Sebagai <strong>Supervisor</strong>, penambahan anggota memerlukan persetujuan owner terlebih dahulu.
                                        </span>
                                    </div>
                                )}

                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            placeholder="Nama Lengkap"
                                            className={clientErrors.name || addForm.errors.name ? 'border-rose-500' : ''}
                                            required
                                        />
                                        {(clientErrors.name || addForm.errors.name) && (
                                            <p className="text-destructive text-xs">{clientErrors.name || addForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={addForm.data.email}
                                            onChange={(e) => addForm.setData('email', e.target.value)}
                                            placeholder="name@example.com"
                                            className={clientErrors.email || addForm.errors.email ? 'border-rose-500' : ''}
                                            required
                                        />
                                        {(clientErrors.email || addForm.errors.email) && (
                                            <p className="text-destructive text-xs">{clientErrors.email || addForm.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password Sementara</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={addForm.data.password}
                                            onChange={(e) => addForm.setData('password', e.target.value)}
                                            placeholder="Min. 8 karakter"
                                            className={clientErrors.password || addForm.errors.password ? 'border-rose-500' : ''}
                                            required
                                        />
                                        {(clientErrors.password || addForm.errors.password) && (
                                            <p className="text-destructive text-xs">{clientErrors.password || addForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Peran / Hak Akses</Label>
                                        <Select value={addForm.data.role} onValueChange={(val) => addForm.setData('role', val)}>
                                            <SelectTrigger id="role" className="h-9 rounded-xl">
                                                <SelectValue placeholder="Pilih Peran" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="staff">Staff (Akses Terbatas: Stok & Operasional)</SelectItem>
                                                {is_owner && (
                                                    <SelectItem value="supervisor">Supervisor (Akses Luas, Butuh Approval Member)</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {(clientErrors.role || addForm.errors.role) && (
                                            <p className="text-destructive text-xs">{clientErrors.role || addForm.errors.role}</p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={addForm.processing} className="rounded-xl">
                                        {addForm.processing
                                            ? is_supervisor
                                                ? 'Mengirim...'
                                                : 'Menyimpan...'
                                            : is_supervisor
                                              ? 'Kirim Permintaan'
                                              : 'Tambah Anggota'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ── Pending Requests Section (hanya owner) ── */}
                {is_owner && pending_requests.length > 0 && (
                    <Card className="rounded-2xl border-amber-200 bg-amber-50/50 shadow-sm dark:border-amber-800/40 dark:bg-amber-900/10">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-amber-700 dark:text-amber-400">
                                <Clock size={18} />
                                Permintaan Menunggu Persetujuan
                                <Badge className="ml-1 bg-amber-500 text-white hover:bg-amber-500">{pending_requests.length}</Badge>
                            </CardTitle>
                            <CardDescription>
                                Supervisor mengajukan permintaan penambahan anggota baru. Tinjau dan setujui atau tolak.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-col gap-3">
                                {pending_requests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="dark:bg-card flex flex-col gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-amber-800/30"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                {req.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-foreground text-sm font-semibold">{req.name}</p>
                                                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] capitalize">
                                                        {ROLE_LABELS[req.role] ?? req.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground text-xs">{req.email}</p>
                                                <p className="text-muted-foreground mt-0.5 text-xs">
                                                    Diajukan oleh: <span className="text-foreground font-medium">{req.requested_by?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:shrink-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-8 gap-1.5 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800/40 dark:hover:bg-rose-900/20"
                                                disabled={rejectForm.processing}
                                                onClick={() => handleReject(req.id, req.name)}
                                            >
                                                <X size={14} />
                                                Tolak
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 gap-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                                disabled={approveForm.processing}
                                                onClick={() => handleApprove(req.id)}
                                            >
                                                <Check size={14} />
                                                Setujui
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Limit status indicator */}
                <Card className="border-border rounded-2xl shadow-sm">
                    <CardContent className="pt-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Users size={16} />
                                Batas Kapasitas Pengguna
                            </span>
                            <span className="text-foreground font-semibold">
                                {member_count} / {limit} pengguna terdaftar
                            </span>
                        </div>
                        <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-amber-500' : 'bg-primary'
                                }`}
                                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                            />
                        </div>
                        {member_count >= limit && (
                            <p className="mt-3 flex items-center gap-1 text-xs text-rose-500">
                                <AlertCircle size={14} />
                                Kuota pengguna Anda sudah penuh. Hubungi pemilik atau upgrade paket langganan untuk menambah lebih banyak staff.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Team members list DataTable */}
                <Card className="border-border overflow-hidden rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <CardDescription>Semua pengguna yang memiliki akses ke dashboard tenant bisnis Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable columns={columns} data={members} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
