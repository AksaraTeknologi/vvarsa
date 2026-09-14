import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { BUSINESS_TYPE_LABELS, formatDate } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type CommunityPost, type CommunityReply } from '@/types/mrp';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Heart, LogIn, LogOut, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
    post: CommunityPost;
    replies: CommunityReply[];
    is_liked: boolean;
    tenant_business_type: string;
    is_member: boolean;
}

const CATEGORY_STYLES: Record<string, string> = {
    discussion: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    question: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    tips: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    announcement: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
};

const BUSINESS_TYPE_COLORS: Record<string, string> = {
    fnb: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    retail: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    fashion: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    general: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
    service: 'bg-owner-accent/10 text-owner-accent dark:bg-owner-accent/20',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function timeAgo(dateStr: string, t: (k: string, opts?: any) => string, locale: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return t('community.time.justNow');
    if (diffMin < 60) return t('community.time.minutesAgo', { count: diffMin });
    if (diffHr < 24) return t('community.time.hoursAgo', { count: diffHr });
    if (diffDay < 7) return t('community.time.daysAgo', { count: diffDay });
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CommunityShow({ post, replies, is_liked, tenant_business_type, is_member }: Props) {
    const { t, i18n } = useTranslation();
    const { auth } = usePage().props as any;

    const currentLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('community.title'), href: '/community' },
        { title: post.title, href: `/community/${post.id}` },
    ];

    const replySchema = z.object({
        content: z.string().min(1, t('community.validation.replyEmpty')),
    });

    const {
        data,
        setData,
        post: submitReply,
        processing,
        errors,
        reset,
    } = useForm({
        content: '',
    });

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const businessLabel = t(`community.businessTypes.${tenant_business_type}`, {
        defaultValue: BUSINESS_TYPE_LABELS[tenant_business_type] || tenant_business_type,
    });
    const businessColor = BUSINESS_TYPE_COLORS[tenant_business_type] || BUSINESS_TYPE_COLORS.general;

    const handleReply = (e: React.FormEvent) => {
        e.preventDefault();
        setClientErrors({});

        const result = replySchema.safeParse(data);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                newErrors[path] = issue.message;
            });
            setClientErrors(newErrors);
            return;
        }

        submitReply(`/community/${post.id}/reply`, {
            onSuccess: () => reset(),
        });
    };

    const toggleLike = () => {
        handleAsyncAction(() => routerPromise('post', `/community/${post.id}/like`, {}, { preserveScroll: true }), {
            loading: t('community.toasts.processing'),
            success: t('community.toasts.success'),
            error: t('community.toasts.failed'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />
            <div className="business-page flex h-[calc(100vh-64px)] flex-col">
                {/* Top bar */}
                <div className="border-border bg-card mx-4 mt-4 flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_8px_22px_rgba(90,166,122,0.08)] md:mx-6 md:px-5">
                    <Link href="/community" className="hover:bg-muted flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <p className="min-w-0 truncate text-sm font-bold text-slate-800 md:text-base">{post.title}</p>
                            <span className={`shrink-0 rounded-full border border-owner-accent/35 px-2 py-0.5 text-xs font-medium ${businessColor}`}>
                                {businessLabel}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className={`rounded-full px-2 py-0.5 ${CATEGORY_STYLES[post.category] || ''}`}>
                                {t(`community.categories.${post.category}`, { defaultValue: post.category })}
                            </span>
                            <span>{t('community.repliesCount', { count: post.replies_count })}</span>
                            <span className="text-slate-300">·</span>
                            <span>{t('community.viewsCount', { count: post.views_count })}</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleLike}
                        className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                            is_liked
                                ? 'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-900/20'
                                : 'border-border text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <Heart size={15} className={is_liked ? 'fill-current' : ''} />
                        <span>{post.likes_count}</span>
                    </button>
                    {is_member ? (
                        <Button variant="outline" size="sm" onClick={() => router.delete(`/community/${post.id}/leave`, { preserveScroll: true })}>
                            <LogOut className="size-4" /> {t('community.leave')}
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="bg-owner-accent text-white hover:opacity-90"
                            onClick={() => router.post(`/community/${post.id}/join`, {}, { preserveScroll: true })}
                        >
                            <LogIn className="size-4" /> {t('community.join')}
                        </Button>
                    )}
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <div className="mx-auto max-w-3xl space-y-5">
                        {/* Original post as first message */}
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-owner-accent/10 text-sm font-bold text-owner-accent">
                                {getInitials(post.user?.name || '?')}
                            </div>
                            <div className="flex-1">
                                <div className="mb-1 flex flex-wrap items-baseline gap-2">
                                    <span className="text-sm font-semibold">{post.user?.name || t('community.anonymous')}</span>
                                    <span className="text-muted-foreground text-xs">{post.tenant?.name}</span>
                                    <span className="text-muted-foreground text-xs">{timeAgo(post.created_at, t, currentLocale)}</span>
                                </div>
                                <div className="bg-card border-border rounded-2xl rounded-tl-sm border px-4 py-3 shadow-sm">
                                    <p className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        {replies.length > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="border-border flex-1 border-t" />
                                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                    <MessageCircle size={12} />
                                    {t('community.repliesCountDivider', { count: replies.length })}
                                </span>
                                <div className="border-border flex-1 border-t" />
                            </div>
                        )}

                        {/* Replies as chat messages */}
                        {replies.map((reply) => {
                            const isMe = reply.user_id === auth?.user?.id;
                            return (
                                <div key={reply.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isMe ? 'bg-owner-accent text-white' : 'bg-muted text-muted-foreground'}`}>
                                        {getInitials(reply.user?.name || '?')}
                                    </div>
                                    <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`mb-1 flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-xs font-semibold">{isMe ? t('community.you') : (reply.user?.name || t('community.anonymous'))}</span>
                                            <span className="text-muted-foreground text-xs">{timeAgo(reply.created_at, t, currentLocale)}</span>
                                        </div>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                isMe
                                                    ? 'rounded-tr-sm bg-owner-accent text-white'
                                                    : 'bg-card border-border border rounded-tl-sm shadow-sm'
                                            }`}
                                        >
                                            {reply.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reply input — pinned at bottom like chat */}
                <div className="shrink-0 px-4 pb-4 pt-3 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        {is_member ? <form onSubmit={handleReply} className="flex items-end gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-owner-accent/10 text-sm font-bold text-owner-accent">
                                {getInitials(auth?.user?.name || '?')}
                            </div>
                            <div className="flex-1">
                                <Textarea
                                    rows={1}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            if (data.content.trim()) handleReply(e as any);
                                        }
                                    }}
                                    placeholder={t('community.replyPlaceholder')}
                                    className={`resize-none rounded-2xl ${clientErrors.content || errors.content ? 'border-rose-500' : ''}`}
                                />
                                {(clientErrors.content || errors.content) && (
                                    <p className="mt-1 text-xs text-rose-500">{clientErrors.content || errors.content}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant="owner"
                                size="icon"
                                disabled={processing || !data.content.trim()}
                                className="h-9 w-9 shrink-0 rounded-xl"
                            >
                                <Send size={15} />
                            </Button>
                        </form> : <div className="text-muted-foreground flex items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm">
                            <LogIn className="size-4" /> {t('community.joinToChat')}
                        </div>}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
