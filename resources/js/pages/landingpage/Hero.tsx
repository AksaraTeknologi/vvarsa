import { Link } from '@inertiajs/react';
import { ArrowRight, Bell, Boxes, Check, ChefHat, CircleDollarSign, Package, Play, Star, TrendingUp } from 'lucide-react';
import { type LandingProps } from './types';

export function Hero({ goToDashboard }: LandingProps) {
    return (
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
    );
}
