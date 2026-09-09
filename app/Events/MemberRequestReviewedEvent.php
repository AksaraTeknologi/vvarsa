<?php

namespace App\Events;

use App\Models\MemberRequest;
use App\Support\RealtimeNotification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MemberRequestReviewedEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public MemberRequest $memberRequest)
    {
    }

    public function broadcastOn(): array
    {
        return [new PrivateChannel('tenant.' . $this->memberRequest->tenant_id)];
    }

    public function broadcastAs(): string
    {
        return 'MemberRequestReviewedEvent';
    }

    public function broadcastWith(): array
    {
        $message = "Permintaan anggota {$this->memberRequest->name} telah {$this->memberRequest->status}.";

        RealtimeNotification::create(
            'MemberRequestReviewedEvent',
            'Status anggota',
            $message,
            $this->memberRequest->tenant_id,
            $this->memberRequest->requested_by,
            [
                'member_request_id' => $this->memberRequest->id,
                'name' => $this->memberRequest->name,
                'email' => $this->memberRequest->email,
                'status' => $this->memberRequest->status,
            ]
        );

        return ['member_request' => $this->memberRequest->only(['id', 'name', 'email', 'role', 'status']), 'message' => $message ];
    }
}
