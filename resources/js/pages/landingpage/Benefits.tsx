import { ArrowRight, Check, X } from 'lucide-react';

export function Benefits() {
    return (
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
                                Proses berulang &amp; tidak efisien
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
                                Otomatis, cepat &amp; terintegrasi
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
    );
}
