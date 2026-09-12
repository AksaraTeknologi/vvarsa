<?php

namespace App\Http\Controllers;

use App\Services\AiAnalyticsService;
use Illuminate\Http\JsonResponse;

class TenantAnalyticsController extends Controller
{
    protected AiAnalyticsService $aiService;

    public function __construct(AiAnalyticsService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Get AI Analytics insights endpoint for Tenant Dashboard
     */
    public function getAnalytics(): JsonResponse
    {
        $tenant = app()->has('tenant') ? app('tenant') : auth()->user()?->tenant;

        if (! $tenant) {
            return response()->json([
                'success' => false,
                'message' => 'Tenant tidak ditemukan atau akun belum terhubung dengan bisnis.',
            ], 404);
        }

        $analytics = $this->aiService->getDashboardAnalytics($tenant->id);

        return response()->json([
            'success' => true,
            'data' => $analytics,
        ]);
    }
}
