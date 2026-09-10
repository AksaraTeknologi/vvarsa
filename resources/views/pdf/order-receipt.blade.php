<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Struk Pesanan {{ $order->order_number }}</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            background: #fff;
            line-height: 1.5;
        }
        .page {
            width: 80mm;
            margin: 0 auto;
            padding: 10px 12px 20px;
        }

        /* Header */
        .header {
            text-align: center;
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .header .logo-text {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
        }
        .header .tagline {
            font-size: 9px;
            color: #555;
            margin-top: 2px;
        }
        .header .struk-title {
            font-size: 11px;
            font-weight: 700;
            margin-top: 6px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Info Row */
        .info-table {
            width: 100%;
            font-size: 10px;
            color: #333;
            margin-bottom: 8px;
        }
        .info-table td { padding: 1px 0; vertical-align: top; }
        .info-table td.label { width: 45%; color: #555; }
        .info-table td.value { font-weight: 600; }

        /* Divider */
        .divider {
            border: none;
            border-top: 1px dashed #999;
            margin: 8px 0;
        }
        .divider-solid {
            border: none;
            border-top: 2px solid #1a1a1a;
            margin: 8px 0;
        }

        /* Items */
        .items-header {
            display: flex;
            font-size: 9px;
            font-weight: 700;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .item-row {
            font-size: 10px;
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px dashed #e0e0e0;
        }
        .item-name {
            font-weight: 700;
            font-size: 10px;
            margin-bottom: 2px;
        }
        .item-variants {
            font-size: 9px;
            color: #555;
            margin-bottom: 2px;
        }
        .item-price-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
        }
        .item-qty { color: #555; }
        .item-price { font-weight: 700; }

        /* Total Section */
        .total-section { margin-top: 6px; }
        .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            padding: 1px 0;
        }
        .total-row.grand {
            font-size: 14px;
            font-weight: 900;
            margin-top: 4px;
            padding-top: 4px;
            border-top: 2px solid #1a1a1a;
        }

        /* Payment badge */
        .badge-paid {
            display: inline-block;
            background: #d1fae5;
            color: #065f46;
            font-size: 9px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }
        .badge-unpaid {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            font-size: 9px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 3px;
            text-transform: uppercase;
        }

        /* Footer */
        .footer {
            margin-top: 14px;
            text-align: center;
            font-size: 9px;
            color: #888;
            border-top: 1px dashed #ccc;
            padding-top: 10px;
        }
        .footer .thank-you {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 4px;
        }
    </style>
</head>
<body>
<div class="page">
    {{-- Header --}}
    <div class="header">
        <div class="logo-text">Kasir POS</div>
        <div class="tagline">Sistem Kasir Digital</div>
        <div class="struk-title">Struk Pembelian</div>
    </div>

    {{-- Order Info --}}
    <table class="info-table">
        <tr>
            <td class="label">No. Pesanan</td>
            <td class="value">{{ $order->order_number }}</td>
        </tr>
        <tr>
            <td class="label">Tanggal</td>
            <td class="value">{{ $order->ordered_at->timezone('Asia/Jakarta')->format('d/m/Y H:i') }}</td>
        </tr>
        <tr>
            <td class="label">Pelanggan</td>
            <td class="value">{{ $order->customer_name }}</td>
        </tr>
        @if ($order->customer_phone)
        <tr>
            <td class="label">No. HP</td>
            <td class="value">{{ $order->customer_phone }}</td>
        </tr>
        @endif
        @if ($order->customer_email)
        <tr>
            <td class="label">Email</td>
            <td class="value">{{ $order->customer_email }}</td>
        </tr>
        @endif
        <tr>
            <td class="label">Kasir</td>
            <td class="value">{{ $order->user->name ?? '-' }}</td>
        </tr>
    </table>

    <hr class="divider">

    {{-- Items --}}
    @foreach ($order->items->groupBy(fn($i) => $i->paket_isi . '||' . $i->paket_harga) as $groupKey => $groupItems)
        @php
            [$paketIsi, $paketHarga] = explode('||', $groupKey);
            $paketHarga = (int) $paketHarga;
            $paketIsi   = (int) $paketIsi;
            $names      = $groupItems->pluck('variant_name')->implode(', ');
        @endphp
        <div class="item-row">
            <div class="item-name">Paket {{ $paketIsi }} Pcs</div>
            <div class="item-variants">{{ $names }}</div>
            <div class="item-price-row">
                <span class="item-qty">1x</span>
                <span class="item-price">Rp {{ number_format($paketHarga, 0, ',', '.') }}</span>
            </div>
        </div>
    @endforeach

    <hr class="divider">

    {{-- Total --}}
    <div class="total-section">
        <div class="total-row">
            <span>Subtotal</span>
            <span>Rp {{ number_format($order->subtotal, 0, ',', '.') }}</span>
        </div>
        @if ($order->discount > 0)
        <div class="total-row">
            <span>Diskon</span>
            <span>- Rp {{ number_format($order->discount, 0, ',', '.') }}</span>
        </div>
        @endif
        <div class="total-row grand">
            <span>TOTAL</span>
            <span>Rp {{ number_format($order->total, 0, ',', '.') }}</span>
        </div>
        @if ($order->cash_received !== null && $order->cash_received > 0)
        <div class="total-row" style="margin-top: 5px; padding-top: 4px; border-top: 1px dashed #ccc;">
            <span>Tunai Diterima</span>
            <span>Rp {{ number_format($order->cash_received, 0, ',', '.') }}</span>
        </div>
        <div class="total-row">
            <span>Kembalian</span>
            <span>Rp {{ number_format($order->change_amount ?? 0, 0, ',', '.') }}</span>
        </div>
        @endif
    </div>

    <hr class="divider" style="margin-top: 8px;">

    {{-- Payment Info --}}
    <table class="info-table" style="margin-top: 6px;">
        <tr>
            <td class="label">Metode Bayar</td>
            <td class="value">{{ $order->payment_method ?? '-' }}</td>
        </tr>
        <tr>
            <td class="label">Status</td>
            <td class="value">
                @if ($order->payment_status === 'paid')
                    <span class="badge-paid">Lunas</span>
                @else
                    <span class="badge-unpaid">Belum Lunas</span>
                @endif
            </td>
        </tr>
    </table>

    @if ($order->notes)
    <hr class="divider">
    <div style="font-size: 9px; color: #555;">
        <strong>Catatan:</strong> {{ $order->notes }}
    </div>
    @endif

    {{-- Footer --}}
    <div class="footer">
        <div class="thank-you">Terima Kasih! 🧡</div>
        <div>Pesanan Anda sangat berarti bagi kami.</div>
        <div style="margin-top: 6px;">{{ $order->ordered_at->timezone('Asia/Jakarta')->format('d M Y, H:i') }} WIB</div>
    </div>
</div>
</body>
</html>
