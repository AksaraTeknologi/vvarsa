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
    Zap,
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
];

const testimonials = [
    {
        name: 'Rina Pratiwi',
        role: 'Owner Kedai Kopi',
        text: 'Dulu setiap malam saya rekap penjualan manual. Sekarang tinggal buka VVARSA dan semuanya langsung kelihatan.',
        avatar: 'RP',
        rating: 5,
    },
    {
        name: 'Budi Santoso',
        role: 'Owner Cafe & Resto',
        text: 'Yang paling membantu itu stok otomatisnya. Jadi saya nggak perlu bolak-balik cek spreadsheet lagi.',
        avatar: 'BS',
        rating: 5,
    },
    {
        name: 'Alya Ramadhani',
        role: 'UMKM Kuliner',
        text: 'Tampilannya gampang dipahami dan laporan bisnis jadi jauh lebih rapi. Cocok banget buat usaha yang lagi berkembang.',
        avatar: 'AR',
        rating: 5,
    },
];

const plans = [
    {
        name: 'Free',
        price: 'Gratis',
        description: 'Untuk mulai merapikan bisnis',
        icon: Package,
        features: [
            'Kelola inventori',
            'Laporan keuangan harian',
            'Akses komunitas',
        ],
        button: 'Mulai Gratis',
        color: '#5E4BF2',
        bg: '#F1EFFD',
    },
    {
        name: 'Pro',
        price: 'Rp149.000',
        description: 'Untuk bisnis yang sedang tumbuh',
        icon: Sparkles,
        features: [
            'Semua fitur Free',
            'Export laporan & PDF',
            'Multi-user hingga 5 orang',
            'Fitur POS kasir cepat',
        ],
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
        features: [
            'Semua fitur Pro',
            'Akses API khusus',
            'Dukungan prioritas 24/7',
            'Kustomisasi laporan',
        ],
        button: 'Pilih Enterprise',
        color: '#FFFFFF',
        bg: '#FF8C67',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const [menuOpen, setMenuOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [featureAutoRotate, setFeatureAutoRotate] = useState(true);

    useEffect(() => {
        const elements =
            document.querySelectorAll<HTMLElement>('[data-reveal]');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
            },
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)',
        );

        const syncMotionMode = () => {
            setFeatureAutoRotate(!mediaQuery.matches);
        };

        syncMotionMode();

        mediaQuery.addEventListener('change', syncMotionMode);

        return () => mediaQuery.removeEventListener('change', syncMotionMode);
    }, []);

    useEffect(() => {
        if (!featureAutoRotate) return;

        const interval = window.setInterval(() => {
            setActiveFeature(
                (current) => (current + 1) % features.length,
            );
        }, 5200);

        return () => window.clearInterval(interval);
    }, [featureAutoRotate]);

    const goToDashboard = auth.user
        ? route('dashboard')
        : route('register');

    return (
        <>
            <Head title="VVARSA — Kelola Bisnis Jadi Seru & Rapi">
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />

                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />

                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#FDFBFF_0%,#F5F2EE_28%,#F0EEE9_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#D8F380] selection:text-[#17182A]">
                <style>{`
                    @keyframes driftSlow {
                        0% {
                            transform: translate3d(0, 0, 0) scale(1);
                        }
                        50% {
                            transform: translate3d(2.5%, -2%, 0) scale(1.08);
                        }
                        100% {
                            transform: translate3d(-2%, 2.5%, 0) scale(1.02);
                        }
                    }

                    @keyframes gridShift {
                        0% {
                            background-position: 0 0, 0 0;
                        }
                        100% {
                            background-position: 40px 40px, 40px 40px;
                        }
                    }

                    @keyframes floatSlow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-12px); }
                    }

                    @keyframes floatDelay {
                        0%, 100% { transform: translateY(0px) translateX(0px); }
                        50% { transform: translateY(-10px) translateX(6px); }
                    }

                    @keyframes sway {
                        0%, 100% { transform: rotate(0deg); }
                        50% { transform: rotate(2deg); }
                    }

                    @keyframes glowPulse {
                        0%, 100% { box-shadow: 0 0 0 rgba(94,75,242,0); }
                        50% { box-shadow: 0 0 28px rgba(94,75,242,0.22); }
                    }

                    .bg-drift {
                        animation: driftSlow 18s ease-in-out infinite alternate;
                    }

                    .bg-grid {
                        animation: gridShift 24s linear infinite;
                    }

                    .reveal-hidden {
                        opacity: 0;
                        transform: translateY(24px);
                        transition: opacity 0.7s ease, transform 0.7s ease;
                    }

                    .reveal-visible {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
                    .animate-float { animation: floatSlow 5s ease-in-out infinite; }
                    .animate-float-delay { animation: floatDelay 6.5s ease-in-out infinite; }
                    .animate-float-delay-2 { animation: floatDelay 7.2s ease-in-out infinite reverse; }
                    .animate-sway { animation: sway 7s ease-in-out infinite; }
                    .animate-glow { animation: glowPulse 4s ease-in-out infinite; }
                `}</style>

                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-drift absolute -left-16 top-20 h-[26rem] w-[26rem] rounded-full bg-[#C9C2FF]/35 blur-3xl" />
                    <div className="bg-drift absolute -right-12 top-32 h-[28rem] w-[28rem] rounded-full bg-[#D8F380]/25 blur-3xl [animation-delay:2s]" />
                    <div className="bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#F5D9C7]/30 blur-3xl [animation-delay:4s]" />
                    <div
                        className="bg-grid absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(94,75,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,75,242,0.06) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative z-10">
                    {/* =========================================================
                        NAVBAR
                    ========================================================= */}

                <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#E7E3FA] bg-white/85 backdrop-blur-xl">
                    <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">

                        <Link
                            href={route('home')}
                            className="group flex items-center gap-3"
                        >
                            <span className="flex size-11 items-center justify-center rounded-2xl bg-[#5E4BF2] text-white shadow-lg shadow-[#5E4BF2]/25 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                                <ChefHat
                                    className="size-6"
                                    strokeWidth={2.5}
                                />
                            </span>

                            <div>
                                <div className="text-xl font-black tracking-tight">
                                    VVAR<span className="text-[#5E4BF2]">SA</span>
                                </div>

                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9693AA]">
                                    Business Suite
                                </div>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-1 md:flex">
                            {[
                                ['Manfaat', '#manfaat'],
                                ['Fitur', '#produk'],
                                ['Cara Kerja', '#cara-kerja'],
                                ['Paket', '#paket'],
                                ['Cerita', '#cerita'],
                            ].map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    className="rounded-full px-4 py-2 text-sm font-bold text-[#53556A] transition hover:bg-[#F1EFFD] hover:text-[#5E4BF2]"
                                >
                                    {label}
                                </a>
                            ))}
                        </nav>

                        <div className="hidden items-center gap-3 md:flex">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-full border-2 border-[#5E4BF2] px-5 py-2.5 text-sm font-black text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2.5 text-sm font-black text-[#35364A] transition hover:text-[#5E4BF2]"
                                    >
                                        Masuk
                                    </Link>

                                    <Link
                                        href={route('register')}
                                        className="group rounded-full bg-[#5E4BF2] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#5E4BF2]/25 transition hover:-translate-y-0.5 hover:bg-[#4938D9]"
                                    >
                                        Mulai Gratis

                                        <ArrowRight className="ml-1 inline size-4 transition group-hover:translate-x-1" />
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="rounded-2xl bg-[#F1EFFD] p-2.5 md:hidden"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? (
                                <X className="size-6" />
                            ) : (
                                <Menu className="size-6" />
                            )}
                        </button>
                    </div>
                </header>

                {/* MOBILE MENU */}

                {menuOpen && (
                    <div className="sticky top-[76px] z-40 mx-4 mt-2 rounded-3xl border border-[#E7E3FA] bg-white p-4 shadow-2xl md:hidden">
                        {[
                            ['Manfaat', '#manfaat'],
                            ['Fitur', '#produk'],
                            ['Cara Kerja', '#cara-kerja'],
                            ['Paket', '#paket'],
                            ['Cerita', '#cerita'],
                        ].map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className="block rounded-2xl px-4 py-3 font-bold hover:bg-[#F1EFFD]"
                            >
                                {label}
                            </a>
                        ))}

                        <Link
                            href={
                                auth.user
                                    ? route('dashboard')
                                    : route('login')
                            }
                            className="mt-2 block rounded-2xl bg-[#5E4BF2] px-4 py-3 text-center font-black text-white"
                        >
                            {auth.user ? 'Dashboard' : 'Masuk'}
                        </Link>
                    </div>
                )}

                <main>

                    {/* =====================================================
                        HERO
                    ===================================================== */}

                    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(94,75,242,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(216,243,128,0.22),transparent_20%),linear-gradient(180deg,#F9F7F4_0%,#F3F0EC_100%)] px-5 pb-28 pt-16 sm:px-6 lg:px-10 lg:pb-36 lg:pt-40">

                        <div className="absolute left-[-120px] top-[120px] size-[340px] rounded-full bg-[#D8F380]/70 blur-[110px]" />

                        <div className="absolute right-[-100px] top-[-100px] size-[420px] rounded-full bg-[#BDB5FF]/70 blur-[110px]" />

                        <div className="absolute left-1/2 top-[18%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#5E4BF2]/15 blur-[120px]" />

                        <div className="absolute bottom-[4%] left-[10%] h-[240px] w-[240px] rounded-full bg-[#FF8C67]/15 blur-[90px]" />

                        <div className="absolute inset-0 opacity-[0.4] hero-grid" />

                        <div className="relative mx-auto grid max-w-7xl items-center gap-20 lg:grid-cols-[0.92fr_1.08fr]">

                            {/* HERO COPY */}

                            <div
                                data-reveal
                                className="reveal-hidden relative z-10"
                            >
                                <h1 className="max-w-3xl text-[2.8rem] font-black leading-[0.82] tracking-[-0.07em] sm:text-5xl lg:text-[5rem]">
                                    Usaha lebih
                                    <br />

                                    <span className="relative inline-block text-[#5E4BF2]">
                                        <span className="relative z-10">
                                            tertata
                                        </span>

                                        <span className="absolute -bottom-2 left-0 right-0 -z-0 h-5 rounded-[0.75rem] bg-[#D8F380] opacity-90 sm:h-8" />
                                    </span>{' '}

                                    <span className="text-[#17182A]">
                                        dan
                                    </span>

                                    <br />

                                    <span className="text-[#17182A]">
                                        lebih siap tumbuh.
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-[#66677A] sm:text-lg">
                                    VVARSA menyatukan stok, kasir,
                                    penjualan, dan laporan dalam satu sistem
                                    yang elegan, efisien, dan siap berkembang.

                                    <span className="text-[#5E4BF2]">
                                        {' '}
                                        Dengan operasional yang lebih tertata,
                                        Anda dapat fokus pada pelayanan,
                                        penjualan, dan pertumbuhan bisnis dengan
                                        lebih tenang.
                                    </span>
                                </p>

                                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={goToDashboard}
                                        className="group inline-flex items-center justify-center rounded-2xl bg-[#5E4BF2] px-7 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(94,75,242,0.45)] transition duration-300 hover:-translate-y-1 hover:bg-[#4938D9] sm:text-base"
                                    >
                                        Coba Gratis 14 Hari

                                        <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1" />
                                    </Link>

                                    <a
                                        href="#cara-kerja"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#E6E2F4] bg-white px-6 py-4 text-sm font-black text-[#343548] transition hover:-translate-y-1 hover:border-[#5E4BF2] hover:text-[#5E4BF2] sm:text-base"
                                    >
                                        <span className="flex size-7 items-center justify-center rounded-full bg-[#D8F380]">
                                            <Play className="size-3.5 fill-current" />
                                        </span>

                                        Lihat Demo
                                    </a>
                                </div>

                                <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
                                    <div className="rounded-full border border-[#EAE5F8] bg-white px-4 py-2 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(
                                                (item) => (
                                                    <Star
                                                        key={item}
                                                        className="size-4 fill-[#FFB800] text-[#FFB800]"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <p className="mt-1 text-xs font-black text-[#5E4BF2]">
                                            4.9/5 dari pengguna
                                        </p>
                                    </div>

                                    <div className="rounded-full border border-[#EAE5F8] bg-white px-4 py-2 shadow-sm">
                                        <p className="text-xl font-black text-[#17182A]">
                                            1,200+
                                        </p>

                                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8A8999]">
                                            Bisnis aktif
                                        </p>
                                    </div>

                                    <div className="flex -space-x-2">
                                        {['R', 'A', 'B', 'D'].map(
                                            (item, index) => (
                                                <span
                                                    key={item}
                                                    className={`flex size-9 items-center justify-center rounded-full border-2 border-white text-xs font-black ${
                                                        index === 0
                                                            ? 'bg-[#D8F380]'
                                                            : index === 1
                                                              ? 'bg-[#BDB5FF]'
                                                              : index === 2
                                                                ? 'bg-[#FF8C67]'
                                                                : 'bg-[#79D7FF]'
                                                    }`}
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* HERO VISUAL */}

                            <div
                                data-reveal
                                className="reveal-hidden relative min-h-[520px] sm:min-h-[590px]"
                            >
                                <div className="absolute left-[8%] top-[5%] size-24 rotate-12 rounded-[2rem] bg-[#D8F380] opacity-80 blur-[1px] animate-float-slow animate-glow" />

                                <div className="absolute right-[2%] top-[20%] size-20 rounded-full bg-[#FF8C67] opacity-70 animate-float animate-glow" />

                                <div className="absolute bottom-[8%] left-[3%] size-16 rounded-full bg-[#79D7FF] opacity-80 animate-float-slow animate-glow" />

                                <div className="absolute right-[4%] top-[5%] h-[88%] w-[88%] rotate-[5deg] rounded-[3rem] border-2 border-[#D8F380] bg-[#D8F380]/80 shadow-[0_25px_60px_rgba(122,145,28,0.25)] animate-sway" />

                                <div className="absolute left-[2%] top-[10%] h-[87%] w-[87%] rotate-[-5deg] rounded-[3rem] border-2 border-[#BDB5FF] bg-[#DCD8FF]/80 shadow-[0_20px_55px_rgba(94,75,242,0.18)] animate-float-delay" />

                                <div className="hero-panel absolute inset-x-[2%] top-0 z-10 mx-auto max-w-[500px]">
                                    <div className="card-depth overflow-hidden rounded-[2.75rem] border-[5px] border-white bg-white shadow-[0_40px_90px_rgba(55,43,130,0.22)]">

                                        <div className="flex items-center justify-between border-b border-[#ECEAF5] px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-10 items-center justify-center rounded-xl bg-[#5E4BF2] text-white">
                                                    <ChefHat className="size-5" />
                                                </span>

                                                <div>
                                                    <p className="text-[10px] font-bold text-[#9998AA]">
                                                        Selamat datang,
                                                    </p>

                                                    <p className="text-sm font-black">
                                                        VVARSA Dashboard
                                                    </p>
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
                                                        <span className="text-[10px] font-bold text-[#9998AA]">
                                                            Omzet Hari Ini
                                                        </span>

                                                        <span className="rounded-lg bg-[#EAF8DC] p-1.5 text-[#3E6A19]">
                                                            <TrendingUp className="size-3.5" />
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 text-xl font-black">
                                                        Rp3,45jt
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-bold text-[#45A62E]">
                                                        +24.8% dari kemarin
                                                    </p>
                                                </div>

                                                <div className="rounded-2xl bg-[#5E4BF2] p-4 text-white shadow-lg shadow-[#5E4BF2]/20">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-white/70">
                                                            Profit
                                                        </span>

                                                        <CircleDollarSign className="size-4 text-[#D8F380]" />
                                                    </div>

                                                    <p className="mt-2 text-xl font-black">
                                                        Rp1,28jt
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-bold text-[#D8F380]">
                                                        +18.2% bulan ini
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-3 rounded-[1.75rem] border border-[#F0ECFF] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF9FF_100%)] p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-[#9998AA]">
                                                            Performa Penjualan
                                                        </p>

                                                        <p className="mt-1 text-sm font-black">
                                                            Minggu ini
                                                        </p>
                                                    </div>

                                                    <span className="rounded-lg bg-[#F1EFFD] px-2 py-1 text-[9px] font-black text-[#5E4BF2]">
                                                        7 Hari
                                                    </span>
                                                </div>

                                                <div className="relative mt-5 h-28 overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#F7F5FF_0%,#FFFFFF_100%)] p-2">
                                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(94,75,242,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(94,75,242,0.04)_1px,transparent_1px)] bg-[size:18px_18px]" />

                                                    <svg
                                                        viewBox="0 0 300 120"
                                                        className="absolute inset-0 h-full w-full"
                                                        preserveAspectRatio="none"
                                                    >
                                                        <defs>
                                                            <linearGradient
                                                                id="chartFill"
                                                                x1="0"
                                                                x2="0"
                                                                y1="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="0%"
                                                                    stopColor="#5E4BF2"
                                                                    stopOpacity={0.22}
                                                                />

                                                                <stop
                                                                    offset="100%"
                                                                    stopColor="#5E4BF2"
                                                                    stopOpacity={0.02}
                                                                />
                                                            </linearGradient>
                                                        </defs>

                                                        <path
                                                            d="M0,82 C30,70 48,58 72,65 C100,72 121,30 150,46 C178,62 201,24 227,35 C254,46 280,18 300,12 L300,120 L0,120 Z"
                                                            fill="url(#chartFill)"
                                                        />

                                                        <path
                                                            d="M0,82 C30,70 48,58 72,65 C100,72 121,30 150,46 C178,62 201,24 227,35 C254,46 280,18 300,12"
                                                            fill="none"
                                                            stroke="#5E4BF2"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />

                                                        <circle
                                                            cx="227"
                                                            cy="35"
                                                            r="5"
                                                            fill="#D8F380"
                                                            stroke="#5E4BF2"
                                                            strokeWidth="2"
                                                        />

                                                        <circle
                                                            cx="150"
                                                            cy="46"
                                                            r="4"
                                                            fill="#5E4BF2"
                                                        />

                                                        <circle
                                                            cx="300"
                                                            cy="12"
                                                            r="4"
                                                            fill="#5E4BF2"
                                                        />
                                                    </svg>
                                                </div>

                                                <div className="mt-2 flex justify-between text-[8px] font-bold text-[#AAA8B8]">
                                                    <span>Sen</span>
                                                    <span>Sel</span>
                                                    <span>Rab</span>
                                                    <span>Kam</span>
                                                    <span>Jum</span>
                                                    <span>Sab</span>
                                                    <span>Min</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex size-9 items-center justify-center rounded-xl bg-[#D8F380]">
                                                            <Package className="size-4" />
                                                        </span>

                                                        <div>
                                                            <p className="text-[10px] font-bold text-[#9998AA]">
                                                                Status Inventori
                                                            </p>

                                                            <p className="text-xs font-black">
                                                                128 item tersedia
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="rounded-full bg-[#EAF8DC] px-2 py-1 text-[9px] font-black text-[#3E6A19]">
                                                        Aman
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute left-[-2%] top-[25%] z-20 w-[190px] rounded-2xl border border-white bg-white p-3.5 shadow-2xl animate-float-delay sm:left-[-5%]">
                                    <div className="flex items-start gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#D8F380]">
                                            <Check
                                                className="size-4"
                                                strokeWidth={3}
                                            />
                                        </span>

                                        <div>
                                            <p className="text-[9px] font-bold text-[#9694A6]">
                                                Transaksi berhasil
                                            </p>

                                            <p className="mt-0.5 text-xs font-black">
                                                Rp450.000
                                            </p>

                                            <p className="mt-1 text-[8px] font-bold text-[#49A22E]">
                                                âœ“ Stok otomatis terpotong
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-[12%] right-[-1%] z-20 w-[190px] rotate-3 rounded-2xl border border-white bg-[#FF8C67] p-3.5 text-white shadow-2xl animate-float-delay-2 sm:right-[-4%]">
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#FF8C67]">
                                            <Boxes className="size-4" />
                                        </span>

                                        <div>
                                            <p className="text-[9px] font-bold text-white/70">
                                                Peringatan stok
                                            </p>

                                            <p className="text-xs font-black">
                                                Susu UHT menipis
                                            </p>

                                            <p className="mt-0.5 text-[8px] font-bold text-white/80">
                                                Tinggal 3 botol
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-[3%] left-[10%] z-20 flex items-center gap-2 rounded-full border-2 border-white bg-white py-2 pl-2 pr-4 shadow-xl animate-float-slow">
                                    <span className="flex size-8 items-center justify-center rounded-full bg-[#79D7FF] text-[10px] font-black">
                                        RA
                                    </span>

                                    <div>
                                        <p className="text-[8px] font-bold text-[#9998AA]">
                                            Owner
                                        </p>

                                        <p className="text-[10px] font-black">
                                            Rina A.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        MANFAAT
                    ===================================================== */}

                    <section
                        data-reveal
                        id="manfaat"
                        className="reveal-hidden relative mx-auto max-w-7xl overflow-visible px-6 py-28 lg:px-10 lg:py-36"
                    >
                        <div className="pointer-events-none absolute left-[-100px] top-[15%] size-[300px] rounded-full bg-[#D8F380]/30 blur-[110px]" />

                        <div className="pointer-events-none absolute right-[-100px] bottom-[5%] size-[320px] rounded-full bg-[#BDB5FF]/25 blur-[110px]" />

                        <div className="relative grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">

                            {/* LEFT COPY */}

                            <div>
                                <h2 className="mt-6 text-[2.5rem] font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-[3.6rem]">
                                    Usaha sibuk,
                                    <br />

                                    <span className="relative inline-block text-[#5E4BF2]">
                                        <span className="relative z-10">
                                            tapi omzet nggak naik?
                                        </span>

                                        <span className="absolute -bottom-2 left-0 right-0 -z-0 h-5 rounded-[0.5rem] bg-[#D8F380] opacity-85 sm:h-7" />
                                    </span>

                                    <br />

                                    <span className="text-[#17182A]">
                                        Sistemmu mungkin belum siap.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-lg text-base font-semibold leading-relaxed text-[#777689] sm:text-lg">
                                    VVARSA menyatukan stok, kasir,
                                    penjualan, dan laporan dalam satu
                                    ekosistem. Dengan operasional yang lebih
                                    rapi, kamu punya ruang lebih banyak untuk
                                    menjual, upsell, dan tumbuh tanpa
                                    hambatan.
                                </p>
                            </div>

                            {/* BEFORE / AFTER */}

                            <div
                                className="grid gap-8 sm:grid-cols-2"
                                style={{ perspective: '1400px' }}
                            >

                                {/* BEFORE */}

                                <div
                                    data-reveal
                                    className="reveal-hidden group relative overflow-visible rounded-[2.25rem] border-2 border-[#FFD8D8] bg-[linear-gradient(135deg,#FFFFFF_0%,#FFF9F9_100%)] p-8 shadow-[0_28px_70px_rgba(214,83,83,0.13)] transition-all duration-700 ease-out hover:-translate-y-4 hover:rotate-[-1deg] hover:shadow-[0_40px_90px_rgba(214,83,83,0.22)] sm:p-9"
                                >
                                    <div className="pointer-events-none absolute right-[-35px] top-[-35px] size-32 rounded-full bg-[#FFE7E7] opacity-60 blur-[1px]" />

                                    <div className="pointer-events-none absolute bottom-[-20px] left-[-20px] size-24 rounded-full bg-[#FFF0F0]" />

                                    <div className="relative z-10">

                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFE9E9] px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#D65353]">
                                            <span className="flex size-5 items-center justify-center rounded-full bg-[#FFD8D8]">
                                                <X
                                                    className="size-3"
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            Sebelum
                                        </div>

                                        <h3 className="mt-6 text-3xl font-black tracking-[-0.04em] text-[#17182A]">
                                            Serba manual
                                        </h3>

                                        <p className="mt-2 text-sm font-semibold text-[#9998A8]">
                                            Proses berulang & tidak efisien
                                        </p>

                                        <div className="mt-8 space-y-4">
                                            {[
                                                'Spreadsheet berantakan',
                                                'Cek stok satu-satu',
                                                'Rekap transaksi malam hari',
                                                'Laporan susah dicari',
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className="group/item relative flex min-h-[68px] cursor-default items-center gap-4 rounded-2xl border-2 border-[#FFE0E0] bg-white px-5 py-4 pr-12 shadow-[0_8px_20px_rgba(214,83,83,0.06)] transition-all duration-500 ease-out hover:-translate-y-3 hover:translate-x-3 hover:scale-[1.035] hover:border-[#FFBABA] hover:bg-[#FFFDFD] hover:shadow-[0_22px_40px_rgba(214,83,83,0.18)]"
                                                >
                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFE0E0] text-[#D65353] transition-all duration-500 group-hover/item:scale-125 group-hover/item:rotate-6 group-hover/item:bg-[#D65353] group-hover/item:text-white group-hover/item:shadow-lg">
                                                        <X
                                                            className="size-4"
                                                            strokeWidth={3}
                                                        />
                                                    </span>

                                                    <span className="flex-1 text-[15px] font-extrabold tracking-[-0.01em] text-[#4D4E5E] transition-all duration-500 group-hover/item:translate-x-1.5 group-hover/item:text-[#17182A] group-hover/item:drop-shadow-[0_5px_10px_rgba(23,24,42,0.15)]">
                                                        {item}
                                                    </span>

                                                    <span className="pointer-events-none absolute right-3 flex size-7 items-center justify-center rounded-full bg-[#FFE9E9] text-[#D65353] opacity-0 transition-all duration-500 group-hover/item:translate-x-1 group-hover/item:opacity-100">
                                                        <ArrowRight className="size-3.5" />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* AFTER */}

                                <div
                                    data-reveal
                                    className="reveal-hidden group relative overflow-visible rounded-[2.25rem] border-2 border-[#5E4BF2]/40 bg-[linear-gradient(135deg,#5E4BF2_0%,#4B3ED8_100%)] p-8 text-white shadow-[0_35px_85px_rgba(94,75,242,0.30)] transition-all duration-700 ease-out hover:-translate-y-4 hover:rotate-[1deg] hover:shadow-[0_45px_100px_rgba(94,75,242,0.40)] sm:p-9"
                                >
                                    <div className="pointer-events-none absolute right-[-35px] top-[-35px] size-32 rounded-full bg-[#D8F380] opacity-30 blur-[1px]" />

                                    <div className="pointer-events-none absolute bottom-[-20px] left-[-20px] size-24 rounded-full bg-[#79D7FF] opacity-20" />

                                    <div className="relative z-10">

                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#D8F380]">
                                            <span className="flex size-5 items-center justify-center rounded-full bg-[#D8F380] text-[#1E2A0A]">
                                                <Check
                                                    className="size-3"
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            Sesudah
                                        </div>

                                        <h3 className="mt-6 text-3xl font-black tracking-[-0.04em]">
                                            Semua terhubung
                                        </h3>

                                        <p className="mt-2 text-sm font-semibold text-white/60">
                                            Otomatis, cepat & terintegrasi
                                        </p>

                                        <div className="mt-8 space-y-4">
                                            {[
                                                'Dashboard real-time',
                                                'Stok otomatis',
                                                'POS lebih cepat',
                                                'Laporan siap kapan saja',
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className="group/item relative flex min-h-[68px] cursor-default items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 pr-12 shadow-[0_10px_25px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:translate-x-3 hover:scale-[1.045] hover:border-[#D8F380]/70 hover:bg-white/15 hover:shadow-[0_24px_45px_rgba(216,243,128,0.22)]"
                                                >
                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#D8F380] text-[#1E2A0A] shadow-[0_5px_15px_rgba(216,243,128,0.25)] transition-all duration-500 group-hover/item:scale-125 group-hover/item:rotate-6 group-hover/item:shadow-[0_10px_28px_rgba(216,243,128,0.55)]">
                                                        <Check
                                                            className="size-4"
                                                            strokeWidth={3}
                                                        />
                                                    </span>

                                                    <span className="flex-1 text-[15px] font-extrabold tracking-[-0.01em] text-white/90 transition-all duration-500 group-hover/item:translate-x-1.5 group-hover/item:text-white group-hover/item:drop-shadow-[0_5px_12px_rgba(255,255,255,0.22)]">
                                                        {item}
                                                    </span>

                                                    <span className="pointer-events-none absolute right-3 flex size-7 items-center justify-center rounded-full bg-[#D8F380] text-[#1E2A0A] opacity-0 transition-all duration-500 group-hover/item:translate-x-1 group-hover/item:opacity-100">
                                                        <ArrowRight className="size-3.5" />
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        FEATURES
                    ===================================================== */}

                    <section
                        id="produk"
                        className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(94,75,242,0.38),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(216,243,128,0.25),transparent_28%),linear-gradient(180deg,#F4F0FF_0%,#F0EFF7_40%,#F7F2ED_100%)] px-6 py-20 text-[#17182A] lg:px-10 lg:py-28"
                    >
                        <div className="absolute right-[-120px] top-[-100px] size-[420px] rounded-full bg-[#5E4BF2]/16 blur-[120px]" />

                        <div className="absolute bottom-[-130px] left-[-80px] size-[380px] rounded-full bg-[#D8F380]/20 blur-[120px]" />

                        <div className="absolute inset-0 bg-[linear-gradient(rgba(94,75,242,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(94,75,242,0.02)_1px,transparent_1px)] bg-[size:32px_32px] opacity-90" />

                        <div className="relative mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden grid gap-7 xl:grid-cols-[0.95fr_1.05fr] xl:items-center"
                            >
                                <div className="lg:pr-4">
                                    <span className="inline-flex rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#17182A] shadow-[0_12px_30px_rgba(216,243,128,0.45)]">
                                        Semua dalam satu tempat
                                    </span>

                                    <h2 className="mt-6 text-[3.1rem] font-black leading-[0.86] tracking-[-0.07em] text-[#17182A] sm:text-5xl lg:text-[5.2rem]">
                                        Satu dashboard.
                                        <br />
                                        <span className="text-[#5E4BF2]">
                                            Banyak hal
                                        </span>
                                        <br />
                                        jadi mudah.
                                    </h2>

                                    <p className="mt-6 max-w-[31rem] text-sm font-semibold leading-relaxed text-[#5F6073] sm:text-base">
                                        Tidak perlu pindah-pindah aplikasi.
                                        Semua data penting bisnismu saling
                                        terhubung secara otomatis.
                                    </p>

                                    <div className="mt-8 space-y-3">
                                        {features.map((feature, index) => {
                                            const Icon = feature.icon;
                                            const active = activeFeature === index;

                                            return (
                                                <button
                                                    key={feature.number}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveFeature(index)
                                                    }
                                                    className={`group flex w-full items-center gap-4 rounded-[1.5rem] border p-4 text-left transition-all duration-300 ${
                                                        active
                                                            ? 'border-[#E5E1FF] bg-white text-[#17182A] shadow-[0_22px_50px_rgba(94,75,242,0.14),inset_0_1px_0_rgba(255,255,255,0.8)] -translate-y-0.5'
                                                            : 'border-transparent bg-white/55 text-[#17182A] hover:border-[#E5E1FF] hover:bg-white/90 hover:shadow-[0_18px_38px_rgba(94,75,242,0.08)] hover:-translate-y-0.5'
                                                    }`}
                                                >
                                                    <span
                                                        className={`flex size-12 shrink-0 items-center justify-center rounded-[1.1rem] ${
                                                            active
                                                                ? 'bg-[#D8F380] text-[#17182A] shadow-[0_8px_18px_rgba(216,243,128,0.35)]'
                                                                : 'bg-[#F2F0FF] text-[#5E4BF2]'
                                                        }`}
                                                    >
                                                        <Icon className="size-5" />
                                                    </span>

                                                    <div className="flex-1">
                                                        <p className="text-base font-black">
                                                            {feature.title}
                                                        </p>
                                                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C7D8D]">
                                                            {feature.number} Â· Fitur utama
                                                        </p>
                                                    </div>

                                                    <ChevronRight
                                                        className={`size-4 transition ${
                                                            active
                                                                ? 'translate-x-1 text-[#5E4BF2]'
                                                                : 'opacity-30'
                                                        }`}
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div
                                    className="relative"
                                    onMouseEnter={() => setFeatureAutoRotate(false)}
                                    onMouseLeave={() => setFeatureAutoRotate(true)}
                                >
                                    <div className="absolute inset-3 rounded-[2.5rem] bg-[#5E4BF2]/10 blur-2xl" />

                                    <div className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/75 p-3 shadow-[0_38px_90px_rgba(94,75,242,0.18)] backdrop-blur-sm sm:p-4">
                                        <div className="flex items-center justify-between rounded-[1.3rem] border border-[#EDE9F9] bg-[#F8F7FF] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                            <div className="flex items-center gap-3">
                                                <span className="flex size-10 items-center justify-center rounded-2xl bg-[#D8F380] text-[#17182A] shadow-[0_10px_24px_rgba(216,243,128,0.35)]">
                                                    {(() => {
                                                        const Icon = features[activeFeature].icon;
                                                        return <Icon className="size-4" />;
                                                    })()}
                                                </span>

                                                <div className="leading-none">
                                                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#9AA0B3]">
                                                        VVARSA dashboard
                                                    </p>
                                                    <p className="mt-1.5 text-lg font-black text-[#17182A]">
                                                        {features[activeFeature].title}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E1E6F5] bg-white px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#17182A] shadow-sm">
                                                <span className="size-1.5 rounded-full bg-[#D8F380] shadow-[0_0_0_3px_rgba(216,243,128,0.2)]" />
                                                Live
                                            </span>
                                        </div>

                                        <div className="mt-4 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
                                            <div className="rounded-[1.6rem] border border-[#F0EEFF] bg-white p-4 shadow-[0_24px_42px_rgba(94,75,242,0.08)]">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9AA0B3]">
                                                            {features[activeFeature].metricLabel}
                                                        </p>
                                                        <p className="mt-2 text-[2.6rem] font-black leading-none tracking-[-0.06em]">
                                                            {features[activeFeature].metric}
                                                        </p>
                                                    </div>

                                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[#F2F0FF] text-[#5E4BF2] shadow-inner shadow-white/80">
                                                        <TrendingUp className="size-4" />
                                                    </div>
                                                </div>

                                                {features[activeFeature].type === 'bars' && (
                                                    <div className="mt-5 flex h-32 items-end gap-2 rounded-[1.25rem] border border-[#F0ECFF] bg-[linear-gradient(180deg,#F9F8FF_0%,#F1EDFF_100%)] px-2 pb-2 pt-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                                                        {features[activeFeature].bars.map(
                                                            (height, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={`flex-1 rounded-[999px] border border-white/35 ${
                                                                        index ===
                                                                        features[
                                                                            activeFeature
                                                                        ].bars.length -
                                                                            1
                                                                            ? 'bg-[linear-gradient(180deg,#5E4BF2_0%,#4137D9_100%)] shadow-[0_12px_18px_rgba(94,75,242,0.24)]'
                                                                            : 'bg-[linear-gradient(180deg,#E7E0FF_0%,#D7CCFF_100%)]'
                                                                    }`}
                                                                    style={{
                                                                        height: `${Math.max(height, 38)}%`,
                                                                        minHeight: '30%',
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                                {features[activeFeature].type === 'line' && (
                                                    <div className="mt-5 h-32 rounded-[1.25rem] border border-[#F0ECFF] bg-[linear-gradient(180deg,#F9F8FF_0%,#F1EDFF_100%)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                                                        <svg
                                                            viewBox="0 0 240 100"
                                                            className="h-full w-full"
                                                            preserveAspectRatio="none"
                                                        >
                                                            <defs>
                                                                <linearGradient
                                                                    id="featureLineFill"
                                                                    x1="0"
                                                                    x2="0"
                                                                    y1="0"
                                                                    y2="1"
                                                                >
                                                                    <stop
                                                                        offset="0%"
                                                                        stopColor="#5E4BF2"
                                                                        stopOpacity={0.23}
                                                                    />
                                                                    <stop
                                                                        offset="100%"
                                                                        stopColor="#5E4BF2"
                                                                        stopOpacity={0.03}
                                                                    />
                                                                </linearGradient>
                                                            </defs>
                                                            <path
                                                                d="M0,72 L18,66 L36,68 L54,48 L72,56 L90,30 L108,36 L126,20 L144,29 L162,16 L180,12 L198,16 L216,14 L240,10 L240,100 L0,100 Z"
                                                                fill="url(#featureLineFill)"
                                                            />
                                                            <path
                                                                d="M0,72 L18,66 L36,68 L54,48 L72,56 L90,30 L108,36 L126,20 L144,29 L162,16 L180,12 L198,16 L216,14 L240,10"
                                                                fill="none"
                                                                stroke="#5E4BF2"
                                                                strokeWidth="4"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                {features[activeFeature].type === 'ring' && (
                                                    <div className="mt-5 flex h-32 items-center justify-center rounded-[1.25rem] border border-[#F0ECFF] bg-[linear-gradient(180deg,#F9F8FF_0%,#F1EDFF_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                                                        <div
                                                            className="relative flex size-28 items-center justify-center rounded-full border-[10px] border-[#E9E2FF]"
                                                            style={{
                                                                background: `conic-gradient(#5E4BF2 0 ${features[activeFeature].ring}%, #E9E2FF ${features[activeFeature].ring}% 100%)`,
                                                            }}
                                                        >
                                                            <div className="flex size-18 items-center justify-center rounded-full bg-white text-[1.35rem] font-black text-[#17182A] shadow-[inset_0_0_0_1px_rgba(94,75,242,0.08)]">
                                                                {features[activeFeature].ring}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div
                                                    className={`rounded-[1.5rem] p-4 text-[#17182A] shadow-[0_24px_46px_rgba(216,243,128,0.28)] ${
                                                        features[activeFeature].tone === 'orange'
                                                            ? 'bg-[linear-gradient(135deg,#FFB49A_0%,#FF8C67_100%)]'
                                                            : features[activeFeature].tone === 'blue'
                                                              ? 'bg-[linear-gradient(135deg,#B9E3FF_0%,#79D7FF_100%)]'
                                                              : 'bg-[linear-gradient(135deg,#D8F380_0%,#C8F369_100%)]'
                                                    }`}
                                                >
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#37421A] opacity-70">
                                                        {features[activeFeature].trendLabel}
                                                    </p>

                                                    <p className="mt-2 text-[2.2rem] font-black leading-none tracking-[-0.06em]">
                                                        {features[activeFeature].trend}
                                                    </p>

                                                    {features[activeFeature].type === 'bars' && (
                                                        <div className="mt-4 flex items-end gap-1.5">
                                                            {[3, 5, 4, 7, 6, 9].map((item, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="flex-1 rounded-full bg-[#1A1B23]/18"
                                                                    style={{
                                                                        height: `${item * 5}px`,
                                                                        opacity: 0.7,
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {features[activeFeature].type === 'line' && (
                                                        <div className="mt-4 flex items-end gap-1.5">
                                                            {[4, 6, 5, 7, 8, 9, 6, 8].map((item, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="flex-1 rounded-full bg-[#1A1B23]/18"
                                                                    style={{
                                                                        height: `${item * 5}px`,
                                                                        opacity: 0.7,
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {features[activeFeature].type === 'ring' && (
                                                        <div className="mt-3 flex items-center justify-center">
                                                            <div className="flex h-14 w-full items-center justify-center rounded-[1rem] bg-white/15 ring-1 ring-black/5">
                                                                <div className="flex gap-2">
                                                                    {[60, 80, 95].map((item, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="w-2 rounded-full bg-[#1A1B23]/20"
                                                                            style={{
                                                                                height: `${item / 2}px`,
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="rounded-[1.45rem] border border-[#F0EEFF] bg-[#F8F5FF] p-3.5 shadow-[0_18px_32px_rgba(94,75,242,0.06)]">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className="flex size-10 items-center justify-center rounded-2xl shadow-[0_10px_20px_rgba(255,140,103,0.3)]"
                                                            style={{
                                                                backgroundColor:
                                                                    features[
                                                                        activeFeature
                                                                    ].secondaryColor,
                                                            }}
                                                        >
                                                            <Bell className="size-4 text-[#17182A]" />
                                                        </span>

                                                        <div className="leading-none">
                                                            <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9AA0B3]">
                                                                Notifikasi
                                                            </p>
                                                            <p className="mt-1 text-sm font-black text-[#17182A]">
                                                                {features[activeFeature].secondary}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                            {[
                                                ['Stok', 'Aman', '#D8F380'],
                                                ['Kasir', '48 transaksi', '#FF8C67'],
                                                ['Profit', '+18.2%', '#79D7FF'],
                                            ].map(([title, value, color]) => (
                                                <div
                                                    key={title}
                                                    className="flex min-h-[72px] flex-col justify-center rounded-[1.1rem] border border-[#F0EEFF] bg-[#F8F5FF] p-3 shadow-[0_10px_18px_rgba(94,75,242,0.04)]"
                                                >
                                                    <div
                                                        className="mb-1.5 size-2 rounded-full"
                                                        style={{
                                                            backgroundColor: color,
                                                        }}
                                                    />

                                                    <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#9AA0B3]">
                                                        {title}
                                                    </p>

                                                    <p className="mt-1 text-xs font-black text-[#17182A]">
                                                        {value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#5E4BF2]/45 to-transparent" />
                    </div>

                    {/* =====================================================
                        HOW IT WORKS
                    ===================================================== */}

                    <section
                        id="cara-kerja"
                        className="relative mt-6 overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(94,75,242,0.22),transparent_30%),linear-gradient(180deg,#17182A_0%,#101426_100%)] px-6 py-20 text-white lg:px-10 lg:py-28"
                    >
                        <div className="absolute left-[-80px] top-[-40px] size-52 rounded-full bg-[#D8F380]/18 blur-3xl" />

                        <div className="absolute bottom-[-90px] right-[-80px] size-64 rounded-full bg-[#FF8C67]/18 blur-3xl" />

                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] opacity-40" />

                        <div className="relative mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden text-center"
                            >
                                <span className="rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase text-[#17182A]">
                                    Cara kerja VVARSA
                                </span>

                                <h2 className="mx-auto mt-5 max-w-4xl text-[2.2rem] font-black leading-tight tracking-[-0.04em] sm:text-5xl">
                                    Dari data ribet,
                                    <span className="text-[#D8F380]">
                                        {' '}
                                        jadi bisnis yang bergerak.
                                    </span>
                                </h2>

                                <p className="mx-auto mt-4 max-w-2xl text-sm font-semibold text-white/65 sm:text-base">
                                    Semua proses penting dari input data sampai
                                    laporan keputusan dibuat dalam satu flow
                                    yang simpel, cepat, dan lebih rapi.
                                </p>
                            </div>

                            <div className="relative mt-16 grid gap-6 md:grid-cols-3">
                                {[
                                    {
                                        step: '01',
                                        icon: Boxes,
                                        title: 'Masukkan data',
                                        text: 'Input produk, stok, supplier, dan harga hanya sekali, lalu semuanya otomatis tersusun.',
                                        color: '#5E4BF2',
                                        tint: 'from-[#5E4BF2]/30 to-[#17192E]',
                                        badge: 'mulai',
                                    },
                                    {
                                        step: '02',
                                        icon: WalletCards,
                                        title: 'Kelola transaksi',
                                        text: 'Kasir, pesanan, pembayaran, dan aktivitas harian berjalan lebih cepat tanpa bolak balik data.',
                                        color: '#FF8C67',
                                        tint: 'from-[#FF8C67]/30 to-[#17192E]',
                                        badge: 'jalan',
                                    },
                                    {
                                        step: '03',
                                        icon: BarChart3,
                                        title: 'Lihat hasil',
                                        text: 'Dashboard real-time menampilkan omzet, stok, dan profit tanpa perlu rekap manual.',
                                        color: '#79D7FF',
                                        tint: 'from-[#1777FB]/30 to-[#17192E]',
                                        badge: 'naik',
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.step}
                                            data-reveal
                                            className={`reveal-hidden group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${item.tint} p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition duration-500 hover:-translate-y-3 hover:border-white/20`}
                                        >
                                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="flex size-14 items-center justify-center rounded-2xl text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-110"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                >
                                                    <Icon className="size-6" />
                                                </span>

                                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/75">
                                                    {item.badge}
                                                </span>
                                            </div>

                                            <div className="mt-7 flex items-center justify-between">
                                                <h3 className="text-xl font-black text-white">
                                                    {item.title}
                                                </h3>

                                                <span className="text-sm font-black text-white/60">
                                                    {item.step}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-sm font-semibold leading-relaxed text-white/65">
                                                {item.text}
                                            </p>

                                            <div
                                                className="mt-6 h-1.5 w-12 rounded-full transition-all duration-500 group-hover:w-full"
                                                style={{
                                                    backgroundColor:
                                                        item.color,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        BENEFITS
                    ===================================================== */}

                    <section className="bg-[linear-gradient(180deg,#F7F5FF_0%,#F3F0EC_100%)] px-6 py-20 lg:px-10">
                        <div className="mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
                            >
                                <div>
                                    <span className="rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase text-[#17182A]">
                                        Kenapa lebih cepat
                                    </span>

                                    <h2 className="mt-5 text-[2.2rem] font-black leading-tight tracking-[-0.04em] sm:text-4xl">
                                        Rapi di dalam,
                                        <span className="text-[#5E4BF2]">
                                            {' '}
                                            lebih kuat di luar.
                                        </span>
                                    </h2>
                                </div>

                                <p className="max-w-xl text-sm font-semibold leading-relaxed text-[#66677A] sm:text-base">
                                    Suasana kerja yang lebih teratur membuat tim
                                    lebih fokus, lebih cepat, dan lebih siap
                                    bertumbuh tanpa hambatan manual.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                {[
                                    [
                                        'Order makin cepat',
                                        'Transaksi lebih lancar tanpa kerja manual berulang.',
                                        '#5E4BF2',
                                        '#F1EEFF',
                                    ],
                                    [
                                        'Stok lebih aman',
                                        'Data real-time membantu mencegah kehabisan atau overstock.',
                                        '#FF8C67',
                                        '#FFF2ED',
                                    ],
                                    [
                                        'Tim lebih fokus',
                                        'Semua orang jelas tugas dan aksesnya masing-masing.',
                                        '#1777FB',
                                        '#EEF6FF',
                                    ],
                                    [
                                        'Keputusan lebih tepat',
                                        'Laporan jelas jadi bahan pertimbangan bisnis.',
                                        '#1E2A0A',
                                        '#F0F5E6',
                                    ],
                                ].map(
                                    ([title, text, color, bg]) => (
                                        <div
                                            key={title}
                                            data-reveal
                                            className="reveal-hidden rounded-[1.75rem] border border-[#E9E4F7] bg-white/80 p-5 shadow-[0_18px_45px_rgba(94,75,242,0.08)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(94,75,242,0.12)]"
                                            style={{
                                                backgroundColor: bg,
                                            }}
                                        >
                                            <span
                                                className="mb-4 flex size-11 items-center justify-center rounded-2xl text-white"
                                                style={{
                                                    backgroundColor:
                                                        color,
                                                }}
                                            >
                                                <Check
                                                    className="size-4"
                                                    strokeWidth={3}
                                                />
                                            </span>

                                            <h3 className="text-base font-black text-[#17182A]">
                                                {title}
                                            </h3>

                                            <p className="mt-2 text-sm font-semibold leading-relaxed text-[#66677A]">
                                                {text}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        STATS
                    ===================================================== */}

                    <section className="bg-white px-6 py-20 lg:px-10">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-[2.25rem] border border-[#EAE4F7] bg-[linear-gradient(135deg,#FDFBFF_0%,#F3F0FF_100%)] shadow-[0_24px_60px_rgba(94,75,242,0.06)] sm:grid-cols-4">
                            {[
                                ['1,200+', 'Bisnis aktif', '#5E4BF2'],
                                ['24/7', 'Data tersimpan', '#FF8C67'],
                                ['4.9/5', 'Rating pengguna', '#1777FB'],
                                ['4.8x', 'Lebih cepat', '#1E2A0A'],
                            ].map(([value, label, color], index) => (
                                <div
                                    key={label}
                                    className={`p-6 text-center ${
                                        index !== 3
                                            ? 'border-b border-[#E8E5F1] sm:border-b-0 sm:border-r'
                                            : ''
                                    }`}
                                >
                                    <p
                                        className="text-2xl font-black sm:text-3xl"
                                        style={{ color }}
                                    >
                                        {value}
                                    </p>

                                    <p className="mt-1 text-[10px] font-bold text-[#898797] sm:text-xs">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* =====================================================
                        TESTIMONIAL
                    ===================================================== */}

                    <section
                        id="cerita"
                        className="px-6 py-20 lg:px-10 lg:py-28"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
                            >
                                <div>
                                    <span className="rounded-full bg-[#BDB5FF] px-4 py-2 text-[10px] font-black uppercase text-[#40349A]">
                                        Cerita pengguna
                                    </span>

                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.04em] sm:text-5xl">
                                        Mereka sudah
                                        <span className="text-[#5E4BF2]">
                                            {' '}
                                            merasakan.
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {['R', 'B', 'A', 'D', 'S'].map(
                                            (item) => (
                                                <span
                                                    key={item}
                                                    className="flex size-8 items-center justify-center rounded-full border-2 border-[#F7F5FF] bg-[#D8F380] text-[9px] font-black"
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    <span className="text-xs font-black text-[#17182A]">
                                        +1,200 pengguna
                                    </span>
                                </div>
                            </div>

                            <div className="mt-14 grid gap-7 md:grid-cols-3">
                                {[
                                    {
                                        bg: 'linear-gradient(180deg, #F2EEFF 0%, #FFFFFF 100%)',
                                        accent: '#5E4BF2',
                                        name: testimonials[0].name,
                                        role: testimonials[0].role,
                                        text: testimonials[0].text,
                                        avatar: testimonials[0].avatar,
                                    },
                                    {
                                        bg: 'linear-gradient(180deg, #F3FFF2 0%, #FFFFFF 100%)',
                                        accent: '#76C978',
                                        name: testimonials[1].name,
                                        role: testimonials[1].role,
                                        text: testimonials[1].text,
                                        avatar: testimonials[1].avatar,
                                    },
                                    {
                                        bg: 'linear-gradient(180deg, #FFF4EE 0%, #FFFFFF 100%)',
                                        accent: '#FF8C67',
                                        name: testimonials[2].name,
                                        role: testimonials[2].role,
                                        text: testimonials[2].text,
                                        avatar: testimonials[2].avatar,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        data-reveal
                                        className="reveal-hidden group rounded-[2rem] border border-[#E9E6F1] bg-white p-6 shadow-[0_18px_45px_rgba(94,75,242,0.06)] transition duration-500 hover:-translate-y-2 hover:border-[#D8D2FF] hover:shadow-[0_28px_70px_rgba(94,75,242,0.12)]"
                                        style={{
                                            background: item.bg,
                                        }}
                                    >
                                        <div className="flex gap-1">
                                            {Array.from({
                                                length: 5,
                                            }).map(
                                                (_, starIndex) => (
                                                    <Star
                                                        key={
                                                            starIndex
                                                        }
                                                        className="size-4 fill-[#FFB800] text-[#FFB800]"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <p className="mt-6 text-sm font-bold leading-relaxed text-[#555667]">
                                            “{item.text}”
                                        </p>

                                        <div className="mt-7 flex items-center gap-3 border-t border-[#EEEAF4] pt-5">
                                            <span
                                                className="flex size-11 items-center justify-center rounded-full text-xs font-black text-[#17182A]"
                                                style={{
                                                    backgroundColor:
                                                        item.accent,
                                                }}
                                            >
                                                {item.avatar}
                                            </span>

                                            <div>
                                                <p className="text-xs font-black text-[#17182A]">
                                                    {item.name}
                                                </p>

                                                <p className="text-[10px] font-semibold text-[#9998A8]">
                                                    {item.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        PRICING
                    ===================================================== */}

                    <section
                        id="paket"
                        className="bg-[radial-gradient(circle_at_top,rgba(94,75,242,0.08),transparent_30%),linear-gradient(180deg,#F8F6F2_0%,#F1F0FF_100%)] px-6 py-24 lg:px-10 lg:py-32"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden mx-auto max-w-2xl text-center"
                            >
                                <span className="rounded-full bg-[#1777FB] px-4 py-2 text-[10px] font-black uppercase text-white">
                                    Harga transparan
                                </span>

                                <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.04em] sm:text-5xl">
                                    Pilih yang paling pas,
                                    <span className="text-[#5E4BF2]">
                                        {' '}
                                        tanpa ribet.
                                    </span>
                                </h2>

                                <p className="mt-4 text-sm font-semibold leading-relaxed text-[#777689] sm:text-base">
                                    Mulai dari yang paling sederhana sampai
                                    yang siap mendukung bisnis yang tumbuh
                                    cepat.
                                </p>
                            </div>

                            <div className="mt-16 grid gap-8 lg:grid-cols-3">
                                {plans.map((plan) => {
                                    const Icon = plan.icon;
                                    const isFeatured =
                                        plan.featured;

                                    return (
                                        <div
                                            key={plan.name}
                                            data-reveal
                                            className={`reveal-hidden relative flex min-h-[500px] flex-col rounded-[2rem] p-6 transition duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                                                isFeatured
                                                    ? 'border-[3px] border-[#5E4BF2] bg-white shadow-[0_30px_75px_rgba(94,75,242,0.18)] lg:-translate-y-1'
                                                    : 'border border-[#EEEAF5] bg-white/90 shadow-[0_22px_50px_rgba(24,24,35,0.04)]'
                                            }`}
                                        >
                                            {isFeatured && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#5E4BF2] px-4 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-lg">
                                                    Popular
                                                </div>
                                            )}

                                            <div className="mb-5 flex items-center justify-between">
                                                <span
                                                    className="flex size-12 items-center justify-center rounded-2xl"
                                                    style={{
                                                        backgroundColor:
                                                            plan.bg,
                                                        color: plan.color,
                                                    }}
                                                >
                                                    <Icon className="size-6" />
                                                </span>

                                                {plan.name !==
                                                    'Free' && (
                                                    <span className="text-xs font-bold text-[#8A8999]">
                                                        / bulan
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mb-4">
                                                <h3 className="text-[2rem] font-black tracking-[-0.04em] text-[#17182A]">
                                                    {plan.name}
                                                </h3>

                                                <p className="mt-2 text-sm font-semibold text-[#8A8999]">
                                                    {
                                                        plan.description
                                                    }
                                                </p>
                                            </div>

                                            <div className="mt-2 flex items-end gap-2">
                                                <span className="text-[2.2rem] font-black tracking-[-0.06em] text-[#17182A] sm:text-[2.8rem]">
                                                    {plan.price}
                                                </span>

                                                {plan.name ===
                                                    'Free' && (
                                                    <span className="pb-2 text-xs font-bold text-[#9998A8]">
                                                        selamanya
                                                    </span>
                                                )}
                                            </div>

                                            <div className="my-6 h-px bg-[#EDEAF3]" />

                                            <ul className="flex-1 space-y-4">
                                                {plan.features.map(
                                                    (feature) => (
                                                        <li
                                                            key={
                                                                feature
                                                            }
                                                            className="flex items-center gap-3 text-sm font-bold text-[#3A3C4F]"
                                                        >
                                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E9F5DE] text-[#3E791E]">
                                                                <Check
                                                                    className="size-3"
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                            </span>

                                                            {feature}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>

                                            <Link
                                                href={
                                                    goToDashboard
                                                }
                                                className={`group mt-8 inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 text-sm font-black transition hover:-translate-y-0.5 ${
                                                    isFeatured
                                                        ? 'bg-[#D8F380] text-[#1E2A0A] hover:bg-[#C8E96B]'
                                                        : plan.name ===
                                                            'Enterprise'
                                                          ? 'bg-[#FF8C67] text-white hover:bg-[#F17B58]'
                                                          : 'bg-[#5E4BF2] text-white hover:bg-[#4938D9]'
                                                }`}
                                            >
                                                {plan.button}

                                                <ArrowRight className="ml-2 size-4 transition group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* =====================================================
                        FINAL CTA
                    ===================================================== */}

                    <section className="px-6 py-20 lg:px-10 lg:py-28">
                        <div
                            data-reveal
                            className="reveal-hidden relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#5E4BF2_0%,#4736D4_100%)] px-7 py-14 text-white shadow-[0_35px_90px_rgba(94,75,242,0.3)] sm:px-12 lg:px-20 lg:py-20"
                        >
                            <div className="absolute right-[-60px] top-[-70px] size-56 rounded-full bg-[#D8F380] opacity-90" />

                            <div className="absolute bottom-[-80px] left-[-60px] size-56 rounded-full bg-[#FF8C67] opacity-70" />

                            <div className="absolute right-[25%] top-[20%] size-5 rotate-12 rounded bg-white/30" />

                            <div className="absolute bottom-[25%] right-[15%] size-3 rounded-full bg-[#D8F380]" />

                            <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                                <div>
                                    <span className="inline-flex rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase text-[#17182A]">
                                        🚀 Saatnya naik level
                                    </span>

                                    <h2 className="mt-5 max-w-2xl text-[2.2rem] font-black leading-tight tracking-tight sm:text-4xl lg:text-[4rem]">
                                        Rapiin operasional.
                                        <br />
                                        Naikin omzet.
                                        <span className="text-[#D8F380]">
                                            {' '}
                                            Mulai hari ini.
                                        </span>
                                    </h2>

                                    <p className="mt-5 max-w-xl text-sm font-semibold leading-relaxed text-white/70 sm:text-base">
                                        Jangan biarkan proses manual
                                        menghambat penjualan. Mulai kelola
                                        bisnis dengan sistem yang lebih cepat,
                                        lebih rapi, dan siap tumbuh.
                                    </p>

                                    <Link
                                        href={goToDashboard}
                                        className="group mt-8 inline-flex items-center rounded-2xl bg-[#D8F380] px-7 py-4 text-sm font-black text-[#17182A] shadow-xl transition hover:-translate-y-1 hover:bg-white sm:text-base"
                                    >
                                        Coba Gratis Sekarang

                                        <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                                    {[
                                        ['1,200+', 'Bisnis'],
                                        ['4.9/5', 'Rating'],
                                        ['24/7', 'Akses'],
                                        ['4.8x', 'Lebih cepat'],
                                    ].map(([value, label]) => (
                                        <div
                                            key={label}
                                            className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
                                        >
                                            <p className="text-2xl font-black text-[#D8F380]">
                                                {value}
                                            </p>

                                            <p className="mt-1 text-[9px] font-bold text-white/60">
                                                {label}
                                            </p>
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

