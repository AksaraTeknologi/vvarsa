import { Breadcrumbs } from '@/components/breadcrumbs';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NotificationDropdown } from '@/components/notification-dropdown';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { url, props } = usePage<SharedData>();
    const isAdminRoute = url.startsWith('/admin');
    const isOwnerRoute = !isAdminRoute && props.auth.user?.roles?.includes('owner');

    return (
        <header
            className={`flex h-14 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 ${
                isAdminRoute ? 'border-[#E7E3FA] bg-white/85 backdrop-blur-sm dark:border-[#a78bfa]/25 dark:bg-transparent' : isOwnerRoute ? 'owner-header' : 'border-sidebar-border/50'
            }`}
        >
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger
                    className={`-ml-1 ${isAdminRoute ? 'text-[#53556A] hover:bg-[#F1EFFD] hover:text-[#17182A] dark:text-[#c4b5fd] dark:hover:bg-[#8b5cf6]/20 dark:hover:text-[#ffffff]' : isOwnerRoute ? 'text-[#4A6B59] hover:bg-[#D4F0E1] hover:text-[#2D6B49]' : ''}`}
                />
                {isAdminRoute && breadcrumbs.length > 0 && <div className="mx-1 h-4 w-px bg-[#E7E3FA] dark:bg-[#a78bfa]/35" />}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitcher className={isAdminRoute ? 'admin-language-switcher' : undefined} />
                <NotificationDropdown />
            </div>
        </header>
    );
}
