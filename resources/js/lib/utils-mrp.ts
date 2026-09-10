/**
 * Format a number using a tenant currency.
 */
export function formatCurrency(amount: number, currencyCode?: string, compact = false): string {
    const currency = currencyCode ?? (typeof window !== 'undefined' ? window.localStorage.getItem('vvarsa.currency') : null) ?? 'IDR';
    const locale = currency === 'IDR' ? 'id-ID' : currency === 'SGD' ? 'en-SG' : 'en-US';
    if (compact) {
        const symbol = currency === 'IDR' ? 'Rp' : currency === 'SGD' ? 'S$' : '$';
        if (amount >= 1_000_000_000) return `${symbol} ${(amount / 1_000_000_000).toFixed(1)}B`;
        if (amount >= 1_000_000) return `${symbol} ${(amount / 1_000_000).toFixed(1)}M`;
        if (amount >= 1_000) return `${symbol} ${(amount / 1_000).toFixed(currency === 'IDR' ? 0 : 1)}K`;
    }
    const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'IDR' ? 0 : 2,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
    }).format(amount);

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
