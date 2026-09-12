import { useEcho } from '@laravel/echo-react';
import { usePage } from '@inertiajs/react';
import { Bell, CheckCheck, Package, ShoppingCart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type SharedData } from '@/types';

type RealtimeEvent = {
    id: string;
    kind: string;
    message: string;
    read: boolean;
    createdAt: string;
    url?: string;
};

type BroadcastPayload = {
    message?: string;
    url?: string;
    product?: { id: string; name: string };
    order?: { id: string; order_number: string };
    reply?: { post_id: string };
};

function eventLabel(kind: string): string {
    if (kind === 'LowStockAlertEvent') return 'Stok menipis';
    if (kind === 'NewOrderReceivedEvent') return 'Pesanan baru';
    if (kind === 'MemberRequestSubmittedEvent') return 'Permintaan anggota';
    if (kind === 'MemberRequestReviewedEvent') return 'Review anggota';
    return 'Komunitas';
}

function eventIcon(kind: string) {
    if (kind === 'LowStockAlertEvent') return Package;
    if (kind === 'NewOrderReceivedEvent') return ShoppingCart;
    if (kind.includes('MemberRequest')) return Users;
    return Bell;
}

interface ListenerProps {
    receive: (kind: string, payload: BroadcastPayload) => void;
}

function TenantEchoListener({ tenantId, receive }: ListenerProps & { tenantId: string | number }) {
    const channelName = `tenant.${tenantId}`;
    useEcho<BroadcastPayload>(channelName, '.LowStockAlertEvent', (payload) => receive('LowStockAlertEvent', payload), [tenantId]);
    useEcho<BroadcastPayload>(channelName, '.MemberRequestSubmittedEvent', (payload) => receive('MemberRequestSubmittedEvent', payload), [tenantId]);
    useEcho<BroadcastPayload>(channelName, '.MemberRequestReviewedEvent', (payload) => receive('MemberRequestReviewedEvent', payload), [tenantId]);
    return null;
}

function UserEchoListener({ userId, receive }: ListenerProps & { userId: string | number }) {
    const userChannelName = `user.${userId}`;
    useEcho<BroadcastPayload>(userChannelName, '.NewOrderReceivedEvent', (payload) => receive('NewOrderReceivedEvent', payload), [userId]);
    useEcho<BroadcastPayload>(userChannelName, '.CommunityReplyReceivedEvent', (payload) => receive('CommunityReplyReceivedEvent', payload), [userId]);
    return null;
}

export function NotificationDropdown() {
    const { auth, tenant } = usePage<SharedData>().props;
    const [notifications, setNotifications] = useState<RealtimeEvent[]>([]);
    const unreadCount = notifications.filter((notification) => !notification.read).length;

    useEffect(() => {
        if (!tenant?.id) return;

        fetch('/notifications', {
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        })
            .then((response) => response.ok ? response.json() : [])
            .then((data) => {
                if (!Array.isArray(data)) return;

                const persisted = data.map((item) => ({
                    id: item.id,
                    kind: item.kind,
                    message: item.message,
                    read: item.read,
                    createdAt: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    url: item.url,
                }));

                setNotifications((current) => {
                    const live = current.filter((item) => item.id.startsWith('live-'));
                    return [...live, ...persisted].slice(0, 30);
                });
            })
            .catch(() => {});
    }, [tenant?.id]);

    const receive = (kind: string, payload: BroadcastPayload) => {
        const message = payload.message ?? eventLabel(kind);
        const notification: RealtimeEvent = {
            id: `live-${kind}-${Date.now()}-${Math.random()}`,
            kind,
            message,
            read: false,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            url: payload.url
                ?? (kind === 'LowStockAlertEvent' && payload.product?.id ? `/inventory?low_stock=1&product_id=${payload.product.id}` : undefined)
                ?? (kind === 'NewOrderReceivedEvent' && payload.order?.id ? `/orders/${payload.order.id}` : undefined)
                ?? (kind === 'CommunityReplyReceivedEvent' && payload.reply?.post_id ? `/community/${payload.reply.post_id}` : undefined),
        };

        setNotifications((current) => [notification, ...current].slice(0, 30));
        if (kind === 'LowStockAlertEvent') toast.warning(message);
        if (kind === 'NewOrderReceivedEvent') toast.success(message);
    };

    const markAllRead = async () => {
        setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));

        try {
            await fetch('/notifications/read-all', {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
            });
        } catch {
            // ignore network error for now
        }
    };

    const markRead = async (id: string) => {
        setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, read: true } : notification));

        if (id.startsWith('live-')) return;

        try {
            await fetch(`/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
                },
            });
        } catch {
            // ignore network error for now
        }
    };

    return (
        <>
            {tenant?.id && <TenantEchoListener tenantId={tenant.id} receive={receive} />}
            {auth?.user?.id && <UserEchoListener userId={auth.user.id} receive={receive} />}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" aria-label="Notifikasi">
                        <Bell className="size-5" />
                        {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-red-500 px-1 text-[10px] leading-4 font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between px-2">
                        <DropdownMenuLabel className="px-0">Notifikasi</DropdownMenuLabel>
                        {unreadCount > 0 && <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={markAllRead}><CheckCheck className="size-3.5" /> Tandai dibaca</Button>}
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? <p className="px-3 py-6 text-center text-sm text-muted-foreground">Belum ada notifikasi.</p> : notifications.map((notification) => {
                        const Icon = eventIcon(notification.kind);
                        return <button key={notification.id} type="button" onClick={() => { void markRead(notification.id); if (notification.url) window.location.assign(notification.url); }} className={`flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-muted ${notification.read ? 'opacity-60' : ''}`}>
                            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{eventLabel(notification.kind)}</span><span className="block text-sm">{notification.message}</span><span className="block text-[11px] text-muted-foreground">{notification.createdAt}</span></span>
                        </button>;
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
