import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.roles?.includes('admin');
    const isSupervisor = auth.user?.roles?.includes('supervisor');

    const sidebarNavItems: NavItem[] = [
        {
            title: t('settings.profileNav'),
            href: '/settings/profile',
            icon: null,
        },
        {
            title: t('settings.passwordNav'),
            href: '/settings/password',
            icon: null,
        },
        {
            title: t('settings.appearanceNav'),
            href: '/settings/appearance',
            icon: null,
        },
        {
            title: t('settings.paymentNav'),
            href: '/settings/payment-methods',
            icon: null,
        },
    ];

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className={cn('business-page w-full p-4 md:p-6', isAdmin && 'admin-settings-page relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(94,75,242,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(121,215,255,0.18),_transparent_32%),linear-gradient(180deg,#f6f2ff_0%,#f9f8fc_100%)]', isSupervisor && 'supervisor-settings-page relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,150,190,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(125,211,252,0.22),_transparent_35%),linear-gradient(180deg,#e9f8ff_0%,#f8fcff_100%)]')}>
            {isAdmin && (
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-one" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-two" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-three" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-four" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-five" />
                    <div className="admin-dashboard-bubble tenant-dashboard-bubble tenant-dashboard-bubble-six" />
                </div>
            )}
            <div className={isAdmin || isSupervisor ? 'relative z-10' : undefined}>
                <Heading title={t('settings.title')} description={t('settings.subtitle')} />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <aside className="w-full lg:w-56 lg:shrink-0">
                    <nav className={cn('flex flex-col gap-1 rounded-2xl border bg-white p-2 shadow-sm', isAdmin ? 'border-[#DCD8FF]' : isSupervisor ? 'border-[#B9E2F2]' : 'border-[#d9e5dd]')}>
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start rounded-xl text-sm', {
                                    [isAdmin ? 'bg-[#5E4BF2] text-white hover:bg-[#4938D9] hover:text-white' : isSupervisor ? 'bg-[#2596BE] text-white hover:bg-[#16749B] hover:text-white' : 'bg-owner-accent text-white hover:bg-owner-accent hover:text-white']: currentPath === item.href,
                                    [isAdmin ? 'text-[#686673] hover:bg-[#F1EFFD] hover:text-[#5E4BF2]' : isSupervisor ? 'text-[#356477] hover:bg-[#E0F2FE] hover:text-[#16749B]' : 'text-muted-foreground hover:bg-owner-accent/10 hover:text-owner-accent']: currentPath !== item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-2 md:hidden" />

                <div className="min-w-0 flex-1">
                    <section className="w-full space-y-6">{children}</section>
                </div>
            </div>
            </div>
        </div>
    );
}
