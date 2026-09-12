<?php

use App\Http\Controllers\TenantAnalyticsController;
use App\Http\Middleware\EnsureTenantMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
|
*/

Route::middleware(['auth', EnsureTenantMiddleware::class])->group(function () {
    Route::get('/ai/analytics', [TenantAnalyticsController::class, 'getAnalytics'])->name('api.ai.analytics');
});
