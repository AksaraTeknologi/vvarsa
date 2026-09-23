import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const isAdmin = auth.user?.roles?.includes('admin');
    const isSupervisor = auth.user?.roles?.includes('supervisor');
    const isStaff = auth.user?.roles?.includes('staff');

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={`${isAdmin ? 'admin-user-menu' : isSupervisor ? 'supervisor-user-menu' : isStaff ? 'staff-user-menu' : 'bg-owner-accent/10 text-owner-accent hover:bg-owner-accent/15 hover:text-owner-accent data-[state=open]:bg-owner-accent/15 data-[state=open]:text-owner-accent'} group`}
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
