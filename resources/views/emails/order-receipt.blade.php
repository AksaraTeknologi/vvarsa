<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Struk Pesanan</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6; background: #f9f9f9; margin: 0; padding: 0;">
    <div style="max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
        {{-- Header --}}
        <div style="background: #4f46e5; color: #fff; padding: 28px 32px;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">🧾 Struk Pesanan</h1>
            <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Terima kasih telah berbelanja!</p>
        </div>

        {{-- Body --}}
        <div style="padding: 28px 32px;">
            <p style="margin: 0 0 16px; color: #555;">
                Halo <strong>{{ $order->customer_name }}</strong>, berikut adalah struk pembelian Anda.
                PDF struk juga telah dilampirkan pada email ini.
            </p>

            {{-- Order Info --}}
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                    <td style="padding: 6px 0; color: #888; font-size: 13px; width: 140px;">Nomor Pesanan</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #4f46e5;">{{ $order->order_number }}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #888; font-size: 13px;">Tanggal</td>
                    <td style="padding: 6px 0;">{{ $order->ordered_at->timezone('Asia/Jakarta')->format('d M Y, H:i') }} WIB</td>
                </tr>
                @if ($order->customer_phone)
                <tr>
                    <td style="padding: 6px 0; color: #888; font-size: 13px;">No. HP</td>
                    <td style="padding: 6px 0;">{{ $order->customer_phone }}</td>
                </tr>
                @endif
                <tr>
                    <td style="padding: 6px 0; color: #888; font-size: 13px;">Metode Bayar</td>
                    <td style="padding: 6px 0;">{{ $order->payment_method ?? 'Belum dibayar' }}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #888; font-size: 13px;">Status Bayar</td>
                    <td style="padding: 6px 0;">
                        @if ($order->payment_status === 'paid')
                            <span style="color: #10b981; font-weight: 600;">✓ Lunas</span>
                        @else
                            <span style="color: #f59e0b; font-weight: 600;">⏳ Belum Lunas</span>
                        @endif
                    </td>
                </tr>
            </table>

            {{-- Items Table --}}
            <h3 style="margin: 0 0 10px; font-size: 14px; font-weight: 700; color: #111;">Detail Item</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 8px 10px; text-align: left; border-radius: 4px 0 0 4px; color: #555;">Produk</th>
                        <th style="padding: 8px 10px; text-align: center; color: #555;">Qty</th>
                        <th style="padding: 8px 10px; text-align: right; border-radius: 0 4px 4px 0; color: #555;">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->items->groupBy(fn($i) => $i->paket_isi . '-' . $i->paket_harga) as $groupKey => $groupItems)
                        @php
                            $paketHarga = $groupItems->first()->paket_harga;
                            $paketIsi  = $groupItems->first()->paket_isi;
                            $names     = $groupItems->pluck('variant_name')->implode(', ');
                        @endphp
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 8px 10px; color: #333;">
                                Paket {{ $paketIsi }} — {{ $names }}
                            </td>
                            <td style="padding: 8px 10px; text-align: center; color: #555;">1</td>
                            <td style="padding: 8px 10px; text-align: right; font-weight: 600; color: #333;">
                                Rp {{ number_format($paketHarga, 0, ',', '.') }}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{-- Total --}}
            <div style="background: #f3f4f6; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="font-size: 15px; font-weight: 700; color: #111;">Total Pembayaran</td>
                        <td style="font-size: 17px; font-weight: 800; color: #4f46e5; text-align: right;">
                            Rp {{ number_format($order->total, 0, ',', '.') }}
                        </td>
                    </tr>
                </table>
            </div>

            @if ($order->notes)
            <p style="margin: 16px 0 0; font-size: 13px; color: #888;"><strong>Catatan:</strong> {{ $order->notes }}</p>
            @endif
        </div>

        {{-- Footer --}}
        <div style="background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 18px 32px; text-align: center; font-size: 12px; color: #aaa;">
            Email ini dikirim secara otomatis oleh sistem kasir. Terima kasih atas kepercayaan Anda!
        </div>
    </div>
</body>
</html>
