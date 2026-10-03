import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.roles?.includes('admin') || auth.user?.role === 'admin';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div
                    className={cn(
                        'staff-appearance-panel space-y-6 rounded-2xl p-5 md:p-6',
                        isAdmin
                            ? 'border border-[#DCD8FF] bg-white text-neutral-900 shadow-sm dark:border-[#2b2d4b] dark:bg-[#16172b] dark:text-white'
                            : 'border border-[#4ec77e]/30 bg-[#0c1d17] shadow-[0_20px_60px_rgba(7,20,15,0.7)]',
                    )}
                >
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
