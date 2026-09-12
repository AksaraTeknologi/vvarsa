<?php

namespace App\Support;

use NumberFormatter;

class Currency
{
    public static function format(float|int $amount, string $currencyCode = 'IDR'): string
    {
        $currencyCode = in_array($currencyCode, ['IDR', 'USD', 'SGD'], true) ? $currencyCode : 'IDR';
        $locale = match ($currencyCode) {
            'USD' => 'en-US',
            'SGD' => 'en-SG',
            default => 'id-ID',
        };

        $formatter = new NumberFormatter($locale, NumberFormatter::CURRENCY);
        $formatter->setAttribute(NumberFormatter::FRACTION_DIGITS, $currencyCode === 'IDR' ? 0 : 2);

        $formatted = $formatter->formatCurrency((float) $amount, $currencyCode);

        return $currencyCode === 'SGD' ? str_replace('$', 'S$', $formatted) : $formatted;
    }
}