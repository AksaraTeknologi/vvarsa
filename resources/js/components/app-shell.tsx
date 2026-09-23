import { SidebarProvider } from '@/components/ui/sidebar';
import { staffShellClassName } from '@/roles/staff/styles';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const page = usePage<SharedData>();
    const isOpen = page.props.sidebarOpen;
    const isAdminRoute = page.url.startsWith('/admin');
    const isAdmin = page.props.auth.user?.roles?.includes('admin');
    const isOwner = page.props.auth.user?.roles?.includes('owner');
    const isSupervisor = page.props.auth.user?.roles?.includes('supervisor');
    const isStaff = page.props.auth.user?.roles?.includes('staff');

    if (variant === 'header') {
        return <div className="flex min-h-screen w-full flex-col">{children}</div>;
    }

    return (
        <SidebarProvider
            defaultOpen={isOpen}
            className={isAdminRoute || isAdmin ? 'admin-theme' : isOwner ? 'owner-theme' : isSupervisor ? 'supervisor-theme' : isStaff ? staffShellClassName : undefined}
        >
            {children}
        </SidebarProvider>
    );
}
