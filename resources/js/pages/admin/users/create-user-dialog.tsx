import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Tenant {
    id: number;
    name: string;
}

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenants: Tenant[];
}

const createUserSchema = z
    .object({
        name: z.string().min(1, 'Nama wajib diisi'),
        email: z.string().email('Format email tidak valid'),
        password: z.string().min(8, 'Password minimal 8 karakter'),
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

export function CreateUserDialog({ open, onOpenChange, tenants }: CreateUserDialogProps) {
    const { t } = useTranslation();
    const form = useForm({
        name: '',
        email: '',
        password: '',
        role: 'owner' as 'admin' | 'owner' | 'staff',
        tenant_id: '' as string | null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});
        form.clearErrors();

        const result = createUserSchema.safeParse(form.data);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                errors[path] = issue.message;
            });
            setValidationErrors(errors);
            return;
        }

        form.post('/admin/users', {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                setValidationErrors({});
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('admin.users.createTitle')}</DialogTitle>
                        <DialogDescription>{t('admin.users.createDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('admin.users.fullName')}</Label>
                            <Input
                                id="name"
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
                            <Label htmlFor="email">{t('common.email')}</Label>
                            <Input
                                id="email"
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
                            <Label htmlFor="password">{t('admin.users.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                                placeholder={t('admin.users.passwordPlaceholder')}
                                required
                            />
                            {(validationErrors.password || form.errors.password) && (
                                <p className="text-destructive text-xs">{validationErrors.password || form.errors.password}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">{t('admin.users.role')}</Label>
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
                                <Label htmlFor="tenant_id">{t('admin.users.colTenant')}</Label>
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
                            {form.processing ? t('common.saving') : t('admin.users.saveUser')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
