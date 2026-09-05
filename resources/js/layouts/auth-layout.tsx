import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { FlashMessageToaster } from '@/lib/toast';
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    bgImage?: string;
    reverse?: boolean;
}

export default function AuthLayout({ children, title, description, reverse, ...props }: AuthLayoutProps) {
    const isRegister = reverse ?? (typeof route !== 'undefined' ? route().current('register') : false);
    
    const displayTitle = title ?? (isRegister ? "Create an account" : "Log in to your account");
    const displayDescription = description ?? (isRegister ? "Enter your details below to create your account" : "Enter your email and password below to log in");

    return (
        <AuthSplitLayout title={displayTitle} description={displayDescription} reverse={isRegister} {...props}>
            <FlashMessageToaster />
            {children}
        </AuthSplitLayout>
    );
}

export const withAuthLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;
