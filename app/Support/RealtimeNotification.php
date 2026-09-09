<?php

namespace App\Support;

use App\Models\Notification;
use App\Models\User;

class RealtimeNotification
{
    public static function create(
        string $type,
        string $title,
        string $message,
        string $tenantId,
        ?string $userId = null,
        array $data = []
    ): Notification {
        return Notification::create([
            'tenant_id' => $tenantId,
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public static function createForTenantRoles(
        string $type,
        string $title,
        string $message,
        string $tenantId,
        array $roles,
        array $data = []
    ): void {
        User::query()
            ->where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->whereHas('roles', fn ($query) => $query->whereIn('name', $roles))
            ->pluck('id')
            ->each(fn (string $userId) => self::create($type, $title, $message, $tenantId, $userId, $data));
    }
}
