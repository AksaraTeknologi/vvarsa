import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface UserTenantItem {
    id: string;
    name: string;
    slug: string;
    business_type: string;
    currency: 'IDR' | 'USD' | 'SGD' | string;
    plan_name?: string;
    is_current: boolean;
}

export interface AvailablePlan {
    id: string;
    name: string;
    slug: string;
    price: number;
    max_users: number;
    max_products: number;
    features: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    tenant?: {
        id: string | number;
        name: string;
        business_type: string;
        currency: 'IDR' | 'USD' | 'SGD' | string;
        plan: { name: string; slug: string; features: string[]; max_products?: number; max_users?: number } | null;
        max_products?: number;
        max_users?: number;
    };
    userTenants?: UserTenantItem[];
    availablePlans?: AvailablePlan[];
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    permissions: string[];
    [key: string]: unknown;
}
