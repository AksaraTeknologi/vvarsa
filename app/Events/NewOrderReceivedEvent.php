<?php

namespace App\Events;

use App\Models\Order;
use App\Models\User;
use App\Support\RealtimeNotification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderReceivedEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return User::query()
            ->where('tenant_id', $this->order->tenant_id)
            ->where('is_active', true)
            ->whereHas('roles', fn ($query) => $query->whereIn('name', ['supervisor', 'staff']))
            ->pluck('id')
            ->map(fn (string $userId) => new PrivateChannel('user.'.$userId))
            ->all();
    }

    public function broadcastAs(): string
    {
        return 'NewOrderReceivedEvent';
    }

    public function broadcastWith(): array
    {
        $message = "Pesanan baru #{$this->order->order_number} masuk.";

        $data = [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status,
            'url' => '/orders/'.$this->order->id,
        ];

        RealtimeNotification::createForTenantRoles(
            'NewOrderReceivedEvent',
            'Pesanan baru',
            $message,
            $this->order->tenant_id,
            ['supervisor', 'staff'],
            $data
        );

        return [
            'order' => [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'customer_name' => $this->order->customer_name,
                'total' => $this->order->total,
                'status' => $this->order->status,
            ],
            'message' => $message,
            'url' => $data['url'],
        ];
    }
}
