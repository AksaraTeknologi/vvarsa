import AppLayout from '@/layouts/app-layout';
import { BUSINESS_TYPE_LABELS, formatDate, truncate } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { type CommunityPost, type PaginatedData } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Heart, MessageCircle, PinIcon, Plus, Search, Users } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Komunitas', href: '/community' }];

interface Props {
    posts: PaginatedData<CommunityPost>;
    liked_post_ids: number[];
    filters: { category?: string; search?: string };
    tenant_business_type: string;
}

const CATEGORIES = [
    { value: '', label: 'Semua' },
    { value: 'discussion', label: 'Diskusi' },
    { value: 'question', label: 'Pertanyaan' },
    { value: 'tips', label: 'Tips' },
    { value: 'announcement', label: 'Pengumuman' },
];

const CATEGORY_STYLES: Record<string, string> = {
    discussion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    question: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    tips: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    announcement: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const BUSINESS_TYPE_COLORS: Record<string, string> = {
    fnb: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    retail: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    fashion: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    general: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    service: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
};

function getInitials(name: string) {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHr < 24) return `${diffHr} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return formatDate(dateStr, { day: 'numeric', month: 'short' });
}

export default function CommunityIndex({ posts, liked_post_ids, filters, tenant_business_type }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');

    const businessLabel = BUSINESS_TYPE_LABELS[tenant_business_type] || tenant_business_type;
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
            <Head title="Komunitas" />
            <div className="flex flex-col gap-5 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-2xl">
                            <Users size={22} className="text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight">Komunitas</h1>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${businessColor}`}>
                                    {businessLabel}
                                </span>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Forum eksklusif untuk pelaku bisnis {businessLabel}
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/community/create"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all"
                    >
                        <Plus size={16} /> Buat Diskusi
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="bg-card border-border rounded-2xl border p-4 shadow-sm">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => {
                                    setCategory(cat.value);
                                    applyFilter({ category: cat.value });
                                }}
                                className={`shrink-0 rounded-xl px-4 py-1.5 text-sm font-medium transition-colors ${
                                    category === cat.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border-border hover:bg-muted border'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative mt-3">
                        <Search size={15} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder={`Cari diskusi di komunitas ${businessLabel}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                            className="border-border bg-background w-full rounded-xl border py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Posts list */}
                {posts.data.length === 0 ? (
                    <div className="bg-card border-border flex flex-col items-center rounded-2xl border py-16 text-center">
                        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                            <MessageCircle size={28} className="text-muted-foreground/50" />
                        </div>
                        <p className="font-medium">Belum ada diskusi</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Jadilah yang pertama memulai diskusi di komunitas {businessLabel}!
                        </p>
                        <Link
                            href="/community/create"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
                        >
                            <Plus size={14} /> Buat Diskusi Pertama
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {posts.data.map((post) => (
                            <Link
                                key={post.id}
                                href={`/community/${post.id}`}
                                className="bg-card border-border hover:border-primary/30 group flex gap-3 rounded-2xl border p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                {/* Avatar */}
                                <div className="bg-primary/10 text-primary hidden h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:flex">
                                    {getInitials(post.user?.name || '?')}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                        {post.is_pinned && (
                                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                <PinIcon size={9} /> Disematkan
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_STYLES[post.category] || 'bg-slate-100 text-slate-600'}`}
                                        >
                                            {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                                        </span>
                                    </div>

                                    <h2 className="group-hover:text-primary font-semibold leading-snug transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
                                        {truncate(post.content, 100)}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <span className="font-medium text-slate-500 dark:text-slate-400">
                                            {post.user?.name || 'Anonim'}
                                        </span>
                                        <span>{post.tenant?.name}</span>
                                        <span>{timeAgo(post.created_at)}</span>
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
                                        ? 'bg-primary text-primary-foreground'
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

