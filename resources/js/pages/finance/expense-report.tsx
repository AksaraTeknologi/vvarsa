import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah, MONTHS_ID } from '@/lib/utils-mrp';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const PIE_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

interface Props {
    monthly_data: { day: number; total: number }[];
    by_category: { expense_category_id: number | null; total: number; count: number; expense_category?: { id: number; name: string } }[];
    year: number;
    month: number;
    today_expense: number;
    month_expense: number;
}

export default function ExpenseReport({ monthly_data, by_category, year, month, today_expense, month_expense }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('finance.title', 'Keuangan'), href: '/finance' },
        { title: t('finance.expenseReport', 'Laporan Pengeluaran'), href: '/finance/expense-report' },
    ];

    const pieData = by_category.map((c) => ({
        name: c.expense_category?.name || t('finance.other', 'Lainnya'),
        value: c.total,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('finance.expenseReport', 'Laporan Pengeluaran')} />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('finance.expenseReport', 'Laporan Pengeluaran')}</h1>
                        <p className="text-muted-foreground text-sm">{t('finance.expenseReportSubtitle', 'Pantau dan kelola pengeluaran bisnis Anda')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Select value={String(month)} onValueChange={(val) => router.get('/finance/expense-report', { year, month: val })}>
                            <SelectTrigger className="w-[140px] rounded-xl">
                                <SelectValue placeholder={t('finance.monthPlaceholder', 'Bulan')} />
                            </SelectTrigger>
                            <SelectContent>
                                {MONTHS_ID.map((m, i) => (
                                    <SelectItem key={i} value={String(i + 1)}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={String(year)} onValueChange={(val) => router.get('/finance/expense-report', { year: val, month })}>
                            <SelectTrigger className="w-[100px] rounded-xl">
                                <SelectValue placeholder={t('finance.yearPlaceholder', 'Tahun')} />
                            </SelectTrigger>
                            <SelectContent>
                                {[2024, 2025, 2026].map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-rose-50 p-4 dark:bg-rose-900/20">
                        <p className="text-muted-foreground text-xs">{t('finance.todayExpense', 'Pengeluaran Hari Ini')}</p>
                        <p className="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">{formatRupiah(today_expense)}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-4 dark:bg-orange-900/20">
                        <p className="text-muted-foreground text-xs">{t('finance.monthExpense', 'Pengeluaran Bulan Ini')}</p>
                        <p className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">{formatRupiah(month_expense)}</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Daily chart */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold">
                            {t('finance.dailyExpenseTitle', { month: MONTHS_ID[month - 1], year, defaultValue: `Pengeluaran Harian — ${MONTHS_ID[month - 1]} ${year}` })}
                        </h2>
                        {monthly_data.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">{t('finance.noMonthlyExpense', 'Tidak ada pengeluaran bulan ini.')}</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={monthly_data}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatRupiah(v, true)} />
                                    <Tooltip formatter={(v: any) => [formatRupiah(Number(v)), t('finance.expenseTooltip', 'Pengeluaran')]} />
                                    <Bar dataKey="total" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* By category */}
                    <div className="bg-card border-border rounded-2xl border p-5 shadow-sm">
                        <h2 className="mb-4 font-semibold">{t('finance.categoryPercentageTitle', 'Persentase per Kategori')}</h2>
                        {pieData.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">{t('finance.noCategoryData', 'Tidak ada data kategori.')}</p>
                        ) : (
                            <div className="flex flex-col items-center gap-4">
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={75}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v: any) => formatRupiah(Number(v))} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="w-full space-y-2">
                                    {by_category.map((c, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                                                />
                                                <span>{c.expense_category?.name || t('finance.other', 'Lainnya')}</span>
                                            </div>
                                            <span className="font-semibold text-rose-600">{formatRupiah(c.total, true)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
