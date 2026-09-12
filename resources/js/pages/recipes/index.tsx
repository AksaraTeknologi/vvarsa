import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type PaginatedData, type Recipe } from '@/types/mrp';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { columns } from './columns';
import { DataTable } from './data-table';

interface Props {
    recipes: PaginatedData<Recipe>;
    filters: { search?: string };
}

export default function RecipesIndex({ recipes, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search ?? '');
    const breadcrumbs: BreadcrumbItem[] = [{ title: t('recipes.title'), href: '/recipes' }];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/recipes', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('recipes.title')} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[1.6rem] leading-none font-bold tracking-[-0.04em] text-[#1f2a23] md:text-[1.9rem]">
                            {t('recipes.title')}
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm leading-relaxed md:text-[0.95rem]">{t('recipes.subtitle')}</p>
                    </div>
                    <Button asChild variant="owner" className="gap-1.5 rounded-xl">
                        <Link href="/recipes/create">
                            <PlusCircle size={16} />
                            {t('recipes.addRecipe')}
                        </Link>
                    </Button>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative max-w-sm flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" size={14} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('recipes.searchPlaceholder')}
                            className="h-10 rounded-xl !border-[#dde9df] !bg-white pl-9 text-sm text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </form>

                {/* Table */}
                <div className="w-full">
                    {recipes.data.length === 0 ? (
                        <div className="bg-card border-border rounded-2xl border p-16 text-center shadow-sm">
                            <BookOpen size={40} className="text-muted-foreground mx-auto mb-3 opacity-40" />
                            <p className="text-muted-foreground font-medium">{t('common.noData')}</p>
                            <p className="text-muted-foreground mt-1 text-sm">{t('recipes.subtitle')}</p>
                            <Button asChild className="mt-4 rounded-xl" variant="outline">
                                <Link href="/recipes/create">+ {t('recipes.addRecipe')}</Link>
                            </Button>
                        </div>
                    ) : (
                        <DataTable columns={columns(t)} data={recipes.data} />
                    )}
                </div>

                {/* Pagination */}
                {recipes.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {recipes.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                className="h-8 rounded-lg px-3 text-xs"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
