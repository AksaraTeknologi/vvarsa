import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function TenantCurrencySync() {
    const { tenant } = usePage<SharedData>().props;

    useEffect(() => {
        const userLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('vvarsa.language') : null;
        if (!userLanguage && tenant?.currency) {
            window.localStorage.setItem('vvarsa.currency', tenant.currency);
        }
    }, [tenant?.currency]);

    return null;
}