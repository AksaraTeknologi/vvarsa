import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3, Boxes, CakeSlice, Check, ChefHat, CircleDollarSign, Coffee, Crown, FileText, Heart, Menu, Package, Play, Sparkles, Soup, TrendingUp, UsersRound, Utensils, WalletCards, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type SharedData } from '@/types';

const features = [
    {
        icon: Package,
        title: 'Stok selalu siap',
        text: 'Pantau bahan, produk, dan pergerakan stok tanpa spreadsheet berantakan.',
        color: 'bg-[#1777fb] text-white shadow-[#1777fb]/25',
        badgeBg: 'bg-[#eef5ff] text-[#1777fb] border border-[#1777fb]/20',
        borderColor: 'border-[#1777fb]/30',
        tag: 'Praktis',
    },
    {
        icon: BarChart3,
        title: 'Bisnis lebih terarah',
        text: 'Lihat penjualan dan laporan keuangan yang membantu keputusan harian.',
        color: 'bg-[#ffbc03] text-[#0f172a] shadow-[#ffbc03]/30',
        badgeBg: 'bg-[#fff8e5] text-[#b88600] border border-[#ffbc03]/30',
        borderColor: 'border-[#ffbc03]/40',
        tag: 'Otomatis',
    },
    {
        icon: Utensils,
        title: 'Komunitas bertumbuh',
        text: 'Terhubung dengan pemilik usaha lain, event, supplier, dan insight baru.',
        color: 'bg-[#fb0001] text-white shadow-[#fb0001]/25',
        badgeBg: 'bg-[#fdf0f4] text-[#fb0001] border border-[#fb0001]/20',
        borderColor: 'border-[#fb0001]/30',
        tag: 'Seru & Ramai',
    },
];

const stats = [
    { value: '4.8x', label: 'lebih cepat kelola stok', color: 'text-[#ffbc03]' },
    { value: '24/7', label: 'data tersimpan aman', color: 'text-[#f5c4d1]' },
    { value: '1 ruang', label: 'untuk operasional', color: 'text-[#1777fb]' },
];

const plans = [
    {
        name: 'Free',
        price: 'Gratis',
        note: 'Untuk mulai merapikan bisnis',
        icon: Package,
        accentColor: 'text-[#1777fb]',
        headerBg: 'bg-[#eef5ff]',
        badgeBg: 'bg-[#1777fb] text-white',
        border: 'border-2 border-[#1777fb]/20',
        btnBg: 'bg-[#1777fb] hover:bg-[#0d5ecc] text-white',
        features: ['Kelola inventori', 'Laporan keuangan harian', 'Akses komunitas'],
    },
    {
        name: 'Pro',
        price: 'Rp149.000',
        note: 'Untuk bisnis yang sedang tumbuh pesat',
        icon: Sparkles,
        accentColor: 'text-[#fb0001]',
        headerBg: 'bg-[#fdf0f4]',
        badgeBg: 'bg-[#fb0001] text-white',
        border: 'border-4 border-[#fb0001]',
        btnBg: 'bg-[#fb0001] hover:bg-[#d00001] text-white',
        featured: true,
        features: ['Semua fitur Free', 'Export laporan & PDF', 'Multi-user hingga 5 orang', 'Fitur POS kasir cepat'],
    },
    {
        name: 'Enterprise',
        price: 'Rp499.000',
        note: 'Untuk tim dan operasional besar',
        icon: Crown,
        accentColor: 'text-[#d99b00]',
        headerBg: 'bg-[#fff8e5]',
        badgeBg: 'bg-[#ffbc03] text-[#0f172a]',
        border: 'border-2 border-[#ffbc03]/40',
        btnBg: 'bg-[#ffbc03] hover:bg-[#e0a500] text-[#0f172a]',
        features: ['Semua fitur Pro', 'Akses API khusus', 'Dukungan prioritas 24/7', 'Kustomisasi laporan'],
    },
];

const cuteStickerArchGallery = [
    { label: 'Boba Cute', pos: '0% 0%', bg: 'bg-[#eef5ff]', border: 'border-[#1777fb]' },
    { label: 'Ramen Joy', pos: '35% 0%', bg: 'bg-[#fdf0f4]', border: 'border-[#fb0001]' },
    { label: 'Fresh Milk', pos: '68% 0%', bg: 'bg-[#fff8e5]', border: 'border-[#ffbc03]' },
    { label: 'Pastry Croissant', pos: '100% 0%', bg: 'bg-[#f5c4d1]/40', border: 'border-[#fb0001]' },
    { label: 'Happy Order Box', pos: '30% 45%', bg: 'bg-[#eef5ff]', border: 'border-[#1777fb]' },
    { label: 'Crazy Chili', pos: '75% 45%', bg: 'bg-[#fdf0f4]', border: 'border-[#fb0001]' },
    { label: 'Cake Slice', pos: '10% 85%', bg: 'bg-[#fff8e5]', border: 'border-[#ffbc03]' },
    { label: 'Fruit Friends', pos: '90% 85%', bg: 'bg-[#eef5ff]', border: 'border-[#1777fb]' },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.remove('opacity-0', 'translate-y-8', 'scale-[0.97]', 'scale-95');
                    entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.16 },
        );

        revealItems.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="VVARSA - Kelola bisnis jadi seru & rapi">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                @keyframes marqueeLeft {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marqueeRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .animate-marquee-left {
                    display: flex;
                    width: max-content;
                    animation: marqueeLeft 24s linear infinite;
                }
                .animate-marquee-right {
                    display: flex;
                    width: max-content;
                    animation: marqueeRight 24s linear infinite;
                }
                .animate-marquee-left:hover, .animate-marquee-right:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="min-h-screen bg-[#f8fafc] font-['Plus_Jakarta_Sans'] text-[#0f172a] selection:bg-[#ffbc03] selection:text-[#0f172a]">
                {/* Header Top Bar */}
                <header className="sticky top-0 z-40 mx-auto w-full border-b-2 border-[#0f172a]/10 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-md lg:px-10">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <Link href={route('home')} className="flex items-center gap-3 group" aria-label="VVARSA">
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1777fb] text-white shadow-md shadow-[#1777fb]/30 transition group-hover:rotate-6 group-hover:scale-110">
                                <ChefHat className="size-6" strokeWidth={2.5} />
                            </span>
                            <span className="text-2xl font-black tracking-tight text-[#0f172a]">
                                VVAR<span className="text-[#fb0001]">SA</span>
                                <span className="ml-1.5 inline-block rounded-full bg-[#ffbc03] px-2 py-0.5 text-[10px] font-black uppercase text-[#0f172a]">
                                    Fresh
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden items-center gap-7 text-base font-bold text-[#475569] md:flex">
                            <a href="#manfaat" className="rounded-full px-3 py-1.5 transition hover:bg-[#eef5ff] hover:text-[#1777fb]">
                                Manfaat
                            </a>
                            <a href="#cara-kerja" className="rounded-full px-3 py-1.5 transition hover:bg-[#fff8e5] hover:text-[#b88600]">
                                Cara kerja
                            </a>
                            <a href="#produk" className="rounded-full px-3 py-1.5 transition hover:bg-[#fdf0f4] hover:text-[#fb0001]">
                                Ekosistem
                            </a>
                            <a href="#paket" className="rounded-full px-3 py-1.5 transition hover:bg-[#fff8e5] hover:text-[#b88600]">
                                Paket
                            </a>
                            <a href="#cerita" className="rounded-full px-3 py-1.5 transition hover:bg-[#f5c4d1]/30 hover:text-[#0f172a]">
                                Cerita pengguna
                            </a>
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full border-2 border-[#0f172a] bg-white px-5 py-2.5 text-base font-extrabold text-[#0f172a] shadow-sm transition hover:bg-[#ffbc03]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="px-4 py-2.5 text-base font-extrabold text-[#475569] transition hover:text-[#1777fb]">
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-[#1777fb] px-6 py-2.5 text-base font-extrabold text-white shadow-md shadow-[#1777fb]/30 transition hover:-translate-y-0.5 hover:bg-[#fb0001]"
                                    >
                                        Mulai Gratis <ArrowRight className="ml-1 inline size-4 stroke-[3]" />
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="rounded-2xl bg-[#f1f5f9] p-2.5 text-[#0f172a] hover:bg-[#e2e8f0] md:hidden"
                            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
                        >
                            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </header>

                {/* Mobile Navigation */}
                {menuOpen && (
                    <div className="relative z-30 mx-6 mt-2 flex flex-col gap-2 rounded-3xl border-2 border-[#0f172a] bg-white p-4 shadow-xl md:hidden">
                        <a href="#manfaat" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-2.5 text-base font-bold text-[#0f172a] hover:bg-[#eef5ff]">
                            Manfaat
                        </a>
                        <a href="#cara-kerja" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-2.5 text-base font-bold text-[#0f172a] hover:bg-[#fff8e5]">
                            Cara kerja
                        </a>
                        <a href="#produk" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-2.5 text-base font-bold text-[#0f172a] hover:bg-[#fdf0f4]">
                            Ekosistem
                        </a>
                        <a href="#paket" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-2.5 text-base font-bold text-[#0f172a] hover:bg-[#fff8e5]">
                            Paket
                        </a>
                        {!auth.user && (
                            <Link href={route('login')} className="mt-2 rounded-2xl bg-[#1777fb] px-4 py-3 text-center text-base font-extrabold text-white shadow-md">
                                Masuk ke akun
                            </Link>
                        )}
                    </div>
                )}

                <main>
                    {/* Hero Section */}
                    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pt-12 pb-20 lg:grid-cols-[1fr_1fr] lg:px-10 lg:pt-16 lg:pb-28">
                        <div className="relative z-10 max-w-xl">
                            {/* Cute Tag */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-[#fb0001] bg-[#fdf0f4] px-4 py-2 text-xs font-black tracking-wider text-[#fb0001] uppercase shadow-sm">
                                <Sparkles className="size-4 text-[#ffbc03] fill-[#ffbc03]" />
                                <span>Solusi Usaha Paling Seger</span>
                                <span className="rounded-full bg-[#ffbc03] px-2 py-0.5 text-[10px] text-[#0f172a]">New</span>
                            </div>

                            <h1 className="text-5xl leading-[1.02] font-black tracking-tight text-[#0f172a] sm:text-6xl lg:text-[4.8rem]">
                                Kelola bisnis <br />
                                <span className="inline-block rounded-2xl bg-[#ffbc03] px-4 py-1 text-[#0f172a] -rotate-1 shadow-md">
                                    jadi seru & rapi.
                                </span>
                            </h1>

                            <p className="mt-7 max-w-lg text-lg leading-relaxed font-semibold text-[#475569]">
                                Pantau stok bahan, catat transaksi penjualan, dan rapikan laporan keuangan tanpa perlu pusing. <span className="text-[#fb0001] font-bold">Semua dalam 1 tempat!</span>
                            </p>

                            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group inline-flex items-center justify-center rounded-2xl bg-[#1777fb] px-7 py-4 text-base font-black text-white shadow-lg shadow-[#1777fb]/30 transition hover:-translate-y-1 hover:bg-[#0d5ecc]"
                                >
                                    Coba Gratis Sekarang <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1 stroke-[3]" />
                                </Link>

                                <a
                                    href="#cara-kerja"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#0f172a]/15 bg-white px-6 py-4 text-base font-extrabold text-[#0f172a] shadow-sm transition hover:border-[#1777fb] hover:bg-[#eef5ff] hover:text-[#1777fb]"
                                >
                                    <Play className="size-4 fill-[#ffbc03] text-[#ffbc03]" /> Lihat cara kerja
                                </a>
                            </div>

                            {/* Cute Avatars Banner */}
                            <div className="mt-10 flex items-center gap-4 rounded-2xl border-2 border-[#0f172a]/10 bg-white p-3.5 shadow-sm max-w-md">
                                <div className="flex -space-x-3">
                                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#ffbc03] text-sm font-black shadow-sm">
                                        <Soup className="size-5 text-[#0f172a]" />
                                    </span>
                                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#1777fb] text-sm font-black text-white shadow-sm">
                                        <Coffee className="size-5" />
                                    </span>
                                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#f5c4d1] text-sm font-black text-[#fb0001] shadow-sm">
                                        <CakeSlice className="size-5" />
                                    </span>
                                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#fb0001] text-sm font-black text-white shadow-sm">
                                        <Heart className="size-5 fill-white" />
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-[#1777fb]">Dipercaya 1,200+ Usaha</p>
                                    <p className="text-sm font-extrabold text-[#0f172a]">Kuliner, Cafe, Retail & UMKM</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Interactive Visual */}
                        <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]">
                            {/* Cute Layered Card Backgrounds */}
                            <div className="absolute top-4 right-2 h-[88%] w-[88%] rotate-4 rounded-[2.5rem] border-4 border-[#0f172a] bg-[#ffbc03] shadow-xl sm:rounded-[3rem]" />
                            <div className="absolute top-8 left-2 h-[88%] w-[88%] -rotate-3 rounded-[2.5rem] border-4 border-[#0f172a] bg-[#f5c4d1] shadow-lg sm:rounded-[3rem]" />

                            {/* Main Card */}
                            <div data-reveal className="absolute inset-x-2 top-0 mx-auto h-[90%] max-w-[440px] transition duration-700">
                                <div className="h-full overflow-hidden rounded-[2.5rem] border-4 border-[#0f172a] bg-white p-6 shadow-2xl transition hover:rotate-1 sm:rounded-[3rem]">
                                    {/* Card Header */}
                                    <div className="flex items-center justify-between border-b-2 border-[#0f172a]/10 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="flex size-10 items-center justify-center rounded-2xl bg-[#1777fb] text-white">
                                                <ChefHat className="size-5" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold text-[#64748b]">Dapur & Cafe</p>
                                                <p className="text-base font-black text-[#0f172a]">VVARSA Live</p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fdf0f4] border border-[#fb0001]/30 px-3 py-1 text-xs font-black text-[#fb0001]">
                                            <span className="size-2 rounded-full bg-[#fb0001] animate-pulse"></span>
                                            Live Update
                                        </span>
                                    </div>

                                    {/* Sales Display */}
                                    <div className="mt-5 rounded-2xl border-2 border-[#1777fb]/20 bg-[#eef5ff] p-5">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-xs font-extrabold text-[#1777fb] uppercase tracking-wider">Penjualan Hari Ini</p>
                                                <p className="mt-1 text-3xl font-black text-[#0f172a]">Rp 3.450.000</p>
                                            </div>
                                            <span className="rounded-xl bg-[#ffbc03] px-2.5 py-1 text-xs font-black text-[#0f172a] shadow-sm">
                                                +24%
                                            </span>
                                        </div>

                                        {/* Colorful Bars */}
                                        <div className="mt-6 flex h-20 items-end gap-2.5">
                                            {[40, 65, 45, 80, 60, 95, 85].map((height, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`w-full rounded-t-xl transition-all duration-300 ${
                                                        idx === 5
                                                            ? 'bg-[#fb0001]'
                                                            : idx % 3 === 0
                                                              ? 'bg-[#1777fb]'
                                                              : idx % 2 === 0
                                                                ? 'bg-[#ffbc03]'
                                                                : 'bg-[#f5c4d1]'
                                                    }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stock Widget */}
                                    <div className="mt-4 flex items-center justify-between rounded-2xl border-2 border-[#0f172a]/10 bg-[#fff8e5] p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="rounded-xl bg-[#ffbc03] p-2.5 text-[#0f172a]">
                                                <Package className="size-5" />
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold text-[#64748b]">Inventori Bahan</p>
                                                <p className="text-sm font-black text-[#0f172a]">128 item aman & cukup</p>
                                            </div>
                                        </div>
                                        <Check className="size-6 text-[#1777fb] stroke-[3]" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cute Badges */}
                            <div className="absolute top-[8%] -left-2 z-20 w-44 -rotate-6 rounded-2xl border-3 border-[#0f172a] bg-white p-3.5 shadow-xl transition hover:rotate-0 sm:-left-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="rounded-xl bg-[#fb0001] p-2 text-white">
                                        <TrendingUp className="size-4" />
                                    </span>
                                    <div>
                                        <p className="text-[11px] font-bold text-[#64748b]">Profit Bulan Ini</p>
                                        <p className="text-base font-black text-[#fb0001]">Rp 14.8 Juta</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-[8%] -right-2 z-20 w-44 rotate-6 rounded-2xl border-3 border-[#0f172a] bg-[#ffbc03] p-3.5 shadow-xl transition hover:rotate-0 sm:-right-6">
                                <div className="flex items-center gap-2.5">
                                    <span className="rounded-xl bg-white p-2 text-[#0f172a]">
                                        <Sparkles className="size-4 text-[#fb0001]" />
                                    </span>
                                    <div>
                                        <p className="text-[11px] font-extrabold text-[#0f172a]">Status Bisnis</p>
                                        <p className="text-base font-black text-[#0f172a]">Super Rapi!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid (Manfaat) */}
                    <section data-reveal id="manfaat" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                        <div className="mb-10 text-center">
                            <span className="rounded-full bg-[#eef5ff] border-2 border-[#1777fb] px-4 py-1.5 text-xs font-black uppercase text-[#1777fb]">
                                Mengapa Harus VVARSA?
                            </span>
                            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
                                Fitur Lengkap, Tampilan Manis & Mudah
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            {features.map(({ icon: Icon, title, text, color, badgeBg, borderColor, tag }) => (
                                <div
                                    key={title}
                                    className={`group relative flex flex-col justify-between rounded-3xl border-3 ${borderColor} bg-white p-7 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className={`flex size-14 items-center justify-center rounded-2xl ${color} shadow-lg transition group-hover:scale-110 group-hover:rotate-3`}>
                                                <Icon className="size-7 stroke-[2.5]" />
                                            </span>
                                            <span className={`rounded-full px-3 py-1 text-xs font-black ${badgeBg}`}>
                                                {tag}
                                            </span>
                                        </div>
                                        <h3 className="mt-6 text-xl font-black text-[#0f172a]">{title}</h3>
                                        <p className="mt-2 text-base leading-relaxed font-semibold text-[#64748b]">{text}</p>
                                    </div>

                                    <div className="mt-6 flex items-center gap-1 text-sm font-black text-[#1777fb]">
                                        <span>Pelajari lebih lanjut</span>
                                        <ArrowRight className="size-4 transition group-hover:translate-x-1 stroke-[3]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* How It Works (Cara Kerja) */}
                    <section data-reveal id="cara-kerja" className="bg-[#fff8e5] border-y-3 border-[#0f172a]/10 px-6 py-20 lg:px-10 lg:py-28">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
                                <div>
                                    <span className="rounded-full bg-[#fb0001] px-4 py-1.5 text-xs font-black uppercase text-white shadow-sm">
                                        Proses Cepat & Ringkas
                                    </span>
                                    <h2 className="mt-4 max-w-2xl text-4xl leading-tight font-black tracking-tight text-[#0f172a] sm:text-5xl">
                                        3 Langkah Mudah <br />
                                        <span className="inline-block rounded-xl bg-white px-3 py-0.5 text-[#1777fb] border-2 border-[#1777fb] mt-1">
                                            Bikin Bisnis Lancar Jaya.
                                        </span>
                                    </h2>
                                </div>
                                <p className="max-w-xs text-base font-bold text-[#64748b]">
                                    Dirancang simpel agar kamu dan tim bisa langsung pakai tanpa perlu pelatihan rumit.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 md:grid-cols-3">
                                {[
                                    { step: '01', title: 'Catat Stok & Produk', desc: 'Masukkan daftar bahan baku dan barang dengan beberapa klik saja.', color: 'bg-[#1777fb]', textColor: 'text-[#1777fb]' },
                                    { step: '02', title: 'Jalankan Kasir POS', desc: 'Catat pesanan pelanggan dengan cepat, stok terpotong otomatis.', color: 'bg-[#fb0001]', textColor: 'text-[#fb0001]' },
                                    { step: '03', title: 'Pantau Laporan Keuangan', desc: 'Lihat profit harian & bulanan langsung dalam tampilan grafik yang jernih.', color: 'bg-[#ffbc03]', textColor: 'text-[#0f172a]' },
                                ].map((item) => (
                                    <div
                                        key={item.step}
                                        className="group relative rounded-3xl border-3 border-[#0f172a] bg-white p-7 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                    >
                                        <span className={`inline-block rounded-2xl ${item.color} px-4 py-2 text-xl font-black text-white shadow-md`}>
                                            Langkah {item.step}
                                        </span>
                                        <h3 className="mt-8 text-2xl font-black text-[#0f172a]">{item.title}</h3>
                                        <p className="mt-3 text-base font-semibold leading-relaxed text-[#64748b]">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Ecosystem Section with 4 FULL Rows of Moving Arch Gallery Background */}
                    <section data-reveal id="produk" className="relative overflow-hidden bg-[#fffdf8] border-y-4 border-[#0f172a] px-6 py-24 lg:px-10 lg:py-32">
                        {/* 4 FULL Rows Moving Alternating (Left, Right, Left, Right) */}
                        <div className="absolute inset-0 z-0 flex flex-col justify-between overflow-hidden pointer-events-none opacity-90 py-2">
                            {/* Row 1: Moving LEFT */}
                            <div className="animate-marquee-left flex items-center gap-4">
                                {[...cuteStickerArchGallery, ...cuteStickerArchGallery, ...cuteStickerArchGallery].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-[160px] sm:h-[185px] w-36 sm:w-44 shrink-0 rounded-t-[3rem] sm:rounded-t-[4rem] border-3 ${item.border} ${item.bg} bg-cover bg-no-repeat shadow-md`}
                                        style={{ backgroundImage: `url(/images/cute_umkm_stickers.jpg)`, backgroundPosition: item.pos, backgroundSize: '240% 240%' }}
                                    />
                                ))}
                            </div>

                            {/* Row 2: Moving RIGHT */}
                            <div className="animate-marquee-right flex items-center gap-4">
                                {[...cuteStickerArchGallery, ...cuteStickerArchGallery, ...cuteStickerArchGallery].reverse().map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-[160px] sm:h-[185px] w-36 sm:w-44 shrink-0 rounded-t-[3rem] sm:rounded-t-[4rem] border-3 ${item.border} ${item.bg} bg-cover bg-no-repeat shadow-md`}
                                        style={{ backgroundImage: `url(/images/cute_umkm_stickers.jpg)`, backgroundPosition: item.pos, backgroundSize: '240% 240%' }}
                                    />
                                ))}
                            </div>

                            {/* Row 3: Moving LEFT */}
                            <div className="animate-marquee-left flex items-center gap-4">
                                {[...cuteStickerArchGallery, ...cuteStickerArchGallery, ...cuteStickerArchGallery].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-[160px] sm:h-[185px] w-36 sm:w-44 shrink-0 rounded-t-[3rem] sm:rounded-t-[4rem] border-3 ${item.border} ${item.bg} bg-cover bg-no-repeat shadow-md`}
                                        style={{ backgroundImage: `url(/images/cute_umkm_stickers.jpg)`, backgroundPosition: item.pos, backgroundSize: '240% 240%' }}
                                    />
                                ))}
                            </div>

                            {/* Row 4: Moving RIGHT */}
                            <div className="animate-marquee-right flex items-center gap-4">
                                {[...cuteStickerArchGallery, ...cuteStickerArchGallery, ...cuteStickerArchGallery].reverse().map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-[160px] sm:h-[185px] w-36 sm:w-44 shrink-0 rounded-t-[3rem] sm:rounded-t-[4rem] border-3 ${item.border} ${item.bg} bg-cover bg-no-repeat shadow-md`}
                                        style={{ backgroundImage: `url(/images/cute_umkm_stickers.jpg)`, backgroundPosition: item.pos, backgroundSize: '240% 240%' }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Crisp Overlay */}
                        <div className="absolute inset-0 z-0 bg-white/75 backdrop-blur-[1px] pointer-events-none" />

                        <div className="relative z-10 mx-auto max-w-7xl">
                            <div className="mx-auto max-w-3xl text-center">
                                <span className="rounded-full bg-[#fb0001] px-4 py-1.5 text-xs font-black uppercase text-white shadow-md">
                                    Semua Terhubung Dalam 1 Aplikasi
                                </span>
                                <h2 className="mt-5 text-4xl leading-tight font-black tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                                    Satu Ekosistem Usaha Lengkap
                                </h2>
                                <p className="mt-4 text-base font-extrabold text-[#475569] sm:text-lg">
                                    Semua fitur operasional penting terhubung otomatis tanpa spreadsheet terpisah. Pahami bisnismu dalam sekali pandang!
                                </p>
                            </div>

                            {/* Grid of 4 Crisp Feature Modules */}
                            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {/* Card 1: Inventori & Stok */}
                                <div className="group relative flex flex-col justify-between rounded-3xl border-3 border-[#1777fb] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(23,119,251,0.2)]">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#1777fb] text-white shadow-md">
                                                <Boxes className="size-6 stroke-[2.5]" />
                                            </span>
                                            <span className="rounded-full bg-[#eef5ff] border border-[#1777fb]/30 px-3 py-1 text-xs font-black text-[#1777fb]">
                                                Stok Bahan
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-[#0f172a]">Inventori Otomatis</h3>
                                        <p className="mt-2 text-sm font-semibold text-[#64748b]">
                                            Stok terpotong otomatis tiap kali ada transaksi kasir. Peringatan bahan habis siap secara real-time.
                                        </p>

                                        {/* Functional Preview Box */}
                                        <div className="mt-6 rounded-2xl border-2 border-[#1777fb]/20 bg-[#eef5ff] p-3.5 space-y-2.5">
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Biji Kopi Arabika</span>
                                                <span className="rounded-md bg-[#1777fb] px-2 py-0.5 text-white font-extrabold">12.5 kg</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Susu UHT Fresh</span>
                                                <span className="rounded-md bg-[#fb0001] px-2 py-0.5 text-white font-extrabold">3 Botol (Kritis)</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Sirup Vanila</span>
                                                <span className="rounded-md bg-[#ffbc03] px-2 py-0.5 text-[#0f172a] font-extrabold">8 Botol</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#1777fb]">
                                        <Check className="size-4 stroke-[3]" /> <span>Bebas Selisih Stok</span>
                                    </div>
                                </div>

                                {/* Card 2: Kasir POS & Transaksi */}
                                <div className="group relative flex flex-col justify-between rounded-3xl border-3 border-[#fb0001] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(251,0,1,0.2)]">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#fb0001] text-white shadow-md">
                                                <TrendingUp className="size-6 stroke-[2.5]" />
                                            </span>
                                            <span className="rounded-full bg-[#fdf0f4] border border-[#fb0001]/30 px-3 py-1 text-xs font-black text-[#fb0001]">
                                                Penjualan POS
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-[#0f172a]">Kasir Super Cepat</h3>
                                        <p className="mt-2 text-sm font-semibold text-[#64748b]">
                                            Terima pembayaran tunai, QRIS, maupun e-wallet dengan cetak struk instant & pembagian meja.
                                        </p>

                                        {/* Functional Preview Box */}
                                        <div className="mt-6 rounded-2xl border-2 border-[#fb0001]/20 bg-[#fdf0f4] p-3.5 space-y-2.5">
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Omset Hari Ini</span>
                                                <span className="text-sm font-black text-[#fb0001]">Rp 2.840.000</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
                                                <span>Total Pesanan</span>
                                                <span className="font-extrabold text-[#0f172a]">48 Transaksi</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
                                                <span>Metode Favorit</span>
                                                <span className="font-extrabold text-[#1777fb]">QRIS (65%)</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#fb0001]">
                                        <Check className="size-4 stroke-[3]" /> <span>Proses Kasir Cepat</span>
                                    </div>
                                </div>

                                {/* Card 3: Laporan Keuangan & Kas */}
                                <div className="group relative flex flex-col justify-between rounded-3xl border-3 border-[#ffbc03] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,188,3,0.25)]">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#ffbc03] text-[#0f172a] shadow-md">
                                                <WalletCards className="size-6 stroke-[2.5]" />
                                            </span>
                                            <span className="rounded-full bg-[#fff8e5] border border-[#ffbc03]/40 px-3 py-1 text-xs font-black text-[#b88600]">
                                                Arus Kas
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-[#0f172a]">Laporan Keuangan</h3>
                                        <p className="mt-2 text-sm font-semibold text-[#64748b]">
                                            Catat pengeluaran operasional, HPP, laba kotor, dan laba bersih tanpa pusing rumus akuntansi.
                                        </p>

                                        {/* Functional Preview Box */}
                                        <div className="mt-6 rounded-2xl border-2 border-[#ffbc03]/30 bg-[#fff8e5] p-3.5 space-y-2.5">
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Laba Bersih Bulan Ini</span>
                                                <span className="text-sm font-black text-[#0f172a]">Rp 8.400.000</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
                                                <span>Margin Keuntungan</span>
                                                <span className="font-extrabold text-[#1777fb]">32.4%</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#64748b]">
                                                <span>Biaya Operasional</span>
                                                <span className="font-extrabold text-[#fb0001]">Rp 1.200.000</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#b88600]">
                                        <Check className="size-4 stroke-[3]" /> <span>Download Laporan PDF</span>
                                    </div>
                                </div>

                                {/* Card 4: Manajemen Tim & Akses */}
                                <div className="group relative flex flex-col justify-between rounded-3xl border-3 border-[#0f172a] bg-white/95 backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white shadow-md">
                                                <UsersRound className="size-6 stroke-[2.5]" />
                                            </span>
                                            <span className="rounded-full bg-[#f1f5f9] border border-[#0f172a]/20 px-3 py-1 text-xs font-black text-[#0f172a]">
                                                Multi-User
                                            </span>
                                        </div>
                                        <h3 className="mt-5 text-xl font-black text-[#0f172a]">Hak Akses Tim</h3>
                                        <p className="mt-2 text-sm font-semibold text-[#64748b]">
                                            Atur peran kasir, koki, manajer, dan owner dengan batasan akses aman sesuai tugasnya.
                                        </p>

                                        {/* Functional Preview Box */}
                                        <div className="mt-6 rounded-2xl border-2 border-[#0f172a]/10 bg-[#f8fafc] p-3.5 space-y-2.5">
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Staff Kasir (Rina)</span>
                                                <span className="rounded-md bg-[#1777fb] px-2 py-0.5 text-white font-extrabold">Shift Pagi</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Koki Dapur (Budi)</span>
                                                <span className="rounded-md bg-[#ffbc03] px-2 py-0.5 text-[#0f172a] font-extrabold">Dapur</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-bold text-[#0f172a]">
                                                <span>Owner / Pemilik</span>
                                                <span className="rounded-md bg-[#0f172a] px-2 py-0.5 text-white font-extrabold">Full Akses</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#0f172a]">
                                        <Check className="size-4 stroke-[3]" /> <span>Aman Dari Kecurangan</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Plans (Paket) */}
                    <section data-reveal id="paket" className="bg-[#f1f5f9] border-t-3 border-[#0f172a]/10 px-6 py-20 lg:px-10 lg:py-28">
                        <div className="mx-auto max-w-7xl">
                            <div className="mx-auto max-w-2xl text-center">
                                <span className="rounded-full bg-[#1777fb] px-4 py-1.5 text-xs font-black uppercase text-white shadow-sm">
                                    Pilih Paket Sesuai Kebutuhan
                                </span>
                                <h2 className="mt-4 text-4xl leading-tight font-black tracking-tight text-[#0f172a] sm:text-5xl">
                                    Harga Spesial & Transparan
                                </h2>
                                <p className="mt-3 text-base font-semibold text-[#64748b]">
                                    Tanpa biaya tersembunyi. Mulai gratis dan upgrade kapan saja ketika usahamu bertambah besar.
                                </p>
                            </div>

                            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                                {plans.map(({ name: planName, price, note, icon: Icon, accentColor, headerBg, border, btnBg, featured, features: planFeatures }) => (
                                    <div
                                        key={planName}
                                        className={`relative flex flex-col justify-between rounded-[2.5rem] bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${border}`}
                                    >
                                        {featured && (
                                            <span className="absolute -top-4 left-8 inline-flex items-center gap-1.5 rounded-full bg-[#fb0001] px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                                                <Crown className="size-3.5 fill-white text-white" />
                                                Paling Laris & Populer
                                            </span>
                                        )}

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <span className={`flex size-12 items-center justify-center rounded-2xl ${headerBg} ${accentColor}`}>
                                                    <Icon className="size-6 stroke-[2.5]" />
                                                </span>
                                                <span className="text-xs font-extrabold text-[#64748b]">/ bulan</span>
                                            </div>

                                            <h3 className="mt-6 text-2xl font-black text-[#0f172a]">{planName}</h3>
                                            <p className="mt-1 min-h-10 text-sm font-semibold text-[#64748b]">{note}</p>

                                            <div className="mt-6 flex items-baseline gap-1">
                                                <span className="text-4xl font-black tracking-tight text-[#0f172a]">{price}</span>
                                                <span className="text-sm font-bold text-[#64748b]">{price === 'Gratis' ? 'selamanya' : '/ bln'}</span>
                                            </div>

                                            <div className="my-6 h-0.5 bg-[#0f172a]/10" />

                                            <ul className="flex flex-col gap-3">
                                                {planFeatures.map((feat) => (
                                                    <li key={feat} className="flex items-center gap-3 text-sm font-bold text-[#0f172a]">
                                                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1777fb] text-white">
                                                            <Check className="size-3.5 stroke-[3]" />
                                                        </span>
                                                        {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <Link
                                            href={auth.user ? route('dashboard') : route('register')}
                                            className={`mt-8 inline-flex items-center justify-center rounded-2xl py-3.5 text-base font-black shadow-md transition ${btnBg}`}
                                        >
                                            Pilih Paket {planName} <ArrowRight className="ml-2 size-4 stroke-[3]" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Bottom CTA Banner */}
                    <section data-reveal id="cerita" className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
                        <div className="relative overflow-hidden rounded-[3rem] border-4 border-[#0f172a] bg-[#1777fb] px-8 py-14 text-white shadow-2xl lg:px-16 lg:py-20">
                            {/* Decorative Crisp Shapes */}
                            <div className="absolute -top-10 -right-10 size-48 rounded-full border-4 border-[#ffbc03] bg-[#ffbc03]" />
                            <div className="absolute -bottom-10 -left-10 size-40 rounded-full border-4 border-[#f5c4d1] bg-[#f5c4d1]" />

                            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                                <div>
                                    <span className="rounded-full bg-[#ffbc03] px-4 py-1.5 text-xs font-black uppercase text-[#0f172a]">
                                        Mulai Hari Ini Juga
                                    </span>
                                    <h2 className="mt-4 text-4xl leading-tight font-black text-white sm:text-5xl">
                                        Siap Bikin Bisnismu <br />
                                        Makin Rapi & Bertumbuh?
                                    </h2>
                                    <p className="mt-4 max-w-md text-lg font-semibold text-white/90">
                                        Bergabung dengan ribuan pemilik usaha yang sudah menikmati kemudahan kelola stok & laporan bersama VVARSA.
                                    </p>
                                </div>

                                <div className="flex flex-col items-start gap-4 lg:items-end">
                                    <div className="grid grid-cols-3 gap-6 w-full text-center mb-4">
                                        {stats.map((st) => (
                                            <div key={st.label} className="rounded-2xl border-2 border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                                <p className={`text-2xl font-black ${st.color} sm:text-3xl`}>{st.value}</p>
                                                <p className="text-xs font-bold text-white/80 mt-1">{st.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="group inline-flex items-center rounded-2xl bg-[#ffbc03] px-8 py-4 text-lg font-black text-[#0f172a] shadow-xl transition duration-300 hover:scale-105 hover:bg-white"
                                    >
                                        Daftar Gratis Sekarang <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1 stroke-[3]" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t-2 border-[#0f172a]/10 bg-white py-8 text-center text-sm font-bold text-[#64748b]">
                    <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-xl bg-[#1777fb] text-white font-black text-xs">V</span>
                            <span className="text-base font-black text-[#0f172a]">VVARSA App</span>
                        </div>
                        <p>© {new Date().getFullYear()} VVARSA. Solusi bisnis seger, colorful & rapi.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
