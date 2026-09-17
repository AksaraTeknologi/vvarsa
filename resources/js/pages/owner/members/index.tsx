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
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getColumns, type Member } from './columns';
import { DataTable } from './data-table';

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

export default function MembersIndex({ members, limit, member_count, pending_requests, is_supervisor, is_owner }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const authUserId = auth.user.id;
    const authRole = is_owner ? 'owner' : is_supervisor ? 'supervisor' : 'staff';
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('members.title'), href: '/members' }];

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
        if (confirm(t('members.deleteConfirm', { name }))) {
            deleteForm.delete(`/members/${memberId}`, { preserveScroll: true });
        }
    };

    const handleApprove = (requestId: string) => {
        approveForm.post(`/members/requests/${requestId}/approve`, { preserveScroll: true });
    };

    const handleReject = (requestId: string, name: string) => {
        if (confirm(t('members.rejectConfirm', { name }))) {
            rejectForm.post(`/members/requests/${requestId}/reject`, { preserveScroll: true });
        }
    };

    const capacityPercent = Math.round((member_count / limit) * 100);

    const columns = getColumns(authUserId, authRole, handleUpdateRole, handleDeleteMember, updateForm.processing, deleteForm.processing, t);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('members.title')} />
            <div className="business-page members-page flex flex-col gap-4 p-4 md:p-6">
                {/* Header section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">
                            {t('members.title')}
                        </h1>
                        <p className="business-page-subtitle text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">
                            {t('members.subtitle')}
                        </p>
                    </div>

                    {/* Tombol Tambah Anggota */}
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="owner" className="inline-flex items-center gap-2 rounded-xl" disabled={member_count >= limit}>
                                <UserPlus size={16} />
                                {t('members.addMember')}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="text-sm sm:max-w-[520px]">
                            <form onSubmit={handleAddMember}>
                                <DialogHeader className="space-y-2">
                                    <DialogTitle className="text-lg font-semibold">{t('members.addTitle')}</DialogTitle>
                                    <DialogDescription className="text-sm leading-relaxed">
                                        {is_supervisor ? t('members.supervisorNoticeDesc') : t('members.ownerNoticeDesc')}
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Banner info untuk supervisor */}
                                {is_supervisor && (
                                    <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                        <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                                        <span>{t('members.supervisorBanner')}</span>
                                    </div>
                                )}

                                <div className="grid gap-4 py-5">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-sm font-medium">
                                            {t('members.fullName')}
                                        </Label>
                                        <Input
                                            id="name"
                                            value={addForm.data.name}
                                            onChange={(e) => addForm.setData('name', e.target.value)}
                                            placeholder={t('members.fullName')}
                                            className={`h-10 !border-[#d9e5dd] !bg-white !text-sm text-slate-700 focus-visible:!border-[#5aa67a] focus-visible:!ring-[#5aa67a]/20 ${clientErrors.name || addForm.errors.name ? '!border-rose-500' : ''}`}
                                            required
                                        />
                                        {(clientErrors.name || addForm.errors.name) && (
                                            <p className="text-destructive text-sm">{clientErrors.name || addForm.errors.name}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            {t('members.email')}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={addForm.data.email}
                                            onChange={(e) => addForm.setData('email', e.target.value)}
                                            placeholder="name@example.com"
                                            className={`h-10 !border-[#d9e5dd] !bg-white !text-sm text-slate-700 focus-visible:!border-[#5aa67a] focus-visible:!ring-[#5aa67a]/20 ${clientErrors.email || addForm.errors.email ? '!border-rose-500' : ''}`}
                                            required
                                        />
                                        {(clientErrors.email || addForm.errors.email) && (
                                            <p className="text-destructive text-sm">{clientErrors.email || addForm.errors.email}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            {t('members.tempPassword')}
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={addForm.data.password}
                                            onChange={(e) => addForm.setData('password', e.target.value)}
                                            placeholder={t('members.passwordHint')}
                                            className={`h-10 !border-[#d9e5dd] !bg-white !text-sm text-slate-700 focus-visible:!border-[#5aa67a] focus-visible:!ring-[#5aa67a]/20 ${clientErrors.password || addForm.errors.password ? '!border-rose-500' : ''}`}
                                            required
                                        />
                                        {(clientErrors.password || addForm.errors.password) && (
                                            <p className="text-destructive text-sm">{clientErrors.password || addForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role" className="text-sm font-medium">
                                            {t('members.roleLabel')}
                                        </Label>
                                        <Select value={addForm.data.role} onValueChange={(val) => addForm.setData('role', val)}>
                                            <SelectTrigger
                                                id="role"
                                                className="h-10 rounded-xl !border-[#d9e5dd] bg-white text-sm text-slate-700 focus:!border-[#5aa67a] focus:!ring-[#5aa67a]/20"
                                            >
                                                <SelectValue placeholder={t('members.selectRole')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="staff" className="text-sm">
                                                    {t('members.staffRoleDesc')}
                                                </SelectItem>
                                                {is_owner && (
                                                    <SelectItem value="supervisor" className="text-sm">
                                                        {t('members.supervisorRoleDesc')}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {(clientErrors.role || addForm.errors.role) && (
                                            <p className="text-destructive text-sm">{clientErrors.role || addForm.errors.role}</p>
                                        )}
                                    </div>
                                </div>

                                <DialogFooter className="gap-2">
                                    <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl">
                                        {t('members.cancel')}
                                    </Button>
                                    <Button type="submit" disabled={addForm.processing} variant="owner" className="rounded-xl">
                                        {addForm.processing
                                            ? is_supervisor
                                                ? t('members.sending')
                                                : t('members.saving')
                                            : is_supervisor
                                              ? t('members.sendRequest')
                                              : t('members.addMember')}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* ── Pending Requests Section (hanya owner) ── */}
                {is_owner && pending_requests.length > 0 && (
                    <Card className="border-owner-accent/30 rounded-2xl bg-white shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-owner-accent flex items-center gap-2 text-sm font-semibold">
                                <Clock size={18} />
                                {t('members.pendingTitle')}
                                <Badge className="bg-owner-accent hover:bg-owner-accent ml-1 text-white">{pending_requests.length}</Badge>
                            </CardTitle>
                            <CardDescription className="text-sm leading-relaxed">{t('members.pendingDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="flex flex-col gap-3">
                                {pending_requests.map((req) => (
                                    <div
                                        key={req.id}
                                        className="border-border flex flex-col gap-3 rounded-xl border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="bg-owner-accent/10 text-owner-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                                {req.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-foreground text-sm font-semibold">{req.name}</p>
                                                    <Badge variant="outline" className="px-1.5 py-0 text-sm capitalize">
                                                        {ROLE_LABELS[req.role] ?? req.role}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground text-sm">{req.email}</p>
                                                <p className="text-muted-foreground mt-0.5 text-sm">
                                                    {t('members.requestedBy', { name: req.requested_by?.name })}
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
                                                {t('members.reject')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="owner"
                                                className="h-8 gap-1.5 rounded-lg"
                                                disabled={approveForm.processing}
                                                onClick={() => handleApprove(req.id)}
                                            >
                                                <Check size={14} />
                                                {t('members.approve')}
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
                                {t('members.capacityLabel')}
                            </span>
                            <span className="text-foreground font-semibold">{t('members.capacityCount', { count: member_count, limit })}</span>
                        </div>
                        <div className="bg-muted h-2.5 overflow-hidden rounded-full">
                            <div
                                className="bg-owner-accent h-full rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                            />
                        </div>
                        {member_count >= limit && (
                            <p className="mt-3 flex items-center gap-1 text-sm text-rose-500">
                                <AlertCircle size={14} />
                                {t('members.capacityFullWarning')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Team members list DataTable */}
                <Card className="border-border overflow-hidden rounded-2xl shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">{t('members.listTitle')}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{t('members.listDesc')}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable columns={columns} data={members} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
