import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Bell,
    Boxes,
    Check,
    ChefHat,
    ChevronRight,
    CircleDollarSign,
    Crown,
    Menu,
    Package,
    Play,
    Sparkles,
    Star,
    TrendingUp,
    UsersRound,
    WalletCards,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { type SharedData } from '@/types';

const features = [
    {
        number: '01',
        icon: Package,
        title: 'Inventori otomatis',
        description:
            'Pantau stok bahan dan produk secara real-time. Setiap transaksi otomatis memperbarui jumlah stok.',
        color: '#5E4BF2',
        bg: '#F1EFFD',
        type: 'bars',
        metric: '128',
        metricLabel: 'Total inventori',
        trend: '+24.8%',
        trendLabel: 'Growth',
        secondary: 'Aman',
        secondaryColor: '#D8F380',
        tone: 'purple',
        bars: [30, 40, 35, 60, 46, 70, 58, 78, 64, 88],
    },
    {
        number: '02',
        icon: BarChart3,
        title: 'Laporan lebih jelas',
        description:
            'Lihat omzet, pengeluaran, laba, dan performa bisnis dalam dashboard yang mudah dipahami.',
        color: '#FF8C67',
        bg: '#FFF1EC',
        type: 'line',
        metric: 'Rp 3,45jt',
        metricLabel: 'Total penjualan',
        trend: '+18.2%',
        trendLabel: 'Profit',
        secondary: '48 transaksi',
        secondaryColor: '#FF8C67',
        tone: 'orange',
        sparkline: [18, 28, 20, 42, 31, 58, 48, 72, 61, 88],
    },
    {
        number: '03',
        icon: UsersRound,
        title: 'Tim lebih teratur',
        description:
            'Atur akses owner, kasir, koki, dan staff sesuai peran masing-masing.',
        color: '#1777FB',
        bg: '#EEF5FF',
        type: 'ring',
        metric: '12',
        metricLabel: 'Total staff',
        trend: '+92%',
        trendLabel: 'Aktivitas',
        secondary: '7 role aktif',
        secondaryColor: '#79D7FF',
        tone: 'blue',
        ring: 82,
    },
] as const;

const testimonials = [
    {
        name: 'Rina Pratiwi',
        role: 'Owner Kedai Kopi',
        text: 'Dulu setiap malam saya rekap penjualan manual. Sekarang tinggal buka VVARSA dan semuanya langsung kelihatan.',
        avatar: 'RP',
        accent: '#D8F380',
        rating: 5,
    },
    {
        name: 'Budi Santoso',
        role: 'Owner Cafe & Resto',
        text: 'Yang paling membantu itu stok otomatisnya. Jadi saya nggak perlu bolak-balik cek spreadsheet lagi.',
        avatar: 'BS',
        accent: '#BDB5FF',
        rating: 5,
    },
    {
        name: 'Alya Ramadhani',
        role: 'UMKM Kuliner',
        text: 'Tampilannya gampang dipahami dan laporan bisnis jadi jauh lebih rapi. Cocok banget buat usaha yang lagi berkembang.',
        avatar: 'AR',
        accent: '#FFD9B8',
        rating: 5,
    },
] as const;

const plans = [
    {
        name: 'Free',
        price: 'Gratis',
        description: 'Untuk mulai merapikan bisnis',
        icon: Package,
        features: ['Kelola inventori', 'Laporan keuangan harian', 'Akses komunitas'],
        button: 'Mulai Gratis',
        color: '#5E4BF2',
        bg: '#F1EFFD',
        featured: false,
    },
    {
        name: 'Pro',
        price: 'Rp149.000',
        description: 'Untuk bisnis yang sedang tumbuh',
        icon: Sparkles,
        features: ['Semua fitur Free', 'Export laporan & PDF', 'Multi-user hingga 5 orang', 'Fitur POS kasir cepat'],
        button: 'Pilih Pro',
        color: '#1E2A0A',
        bg: '#D8F380',
        featured: true,
    },
    {
        name: 'Enterprise',
        price: 'Rp499.000',
        description: 'Untuk tim dan operasional besar',
        icon: Crown,
        features: ['Semua fitur Pro', 'Akses API khusus', 'Dukungan prioritas 24/7', 'Kustomisasi laporan'],
        button: 'Pilih Enterprise',
        color: '#FFFFFF',
        bg: '#FF8C67',
        featured: false,
    },
] as const;

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [featureAutoRotate, setFeatureAutoRotate] = useState(true);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12 },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)');
        const syncMotionMode = () => setFeatureAutoRotate(!mediaQuery.matches);

        syncMotionMode();
        mediaQuery.addEventListener('change', syncMotionMode);
        return () => mediaQuery.removeEventListener('change', syncMotionMode);
    }, []);

    useEffect(() => {
        if (!featureAutoRotate) return;

        const interval = window.setInterval(() => {
            setActiveFeature((current) => (current + 1) % features.length);
        }, 5200);

        return () => window.clearInterval(interval);
    }, [featureAutoRotate]);

    const currentFeature = features[activeFeature] ?? features[0];
    const goToDashboard = auth.user ? route('dashboard') : route('register');

    return (
        <>
            <Head title="VVARSA — Kelola Bisnis Jadi Seru & Rapi">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#FDFBFF_0%,#F5F2EE_28%,#F0EEE9_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#D8F380] selection:text-[#17182A]">
                <style>{`
                    @keyframes driftSlow {
                        0% { transform: translate3d(0,0,0) scale(1); }
                        50% { transform: translate3d(2.5%, -2%, 0) scale(1.08); }
                        100% { transform: translate3d(-2%, 2.5%, 0) scale(1.02); }
                    }
                    @keyframes gridShift {
                        0% { background-position: 0 0, 0 0; }
                        100% { background-position: 40px 40px, 40px 40px; }
                    }
                    .bg-drift { animation: driftSlow 18s ease-in-out infinite alternate; }
                    .bg-grid { animation: gridShift 24s linear infinite; }
                    .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
                    .reveal-visible { opacity: 1; transform: translateY(0); }
                `}</style>

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-drift absolute -left-16 top-20 h-[26rem] w-[26rem] rounded-full bg-[#C9C2FF]/35 blur-3xl" />
                    <div className="bg-drift absolute -right-12 top-32 h-[28rem] w-[28rem] rounded-full bg-[#D8F380]/25 blur-3xl [animation-delay:2s]" />
                    <div className="bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#F5D9C7]/30 blur-3xl [animation-delay:4s]" />
                    <div className="bg-grid absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(rgba(94,75,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,75,242,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative z-10">
                    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#E7E3FA] bg-white/85 backdrop-blur-xl">
                        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
                            <Link href={route('home')} className="group flex items-center gap-3">
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#5E4BF2] text-white shadow-lg shadow-[#5E4BF2]/25 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                    <ChefHat className="size-6" strokeWidth={2.5} />
                                </span>
                                <div>
                                    <div className="text-xl font-black tracking-tight">VVAR<span className="text-[#5E4BF2]">SA</span></div>
                                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9693AA]">Business Suite</div>
                                </div>
                            </Link>

                            <nav className="hidden items-center gap-1 md:flex">
                                {[['Manfaat', '#manfaat'], ['Fitur', '#produk'], ['Cara Kerja', '#cara-kerja'], ['Paket', '#paket'], ['Cerita', '#cerita']].map(([label, href]) => (
                                    <a key={label} href={href} className="rounded-full px-4 py-2 text-sm font-bold text-[#53556A] transition hover:bg-[#F1EFFD] hover:text-[#5E4BF2]">{label}</a>
                                ))}
                            </nav>

                            <div className="hidden items-center gap-3 md:flex">
                                {auth.user ? (
                                    <Link href={route('dashboard')} className="rounded-full border-2 border-[#5E4BF2] px-5 py-2.5 text-sm font-black text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white">Dashboard</Link>
                                ) : (
                                    <>
                                        <Link href={route('login')} className="px-4 py-2.5 text-sm font-black text-[#35364A] transition hover:text-[#5E4BF2]">Masuk</Link>
                                        <Link href={route('register')} className="group rounded-full bg-[#5E4BF2] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#5E4BF2]/25 transition hover:-translate-y-0.5 hover:bg-[#4938D9]">
                                            Mulai Gratis
                                            <ArrowRight className="ml-1 inline size-4 transition group-hover:translate-x-1" />
                                        </Link>
                                    </>
                                )}
                            </div>

                            <button type="button" onClick={() => setMenuOpen((v) => !v)} className="rounded-2xl bg-[#F1EFFD] p-2.5 md:hidden" aria-label="Toggle menu">
                                {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                            </button>
                        </div>
                    </header>

                    {menuOpen && (
                        <div className="sticky top-[76px] z-40 mx-4 mt-2 rounded-3xl border border-[#E7E3FA] bg-white p-4 shadow-2xl md:hidden">
                            {[['Manfaat', '#manfaat'], ['Fitur', '#produk'], ['Cara Kerja', '#cara-kerja'], ['Paket', '#paket'], ['Cerita', '#cerita']].map(([label, href]) => (
                                <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block rounded-2xl px-4 py-3 font-bold hover:bg-[#F1EFFD]">{label}</a>
                            ))}
                            <Link href={auth.user ? route('dashboard') : route('login')} className="mt-2 block rounded-2xl bg-[#5E4BF2] px-4 py-3 text-center font-black text-white">{auth.user ? 'Dashboard' : 'Masuk'}</Link>
                        </div>
                    )}

                    <main>
                        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(94,75,242,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(216,243,128,0.22),transparent_20%),linear-gradient(180deg,#F9F7F4_0%,#F3F0EC_100%)] px-5 pb-28 pt-16 sm:px-6 lg:px-10 lg:pb-36 lg:pt-40">
                            <div className="absolute left-[-120px] top-[120px] size-[340px] rounded-full bg-[#D8F380]/70 blur-[110px]" />
                            <div className="absolute right-[-100px] top-[-100px] size-[420px] rounded-full bg-[#BDB5FF]/70 blur-[110px]" />
                            <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5E4BF2]/15 blur-[120px]" />
                            <div className="absolute bottom-[4%] left-[10%] h-[240px] w-[240px] rounded-full bg-[#FF8C67]/15 blur-[90px]" />
                            <div className="absolute inset-0 opacity-[0.4] hero-grid" />

                            <div className="relative mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-[0.92fr_1.08fr]">
                                <div data-reveal className="reveal-hidden relative z-10">
                                    <h1 className="max-w-3xl text-[2.8rem] font-black leading-[0.82] tracking-[-0.07em] sm:text-5xl lg:text-[5rem]">
                                        Usaha lebih
                                        <br />
                                        <span className="relative inline-block text-[#5E4BF2]">
                                            <span className="relative z-10">tertata</span>
                                            <span className="absolute -bottom-2 left-0 right-0 -z-0 h-5 rounded-[0.75rem] bg-[#D8F380] opacity-90 sm:h-8" />
                                        </span>{' '}
                                        <span className="text-[#17182A]">dan</span>
                                        <br />
                                        <span className="text-[#17182A]">lebih siap tumbuh.</span>
                                    </h1>

                                    <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-[#66677A] sm:text-lg">
                                        VVARSA menyatukan stok, kasir, penjualan, dan laporan dalam satu sistem yang elegan, efisien, dan siap berkembang.
                                        <span className="text-[#5E4BF2]"> Dengan operasional yang lebih tertata, Anda dapat fokus pada pelayanan, penjualan, dan pertumbuhan bisnis dengan lebih tenang.</span>
                                    </p>

                                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                        <Link href={goToDashboard} className="group inline-flex items-center justify-center rounded-2xl bg-[#5E4BF2] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(94,75,242,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-[#4938D9] sm:text-base">
                                            Coba Gratis 14 Hari
                                            <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1" />
                                        </Link>
                                        <a href="#cara-kerja" className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E6E2F4] bg-white px-6 py-4 text-sm font-black text-[#343548] transition hover:-translate-y-1 hover:border-[#5E4BF2] hover:text-[#5E4BF2] sm:text-base">
                                            <span className="flex size-7 items-center justify-center rounded-full bg-[#D8F380]">
                                                <Play className="size-3.5 fill-current" />
                                            </span>
                                            Lihat Demo
                                        </a>
                                    </div>

                                    <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                                        <div className="rounded-full border border-[#EAE5F8] bg-white px-4 py-2 shadow-sm">
                                            <div className="flex items-center gap-1">
                                                {[1,2,3,4,5].map((item) => <Star key={item} className="size-4 fill-[#FFB800] text-[#FFB800]" />)}
                                            </div>
                                            <p className="mt-1 text-xs font-black text-[#5E4BF2]">4.9/5 dari pengguna</p>
                                        </div>
                                        <div className="rounded-full border border-[#EAE5F8] bg-white px-4 py-2 shadow-sm">
                                            <p className="text-xl font-black text-[#17182A]">1,200+</p>
                                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8A8999]">Bisnis aktif</p>
                                        </div>
                                        <div className="flex -space-x-2">
                                            {['R', 'A', 'B', 'D'].map((item, index) => (
                                                <span key={item} className={`flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-black ${index === 0 ? 'bg-[#D8F380]' : index === 1 ? 'bg-[#BDB5FF]' : index === 2 ? 'bg-[#FF8C67]' : 'bg-[#79D7FF]'}`}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div data-reveal className="reveal-hidden relative min-h-[520px] sm:min-h-[590px]">
                                    <div className="absolute left-[8%] top-[5%] size-24 rotate-12 rounded-[2rem] bg-[#D8F380] opacity-80 blur-[1px]" />
                                    <div className="absolute right-[2%] top-[20%] size-20 rounded-full bg-[#FF8C67] opacity-70" />
                                    <div className="absolute bottom-[8%] left-[3%] size-16 rounded-full bg-[#79D7FF] opacity-80" />
                                    <div className="absolute right-[4%] top-[5%] h-[88%] w-[88%] rotate-[5deg] rounded-[3rem] border-2 border-[#D8F380] bg-[#D8F380]/80 shadow-[0_25px_60px_rgba(122,145,28,0.25)]" />
                                    <div className="absolute left-[2%] top-[10%] h-[87%] w-[87%] rotate-[-5deg] rounded-[3rem] border-2 border-[#BDB5FF] bg-[#DCD8FF]/80 shadow-[0_20px_55px_rgba(94,75,242,0.18)]" />

                                    <div className="absolute inset-x-[2%] top-0 z-10 mx-auto max-w-[500px]">
                                        <div className="overflow-hidden rounded-[2.75rem] border-[5px] border-white bg-white shadow-[0_40px_90px_rgba(55,43,130,0.22)]">
                                            <div className="flex items-center justify-between border-b border-[#ECEAF5] px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-10 items-center justify-center rounded-xl bg-[#5E4BF2] text-white">
                                                        <ChefHat className="size-5" />
                                                    </span>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[#9998AA]">Selamat datang,</p>
                                                        <p className="text-sm font-black">VVARSA Dashboard</p>
                                                    </div>
                                                </div>
                                                <span className="relative flex size-9 items-center justify-center rounded-xl bg-[#F4F2FC]">
                                                    <Bell className="size-4" />
                                                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[#FF5252] ring-2 ring-white" />
                                                </span>
                                            </div>
                                            <div className="bg-[#FAF9FE] p-5">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-bold text-[#9998AA]">Omzet Hari Ini</span>
                                                            <span className="rounded-lg bg-[#EAF8DC] p-1.5 text-[#3E6A19]"><TrendingUp className="size-3.5" /></span>
                                                        </div>
                                                        <p className="mt-2 text-xl font-black">Rp3,45jt</p>
                                                        <p className="mt-1 text-[10px] font-bold text-[#45A62E]">+24.8% dari kemarin</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-[#5E4BF2] p-4 text-white shadow-lg shadow-[#5E4BF2]/20">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-bold text-white/70">Profit</span>
                                                            <CircleDollarSign className="size-4 text-[#D8F380]" />
                                                        </div>
                                                        <p className="mt-2 text-xl font-black">Rp1,28jt</p>
                                                        <p className="mt-1 text-[10px] font-bold text-[#D8F380]">+18.2% bulan ini</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 rounded-[1.75rem] border border-[#F0ECFF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF9FF_100%)] p-4 shadow-sm">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#9998AA]">Performa Penjualan</p>
                                                            <p className="mt-1 text-sm font-black">Minggu ini</p>
                                                        </div>
                                                        <span className="rounded-lg bg-[#F1EFFD] px-2 py-1 text-[9px] font-black text-[#5E4BF2]">7 Hari</span>
                                                    </div>
                                                    <div className="relative mt-5 h-28 overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#F7F5FF_0%,#FFFFFF_100%)] p-2">
                                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(94,75,242,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(94,75,242,0.04)_1px,transparent_1px)] bg-[size:18px_18px]" />
                                                        <svg viewBox="0 0 300 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                                                            <defs>
                                                                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                                                                    <stop offset="0%" stopColor="#5E4BF2" stopOpacity={0.22} />
                                                                    <stop offset="100%" stopColor="#5E4BF2" stopOpacity={0.03} />
                                                                </linearGradient>
                                                            </defs>
                                                            <path d="M0,72 L18,66 L36,68 L54,48 L72,56 L90,30 L108,36 L126,20 L144,29 L162,16 L180,12 L198,16 L216,14 L240,10 L240,100 L0,100 Z" fill="url(#chartFill)" />
                                                            <path d="M0,72 L18,66 L36,68 L54,48 L72,56 L90,30 L108,36 L126,20 L144,29 L162,16 L180,12 L198,16 L216,14 L240,10" fill="none" stroke="#5E4BF2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="manfaat" className="px-6 py-24 lg:px-10 lg:py-28">
                            <div className="mx-auto max-w-7xl">
                                <div data-reveal className="reveal-hidden mx-auto max-w-2xl text-center">
                                    <span className="rounded-full bg-[#EAF4FF] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#1777FB]">Manfaat</span>
                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.05em] sm:text-5xl">Semua yang dibutuhkan bisnis modern<span className="text-[#5E4BF2]"> dalam satu tempat.</span></h2>
                                </div>
                                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                                    {[['Inventori', 'Pantau stok bahan dan produk secara real time.', 'Package', '#5E4BF2'], ['Laporan', 'Lihat omzet, biaya, dan profit tanpa repot.', 'BarChart3', '#FF8C67'], ['Tim', 'Kelola peran staff dan akses lebih rapi.', 'UsersRound', '#1777FB'], ['Kasir', 'Transaksi lebih cepat dan lebih aman.', 'WalletCards', '#D8F380']].map(([title, text, iconName, color]) => {
                                        const IconMap = { Package, BarChart3, UsersRound, WalletCards };
                                        const Icon = IconMap[iconName as keyof typeof IconMap];
                                        return (
                                            <div key={title} data-reveal className="reveal-hidden rounded-[2rem] border border-[#ECEAF6] bg-white p-6 shadow-[0_20px_50px_rgba(25,32,52,0.04)]">
                                                <span className="flex size-12 items-center justify-center rounded-2xl shadow-sm" style={{ backgroundColor: `${color}1A`, color }}>
                                                    <Icon className="size-5" />
                                                </span>
                                                <h3 className="mt-5 text-xl font-black text-[#17182A]">{title}</h3>
                                                <p className="mt-3 text-sm font-medium leading-relaxed text-[#66677A]">{text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section id="produk" className="bg-[linear-gradient(180deg,#F8F6F2_0%,#F1F0FF_100%)] px-6 py-24 lg:px-10 lg:py-28">
                            <div className="mx-auto max-w-7xl">
                                <div data-reveal className="reveal-hidden mx-auto max-w-2xl text-center">
                                    <span className="rounded-full bg-[#F1EFFD] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#5E4BF2]">Fitur unggulan</span>
                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.05em] sm:text-5xl">Dashboard yang fokus pada keputusan nyata.</h2>
                                </div>

                                <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                                    <div className="space-y-3">
                                        {features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            const isActive = index === activeFeature;

                                            return (
                                                <button key={feature.title} type="button" onMouseEnter={() => setActiveFeature(index)} onFocus={() => setActiveFeature(index)} onClick={() => setActiveFeature(index)} className={`w-full rounded-[1.75rem] border p-5 text-left transition-all duration-300 ${isActive ? 'border-[#5E4BF2] bg-white shadow-[0_30px_60px_rgba(94,75,242,0.08)]' : 'border-transparent bg-[#F9F8FF] hover:border-[#E8E1FA]'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex size-11 items-center justify-center rounded-2xl" style={{ backgroundColor: feature.bg, color: feature.color }}>
                                                            <Icon className="size-5" />
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9AA0B3]">{feature.number}</p>
                                                            <h3 className="mt-1 text-lg font-black text-[#17182A]">{feature.title}</h3>
                                                        </div>
                                                        <ChevronRight className={`size-5 transition ${isActive ? 'text-[#5E4BF2]' : 'text-[#B7B4C6]'}`} />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="rounded-[2.25rem] border border-[#EEEAF7] bg-white p-5 shadow-[0_30px_70px_rgba(17,20,32,0.08)]">
                                        <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,#F8F5FF_0%,#F3F0FF_100%)] p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9AA0B3]">{currentFeature.metricLabel}</p>
                                                    <p className="mt-2 text-[2rem] font-black tracking-[-0.06em] text-[#17182A]">{currentFeature.metric}</p>
                                                </div>
                                                <span className="rounded-full px-2.5 py-1 text-[10px] font-black text-[#1E2A0A]" style={{ backgroundColor: currentFeature.secondaryColor }}>{currentFeature.trend}</span>
                                            </div>

                                            {currentFeature.type === 'bars' && (
                                                <div className="mt-5 grid grid-cols-10 items-end gap-2">
                                                    {currentFeature.bars.map((value, index) => (
                                                        <span key={index} className="rounded-t-xl bg-[#5E4BF2]" style={{ height: `${value * 1.8}px`, opacity: 0.18 + index / 18 }} />
                                                    ))}
                                                </div>
                                            )}

                                            {currentFeature.type === 'line' && (
                                                <div className="mt-5 overflow-hidden rounded-[1.25rem] bg-white p-3">
                                                    <svg viewBox="0 0 280 110" className="h-28 w-full" preserveAspectRatio="none">
                                                        <path d="M0,80 L25,70 L50,76 L75,52 L100,60 L125,30 L150,35 L175,18 L200,24 L225,10 L250,16 L280,0" fill="none" stroke="#FF8C67" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M0,80 L25,70 L50,76 L75,52 L100,60 L125,30 L150,35 L175,18 L200,24 L225,10 L250,16 L280,0 L280,110 L0,110 Z" fill="rgba(255,140,103,0.09)" />
                                                    </svg>
                                                </div>
                                            )}

                                            {currentFeature.type === 'ring' && (
                                                <div className="mt-5 flex items-center justify-center rounded-[1.5rem] bg-white p-5">
                                                    <div className="relative flex size-28 items-center justify-center rounded-full border-[10px] border-[#E9E2FF]" style={{ background: `conic-gradient(#5E4BF2 0 ${currentFeature.ring}%, #E9E2FF ${currentFeature.ring}% 100%)` }}>
                                                        <div className="flex size-16 items-center justify-center rounded-full bg-white text-lg font-black text-[#17182A] shadow-inner">{currentFeature.ring}%</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="cara-kerja" className="px-6 py-24 lg:px-10 lg:py-28">
                            <div className="mx-auto max-w-7xl">
                                <div data-reveal className="reveal-hidden mx-auto max-w-2xl text-center">
                                    <span className="rounded-full bg-[#F0F7FF] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#1777FB]">Cara kerja</span>
                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.05em] sm:text-5xl">Lebih cepat, lebih jelas, lebih tenang.</h2>
                                </div>
                                <div className="mt-12 grid gap-6 md:grid-cols-3">
                                    {[['1. Masukkan data', 'Mulai dari supplier, produk, hingga stok awal agar semua masuk dalam satu sumber data.'], ['2. Otomatiskan proses', 'Semua transaksi dan pergerakan stok tersinkron otomatis tanpa input duplikat.'], ['3. Ambil keputusan', 'Laporan dan trend langsung membantu Anda melihat mana yang harus ditingkatkan.']].map(([title, text], index) => (
                                        <div key={title} data-reveal className="reveal-hidden rounded-[2rem] border border-[#ECEAF6] bg-white p-6 shadow-[0_18px_45px_rgba(29,25,56,0.04)]">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-[#D8F380] font-black text-[#17182A]">{index + 1}</div>
                                            <h3 className="mt-5 text-xl font-black text-[#17182A]">{title}</h3>
                                            <p className="mt-3 text-sm font-medium leading-relaxed text-[#66677A]">{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section id="cerita" className="bg-[radial-gradient(circle_at_top,rgba(94,75,242,0.08),transparent_30%),linear-gradient(180deg,#F9F8FF_0%,#F5F7F2_100%)] px-6 py-24 lg:px-10 lg:py-28">
                            <div className="mx-auto max-w-7xl">
                                <div data-reveal className="reveal-hidden mx-auto max-w-2xl text-center">
                                    <span className="rounded-full bg-[#F1EFFD] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#5E4BF2]">Cerita pelanggan</span>
                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.05em] sm:text-5xl">Mereka fokus pada bisnis, bukan repotnya administrasi.</h2>
                                </div>
                                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                                    {testimonials.map((item) => (
                                        <div key={item.name} data-reveal className="reveal-hidden rounded-[2rem] border border-[#EEEAF5] bg-white p-6 shadow-[0_22px_52px_rgba(18,19,30,0.05)]">
                                            <div className="flex gap-1 text-[#FFB800]">
                                                {[...Array(item.rating)].map((_, index) => <Star key={index} className="size-4 fill-current" />)}
                                            </div>
                                            <p className="mt-6 text-sm font-bold leading-relaxed text-[#555667]">“{item.text}”</p>
                                            <div className="mt-7 flex items-center gap-3 border-t border-[#EEEAF4] pt-5">
                                                <span className="flex size-11 items-center justify-center rounded-full text-xs font-black text-[#17182A]" style={{ backgroundColor: item.accent ?? '#D8F380' }}>{item.avatar}</span>
                                                <div>
                                                    <p className="text-xs font-black text-[#17182A]">{item.name}</p>
                                                    <p className="text-[10px] font-semibold text-[#9998A8]">{item.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section id="paket" className="bg-[radial-gradient(circle_at_top,rgba(94,75,242,0.08),transparent_30%),linear-gradient(180deg,#F8F6F2_0%,#F1F0FF_100%)] px-6 py-24 lg:px-10 lg:py-32">
                            <div className="mx-auto max-w-7xl">
                                <div data-reveal className="reveal-hidden mx-auto max-w-2xl text-center">
                                    <span className="rounded-full bg-[#1777FB] px-4 py-2 text-[10px] font-black uppercase text-white">Harga transparan</span>
                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.04em] sm:text-5xl">Pilih yang paling pas,<span className="text-[#5E4BF2]"> tanpa ribet.</span></h2>
                                </div>
                                <div className="mt-16 grid gap-8 lg:grid-cols-3">
                                    {plans.map((plan) => {
                                        const Icon = plan.icon;
                                        const isFeatured = plan.featured;
                                        return (
                                            <div key={plan.name} data-reveal className={`reveal-hidden relative flex min-h-[500px] flex-col rounded-[2rem] p-6 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${isFeatured ? 'border-[3px] border-[#5E4BF2] bg-white shadow-[0_30px_75px_rgba(94,75,242,0.18)] lg:-translate-y-1' : 'border border-[#EEEAF5] bg-white/90 shadow-[0_22px_50px_rgba(24,24,35,0.04)]'}`}>
                                                {isFeatured && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#5E4BF2] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-lg">Popular</div>}
                                                <div className="mb-5 flex items-center justify-between">
                                                    <span className="flex size-12 items-center justify-center rounded-2xl" style={{ backgroundColor: plan.bg, color: plan.color }}>
                                                        <Icon className="size-6" />
                                                    </span>
                                                    {plan.name !== 'Free' && <span className="text-xs font-bold text-[#8A8999]">/ bulan</span>}
                                                </div>
                                                <div className="mb-4">
                                                    <h3 className="text-[2rem] font-black tracking-[-0.04em] text-[#17182A]">{plan.name}</h3>
                                                    <p className="mt-2 text-sm font-semibold text-[#8A8999]">{plan.description}</p>
                                                </div>
                                                <div className="mt-2 flex items-end gap-2">
                                                    <span className="text-[2.2rem] font-black tracking-[-0.06em] text-[#17182A] sm:text-[2.8rem]">{plan.price}</span>
                                                    {plan.name === 'Free' && <span className="pb-2 text-xs font-bold text-[#9998A8]">selamanya</span>}
                                                </div>
                                                <div className="my-6 h-px bg-[#EDEAF3]" />
                                                <ul className="flex-1 space-y-4">
                                                    {plan.features.map((feature) => (
                                                        <li key={feature} className="flex items-center gap-3 text-sm font-bold text-[#3A3C4F]">
                                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E9F5DE] text-[#3E791E]">
                                                                <Check className="size-3" strokeWidth={3} />
                                                            </span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <Link href={goToDashboard} className={`group mt-8 inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 text-sm font-black transition hover:-translate-y-0.5 ${isFeatured ? 'bg-[#D8F380] text-[#1E2A0A] hover:bg-[#C8E96B]' : plan.name === 'Enterprise' ? 'bg-[#FF8C67] text-white hover:bg-[#F17B58]' : 'bg-[#5E4BF2] text-white hover:bg-[#4938D9]'}`}>
                                                    {plan.button}
                                                    <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section className="px-6 py-20 lg:px-10 lg:py-28">
                            <div data-reveal className="reveal-hidden relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#5E4BF2_0%,#4736D4_100%)] px-7 py-14 text-white shadow-[0_35px_90px_rgba(94,75,242,0.3)] sm:px-12 lg:px-20 lg:py-20">
                                <div className="absolute right-[-60px] top-[-70px] size-56 rounded-full bg-[#D8F380] opacity-90" />
                                <div className="absolute bottom-[-80px] left-[-60px] size-56 rounded-full bg-[#FF8C67] opacity-70" />
                                <div className="absolute right-[25%] top-[20%] size-5 rotate-12 rounded bg-white/30" />
                                <div className="absolute bottom-[25%] right-[15%] size-3 rounded-full bg-[#D8F380]" />

                                <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                                    <div>
                                        <span className="inline-flex rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase text-[#17182A]">Saatnya naik level</span>
                                        <h2 className="mt-5 max-w-2xl text-[2.2rem] font-black leading-tight tracking-tight sm:text-4xl lg:text-[4rem]">
                                            Rapiin operasional.<br />Naikin omzet.<span className="text-[#D8F380]"> Mulai hari ini.</span>
                                        </h2>
                                        <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/70 sm:text-base">Jangan biarkan proses manual menghambat penjualan. Mulai kelola bisnis dengan sistem yang lebih cepat, lebih rapi, dan siap tumbuh.</p>
                                        <Link href={goToDashboard} className="group mt-8 inline-flex items-center rounded-2xl bg-[#D8F380] px-7 py-4 text-sm font-black text-[#17182A] shadow-xl transition hover:-translate-y-1 hover:bg-white sm:text-base">
                                            Coba Gratis Sekarang
                                            <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1" />
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                                        {[['1,200+', 'Bisnis'], ['4.9/5', 'Rating'], ['24/7', 'Akses'], ['4.8x', 'Lebih cepat']].map(([value, label]) => (
                                            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                                                <p className="text-2xl font-black text-[#D8F380]">{value}</p>
                                                <p className="mt-1 text-[9px] font-bold text-white/60">{label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
