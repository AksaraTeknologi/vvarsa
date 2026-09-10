import { SidebarInset } from '@/components/ui/sidebar';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    const { auth } = usePage<SharedData>().props;
    const isOwner = auth.user?.roles?.includes('owner');

    if (variant === 'sidebar') {
        return (
            <SidebarInset className={isOwner ? 'owner-content' : undefined} {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl" {...props}>
            {children}
        </main>
    );
}
