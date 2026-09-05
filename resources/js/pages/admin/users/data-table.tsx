'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="border-border bg-card w-full overflow-x-auto rounded-xl border shadow-sm">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-border border-b bg-slate-50/50 hover:bg-transparent dark:bg-slate-800/10">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="text-muted-foreground h-10 px-6 py-3.5 text-xs font-semibold tracking-wider uppercase"
                                >
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="divide-border divide-y">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="hover:bg-muted/30 border-border border-b transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="px-6 py-3.5 align-middle">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center text-sm">
                                Tidak ada pengguna ditemukan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
