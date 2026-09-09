<?php

namespace App\Events;

use App\Models\Product;
use App\Support\RealtimeNotification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockAlertEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public Product $product)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('tenant.' . $this->product->tenant_id)];
    }

    public function broadcastAs(): string
    {
        return 'LowStockAlertEvent';
    }

    public function broadcastWith(): array
    {
        $message = "Stok {$this->product->name} menipis ({$this->product->current_stock} {$this->product->unit}).";

        $data = [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'current_stock' => $this->product->current_stock,
            'min_stock' => $this->product->min_stock,
            'url' => '/inventory?low_stock=1&product_id=' . $this->product->id,
        ];

        RealtimeNotification::createForTenantRoles(
            'LowStockAlertEvent',
            'Stok menipis',
            $message,
            $this->product->tenant_id,
            ['owner', 'supervisor', 'staff'],
            $data
        );

        return [
            'product' => [
                'id' => $this->product->id,
                'name' => $this->product->name,
                'current_stock' => $this->product->current_stock,
                'min_stock' => $this->product->min_stock,
                'unit' => $this->product->unit,
            ],
            'message' => $message,
            'url' => $data['url'],
        ];
    }
}
