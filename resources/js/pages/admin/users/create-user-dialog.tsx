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
            <DialogContent className="border-[#4ec77e]/35 bg-[#0c1d17] text-[#ecfff5] shadow-[0_20px_60px_rgba(7,20,15,0.7)] sm:max-w-[450px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-[#f4fff8]">{t('admin.users.createTitle')}</DialogTitle>
                        <DialogDescription className="text-[#d8f3e2]">{t('admin.users.createDescription')}</DialogDescription>
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
                                className="h-12 rounded-xl border border-[#4ec77e]/30 bg-[#0e221b] px-3 text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30"
                                style={{ backgroundColor: '#0e221b', color: '#ecfff5', borderColor: 'rgba(118,219,160,0.42)' }}
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
                                className="h-12 rounded-xl border border-[#4ec77e]/30 bg-[#0e221b] px-3 text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30"
                                style={{ backgroundColor: '#0e221b', color: '#ecfff5', borderColor: 'rgba(118,219,160,0.42)' }}
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
                                className="h-12 rounded-xl border border-[#4ec77e]/30 bg-[#0e221b] px-3 text-[#ecfff5] placeholder:text-[#cfead9] focus-visible:border-[#76dba0] focus-visible:ring-[#4ec77e]/30"
                                style={{ backgroundColor: '#0e221b', color: '#ecfff5', borderColor: 'rgba(118,219,160,0.42)' }}
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
                                <SelectTrigger
                                    className="h-12 w-full rounded-xl border border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus:ring-[#4ec77e]/30 data-[placeholder]:text-[#cfead9]"
                                    style={{ backgroundColor: '#0e221b', color: '#ecfff5', borderColor: 'rgba(118,219,160,0.42)' }}
                                >
                                    <SelectValue placeholder={t('admin.users.selectRole')} />
                                </SelectTrigger>
                                <SelectContent className="border-[#4ec77e]/30 bg-[#0f241d] text-[#ecfff5]">
                                    <SelectItem value="owner" className="focus:bg-[#17392d] focus:text-[#ecfff5]">{t('admin.users.roleOwner')}</SelectItem>
                                    <SelectItem value="staff" className="focus:bg-[#17392d] focus:text-[#ecfff5]">{t('admin.users.roleStaff')}</SelectItem>
                                    <SelectItem value="admin" className="focus:bg-[#17392d] focus:text-[#ecfff5]">{t('admin.users.roleAdmin')}</SelectItem>
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
                                    <SelectTrigger
                                        className="h-12 w-full rounded-xl border border-[#4ec77e]/30 bg-[#0e221b] text-[#ecfff5] placeholder:text-[#cfead9] focus:ring-[#4ec77e]/30 data-[placeholder]:text-[#cfead9]"
                                        style={{ backgroundColor: '#0e221b', color: '#ecfff5', borderColor: 'rgba(118,219,160,0.42)' }}
                                    >
                                        <SelectValue placeholder={t('admin.users.selectBusiness')} />
                                    </SelectTrigger>
                                    <SelectContent className="border-[#4ec77e]/30 bg-[#0f241d] text-[#ecfff5]">
                                        {tenants.map((t) => (
                                            <SelectItem key={t.id} value={t.id.toString()} className="focus:bg-[#17392d] focus:text-[#ecfff5]">
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

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#4ec77e]/40 bg-transparent text-[#ecfff5] hover:bg-[#17392d] hover:text-[#ecfff5]">
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={form.processing} className="bg-[#4ec77e] text-[#0b1a14] hover:bg-[#67d595]">
                            {form.processing ? t('common.saving') : t('admin.users.saveUser')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
