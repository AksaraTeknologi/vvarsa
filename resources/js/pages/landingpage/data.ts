import { BarChart3, Boxes, Crown, Package, Sparkles, UsersRound, WalletCards } from 'lucide-react';

export const navigation = [
    ['Manfaat', '#manfaat'],
    ['Fitur', '#produk'],
    ['Cara Kerja', '#cara-kerja'],
    ['Paket', '#paket'],
    ['Cerita', '#cerita'],
] as const;

export type LandingFeature = {
    number: string;
    icon: typeof Package;
    title: string;
    description: string;
    color: string;
    bg: string;
    type: string;
    metric: string;
    metricLabel: string;
    trend: string;
    trendLabel: string;
    secondary: string;
    secondaryColor: string;
    tone: string;
    bars?: readonly number[];
    sparkline?: readonly number[];
    ring?: number;
};

export const features: LandingFeature[] = [
    {
        number: '01', icon: Package, title: 'Inventori otomatis',
        description: 'Pantau stok bahan dan produk secara real-time. Setiap transaksi otomatis memperbarui jumlah stok.',
        color: '#5E4BF2', bg: '#F1EFFD', type: 'bars', metric: '128', metricLabel: 'Total inventori',
        trend: '+24.8%', trendLabel: 'Growth', secondary: 'Aman', secondaryColor: '#D8F380', tone: 'purple',
        bars: [30, 40, 35, 60, 46, 70, 58, 78, 64, 88],
    },
    {
        number: '02', icon: BarChart3, title: 'Laporan lebih jelas',
        description: 'Lihat omzet, pengeluaran, laba, dan performa bisnis dalam dashboard yang mudah dipahami.',
        color: '#FF8C67', bg: '#FFF1EC', type: 'line', metric: 'Rp 3,45jt', metricLabel: 'Total penjualan',
        trend: '+18.2%', trendLabel: 'Profit', secondary: '48 transaksi', secondaryColor: '#FF8C67', tone: 'orange',
        sparkline: [18, 28, 20, 42, 31, 58, 48, 72, 61, 88],
    },
    {
        number: '03', icon: UsersRound, title: 'Tim lebih teratur',
        description: 'Atur akses owner, kasir, koki, dan staff sesuai peran masing-masing.',
        color: '#1777FB', bg: '#EEF5FF', type: 'ring', metric: '12', metricLabel: 'Total staff',
        trend: '+92%', trendLabel: 'Aktivitas', secondary: '7 role aktif', secondaryColor: '#79D7FF', tone: 'blue', ring: 82,
    },
] as const;

export type LandingPlan = {
    name: string;
    price: string;
    description: string;
    icon: typeof Package;
    features: readonly string[];
    button: string;
    color: string;
    bg: string;
    featured?: boolean;
};

export const plans: LandingPlan[] = [
    { name: 'Free', price: 'Gratis', description: 'Untuk mulai merapikan bisnis', icon: Package, features: ['Kelola inventori', 'Laporan keuangan harian', 'Akses komunitas'], button: 'Mulai Gratis', color: '#5E4BF2', bg: '#F1EFFD' },
    { name: 'Pro', price: 'Rp149.000', description: 'Untuk bisnis yang sedang tumbuh', icon: Sparkles, features: ['Semua fitur Free', 'Export laporan & PDF', 'Multi-user hingga 5 orang', 'Fitur POS kasir cepat'], button: 'Pilih Pro', color: '#1E2A0A', bg: '#D8F380', featured: true },
    { name: 'Enterprise', price: 'Rp499.000', description: 'Untuk tim dan operasional besar', icon: Crown, features: ['Semua fitur Pro', 'Akses API khusus', 'Dukungan prioritas 24/7', 'Kustomisasi laporan'], button: 'Pilih Enterprise', color: '#FFFFFF', bg: '#FF8C67' },
] as const;

export const steps = [
    { step: '01', icon: Boxes, title: 'Masukkan data', text: 'Input produk, stok, supplier, dan harga hanya sekali, lalu semuanya otomatis tersusun.', color: '#5E4BF2', tint: 'from-[#5E4BF2]/30 to-[#17192E]', badge: 'mulai' },
    { step: '02', icon: WalletCards, title: 'Kelola transaksi', text: 'Kasir, pesanan, pembayaran, dan aktivitas harian berjalan lebih cepat tanpa bolak balik data.', color: '#FF8C67', tint: 'from-[#FF8C67]/30 to-[#17192E]', badge: 'jalan' },
    { step: '03', icon: BarChart3, title: 'Lihat hasil', text: 'Dashboard real-time menampilkan omzet, stok, dan profit tanpa perlu rekap manual.', color: '#79D7FF', tint: 'from-[#1777FB]/30 to-[#17192E]', badge: 'naik' },
] as const;
