<?php

namespace App\Events;

use App\Models\CommunityReply;
use App\Models\User;
use App\Support\RealtimeNotification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommunityReplyReceivedEvent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public CommunityReply $reply) {}

    public function broadcastOn(): array
    {
        return User::query()
            ->where('is_active', true)
            ->where('id', '!=', $this->reply->user_id)
            ->whereHas('communityMemberships', fn ($query) => $query->where('post_id', $this->reply->post_id))
            ->pluck('id')
            ->map(fn (string $userId) => new PrivateChannel('user.'.$userId))
            ->all();
    }

    public function broadcastAs(): string
    {
        return 'CommunityReplyReceivedEvent';
    }

    public function broadcastWith(): array
    {
        $message = 'Ada balasan baru di komunitas.';

        $data = [
            'reply_id' => $this->reply->id,
            'post_id' => $this->reply->post_id,
            'url' => '/community/'.$this->reply->post_id,
        ];

        User::query()
            ->where('is_active', true)
            ->where('id', '!=', $this->reply->user_id)
            ->whereHas('communityMemberships', fn ($query) => $query->where('post_id', $this->reply->post_id))
            ->get(['id', 'tenant_id'])
            ->each(fn (User $user) => RealtimeNotification::create(
                'CommunityReplyReceivedEvent',
                'Balasan komunitas',
                $message,
                $user->tenant_id,
                $user->id,
                $data
            ));

        return ['reply' => $this->reply->only(['id', 'post_id', 'content', 'user_id']), 'message' => $message, 'url' => $data['url']];
    }
}
