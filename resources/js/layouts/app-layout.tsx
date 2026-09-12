import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { TenantCurrencySync } from '@/components/tenant-currency-sync';
import { FlashMessageToaster } from '@/lib/toast';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    className?: string;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <TenantCurrencySync />
        <FlashMessageToaster />
        {children}
    </AppLayoutTemplate>
);
