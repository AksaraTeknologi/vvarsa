import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { url } = usePage();
    const isAdminRoute = url.startsWith('/admin');

    return (
        <header
            className={`flex h-14 shrink-0 items-center gap-2 border-b px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 ${
                isAdminRoute ? 'border-white/10 bg-[#0d0d0d]/95 backdrop-blur-sm' : 'border-sidebar-border/50'
            }`}
        >
            <div className="flex flex-1 items-center gap-2">
                <SidebarTrigger className={`-ml-1 ${isAdminRoute ? 'text-white/60 hover:bg-white/5 hover:text-white' : ''}`} />
                {isAdminRoute && breadcrumbs.length > 0 && <div className="mx-1 h-4 w-px bg-white/20" />}
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {isAdminRoute && (
                <div className="flex items-center gap-2">
                    <span className="rounded-md border border-[#1a56ff]/20 bg-[#1a56ff]/15 px-2 py-0.5 text-[11px] font-semibold tracking-widest text-[#1a56ff] uppercase">
                        Admin
                    </span>
                </div>
            )}
        </header>
    );
}
