import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_FEATURES, getFeatureLabel, type Plan } from './index';

interface EditPlanDialogProps {
    plan: Plan | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditPlanDialog({ plan, open, onOpenChange }: EditPlanDialogProps) {
    const { t } = useTranslation();
    const form = useForm({
        name: '',
        price: '0',
        billing_cycle: 'monthly' as 'monthly' | 'yearly',
        max_users: '1',
        max_products: '100',
        features: [] as string[],
        is_active: true as boolean,
    });

    // Update form data when plan changes
    useEffect(() => {
        if (plan) {
            form.setData({
                name: plan.name,
                price: plan.price.toString(),
                billing_cycle: plan.billing_cycle,
                max_users: plan.max_users.toString(),
                max_products: plan.max_products.toString(),
                features: plan.features || [],
                is_active: plan.is_active,
            });
            form.clearErrors();
        }
    }, [plan, form]);

    const handleFeatureChange = (featureId: string, checked: boolean) => {
        const currentFeatures = [...form.data.features];
        if (checked) {
            form.setData('features', [...currentFeatures, featureId]);
        } else {
            form.setData(
                'features',
                currentFeatures.filter((f) => f !== featureId),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!plan) return;

        form.put(`/admin/plans/${plan.id}`, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('admin.plans.editTitle')}</DialogTitle>
                        <DialogDescription>{t('admin.plans.editDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">{t('admin.plans.planName')}</Label>
                            <Input
                                id="edit-name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder={t('admin.plans.planNamePlaceholder')}
                                required
                            />
                            {form.errors.name && <p className="text-destructive text-xs">{form.errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-price">{t('admin.plans.monthlyPrice')}</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    placeholder={t('admin.plans.pricePlaceholder')}
                                    required
                                />
                                {form.errors.price && <p className="text-destructive text-xs">{form.errors.price}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-billing_cycle">{t('admin.plans.billingCycle')}</Label>
                                <Select
                                    value={form.data.billing_cycle}
                                    onValueChange={(value) => form.setData('billing_cycle', value as 'monthly' | 'yearly')}
                                >
                                    <SelectTrigger className="w-full rounded-xl">
                                        <SelectValue placeholder={t('admin.plans.billingCycle')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">{t('admin.plans.monthly')}</SelectItem>
                                        <SelectItem value="yearly">{t('admin.plans.yearly')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.billing_cycle && <p className="text-destructive text-xs">{form.errors.billing_cycle}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-max_users">{t('admin.plans.maxUsers')}</Label>
                                <Input
                                    id="edit-max_users"
                                    type="number"
                                    value={form.data.max_users}
                                    onChange={(e) => form.setData('max_users', e.target.value)}
                                    required
                                />
                                {form.errors.max_users && <p className="text-destructive text-xs">{form.errors.max_users}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="edit-max_products">{t('admin.plans.maxProducts')}</Label>
                                <Input
                                    id="edit-max_products"
                                    type="number"
                                    value={form.data.max_products}
                                    onChange={(e) => form.setData('max_products', e.target.value)}
                                    required
                                />
                                {form.errors.max_products && <p className="text-destructive text-xs">{form.errors.max_products}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                                id="edit-is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) => form.setData('is_active', checked === true)}
                            />
                            <Label htmlFor="edit-is_active" className="cursor-pointer text-sm">
                                {t('admin.plans.planActiveLabel')}
                            </Label>
                        </div>

                        <div className="space-y-2 border-t pt-2">
                            <Label className="text-sm font-semibold">{t('admin.plans.activeFeatures')}</Label>
                            <div className="grid max-h-48 grid-cols-2 gap-2.5 overflow-y-auto rounded-lg border bg-slate-50/50 p-1 dark:bg-slate-800/10">
                                {AVAILABLE_FEATURES.map((feat) => {
                                    const isChecked = form.data.features.includes(feat.id);
                                    return (
                                        <div
                                            key={feat.id}
                                            className="flex items-start gap-2 rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <Checkbox
                                                id={`edit-feat-${feat.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => handleFeatureChange(feat.id, checked === true)}
                                            />
                                            <label
                                                htmlFor={`edit-feat-${feat.id}`}
                                                className="cursor-pointer text-xs leading-none text-slate-700 dark:text-slate-300"
                                            >
                                                {getFeatureLabel(feat.id, t)}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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
