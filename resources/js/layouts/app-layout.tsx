import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { FlashMessageToaster } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <FlashMessageToaster />
        {children}
    </AppLayoutTemplate>
);
