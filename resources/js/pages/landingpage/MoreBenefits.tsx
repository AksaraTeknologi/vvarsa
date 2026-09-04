import { Check } from 'lucide-react';

export function MoreBenefits() {
    return (
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
    );
}
