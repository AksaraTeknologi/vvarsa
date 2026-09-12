<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiAnalyticsService
{
    protected string $serviceUrl;

    public function __construct()
    {
        $this->serviceUrl = config('services.ai_analytics.url', env('AI_ANALYTICS_SERVICE_URL', 'http://127.0.0.1:8001'));
    }

    /**
     * Get complete AI Analytics dashboard insights for a tenant.
     */
    public function getDashboardAnalytics(string $tenantId): array
    {
        // 1. Gather Ingredients & compute 30-day daily usage
        $ingredientsData = $this->getIngredientsData($tenantId);

        // 2. Gather Variant Cost & Price data
        $variantsData = $this->getVariantsData($tenantId);

        // 3. Gather Financial Performance data
        $financialsData = $this->getFinancialsData($tenantId);

        return $this->localFallbackAnalytics($ingredientsData, $variantsData, $financialsData);
    }

    protected function getIngredientsData(string $tenantId): array
    {
        $products = Product::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->get();

        // 30 days ago
        $thirtyDaysAgo = now()->subDays(30)->toDateString();

        // Compute total quantity consumed per ingredient from completed orders via recipe BOM
        $usageSums = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.id')
            ->join('recipes', 'product_variants.recipe_id', '=', 'recipes.id')
            ->join('recipe_ingredients', 'recipes.id', '=', 'recipe_ingredients.recipe_id')
            ->where('orders.tenant_id', $tenantId)
            ->where('orders.payment_status', 'paid')
            ->where('orders.created_at', '>=', $thirtyDaysAgo)
            ->select(
                'recipe_ingredients.ingredient_id as product_id',
                DB::raw('SUM(order_items.qty * recipe_ingredients.qty * COALESCE(product_variants.recipe_qty, 1)) as total_used')
            )
            ->groupBy('recipe_ingredients.ingredient_id')
            ->pluck('total_used', 'product_id');

        $result = [];
        foreach ($products as $product) {
            $totalUsed = (float) ($usageSums[$product->id] ?? 0);
            $dailyAvg = round($totalUsed / 30.0, 2);

            $result[] = [
                'product_id' => (string) $product->id,
                'product_name' => $product->name,
                'current_stock' => (float) $product->current_stock,
                'min_stock' => (float) $product->min_stock,
                'unit' => $product->unit ?? 'pcs',
                'daily_usage_avg' => $dailyAvg,
                'cost_price' => (float) ($product->cost_price ?? 0),
            ];
        }

        return $result;
    }

    protected function getVariantsData(string $tenantId): array
    {
        $variants = ProductVariant::where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->with(['recipe.ingredients.ingredient'])
            ->get();

        $result = [];
        foreach ($variants as $variant) {
            $costPrice = (float) $variant->hpp;
            $sellPrice = (float) $variant->sell_price;
            $margin = $sellPrice > 0 ? (($sellPrice - $costPrice) / $sellPrice) * 100.0 : 0.0;

            $result[] = [
                'variant_id' => (string) $variant->id,
                'variant_name' => $variant->name,
                'current_sell_price' => $sellPrice,
                'cost_price' => round($costPrice, 2),
                'current_margin_percent' => round($margin, 1),
                'target_margin_percent' => 30.0,
            ];
        }

        return $result;
    }

    protected function getFinancialsData(string $tenantId): array
    {
        $thirtyDaysAgo = now()->subDays(30)->toDateString();
        $today = now()->toDateString();

        $monthlySales = (float) Transaction::where('tenant_id', $tenantId)
            ->where('type', 'income')
            ->where(function ($q) use ($thirtyDaysAgo, $today) {
                $q->whereBetween('date', [$thirtyDaysAgo, $today])
                  ->orWhereBetween('created_at', [$thirtyDaysAgo . ' 00:00:00', $today . ' 23:59:59']);
            })
            ->sum('amount');

        $paidOrdersSales = (float) Order::where('tenant_id', $tenantId)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$thirtyDaysAgo . ' 00:00:00', $today . ' 23:59:59'])
            ->sum('total');

        $effectiveMonthlySales = max($monthlySales, $paidOrdersSales);

        $monthlyExpenses = (float) Transaction::where('tenant_id', $tenantId)
            ->where('type', 'expense')
            ->where(function ($q) use ($thirtyDaysAgo, $today) {
                $q->whereBetween('date', [$thirtyDaysAgo, $today])
                  ->orWhereBetween('created_at', [$thirtyDaysAgo . ' 00:00:00', $today . ' 23:59:59']);
            })
            ->sum('amount');

        $monthlyCogs = (float) DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.tenant_id', $tenantId)
            ->where('orders.payment_status', 'paid')
            ->whereBetween('orders.created_at', [$thirtyDaysAgo . ' 00:00:00', $today . ' 23:59:59'])
            ->sum(DB::raw('order_items.unit_hpp * order_items.qty'));

        $totalMonthlyCost = $monthlyExpenses + $monthlyCogs;
        $monthlyNetProfit = $effectiveMonthlySales - $totalMonthlyCost;

        $startOfWeek = now()->startOfWeek()->toDateString();
        $endOfWeek = now()->endOfWeek()->toDateString();

        $weeklySales = (float) Transaction::where('tenant_id', $tenantId)
            ->where('type', 'income')
            ->where(function ($q) use ($startOfWeek, $endOfWeek) {
                $q->whereBetween('date', [$startOfWeek, $endOfWeek])
                  ->orWhereBetween('created_at', [$startOfWeek . ' 00:00:00', $endOfWeek . ' 23:59:59']);
            })
            ->sum('amount');

        $paidWeeklyOrders = (float) Order::where('tenant_id', $tenantId)
            ->where('payment_status', 'paid')
            ->whereBetween('created_at', [$startOfWeek . ' 00:00:00', $endOfWeek . ' 23:59:59'])
            ->sum('total');

        $effectiveWeeklySales = max($weeklySales, $paidWeeklyOrders);

        $weeklyExpenses = (float) Transaction::where('tenant_id', $tenantId)
            ->where('type', 'expense')
            ->where(function ($q) use ($startOfWeek, $endOfWeek) {
                $q->whereBetween('date', [$startOfWeek, $endOfWeek])
                  ->orWhereBetween('created_at', [$startOfWeek . ' 00:00:00', $endOfWeek . ' 23:59:59']);
            })
            ->sum('amount');

        $weeklyCogs = (float) DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.tenant_id', $tenantId)
            ->where('orders.payment_status', 'paid')
            ->whereBetween('orders.created_at', [$startOfWeek . ' 00:00:00', $endOfWeek . ' 23:59:59'])
            ->sum(DB::raw('order_items.unit_hpp * order_items.qty'));

        $totalWeeklyCost = $weeklyExpenses + $weeklyCogs;
        $weeklyNetProfit = $effectiveWeeklySales - $totalWeeklyCost;

        $lastWeekStart = now()->subWeek()->startOfWeek()->toDateString();
        $lastWeekEnd = now()->subWeek()->endOfWeek()->toDateString();

        $lastWeekSales = (float) Transaction::where('tenant_id', $tenantId)
            ->where('type', 'income')
            ->where(function ($q) use ($lastWeekStart, $lastWeekEnd) {
                $q->whereBetween('date', [$lastWeekStart, $lastWeekEnd])
                  ->orWhereBetween('created_at', [$lastWeekStart . ' 00:00:00', $lastWeekEnd . ' 23:59:59']);
            })
            ->sum('amount');

        $salesTrendPct = $lastWeekSales > 0
            ? round((($effectiveWeeklySales - $lastWeekSales) / $lastWeekSales) * 100.0, 1)
            : 0.0;

        $lowStockCount = Product::where('tenant_id', $tenantId)
            ->whereColumn('current_stock', '<=', 'min_stock')
            ->where('is_active', true)
            ->count();

        $totalOrders = Order::where('tenant_id', $tenantId)
            ->whereBetween('created_at', [$thirtyDaysAgo . ' 00:00:00', $today . ' 23:59:59'])
            ->count();

        return [
            'period' => 'monthly',
            'monthly_sales' => $effectiveMonthlySales,
            'monthly_expenses' => $totalMonthlyCost,
            'monthly_cogs' => $monthlyCogs,
            'monthly_net_profit' => $monthlyNetProfit,
            'weekly_sales' => $effectiveWeeklySales,
            'weekly_expenses' => $totalWeeklyCost,
            'net_profit' => $weeklyNetProfit,
            'sales_trend_pct' => $salesTrendPct,
            'low_stock_count' => $lowStockCount,
            'total_orders_count' => $totalOrders,
            'top_selling_variants' => [],
        ];
    }

    protected function localFallbackAnalytics(array $ingredients, array $variants, array $financials): array
    {
        $reorderAlerts = [];
        foreach ($ingredients as $ing) {
            $daily = max($ing['daily_usage_avg'], 0.0);
            $stock = $ing['current_stock'];
            $min = $ing['min_stock'];
            $daysLeft = $daily > 0 ? round($stock / $daily, 1) : 999;

            if ($stock <= $min || $daysLeft <= 6) {
                $urgency = ($stock <= ($min * 0.5) || $daysLeft <= 2) ? 'critical' : 'warning';
                $reorderAlerts[] = [
                    'product_id' => $ing['product_id'],
                    'product_name' => $ing['product_name'],
                    'current_stock' => $stock,
                    'min_stock' => $min,
                    'unit' => $ing['unit'],
                    'daily_usage_avg' => $daily,
                    'days_until_depleted' => $daysLeft,
                    'recommended_reorder_qty' => (float) ceil(max(($daily * 10) + $min - $stock, $min)),
                    'urgency' => $urgency,
                    'reason' => $daily > 0
                        ? "Laju pemakaian {$daily} {$ing['unit']}/hari. Stok diperkirakan habis dalam {$daysLeft} hari."
                        : "Stok telah mencapai atau di bawah batas minimum ({$min} {$ing['unit']}).",
                ];
            }
        }

        $pricingRecs = [];
        foreach ($variants as $v) {
            if ($v['current_sell_price'] > 0 && $v['current_margin_percent'] < 30.0) {
                $recPrice = (float) (ceil(($v['cost_price'] / 0.70) / 500) * 500);
                $recMargin = round((($recPrice - $v['cost_price']) / $recPrice) * 100, 1);
                $pricingRecs[] = [
                    'variant_id' => $v['variant_id'],
                    'variant_name' => $v['variant_name'],
                    'current_sell_price' => $v['current_sell_price'],
                    'cost_price' => $v['cost_price'],
                    'current_margin_percent' => $v['current_margin_percent'],
                    'recommended_sell_price' => $recPrice,
                    'recommended_margin_percent' => $recMargin,
                    'reason' => "Margin saat ini ({$v['current_margin_percent']}%) di bawah target minimum (30.0%). HPP resep sebesar Rp " . number_format($v['cost_price']) . ". Disarankan menaikkan harga ke Rp " . number_format($recPrice) . " untuk menjaga margin sehat di 30.0%.",
                    'action_needed' => true,
                ];
            }
        }

        $sales = $financials['monthly_sales'] > 0 ? $financials['monthly_sales'] : $financials['weekly_sales'];
        $expenses = $financials['monthly_sales'] > 0 ? $financials['monthly_expenses'] : $financials['weekly_expenses'];
        $net = $financials['monthly_sales'] > 0 ? $financials['monthly_net_profit'] : $financials['net_profit'];
        $margin = $sales > 0 ? round(($net / $sales) * 100, 1) : 0.0;

        // Multi-Factor Health Score calculation (0 - 100)
        // Pillar 1: Financial & Profitability Health (Max 40 pts)
        if ($sales > 0) {
            if ($net < 0) {
                $financialScore = 8;
            } elseif ($margin >= 30.0) {
                $financialScore = 40;
            } elseif ($margin >= 20.0) {
                $financialScore = 32;
            } elseif ($margin >= 10.0) {
                $financialScore = 24;
            } elseif ($margin >= 0.0) {
                $financialScore = 16;
            } else {
                $financialScore = 8;
            }
        } else {
            $financialScore = 10;
        }

        // Pillar 2: Stock & Supply Chain Health (Max 30 pts)
        $criticalStockCount = count($reorderAlerts);
        if ($criticalStockCount === 0) {
            $stockScore = 30;
        } elseif ($criticalStockCount <= 2) {
            $stockScore = 20;
        } elseif ($criticalStockCount <= 5) {
            $stockScore = 10;
        } else {
            $stockScore = 0;
        }

        // Pillar 3: Menu Margin & Pricing Health (Max 30 pts)
        $totalVariants = count($variants);
        $lowMarginVariantsCount = count($pricingRecs);
        if ($totalVariants > 0) {
            $healthyVariantsRatio = ($totalVariants - $lowMarginVariantsCount) / $totalVariants;
            if ($healthyVariantsRatio >= 0.8) {
                $pricingScore = 30;
            } elseif ($healthyVariantsRatio >= 0.5) {
                $pricingScore = 20;
            } elseif ($healthyVariantsRatio >= 0.2) {
                $pricingScore = 10;
            } else {
                $pricingScore = 5;
            }
        } else {
            $pricingScore = 15;
        }

        $score = max(10, min(100, $financialScore + $stockScore + $pricingScore));
        $statusBadge = $score >= 80 ? 'excellent' : ($score >= 60 ? 'good' : 'needs_attention');

        $geminiKey = config('services.gemini.key') ?? env('GEMINI_API_KEY');
        $healthSummary = null;

        if ($geminiKey) {
            $healthSummary = $this->callGeminiApi($financials, $score, $margin, $reorderAlerts, $pricingRecs, $geminiKey, $ingredients, $variants);
        }

        if (!$healthSummary) {
            $keyTakeaways = [
                "Margin laba bersih tercatat sebesar {$margin}%.",
            ];
            if ($criticalStockCount > 0) {
                $keyTakeaways[] = "Terdapat {$criticalStockCount} produk bahan baku yang berada di bawah stok minimum.";
            } else {
                $keyTakeaways[] = "Persediaan stok bahan baku berada pada tingkat aman.";
            }
            if ($lowMarginVariantsCount > 0) {
                $keyTakeaways[] = "Terdapat {$lowMarginVariantsCount} varian menu dengan margin di bawah target 30%.";
            }

            $actionableTips = [
                "Tinjau efisiensi pembelian bahan baku dan pantau laporan penjualan di POS.",
                "Lakukan penyesuaian harga atau porsi menu yang memiliki margin profit rendah.",
            ];

            $healthSummary = [
                'narrative_summary' => $net >= 0
                    ? "Kondisi keuangan bisnis Anda terkendali dengan total pendapatan Rp " . number_format($sales) . " dan profit margin {$margin}%."
                    : "Perhatian: Total pengeluaran operasional melebihi pendapatan. Segera lakukan tinjauan efisiensi biaya.",
                'health_score' => $score,
                'status_badge' => $statusBadge,
                'key_takeaways' => $keyTakeaways,
                'actionable_tips' => $actionableTips,
                'is_ai_generated' => false,
                'ai_error' => $geminiKey
                    ? 'Gemini API mengalami kendala (timeout / rate limit). Menggunakan engine analisis aturan lokal.'
                    : 'API Key Gemini belum dikonfigurasi pada server.',
            ];
        }

        return [
            'reorder_alerts' => $reorderAlerts,
            'pricing_recommendations' => $pricingRecs,
            'health_summary' => $healthSummary,
        ];
    }

    protected function callGeminiApi(
        array $financials,
        int $score,
        float $margin,
        array $reorderAlerts,
        array $pricingRecs,
        string $apiKey,
        array $ingredients = [],
        array $variants = []
    ): ?array {
        try {
            $salesVal = $financials['monthly_sales'] > 0 ? $financials['monthly_sales'] : $financials['weekly_sales'];
            $expensesVal = $financials['monthly_sales'] > 0 ? $financials['monthly_expenses'] : $financials['weekly_expenses'];
            $netVal = $financials['monthly_sales'] > 0 ? $financials['monthly_net_profit'] : $financials['net_profit'];

            $cogsVal = (float) ($financials['monthly_cogs'] ?? 0);
            $opExpensesVal = (float) ($financials['monthly_expenses'] ?? 0);

            $sales = number_format($salesVal);
            $expenses = number_format($expensesVal);
            $net = number_format($netVal);
            $cogsFormatted = number_format($cogsVal);
            $opExpensesFormatted = number_format($opExpensesVal);

            // Build ingredient details list for Gemini context
            $ingredientDetails = [];
            if (!empty($reorderAlerts)) {
                foreach ($reorderAlerts as $alert) {
                    $ingredientDetails[] = "- Kritis/Warning: Bahan Baku '{$alert['product_name']}' - Stok Saat Ini: {$alert['current_stock']} {$alert['unit']} (Batas Min: {$alert['min_stock']} {$alert['unit']}), Pemakaian Harian: {$alert['daily_usage_avg']} {$alert['unit']}/hari, Estimasi Habis: {$alert['days_until_depleted']} hari, Rekomendasi Reorder: {$alert['recommended_reorder_qty']} {$alert['unit']} [Status: {$alert['urgency']}]";
                }
            }
            foreach (array_slice($ingredients, 0, 5) as $ing) {
                $alreadyListed = collect($reorderAlerts)->pluck('product_name')->contains($ing['product_name']);
                if (!$alreadyListed) {
                    $ingredientDetails[] = "- Stok Normal: Bahan Baku '{$ing['product_name']}' - Stok Saat Ini: {$ing['current_stock']} {$ing['unit']} (Batas Min: {$ing['min_stock']} {$ing['unit']}), Pemakaian Harian: {$ing['daily_usage_avg']} {$ing['unit']}/hari, Biaya/Unit: Rp " . number_format($ing['cost_price']);
                }
            }
            $ingredientDetailsText = !empty($ingredientDetails) ? implode("\n", $ingredientDetails) : "- Persediaan bahan baku saat ini mencukupi dan terpantau normal.";

            // Build variant pricing details list for Gemini context
            $pricingDetails = [];
            if (!empty($pricingRecs)) {
                foreach ($pricingRecs as $rec) {
                    $pricingDetails[] = "- WARN Margin Rendah: Varian '{$rec['variant_name']}' - Harga Jual: Rp " . number_format($rec['current_sell_price']) . " | HPP/Resep: Rp " . number_format($rec['cost_price']) . " | Margin Saat Ini: {$rec['current_margin_percent']}% | Rekomendasi Harga Ideal: Rp " . number_format($rec['recommended_sell_price']) . " (Margin Target: {$rec['recommended_margin_percent']}%)";
                }
            }
            foreach ($variants as $v) {
                $alreadyListed = collect($pricingRecs)->pluck('variant_id')->contains($v['variant_id']);
                if (!$alreadyListed) {
                    $pricingDetails[] = "- Margin Sehat: Varian '{$v['variant_name']}' - Harga Jual: Rp " . number_format($v['current_sell_price']) . " | HPP: Rp " . number_format($v['cost_price']) . " | Margin: {$v['current_margin_percent']}%";
                }
            }
            $pricingDetailsText = !empty($pricingDetails) ? implode("\n", $pricingDetails) : "- Belum ada data varian menu.";

            $prompt = "Anda adalah Senior Financial Analyst & CFO AI berpengalaman untuk bisnis UMKM / FnB / Kuliner / Retail.
Analisis data performa bisnis secara kritis, mendalam, realistis, dan berikan panduan solutif yang konkret dalam Bahasa Indonesia.

[DATA PERFORMA KEUANGAN]
- Total Omset / Pendapatan: Rp {$sales}
- HPP / COGS Terjual (Biaya Bahan Baku): Rp {$cogsFormatted}
- Pengeluaran Operasional / Stok Masuk: Rp {$opExpensesFormatted}
- Total Pengeluaran Gabungan: Rp {$expenses}
- Laba Bersih: Rp {$net}
- Profit Margin Bersih: {$margin}%
- Skor Kesehatan Bisnis: {$score}/100

[DATA STOK & PERSEDIAAN BAHAN BAKU]
{$ingredientDetailsText}

[DATA PRICING & MARGIN PRODUK / VARIAN MENU]
{$pricingDetailsText}

PETUNJUK ANALISIS PENTING:
1. NARRATIVE SUMMARY (2-3 kalimat): Berikan evaluasi kondisi keuangan terkini. Sebutkan angka omset, laba bersih, margin %, dan penyebab utamanya (misal: margin sehat didorong oleh kontrol HPP, atau ada risiko gangguan operasional karena bahan X habis).
2. KEY TAKEAWAYS (3 poin mendalam):
   - Poin 1 (Evaluasi Keuangan): Evaluasi omset Rp {$sales}, pengeluaran, dan profit margin {$margin}% secara mendalam.
   - Poin 2 (Evaluasi Stok & Bahan Baku): Evaluasi stok bahan baku. SEBUTKAN NAMA BAHAN BAKU SPESIFIK (seperti Mika, Gula, dll) yang kritis/perlu reorder beserta sisa hari dan jumlah yang harus dibeli.
   - Poin 3 (Evaluasi Margin Varian Menu): Evaluasi varian menu. SEBUTKAN NAMA VARIAN PRODUK SPESIFIK, HPP, harga jual saat ini, dan persen margin-nya.
3. ACTIONABLE TIPS (3-4 langkah aksi solutif):
   - Tips 1 (Aksi Stok & Pembelian): Rekomendasi reorder bahan baku spesifik. SEBUTKAN NAMA BAHAN BAKU dan JUMLAH REORDER yang direkomendasikan.
   - Tips 2 (Aksi Penetapan Harga Jual): Rekomendasi penyesuaian harga jual ideal untuk varian bermargin rendah. SEBUTKAN NAMA VARIAN, HARGA SEKARANG, dan HARGA REKOMENDASI LENGKAP DENGAN PROYEKSI MARGIN-NYA.
   - Tips 3 (Aksi Strategi Operasional): Strategi taktis meningkatkan omset atau efisiensi biaya operasional bulanan.

PERINGATAN SANGAT PENTING:
- JANGAN BERIKAN RESPONS GENERIK / TEMPLATE REPEAT!
- WAJIB MENYEBUTKAN NAMA BAHAN BAKU SPESIFIK (misal: Mika, Gula, dll) DAN NAMA VARIAN PRODUK SPESIFIK YANG ADA DALAM DATA DI ATAS!

Format respon HARUS berupa JSON murni dengan atribut persis:
{
    \"narrative_summary\": \"...\",
    \"key_takeaways\": [
        \"...\",
        \"...\",
        \"...\"
    ],
    \"actionable_tips\": [
        \"...\",
        \"...\",
        \"...\"
    ]
}";

            // Try working Gemini API models in fallback sequence
            $models = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemma-4-26b-a4b-it', 'gemini-flash-latest'];

            foreach ($models as $model) {
                $response = Http::timeout(10)->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
                    'contents' => [
                        ['parts' => [['text' => $prompt]]]
                    ],
                    'generationConfig' => [
                        'response_mime_type' => 'application/json'
                    ]
                ]);

                if ($response->successful()) {
                    $rawText = $response->json('candidates.0.content.parts.0.text');
                    if ($rawText) {
                        $cleanedText = trim($rawText);
                        if (str_starts_with($cleanedText, '```')) {
                            $lines = explode("\n", $cleanedText);
                            if (str_starts_with($lines[0], '```')) {
                                array_shift($lines);
                            }
                            if (!empty($lines) && str_starts_with(end($lines), '```')) {
                                array_pop($lines);
                            }
                            $cleanedText = trim(implode("\n", $lines));
                        }
                        $parsed = json_decode($cleanedText, true);
                        if (is_array($parsed) && isset($parsed['narrative_summary'])) {
                            $statusBadge = $score >= 80 ? 'excellent' : ($score >= 60 ? 'good' : 'needs_attention');
                            return [
                                'narrative_summary' => $parsed['narrative_summary'],
                                'health_score' => $score,
                                'status_badge' => $statusBadge,
                                'key_takeaways' => $parsed['key_takeaways'] ?? [],
                                'actionable_tips' => $parsed['actionable_tips'] ?? [],
                                'is_ai_generated' => true,
                                'ai_error' => null,
                            ];
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning("Gemini AI Advisory API call failed: {$e->getMessage()}");
        }

        return null;
    }
}
