import { SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, className, ...props }: AppContentProps) {
    const { auth } = usePage<SharedData>().props;
    const isOwner = auth.user?.roles?.includes('owner');

    if (variant === 'sidebar') {
        return (
            <SidebarInset className={cn(isOwner && 'owner-content', className)} {...props}>
                {children}
            </SidebarInset>
        );
    }

    return (
        <main className={cn('mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl', className)} {...props}>
            {children}
        </main>
    );
}
