import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import {
    BarChart3,
    BookOpen,
    Building2,
    CalendarDays,
    ClipboardList,
    CreditCard,
    FileText,
    FlaskConical,
    LayoutDashboard,
    Package,
    Receipt,
    ShoppingBag,
    ShoppingCart,
    Store,
    TrendingUp,
    Users,
    Warehouse,
} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';

// ── Tema warna per role (dari app.css pastel palette) ──
const ROLE_THEME = {
    admin: {
        label: 'Admin Panel',
        text: 'text-admin-accent',
        bg: 'bg-admin-accent',
        bgSubtle: 'bg-admin-bg',
        bgHover: 'hover:bg-admin-hover',
        textHover: 'hover:text-admin-accent',
        dividerBg: 'bg-admin-hover',
        border: 'border-admin-hover',
    },
    owner: {
        label: 'Owner Panel',
        text: 'text-[#2f7d57]',
        bg: 'bg-[#dfeee4]',
        bgSubtle: 'bg-[#edf7f0]',
        bgHover: 'hover:bg-[#f2f5f3]',
        textHover: 'hover:text-[#4a6655]',
        dividerBg: 'bg-[#e7f0ea]',
        border: 'border-[#dfeee4]',
    },
    supervisor: {
        label: 'Supervisor Panel',
        text: 'text-supervisor-accent',
        bg: 'bg-supervisor-accent',
        bgSubtle: 'bg-supervisor-bg',
        bgHover: 'hover:bg-supervisor-hover',
        textHover: 'hover:text-supervisor-accent',
        dividerBg: 'bg-supervisor-hover',
        border: 'border-supervisor-hover',
    },
    staff: {
        label: 'Staff Panel',
        text: 'text-staff-accent',
        bg: 'bg-staff-accent',
        bgSubtle: 'bg-staff-bg',
        bgHover: 'hover:bg-staff-hover',
        textHover: 'hover:text-staff-accent',
        dividerBg: 'bg-staff-hover',
        border: 'border-staff-hover',
    },
} as const;

type RoleTheme = (typeof ROLE_THEME)[keyof typeof ROLE_THEME];

// ── Komponen menu item elegan ──
function NavSection({
    title,
    items,
    theme,
    currentUrl,
}: {
    title?: string;
    items: NavItem[];
    theme: RoleTheme;
    currentUrl: string;
}) {
    if (items.length === 0) return null;

    // Cari satu item paling spesifik (href terpanjang) yang cocok dengan currentUrl.
    const activeHref =
        items
            .filter((item) => currentUrl === item.href || currentUrl.startsWith(item.href + '/'))
            .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;

    return (
        <div className="mb-2">
            {title && (
                <div className={`mb-1 px-3 text-[10px] font-semibold tracking-widest uppercase ${theme.text} opacity-55`}>
                    {title}
                </div>
            )}
            <div className="space-y-0.5 px-2">
                {items.map((item) => {
                    const isActive = item.href === activeHref;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch
                            preserveScroll
                            className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ${
                                isActive ? `${theme.bgSubtle} ${theme.text}` : `text-[#4a4e69] ${theme.textHover} ${theme.bgHover}`
                            }`}
                        >
                            {item.icon && (
                                <item.icon className={`size-4 shrink-0 transition-colors ${isActive ? theme.text : `text-[#9a9bac] ${theme.textHover}`}`} />
                            )}
                            <span className="truncate">{item.title}</span>
                            {isActive && (
                                <span className={`ml-auto size-1.5 shrink-0 rounded-full ${theme.bg}`} />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

// ── Logo Header ──
function SidebarLogo({ href, theme }: { href: string; theme: RoleTheme }) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="hover:!bg-transparent active:!bg-transparent">
                    <Link href={href} prefetch>
                        <div className={`flex aspect-square size-8 items-center justify-center rounded-xl shadow-sm ${theme.bg}`}>
                            <AppLogoIcon className="size-4 fill-current text-white" />
                        </div>
                        <div className="ml-1 grid flex-1 text-left text-sm">
                            <span className="mb-0.5 truncate leading-none font-bold text-[#2c2c2e]">VVARSA</span>
                            <span className={`text-[10px] font-semibold tracking-widest uppercase ${theme.text}`}>
                                {theme.label}
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

// Simpan posisi scroll di luar komponen (module scope)
// agar tidak pernah hilang (reset ke 0) meskipun sidebar ter-unmount oleh Inertia.
let globalSidebarScrollPos = 0;

export function AppSidebar() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const user = auth.user;
    const currentUrl = page.url.split('?')[0];

    // ── Ref ke container scroll sesungguhnya ──
    const scrollRef = useRef<HTMLDivElement>(null);

    // Track scroll position secara real-time
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onScroll = () => {
            globalSidebarScrollPos = el.scrollTop;
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    // Pulihkan scroll secara sinkron sebelum layar di-render (anti-flicker)
    useLayoutEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = globalSidebarScrollPos;
        }
    });

    // Fallback: Paksa kembali posisinya jika browser melakukan auto-focus ke item aktif
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = globalSidebarScrollPos;
            }
        }, 10);
        return () => clearTimeout(timeout);
    }, [currentUrl]);

    const isAdmin = user?.roles?.includes('admin');
    const isOwner = user?.roles?.includes('owner');
    const isSupervisor = user?.roles?.includes('supervisor');

    const theme = isAdmin
        ? ROLE_THEME.admin
        : isOwner
          ? ROLE_THEME.owner
          : isSupervisor
            ? ROLE_THEME.supervisor
            : ROLE_THEME.staff;

    // ── Admin Navigation ──
    if (isAdmin) {
        const adminItems: NavItem[] = [
            { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            { title: 'Daftar Tenant', href: '/admin/tenants', icon: Building2 },
            { title: 'Daftar Pengguna', href: '/admin/users', icon: Users },
            { title: 'Daftar Supplier', href: '/admin/supplier', icon: Store },
            { title: 'Daftar Event', href: '/admin/events', icon: CalendarDays },
            { title: 'Daftar Komunitas', href: '/admin/community', icon: Users },
            { title: 'Paket Langganan', href: '/admin/plans', icon: CreditCard },
        ];

        return (
            <Sidebar collapsible="icon" variant="inset" className={`border-r bg-white ${theme.border}`}>
                <SidebarHeader className="pb-0 pt-4">
                    <SidebarLogo href="/admin" theme={theme} />
                    <div className={`mx-3 mt-3 h-px ${theme.dividerBg}`} />
                </SidebarHeader>

                <SidebarContent className="overflow-hidden py-0">
                    <div
                        ref={scrollRef}
                        className="h-full overflow-y-auto py-3 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        <NavSection items={adminItems} theme={theme} currentUrl={currentUrl} />
                    </div>
                </SidebarContent>

                <SidebarFooter className={`border-t pb-3 pt-2 ${theme.border}`}>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
        );
    }

    // ── Tenant Navigation (Owner, Supervisor, Staff) ──
    const mainItems: NavItem[] = [{ title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }];

    const inventoryItems: NavItem[] = [
        { title: 'Produk (Bahan)', href: '/inventory', icon: Package },
        { title: 'Stok Masuk', href: '/inventory/stock-in', icon: ShoppingCart },
        { title: 'Stok Keluar', href: '/inventory/stock-out', icon: Warehouse },
        { title: 'Stok Opname', href: '/inventory/opname', icon: FileText },
    ];

    const salesItems: NavItem[] = [
        { title: 'Varian Produk', href: '/variants', icon: FlaskConical },
        { title: 'Pesanan', href: '/orders', icon: ClipboardList },
        { title: 'POS Kasir', href: '/pos', icon: ShoppingBag },
    ];

    const financeItems: NavItem[] = isOwner
        ? [
              { title: 'Ringkasan', href: '/finance', icon: BarChart3 },
              { title: 'Transaksi', href: '/finance/transactions', icon: Receipt },
              { title: 'Laporan Penjualan', href: '/finance/sales-report', icon: TrendingUp },
              { title: 'Laporan Pengeluaran', href: '/finance/expense-report', icon: CreditCard },
          ]
        : [];

    const businessItems: NavItem[] = [
        { title: 'Event', href: '/events', icon: CalendarDays },
        { title: 'Komunitas', href: '/community', icon: Users },
        { title: 'Supplier', href: '/suppliers', icon: Store },
        { title: 'Pajak', href: isOwner ? '/tax' : '/tax/consultation', icon: Building2 },
    ];

    if (isOwner || isSupervisor) {
        businessItems.push({ title: 'Anggota Tim', href: '/members', icon: Users });
    }

    if (isOwner) {
        businessItems.push({ title: 'Langganan', href: '/subscription', icon: CreditCard });
        salesItems.unshift({ title: 'Resep (BOM)', href: '/recipes', icon: BookOpen });
        salesItems.unshift({ title: 'Paket Produk', href: '/packages', icon: Package });
    }

    return (
        <Sidebar collapsible="icon" variant="inset" className={`border-r bg-white ${theme.border} ${isOwner ? 'owner-sidebar' : ''}`}>
            <SidebarHeader className="pb-0 pt-4">
                <SidebarLogo href="/dashboard" theme={theme} />
                <div className={`mx-3 mt-3 h-px ${theme.dividerBg}`} />
            </SidebarHeader>

            <SidebarContent className="overflow-hidden py-0">
                <div
                    ref={scrollRef}
                    className="h-full overflow-y-auto py-3 [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    <NavSection items={mainItems} theme={theme} currentUrl={currentUrl} />
                    <NavSection title="Inventori" items={inventoryItems} theme={theme} currentUrl={currentUrl} />
                    <NavSection title="Penjualan" items={salesItems} theme={theme} currentUrl={currentUrl} />
                    {isOwner && <NavSection title="Keuangan" items={financeItems} theme={theme} currentUrl={currentUrl} />}
                    <NavSection title="Bisnis" items={businessItems} theme={theme} currentUrl={currentUrl} />
                </div>
            </SidebarContent>

            <SidebarFooter className={`border-t pb-3 pt-2 ${theme.border}`}>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

