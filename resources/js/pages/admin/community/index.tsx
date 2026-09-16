import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { handleAsyncAction } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { MessageCircle, Pin, PinOff, Search, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'navigation.dashboard', href: '/admin' },
    { title: 'navigation.community', href: '/admin/community' },
];

interface CommunityPost {
    id: number;
    title: string;
    category: string;
    business_type: string | null;
    is_pinned: boolean;
    is_active: boolean;
    views_count: number;
    likes_count: number;
    created_at: string;
    user: { id: number; name: string } | null;
    tenant: { id: number; name: string } | null;
}

interface Props {
    posts: {
        data: CommunityPost[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        category?: string;
        status?: string;
        business_type?: string;
    };
}

const categoryColors: Record<string, string> = {
    discussion: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    question: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    tips: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    announcement: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
};

export default function AdminCommunityIndex({ posts, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [businessType, setBusinessType] = useState(filters.business_type || 'all');

    const categoryLabels: Record<string, string> = {
        discussion: 'Diskusi',
        question: 'Pertanyaan',
        tips: 'Tips',
        announcement: 'Pengumuman',
    };

    const handleFilter = () => {
        router.get(
            '/admin/community',
            {
                search,
                category: category === 'all' ? '' : category,
                status: status === 'all' ? '' : status,
                business_type: businessType === 'all' ? '' : businessType,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleTogglePin = (post: CommunityPost) => {
        handleAsyncAction(
            () => new Promise<void>((resolve, reject) => {
                router.patch(`/admin/community/${post.id}/pin`, {}, {
                    onSuccess: () => resolve(),
                    onError: () => reject(),
                    preserveScroll: true,
                });
            }),
            {
                loading: post.is_pinned ? 'Melepas pin...' : 'Menyematkan...',
                success: post.is_pinned ? 'Post berhasil dilepas.' : 'Post berhasil disematkan.',
            }
        );
    };

    const handleToggleActive = (post: CommunityPost) => {
        handleAsyncAction(
            () => new Promise<void>((resolve, reject) => {
                router.patch(`/admin/community/${post.id}/active`, {}, {
                    onSuccess: () => resolve(),
                    onError: () => reject(),
                    preserveScroll: true,
                });
            }),
            {
                loading: 'Memperbarui status...',
                success: post.is_active ? 'Post berhasil dinonaktifkan.' : 'Post berhasil diaktifkan.',
            }
        );
    };

    const handleDelete = (post: CommunityPost) => {
        if (!confirm(`Hapus post "${post.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        handleAsyncAction(
            () => new Promise<void>((resolve, reject) => {
                router.delete(`/admin/community/${post.id}`, {
                    onSuccess: () => resolve(),
                    onError: () => reject(),
                    preserveScroll: true,
                });
            }),
            {
                loading: 'Menghapus post...',
                success: 'Post berhasil dihapus.',
                error: 'Gagal menghapus post.',
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.community.title')} />
            <div className="community-admin-surface relative isolate flex min-h-[calc(100vh-5rem)] w-full flex-1 flex-col gap-0 overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)]">
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>
                {/* Page Header */}
                <div className="admin-page-header relative z-10 overflow-hidden bg-transparent px-6 pt-6 pb-5 text-[#17182A] md:px-8">
                    <div className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-[#1a56ff]/10 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                                    <MessageCircle size={11} />
                                    {t('admin.platformAdmin')}
                                </span>
                            </div>
                            <h1 className="text-[1.8rem] leading-none font-bold tracking-[-0.05em] text-[#17182A] md:text-[2.1rem]">{t('admin.community.title')}</h1>
                            <p className="mt-3 text-sm leading-relaxed text-[#5F6073] md:text-[0.95rem]">{t('admin.community.subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="admin-page-content relative z-10 flex flex-1 flex-col gap-5 px-6 pt-4 pb-6 md:px-8">
                    {/* Filters */}
                    <div className="admin-filter-panel bg-card border-border flex flex-col items-center gap-3 rounded-2xl border p-4 shadow-sm sm:flex-row">
                        <div className="relative w-full flex-1">
                            <Search size={16} className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <Input
                                type="text"
                                placeholder={t('admin.community.searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                className="w-full rounded-xl pl-9"
                            />
                        </div>

                        <div className="w-full sm:w-44">
                            <Select value={businessType} onValueChange={(val) => setBusinessType(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('admin.supplier.businessType')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.community.allBusinessTypes')}</SelectItem>
                                    <SelectItem value="fnb">F&B</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="fashion">Fashion</SelectItem>
                                    <SelectItem value="jasa">{t('admin.tenants.service')}</SelectItem>
                                    <SelectItem value="general">{t('admin.tenants.general')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-40">
                            <Select value={category} onValueChange={(val) => setCategory(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('admin.community.colCategory')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.community.allCategories')}</SelectItem>
                                    <SelectItem value="discussion">Diskusi</SelectItem>
                                    <SelectItem value="question">Pertanyaan</SelectItem>
                                    <SelectItem value="tips">Tips</SelectItem>
                                    <SelectItem value="announcement">Pengumuman</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-full sm:w-36">
                            <Select value={status} onValueChange={(val) => setStatus(val)}>
                                <SelectTrigger className="w-full rounded-xl">
                                    <SelectValue placeholder={t('common.status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin.community.allStatuses')}</SelectItem>
                                    <SelectItem value="active">{t('admin.active')}</SelectItem>
                                    <SelectItem value="inactive">{t('admin.inactive')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleFilter} className="admin-primary-button h-10 w-full rounded-xl px-4 text-sm font-semibold sm:w-auto">
                            {t('common.filter')}
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="admin-data-table border-border bg-card w-full overflow-x-auto rounded-2xl border shadow-sm">
                        <table className="w-full min-w-[800px] border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-border text-muted-foreground border-b bg-[#F8F7FC] text-[11px] font-bold tracking-wider uppercase">
                                    <th className="px-4 py-3">{t('admin.community.colTitle')}</th>
                                    <th className="px-4 py-3">{t('admin.community.colAuthor')}</th>
                                    <th className="px-4 py-3">{t('admin.community.colTenant')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.community.colCategory')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.community.colBusiness')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.community.colStatus')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.community.colViews')}</th>
                                    <th className="px-4 py-3 text-center">{t('admin.community.colActions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-border divide-y">
                                {posts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-muted-foreground h-32 text-center text-sm">
                                            {t('admin.community.noData')}
                                        </td>
                                    </tr>
                                ) : (
                                    posts.data.map((post) => (
                                        <tr key={post.id} className="hover:bg-muted/30 border-border border-b transition-colors">
                                            <td className="max-w-[260px] px-4 py-3">
                                                <div className="flex items-start gap-2">
                                                    {post.is_pinned && (
                                                        <Pin className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                                                    )}
                                                    <span className="line-clamp-2 font-medium">{post.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{post.user?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{post.tenant?.name ?? '—'}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge
                                                    variant="outline"
                                                    className={`px-1.5 py-0 ${categoryColors[post.category] ?? ''}`}
                                                >
                                                    {categoryLabels[post.category] ?? post.category}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {post.business_type ? (
                                                    <Badge variant="outline" className="rounded-full border-[#DCD8FF] bg-[#F1EFFD] px-2 py-0.5 text-[10px] font-semibold text-[#5E4BF2] uppercase">
                                                        {post.business_type === 'fnb' ? 'F&B' : post.business_type}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="outline" className={`rounded-full border-[#DCD8FF] px-2 py-0.5 text-[10px] font-semibold ${post.is_active ? 'bg-[#DCD8FF] text-[#4938D9]' : 'bg-[#F7EFF0] text-[#A96A73]'}`}>
                                                    {post.is_active ? t('admin.active') : t('admin.inactive')}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center text-muted-foreground">{post.views_count}</td>
                                            <td className="px-4 py-3 text-center">
                                                <TooltipProvider delayDuration={150}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button size="icon" variant="ghost" onClick={() => handleTogglePin(post)} className={`h-8 w-8 hover:bg-[#F1EFFD] hover:text-[#5E4BF2] ${post.is_pinned ? 'text-amber-500' : ''}`}>
                                                                    {post.is_pinned ? <PinOff size={15} /> : <Pin size={15} />}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent arrowClassName="community-action-tooltip-arrow" className="community-action-tooltip">
                                                                {post.is_pinned ? 'Lepas pin' : 'Sematkan'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button size="icon" variant="ghost" onClick={() => handleToggleActive(post)} className="h-8 w-8 hover:bg-[#F1EFFD] hover:text-[#5E4BF2]">
                                                                    <Shield size={15} className={post.is_active ? 'text-[#5E4BF2]' : 'text-slate-400'} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent arrowClassName="community-action-tooltip-arrow" className="community-action-tooltip">
                                                                {post.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(post)} className="h-8 w-8 text-rose-500 hover:bg-[#FDEBEC] hover:text-rose-600">
                                                                    <Trash2 size={15} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent arrowClassName="community-action-tooltip-arrow" className="community-action-tooltip">
                                                                {t('common.delete')}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                </TooltipProvider>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="border-border bg-card flex items-center justify-between rounded-xl border border-t px-4 py-3 shadow-sm">
                            <p className="text-muted-foreground text-sm">
                                {t('admin.community.showing')} {(posts.current_page - 1) * posts.per_page + 1}–
                                {Math.min(posts.current_page * posts.per_page, posts.total)} {t('admin.event.from')} {posts.total} post
                            </p>
                            <div className="flex gap-1">
                                {posts.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className="h-9 rounded-xl px-3 text-sm"
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
