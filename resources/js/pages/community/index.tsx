import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { BUSINESS_TYPE_LABELS, formatDate, truncate } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type CommunityPost, type PaginatedData } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Heart, MessageCircle, PinIcon, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    posts: PaginatedData<CommunityPost>;
    liked_post_ids: number[];
    filters: { category?: string; search?: string };
    tenant_business_type: string;
}

const CATEGORY_KEYS = ['', 'discussion', 'question', 'tips', 'announcement'];

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
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

export default function CommunityIndex({ posts, liked_post_ids, filters, tenant_business_type }: Props) {
    const { t, i18n } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const currentLocale = i18n.language === 'id' ? 'id-ID' : 'en-US';
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('community.title'), href: '/community' }];

    const businessLabel = t(`community.businessTypes.${tenant_business_type}`, {
        defaultValue: BUSINESS_TYPE_LABELS[tenant_business_type] || tenant_business_type,
    });
    const businessColor = BUSINESS_TYPE_COLORS[tenant_business_type] || BUSINESS_TYPE_COLORS.general;

    const applyFilter = (overrides: Partial<{ search: string; category: string }> = {}) => {
        router.get(
            '/community',
            { search: overrides.search ?? search, category: overrides.category ?? category },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('community.title')} />
            <div className="business-page flex flex-col gap-4 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#1f2a23] md:text-[2.1rem]">{t('community.title')}</h1>
                                <span className={`rounded-full border border-owner-accent/35 px-2.5 py-0.5 text-[11px] font-semibold ${businessColor}`}>
                                    {businessLabel}
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                                {t('community.subtitle', { business: businessLabel })}
                            </p>
                        </div>
                    </div>
                    <Button asChild variant="owner" className="inline-flex items-center gap-2 rounded-xl">
                        <Link href="/community/create">
                            <Plus size={16} /> {t('community.createDiscussion')}
                        </Link>
                    </Button>
                </div>

                {/* Filter Bar */}
                <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {CATEGORY_KEYS.map((catKey) => {
                            const label = t(`community.categories.${catKey || 'all'}`);
                            return (
                                <button
                                    key={catKey}
                                    onClick={() => {
                                        setCategory(catKey);
                                        applyFilter({ category: catKey });
                                    }}
                                    className={`shrink-0 rounded-xl px-4 py-1.5 text-sm font-medium transition-colors ${
                                        category === catKey
                                            ? 'bg-owner-accent text-white'
                                            : 'border-border hover:bg-muted border'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="relative mt-3">
                        <Search size={15} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={t('community.searchPlaceholder', { business: businessLabel })}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="border-border bg-background w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-owner-accent focus:outline-none"
                        />
                    </div>
                </div>

                {/* Posts list */}
                {posts.data.length === 0 ? (
                    <div className="bg-card border-border flex flex-col items-center rounded-2xl border py-16 text-center">
                        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <MessageCircle size={28} className="text-muted-foreground/50" />
                        </div>
                        <p className="font-medium">{t('community.emptyStateTitle')}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            {t('community.emptyStateSubtitle', { business: businessLabel })}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2.5 [perspective:1100px]">
                        {posts.data.map((post) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.id}`}
                                className="bg-card border-border group flex gap-3 rounded-2xl border p-4 shadow-sm [transform-style:preserve-3d] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-owner-accent/40 hover:shadow-[0_14px_24px_rgba(90,166,122,0.16)] hover:[transform:translateY(-4px)_rotateX(1.5deg)_rotateY(2deg)_translateZ(4px)] active:[transform:translateY(-1px)_scale(0.99)] motion-reduce:transition-none motion-reduce:hover:transform-none motion-reduce:active:transform-none"
                            >
                                {/* Avatar */}
                                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-owner-accent/10 text-sm font-bold text-owner-accent sm:flex [transform:translateZ(6px)]">
                                    {getInitials(post.user?.name || '?')}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                        {post.is_pinned && (
                                            <span className="flex items-center gap-1 rounded-full bg-owner-accent/10 px-2 py-0.5 text-xs font-medium text-owner-accent dark:bg-owner-accent/20">
                                                <PinIcon size={9} /> {t('community.pinned')}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[post.category] || 'bg-owner-accent/10 text-owner-accent'}`}
                                        >
                                            {t(`community.categories.${post.category}`, { defaultValue: post.category })}
                                        </span>
                                    </div>

                                    <h2 className="group-hover:text-owner-accent font-semibold leading-snug transition-colors [transform:translateZ(4px)]">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                                        {truncate(post.content, 100)}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            {post.user?.name || t('community.anonymous')}
                                        </span>
                                        <span>{post.tenant?.name}</span>
                                        <span>{timeAgo(post.created_at, t, currentLocale)}</span>
                                        <span className="ml-auto flex items-center gap-2.5">
                                            <span className="flex items-center gap-1">
                                                <Heart
                                                    size={11}
                                                    className={liked_post_ids.includes(post.id) ? 'fill-rose-500 text-rose-500' : ''}
                                                />
                                                {post.likes_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle size={11} />
                                                {post.replies_count}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={11} />
                                                {post.views_count}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex flex-wrap justify-center gap-1">
                        {posts.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-xl px-3 py-1.5 text-sm transition-colors ${
                                    link.active
                                        ? 'bg-owner-accent text-white'
                                        : link.url
                                          ? 'border-border hover:bg-muted border'
                                          : 'text-muted-foreground cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
