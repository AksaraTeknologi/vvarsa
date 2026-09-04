import { BarChart3, Boxes, WalletCards } from 'lucide-react';

export function HowItWorks() {
    return (
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
    );
}
