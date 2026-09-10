<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('tenant.{tenantId}', function ($user, $tenantId) {
    if ($user->hasRole('admin')) {
        return true;
    }
    return (string) $user->tenant_id === (string) $tenantId
        && $user->hasAnyRole(['owner', 'supervisor', 'staff']);
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    if ($user->hasRole('admin')) {
        return true;
    }
    return (string) $user->id === (string) $userId;
});
