import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export function TenantCurrencySync() {
    const { tenant } = usePage<SharedData>().props;

    useEffect(() => {
        if (tenant?.currency) window.localStorage.setItem('vvarsa.currency', tenant.currency);
    }, [tenant?.currency]);

    return null;
}