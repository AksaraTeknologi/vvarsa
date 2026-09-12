import { Bell, ChevronRight, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { features } from './data';

export function Features({ autoRotate = true }: { autoRotate?: boolean }) {
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        if (!autoRotate) return;

        const interval = window.setInterval(() => {
            setActiveFeature(
                (current) => (current + 1) % features.length,
            );
        }, 5200);

        return () => window.clearInterval(interval);
    }, [autoRotate]);

    return (
        <>
            <section
                id="produk"
                className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(94,75,242,0.38),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(216,243,128,0.25),transparent_28%),linear-gradient(180deg,#F4F0FF_0%,#F0EFF7_40%,#F7F2ED_100%)] px-6 py-16 text-[#17182A] lg:px-10 lg:py-20"
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

                            <h2 className="mt-4 text-[2.5rem] font-black leading-[0.9] tracking-[-0.06em] text-[#17182A] sm:text-4xl lg:text-[4.5rem]">
                                Satu dashboard.
                                <br />
                                <span className="text-[#5E4BF2]">
                                    Banyak hal
                                </span>
                                <br />
                                jadi mudah.
                            </h2>

                            <p className="mt-4 max-w-[31rem] text-sm font-semibold leading-relaxed text-[#5F6073] sm:text-base">
                                Tidak perlu pindah-pindah aplikasi.
                                Semua data penting bisnismu saling
                                terhubung secara otomatis.
                            </p>

                            <div className="mt-6 space-y-3">
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
                                                        : 'bg-[#eaf6ee] text-[#2f8f5c]'
                                                }`}
                                            >
                                                <Icon className="size-5" />
                                            </span>

                                            <div className="flex-1">
                                                <p className="text-base font-black">
                                                    {feature.title}
                                                </p>
                                                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C7D8D]">
                                                    {feature.number} · Fitur utama
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
                            onMouseEnter={() => {/* handled by parent */}}
                            onMouseLeave={() => {/* handled by parent */}}
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
                                                {(features[activeFeature].bars ?? []).map(
                                                    (height, index) => (
                                                        <span
                                                            key={index}
                                                            className={`flex-1 rounded-[999px] border border-white/35 ${
                                                                index ===
                                                                (features[activeFeature].bars ?? []).length - 1
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
                                            className={`rounded-[1.5rem] p-4 text-[#17182A] shadow-[0_18px_35px_rgba(94,75,242,0.08)] ${
                                                features[activeFeature].tone === 'orange'
                                                    ? 'bg-[linear-gradient(135deg,#FFF1EC_0%,#FDE4DB_100%)]'
                                                    : features[activeFeature].tone === 'blue'
                                                      ? 'bg-[linear-gradient(135deg,#EEF6FF_0%,#E0F0FF_100%)]'
                                                      : 'bg-[linear-gradient(135deg,#F4F0FF_0%,#ECE7FF_100%)]'
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
                                                            features[activeFeature].secondaryColor,
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
        </>
    );
}
