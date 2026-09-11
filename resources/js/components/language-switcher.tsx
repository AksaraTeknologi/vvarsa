import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLiveExchangeRate } from '@/lib/utils-mrp';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
    const { i18n, t } = useTranslation();
    const isEn = i18n.language === 'en';

    useEffect(() => {
        // Fetch live exchange rate in background
        void fetchLiveExchangeRate();
    }, []);

    const toggleLanguage = () => {
        const nextLanguage = isEn ? 'id' : 'en';
        const nextCurrency = nextLanguage === 'en' ? 'USD' : 'IDR';
        void i18n.changeLanguage(nextLanguage);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('vvarsa.language', nextLanguage);
            window.localStorage.setItem('vvarsa.currency', nextCurrency);
            window.dispatchEvent(new CustomEvent('vvarsa:currency-change', { detail: nextCurrency }));
        }
        void fetchLiveExchangeRate();
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isEn}
            aria-label={t('common.language', 'Bahasa / Currency')}
            onClick={toggleLanguage}
            className={cn(
                'relative inline-flex h-8 w-[72px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ease-in-out shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50',
                isEn ? 'bg-[#4CAF50] justify-start' : 'bg-[#B0B0B0] justify-end',
                className
            )}
        >
            {/* Label inside track */}
            <span
                className={cn(
                    'select-none text-[12px] font-extrabold tracking-wider text-white transition-opacity duration-200 px-2.5',
                    isEn ? 'order-1' : 'order-2'
                )}
            >
                {isEn ? 'EN' : 'ID'}
            </span>

            {/* Circular knob matching image.png */}
            <span
                className={cn(
                    'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out',
                    isEn ? 'order-2' : 'order-1'
                )}
                style={{
                    boxShadow: '0 2px 5px rgba(0,0,0,0.25), inset 0 -1px 2px rgba(0,0,0,0.1)'
                }}
            />
        </button>
    );
}