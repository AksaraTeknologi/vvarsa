import i18n from '@/lib/i18n';

/**
 * Fallback exchange rate constant for converting IDR to USD
 */
export const DEFAULT_USD_EXCHANGE_RATE = 15000;

/**
 * Get current USD exchange rate (cached or default)
 */
export function getUsdExchangeRate(): number {
    if (typeof window !== 'undefined') {
        const cached = window.localStorage.getItem('vvarsa.usd_rate');
        if (cached) {
            const parsed = parseFloat(cached);
            if (!isNaN(parsed) && parsed > 0) return parsed;
        }
    }
    return DEFAULT_USD_EXCHANGE_RATE;
}

/**
 * Fetch live USD exchange rate in real-time
 */
export async function fetchLiveExchangeRate(): Promise<number> {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (data && data.rates && data.rates.IDR) {
            const liveRate = data.rates.IDR;
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('vvarsa.usd_rate', String(liveRate));
                window.localStorage.setItem('vvarsa.usd_rate_updated', String(Date.now()));
            }
            return liveRate;
        }
    } catch (e) {
        // Fall back gracefully to cached or default rate if offline or API error occurs
    }
    return getUsdExchangeRate();
}

/**
 * Get active currency based on localStorage or current i18n language
 */
export function getActiveCurrency(): string {
    if (typeof window !== 'undefined') {
        const savedCurrency = window.localStorage.getItem('vvarsa.currency');
        if (savedCurrency === 'USD' || savedCurrency === 'IDR' || savedCurrency === 'SGD') {
            return savedCurrency;
        }
    }
    const currentLang = i18n.language || (typeof window !== 'undefined' ? window.localStorage.getItem('vvarsa.language') : 'id');
    return currentLang === 'en' ? 'USD' : 'IDR';
}

/**
 * Get active currency symbol
 */
export function getCurrencySymbol(currencyCode?: string): string {
    const currency = currencyCode ?? getActiveCurrency();
    if (currency === 'USD') return '$';
    if (currency === 'SGD') return 'S$';
    return 'Rp';
}

/**
 * Format a number using tenant/active currency.
 */
export function formatCurrency(
    amount: number,
    currencyCode?: string,
    compact = false,
    convertRate = true
): string {
    const currency = currencyCode ?? getActiveCurrency();
    const locale = currency === 'IDR' ? 'id-ID' : currency === 'SGD' ? 'en-SG' : 'en-US';

    let displayAmount = amount;
    if (convertRate && currency === 'USD' && !currencyCode) {
        displayAmount = amount / getUsdExchangeRate();
    }

    if (compact) {
        const symbol = getCurrencySymbol(currency);
        if (displayAmount >= 1_000_000_000) return `${symbol} ${(displayAmount / 1_000_000_000).toFixed(1)}B`;
        if (displayAmount >= 1_000_000) return `${symbol} ${(displayAmount / 1_000_000).toFixed(1)}M`;
        if (displayAmount >= 1_000) return `${symbol} ${(displayAmount / 1_000).toFixed(currency === 'IDR' ? 0 : 1)}K`;
        return `${symbol} ${displayAmount.toFixed(currency === 'IDR' ? 0 : 2)}`;
    }

    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'IDR' ? 0 : 2,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(displayAmount);

    return currency === 'SGD' ? formatted.replace('$', 'S$') : formatted;
}

export const formatRupiah = (amount: number, compact = false): string => formatCurrency(amount, undefined, compact);

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    });
}

/**
 * Format date and time
 */
export function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Get stock badge color based on stock level
 */
export function getStockStatus(current: number, min: number): 'danger' | 'warning' | 'success' {
    if (current <= 0) return 'danger';
    if (current <= min) return 'warning';
    return 'success';
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length = 100): string {
    return text.length > length ? text.slice(0, length) + '...' : text;
}

/**
 * Business type label mapping
 */
export const BUSINESS_TYPE_LABELS: Record<string, string> = {
    fnb: 'FnB (Makanan & Minuman)',
    retail: 'Retail',
    fashion: 'Fashion',
    general: 'Umum',
    service: 'Jasa',
};

/**
 * Indonesian month names
 */
export const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
