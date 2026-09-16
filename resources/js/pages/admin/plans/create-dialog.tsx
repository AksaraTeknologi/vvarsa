import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_FEATURES, getFeatureLabel } from './index';

interface CreatePlanDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreatePlanDialog({ open, onOpenChange }: CreatePlanDialogProps) {
    const { t } = useTranslation();
    const form = useForm({
        name: '',
        price: '0',
        billing_cycle: 'monthly' as 'monthly' | 'yearly',
        max_users: '1',
        max_products: '100',
        features: ['inventory', 'events_view', 'community_read', 'suppliers_view'] as string[],
        is_active: true as boolean,
    });

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
        form.post('/admin/plans', {
            onSuccess: () => {
                onOpenChange(false);
                form.reset();
                form.clearErrors();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="plans-dialog max-h-[85vh] overflow-y-auto border-[#DCD8FF] sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('admin.plans.createTitle')}</DialogTitle>
                        <DialogDescription>{t('admin.plans.createDescription')}</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t('admin.plans.planName')}</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                                placeholder={t('admin.plans.planNamePlaceholder')}
                                className="h-10 rounded-xl border-[#DCD8FF] bg-white text-sm focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                required
                            />
                            {form.errors.name && <p className="text-destructive text-xs">{form.errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">{t('admin.plans.monthlyPrice')}</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={form.data.price}
                                    onChange={(e) => form.setData('price', e.target.value)}
                                    placeholder={t('admin.plans.pricePlaceholder')}
                                    className="h-10 rounded-xl border-[#DCD8FF] bg-white text-sm focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                    required
                                />
                                {form.errors.price && <p className="text-destructive text-xs">{form.errors.price}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="billing_cycle">{t('admin.plans.billingCycle')}</Label>
                                <Select
                                    value={form.data.billing_cycle}
                                    onValueChange={(value) => form.setData('billing_cycle', value as 'monthly' | 'yearly')}
                                >
                                        <SelectTrigger className="h-10 w-full rounded-xl border-[#DCD8FF] bg-white text-sm focus:border-[#5E4BF2] focus:ring-[#5E4BF2]/20">
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
                                <Label htmlFor="max_users">{t('admin.plans.maxUsers')}</Label>
                                <Input
                                    id="max_users"
                                    type="number"
                                    value={form.data.max_users}
                                    onChange={(e) => form.setData('max_users', e.target.value)}
                                    className="h-10 rounded-xl border-[#DCD8FF] bg-white text-sm focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                    required
                                />
                                {form.errors.max_users && <p className="text-destructive text-xs">{form.errors.max_users}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="max_products">{t('admin.plans.maxProducts')}</Label>
                                <Input
                                    id="max_products"
                                    type="number"
                                    value={form.data.max_products}
                                    onChange={(e) => form.setData('max_products', e.target.value)}
                                    className="h-10 rounded-xl border-[#DCD8FF] bg-white text-sm focus-visible:border-[#5E4BF2] focus-visible:ring-[#5E4BF2]/20"
                                    required
                                />
                                {form.errors.max_products && <p className="text-destructive text-xs">{form.errors.max_products}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Checkbox
                                id="is_active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) => form.setData('is_active', checked === true)}
                                className="border-[#DCD8FF] data-[state=checked]:border-[#5E4BF2] data-[state=checked]:bg-[#5E4BF2] data-[state=checked]:text-white"
                            />
                            <Label htmlFor="is_active" className="cursor-pointer text-sm">
                                {t('admin.plans.planActiveLabel')}
                            </Label>
                        </div>

                        <div className="space-y-2 border-t border-[#DCD8FF] pt-2">
                            <Label className="text-sm font-semibold">{t('admin.plans.activeFeatures')}</Label>
                            <div className="grid max-h-48 grid-cols-2 gap-2.5 overflow-y-auto rounded-xl border border-[#DCD8FF] bg-[#F1EFFD]/50 p-1">
                                {AVAILABLE_FEATURES.map((feat) => {
                                    const isChecked = form.data.features.includes(feat.id);
                                    return (
                                        <div
                                            key={feat.id}
                                            className="flex items-start gap-2 rounded-lg p-1.5 hover:bg-[#F1EFFD]"
                                        >
                                            <Checkbox
                                                id={`feat-${feat.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => handleFeatureChange(feat.id, checked === true)}
                                                className="border-[#DCD8FF] data-[state=checked]:border-[#5E4BF2] data-[state=checked]:bg-[#5E4BF2] data-[state=checked]:text-white"
                                            />
                                            <label
                                                htmlFor={`feat-${feat.id}`}
                                                className="cursor-pointer text-xs leading-none text-[#53556A]"
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
                        <Button type="submit" disabled={form.processing} className="admin-primary-button rounded-xl">
                            {form.processing ? t('common.saving') : t('admin.plans.savePlan')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
