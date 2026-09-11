import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { FlashMessageToaster } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export default ({ children, breadcrumbs, className, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} className={className} {...props}>
        <FlashMessageToaster />
        {children}
    </AppLayoutTemplate>
);
