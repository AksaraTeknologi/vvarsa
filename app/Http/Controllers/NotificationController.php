<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $tenant = app('tenant');

        $notifications = Notification::query()
            ->where('tenant_id', $tenant->id)
            ->where('user_id', Auth::id())
            ->latest('created_at')
            ->limit(30)
            ->get()
            ->map(function (Notification $notification) {
                return [
                    'id' => $notification->id,
                    'kind' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'read' => ! is_null($notification->read_at),
                    'createdAt' => $notification->created_at?->toIso8601String(),
                    'url' => $notification->data['url'] ?? null,
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead(Notification $notification)
    {
        $tenant = app('tenant');

        if ($notification->tenant_id !== $tenant->id || $notification->user_id !== Auth::id()) {
            abort(403);
        }

        if (is_null($notification->read_at)) {
            $notification->update(['read_at' => now()]);
        }

        return response()->json(['success' => true]);
    }

    public function markAllRead()
    {
        $tenant = app('tenant');

        Notification::query()
            ->where('tenant_id', $tenant->id)
            ->where('user_id', Auth::id())
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
