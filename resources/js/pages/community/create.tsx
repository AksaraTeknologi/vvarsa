import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const CATEGORY_KEYS = ['discussion', 'question', 'tips', 'announcement'] as const;

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
            <div className="business-page w-full p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl">
                        <Link href="/community">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">
                            {t('community.createDiscussion')}
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-[0.95rem]">{t('community.createSubtitle')}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Category picker */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <Label className="mb-3 block text-sm font-semibold">{t('community.form.categoryLabel')}</Label>
                        <div className="grid grid-cols-2 gap-3 [perspective:1000px]">
                            {CATEGORY_KEYS.map((catKey) => {
                                const catLabel = t(`community.form.categories.${catKey}.label`);
                                const catDesc = t(`community.form.categories.${catKey}.desc`);
                                return (
                                    <button
                                        key={catKey}
                                        type="button"
                                        onClick={() => setData('category', catKey as any)}
                                        className={`group rounded-xl border bg-owner-accent/10 p-3 text-left [transform-style:preserve-3d] transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-owner-accent hover:bg-owner-accent/15 hover:shadow-[0_12px_20px_rgba(90,166,122,0.18)] hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(6px)] active:translate-y-0 active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:transform-none ${data.category === catKey ? 'border-owner-accent bg-owner-accent/20 shadow-[0_8px_16px_rgba(90,166,122,0.18)] [transform:translateZ(5px)]' : 'border-owner-accent/35'}`}
                                    >
                                        <p className={`text-sm font-medium ${data.category === catKey ? 'text-owner-accent' : ''}`}>{catLabel}</p>
                                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{catDesc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-card border-border space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div>
                            <Label htmlFor="title" className="mb-1.5 block text-sm font-medium">
                                {t('community.form.titleLabel')}
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder={t('community.form.titlePlaceholder')}
                                className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('title') ? 'border-rose-500' : ''}`}
                            />
                            {displayError('title') && <p className="mt-1 text-xs text-rose-500">{displayError('title')}</p>}
                        </div>

                        <div>
                            <Label htmlFor="content" className="mb-1.5 block text-sm font-medium">
                                {t('community.form.contentLabel')}
                            </Label>
                            <Textarea
                                id="content"
                                rows={8}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder={t('community.form.contentPlaceholder')}
                                className={`!bg-white !text-sm !text-slate-700 placeholder:text-slate-400 ${displayError('content') ? 'border-rose-500' : ''}`}
                            />
                            {displayError('content') && <p className="mt-1 text-xs text-rose-500">{displayError('content')}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" asChild className="rounded-xl">
                            <Link href="/community">{t('community.cancel')}</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.title || !data.content}
                            variant="owner"
                            className="rounded-xl px-5"
                        >
                            {processing ? t('community.posting') : t('community.postDiscussion')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
