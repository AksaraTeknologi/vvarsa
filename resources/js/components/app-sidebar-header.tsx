import { Breadcrumbs } from '@/components/breadcrumbs';
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
                isAdminRoute ? 'border-[#E7E3FA] bg-white/85 backdrop-blur-sm' : isOwnerRoute ? 'owner-header' : 'border-sidebar-border/50'
            }`}
        >
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className={`-ml-1 ${isAdminRoute ? 'text-[#53556A] hover:bg-[#F1EFFD] hover:text-[#17182A]' : isOwnerRoute ? 'text-[#4A6B59] hover:bg-[#D4F0E1] hover:text-[#2D6B49]' : ''}`} />
                {isAdminRoute && breadcrumbs.length > 0 && <div className="mx-1 h-4 w-px bg-[#E7E3FA]" />}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {isAdminRoute && (
                <div className="flex items-center gap-2">
                    <span className="rounded-md border border-[#5E4BF2]/20 bg-[#F1EFFD] px-2 py-0.5 text-[11px] font-semibold tracking-widest text-[#5E4BF2] uppercase">
                        Admin
                    </span>
                </div>
            )}
        </header>
    );
}
