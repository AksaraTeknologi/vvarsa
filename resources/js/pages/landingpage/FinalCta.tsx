import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { type LandingProps } from './types';

export function FinalCta({ goToDashboard }: LandingProps) {
    return (
                    <section className="px-6 py-16 lg:px-10 lg:py-20">
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

                                    <h2 className="mt-4 max-w-2xl text-[2rem] font-black leading-tight tracking-tight sm:text-3xl lg:text-[3.4rem]">
                                        Rapiin operasional.
                                        <br />
                                        Naikin omzet.
                                        <span className="text-[#D8F380]">
                                            {' '}
                                            Mulai hari ini.
                                        </span>
                                    </h2>

                                    <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-white/70 sm:text-base">
                                        Jangan biarkan proses manual
                                        menghambat penjualan. Mulai kelola
                                        bisnis dengan sistem yang lebih cepat,
                                        lebih rapi, dan siap tumbuh.
                                    </p>

                                    <Link
                                        href={goToDashboard}
                                        className="group mt-6 inline-flex items-center rounded-2xl bg-[#D8F380] px-6 py-3.5 text-sm font-black text-[#17182A] shadow-xl transition hover:-translate-y-1 hover:bg-white sm:text-base"
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
    );
}
