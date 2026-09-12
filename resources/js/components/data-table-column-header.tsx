import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
    centered?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className, centered = false }: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <div className={cn('flex items-center space-x-2', centered && 'w-full justify-center', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            'data-[state=open]:bg-[#e8f5ec] h-8 rounded-lg px-2 text-[11px] font-extrabold tracking-[0.06em] text-[#686673] uppercase hover:cursor-pointer hover:bg-[#edf8f1] hover:text-[#3f9567]',
                            !centered && '-ml-3',
                            centered && 'relative w-full justify-center pr-8',
                        )}
                    >
                        <span className="whitespace-nowrap">{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDown className={cn('ml-1.5 size-3.5', centered && 'absolute right-1 ml-0')} />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUp className={cn('ml-1.5 size-3.5', centered && 'absolute right-1 ml-0')} />
                        ) : (
                            <ChevronsUpDown className={cn('ml-1.5 size-3.5', centered && 'absolute right-1 ml-0')} />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem className="hover:cursor-pointer" onClick={() => column.toggleSorting(false)}>
                        <ArrowUp className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:cursor-pointer" onClick={() => column.toggleSorting(true)}>
                        <ArrowDown className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="hover:cursor-pointer" onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
                        Sembunyikan
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
