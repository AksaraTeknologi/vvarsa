import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Crown, Package, Sparkles } from 'lucide-react';
import { type LandingProps } from './types';

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

export function Pricing({ goToDashboard }: LandingProps) {
    return (
                    <section
                        id="paket"
                        className="bg-[radial-gradient(circle_at_top,rgba(94,75,242,0.08),transparent_30%),linear-gradient(180deg,#F8F6F2_0%,#F1F0FF_100%)] px-6 py-16 lg:px-10 lg:py-20"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden mx-auto max-w-2xl text-center"
                            >
                                <span className="rounded-full bg-[#1777FB] px-4 py-2 text-[10px] font-black uppercase text-white">
                                    Harga transparan
                                </span>

                                <h2 className="mt-4 text-[2rem] font-black tracking-[-0.04em] sm:text-4xl">
                                    Pilih yang paling pas,
                                    <span className="text-[#5E4BF2]">
                                        {' '}
                                        tanpa ribet.
                                    </span>
                                </h2>

                                <p className="mt-3 text-sm font-semibold leading-relaxed text-[#777689] sm:text-base">
                                    Mulai dari yang paling sederhana sampai
                                    yang siap mendukung bisnis yang tumbuh
                                    cepat.
                                </p>
                            </div>

                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
    );
}
