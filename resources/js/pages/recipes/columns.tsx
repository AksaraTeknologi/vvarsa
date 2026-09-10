'use client';

import { DataTableColumnHeader } from '@/components/data-table-column-header';
import DeleteConfirmDialog from '@/components/delete-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { handleAsyncAction, routerPromise } from '@/lib/toast-handler';
import { formatRupiah } from '@/lib/utils-mrp';
import { type Recipe } from '@/types/mrp';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { BookOpen, Edit, Trash } from 'lucide-react';

function RecipeActions({ recipe, t }: { recipe: Recipe; t: any }) {
    const handleDelete = () => {
        handleAsyncAction(() => routerPromise('delete', `/recipes/${recipe.id}`, {}, { preserveScroll: true }), {
            loading: t('recipes.deleting', { name: recipe.name, defaultValue: `Menghapus resep "${recipe.name}"...` }),
            success: t('recipes.deleteSuccess', { name: recipe.name, defaultValue: `Resep "${recipe.name}" berhasil dihapus!` }),
            error: t('common.failed', 'Gagal Menghapus'),
        });
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/recipes/${recipe.id}/edit`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('recipes.editRecipe', 'Edit Resep')}</p>
                </TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <DeleteConfirmDialog
                            trigger={
                                <Button variant="link" size="icon" className="size-8 text-red-500 hover:cursor-pointer">
                                    <Trash className="size-4" />
                                    <span className="sr-only">{t('recipes.deleteRecipe', 'Hapus Resep')}</span>
                                </Button>
                            }
                            title={t('recipes.deleteConfirm', 'Apakah Anda yakin ingin menghapus resep ini?')}
                            itemName={recipe.name}
                            onConfirm={handleDelete}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('recipes.deleteRecipe', 'Hapus Resep')}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

export const columns = (t: any): ColumnDef<Recipe>[] => [
    {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
            const index = row.index + 1;
            return <div className="font-medium">{index}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('recipes.recipeName', 'Nama Resep')} />,
        cell: ({ row }) => {
            const recipe = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-violet-50 p-1.5 text-violet-500 dark:bg-violet-950/40">
                        <BookOpen size={16} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-violet-600 dark:text-violet-400">{recipe.name}</div>
                        {recipe.description && <div className="text-muted-foreground mt-0.5 max-w-xs truncate text-xs">{recipe.description}</div>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'ingredients',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('recipes.ingredients', 'Bahan-bahan')} />,
        cell: ({ row }) => {
            const ingredients = row.original.ingredients ?? [];
            return (
                <div className="flex max-w-md flex-wrap gap-1">
                    {ingredients.map((ing: any, i: number) => (
                        <span key={i} className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                            {ing.ingredient_name} ({Number(ing.qty)} {ing.unit})
                        </span>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'total_cost',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('recipes.batchHpp', 'HPP 1 Adonan')} />,
        cell: ({ row }) => {
            return <div className="text-muted-foreground text-right font-medium">{formatRupiah(row.original.total_cost ?? 0)}</div>;
        },
    },
    {
        accessorKey: 'portion_qty',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('recipes.portionQty', 'Porsi Hasil')} />,
        cell: ({ row }) => {
            return (
                <div className="text-muted-foreground text-right font-medium">
                    {t('recipes.portionUnit', { count: Number(row.original.portion_qty), defaultValue: `${Number(row.original.portion_qty)} pcs` })}
                </div>
            );
        },
    },
    {
        accessorKey: 'hpp',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('recipes.hppPerPcs', 'HPP per Pcs')} />,
        cell: ({ row }) => {
            return <div className="text-right font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(row.original.hpp ?? 0)}</div>;
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-center">{t('recipes.actions', 'Aksi')}</div>,
        cell: ({ row }) => <RecipeActions recipe={row.original} t={t} />,
    },
];
