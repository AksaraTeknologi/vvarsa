import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BUSINESS_TYPE_LABELS } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Users } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const CATEGORY_KEYS = ['discussion', 'question', 'tips', 'announcement'] as const;

const BUSINESS_TYPE_COLORS: Record<string, string> = {
    fnb: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    retail: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
    fashion: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
    general: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    service: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800',
};

interface Props {
    tenant_business_type: string;
}

export default function CommunityCreate({ tenant_business_type }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('community.title'), href: '/community' },
        { title: t('community.createDiscussion'), href: '/community/create' },
    ];

    const discussionSchema = z.object({
        title: z.string().min(5, t('community.validation.titleMin')),
        content: z.string().min(10, t('community.validation.contentMin')),
        category: z.enum(['discussion', 'question', 'tips', 'announcement']),
    });

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: 'discussion',
    });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const businessLabel = t(`community.businessTypes.${tenant_business_type}`, {
        defaultValue: BUSINESS_TYPE_LABELS[tenant_business_type] || tenant_business_type,
    });
    const businessColor = BUSINESS_TYPE_COLORS[tenant_business_type] || BUSINESS_TYPE_COLORS.general;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = discussionSchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        post('/community');
    };

    const displayError = (field: keyof typeof errors) => clientErrors[field] || errors[field];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('community.createDiscussion')} />
            <div className="mx-auto max-w-2xl p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="rounded-xl">
                        <Link href="/community">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('community.createDiscussion')}</h1>
                        <p className="text-muted-foreground text-sm">{t('community.createSubtitle')}</p>
                    </div>
                </div>

                {/* Community context badge */}
                <div className={`mb-5 flex items-center gap-2.5 rounded-2xl border px-4 py-3 ${businessColor}`}>
                    <Users size={16} />
                    <p className="text-sm font-medium">
                        {t('community.contextBadge')} <strong>{businessLabel}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Category picker */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <Label className="mb-3 block font-semibold">{t('community.form.categoryLabel')}</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {CATEGORY_KEYS.map((catKey) => {
                                const catLabel = t(`community.form.categories.${catKey}.label`);
                                const catDesc = t(`community.form.categories.${catKey}.desc`);
                                return (
                                    <button
                                        key={catKey}
                                        type="button"
                                        onClick={() => setData('category', catKey as any)}
                                        className={`rounded-xl border p-3 text-left transition-all ${data.category === catKey ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                                    >
                                        <p className={`text-sm font-medium ${data.category === catKey ? 'text-primary' : ''}`}>{catLabel}</p>
                                        <p className="text-muted-foreground mt-0.5 text-xs">{catDesc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div>
                            <Label htmlFor="title" className="mb-1.5 block">
                                {t('community.form.titleLabel')}
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder={t('community.form.titlePlaceholder')}
                                className={displayError('title') ? 'border-rose-500' : ''}
                            />
                            {displayError('title') && <p className="mt-1 text-xs text-rose-500">{displayError('title')}</p>}
                        </div>

                        <div>
                            <Label htmlFor="content" className="mb-1.5 block">
                                {t('community.form.contentLabel')}
                            </Label>
                            <Textarea
                                id="content"
                                rows={8}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder={t('community.form.contentPlaceholder')}
                                className={displayError('content') ? 'border-rose-500' : ''}
                            />
                            {displayError('content') && <p className="mt-1 text-xs text-rose-500">{displayError('content')}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/community">{t('community.cancel')}</Link>
                        </Button>
                        <Button type="submit" disabled={processing || !data.title || !data.content} className="rounded-xl px-5">
                            {processing ? t('community.posting') : t('community.postDiscussion')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
