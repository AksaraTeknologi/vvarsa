import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();

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
        <div className="business-page w-full p-4 md:p-6">
            <Heading title={t('settings.title')} description={t('settings.subtitle')} />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <aside className="w-full lg:w-56 lg:shrink-0">
                    <nav className="flex flex-col gap-1 rounded-2xl border border-[#d9e5dd] bg-white p-2 shadow-sm">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start rounded-xl text-sm', {
                                    'bg-owner-accent text-white hover:bg-owner-accent hover:text-white': currentPath === item.href,
                                    'text-muted-foreground hover:bg-owner-accent/10 hover:text-owner-accent': currentPath !== item.href,
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
    );
}
