import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { FlashMessageToaster } from '@/lib/toast';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    bgImage?: string;
    reverse?: boolean;
}

export default function AuthLayout({ children, title, description, reverse, ...props }: AuthLayoutProps) {
    const { t } = useTranslation();
    const isRegister = reverse ?? (typeof route !== 'undefined' ? route().current('register') : false);
    
    const displayTitle = title ?? (isRegister ? t('auth.register.title', 'Create an account') : t('auth.login.title', 'Log in to your account'));
    const displayDescription = description ?? (isRegister ? t('auth.register.description', 'Enter your details below to create your account') : t('auth.login.description', 'Enter your email and password below to log in'));

    return (
        <AuthSplitLayout title={displayTitle} description={displayDescription} reverse={isRegister} {...props}>
            <FlashMessageToaster />
            {children}
        </AuthSplitLayout>
    );
}

export const withAuthLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;

