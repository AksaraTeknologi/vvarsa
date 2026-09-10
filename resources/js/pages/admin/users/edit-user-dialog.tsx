import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { type UserItem } from './columns';

interface Tenant {
    id: number;
    name: string;
}

interface EditUserDialogProps {
    user: UserItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenants: Tenant[];
}

const editUserSchema = z
    .object({
        name: z.string().min(1, 'Nama wajib diisi'),
        email: z.string().email('Format email tidak valid'),
        password: z
            .string()
            .refine((val) => val === '' || val.length >= 8, {
                message: 'Password minimal 8 karakter',
            })
            .optional(),
        role: z.enum(['admin', 'owner', 'staff']),
        tenant_id: z.string().optional().nullable(),
    })
    .refine(
        (data) => {
            if ((data.role === 'owner' || data.role === 'staff') && !data.tenant_id) {
                return false;
            }
            return true;
        },
        {
            message: 'Bisnis / Tenant wajib dipilih untuk peran Owner atau Staff',
            path: ['tenant_id'],
        },
    );

export function EditUserDialog({ user, open, onOpenChange, tenants }: EditUserDialogProps) {
    const { t } = useTranslation();
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'owner' as 'admin' | 'owner' | 'staff',
        tenant_id: '' as string | null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            form.setData({
                name: user.name,
                email: user.email,
                password: '',
                role: (user.roles[0]?.name || 'staff') as 'admin' | 'owner' | 'staff',
                tenant_id: user.tenant?.id ? user.tenant.id.toString() : null,
            });
            setValidationErrors({});
            form.clearErrors();
        }
    }, [user, form]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setValidationErrors({});
        form.clearErrors();

        const result = editUserSchema.safeParse(form.data);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                errors[path] = issue.message;
            });
            setValidationErrors(errors);
            return;
        }

        form.put(`/admin/users/${user.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                setValidationErrors({});
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('admin.users.editTitle')}</DialogTitle>
                        <DialogDescription>{t('admin.users.editDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">{t('admin.users.fullName')}</Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder={t('admin.users.fullNamePlaceholder')}
                                required
                            />
                            {(validationErrors.name || form.errors.name) && (
                                <p className="text-destructive text-xs">{validationErrors.name || form.errors.name}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">{t('common.email')}</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                                placeholder={t('admin.users.emailPlaceholder')}
                                required
                            />
                            {(validationErrors.email || form.errors.email) && (
                                <p className="text-destructive text-xs">{validationErrors.email || form.errors.email}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-password">{t('admin.users.newPasswordOptional')}</Label>
                            <Input
                                id="edit-password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder={t('admin.users.passwordLeaveBlank')}
                            />
                            {(validationErrors.password || form.errors.password) && (
                                <p className="text-destructive text-xs">{validationErrors.password || form.errors.password}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-role">{t('admin.users.role')}</Label>
                            <Select
                                value={form.data.role}
                                onValueChange={(val) => {
                                    form.setData('role', val as 'admin' | 'owner' | 'staff');
                                    if (val === 'admin') {
                                        form.setData('tenant_id', null);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('admin.users.selectRole')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="owner">{t('admin.users.roleOwner')}</SelectItem>
                                    <SelectItem value="staff">{t('admin.users.roleStaff')}</SelectItem>
                                    <SelectItem value="admin">{t('admin.users.roleAdmin')}</SelectItem>
                                </SelectContent>
                            </Select>
                            {(validationErrors.role || form.errors.role) && (
                                <p className="text-destructive text-xs">{validationErrors.role || form.errors.role}</p>
                            )}
                        </div>

                        {form.data.role !== 'admin' && (
                            <div className="grid gap-2">
                                <Label htmlFor="edit-tenant_id">{t('admin.users.colTenant')}</Label>
                                <Select value={form.data.tenant_id || ''} onValueChange={(val) => form.setData('tenant_id', val)}>
                                    <SelectTrigger className="w-full rounded-xl">
                                        <SelectValue placeholder={t('admin.users.selectBusiness')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tenants.map((t) => (
                                            <SelectItem key={t.id} value={t.id.toString()}>
                                                {t.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {(validationErrors.tenant_id || form.errors.tenant_id) && (
                                    <p className="text-destructive text-xs">{validationErrors.tenant_id || form.errors.tenant_id}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? t('common.saving') : t('common.save')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
