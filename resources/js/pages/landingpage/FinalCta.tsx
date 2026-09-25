import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type LandingProps } from './types';

export function FinalCta({ goToDashboard }: LandingProps) {
    const { t } = useTranslation();

    const stats = [
        ['1,200+', t('landing.finalCta.stats.businesses', 'Bisnis')],
        ['4.9/5', t('landing.finalCta.stats.rating', 'Rating')],
        ['24/7', t('landing.finalCta.stats.access', 'Akses')],
        ['4.8x', t('landing.finalCta.stats.faster', 'Lebih cepat')],
    ] as const;

    return (
        <section className="px-6 py-16 lg:px-10 lg:py-20">
            <div
                data-reveal
                className="reveal-hidden relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-[linear-gradient(135deg,#5E4BF2_0%,#4736D4_100%)] px-7 py-14 text-white shadow-[0_35px_90px_rgba(94,75,242,0.3)] sm:px-12 lg:px-20 lg:py-20"
            >
                <div className="absolute top-[-70px] right-[-60px] size-56 rounded-full bg-[#D8F380] opacity-90" />

                <div className="absolute bottom-[-80px] left-[-60px] size-56 rounded-full bg-[#FF8C67] opacity-70" />

                <div className="absolute top-[20%] right-[25%] size-5 rotate-12 rounded bg-white/30" />

                <div className="absolute right-[15%] bottom-[25%] size-3 rounded-full bg-[#D8F380]" />

                <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <span className="inline-flex rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black text-[#17182A] uppercase">
                            {t('landing.finalCta.badge', '🚀 Saatnya naik level')}
                        </span>

                        <h2 className="mt-4 max-w-2xl text-[2rem] leading-tight font-black tracking-tight sm:text-3xl lg:text-[3.4rem]">
                            {t('landing.finalCta.title1', 'Rapiin operasional.')}
                            <br />
                            {t('landing.finalCta.title2', 'Naikin omzet.')}
                            <span className="text-[#D8F380]"> {t('landing.finalCta.titleHighlight', 'Mulai hari ini.')}</span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-relaxed font-semibold text-white/70 sm:text-base">
                            {t('landing.finalCta.description', 'Jangan biarkan proses manual menghambat penjualan. Mulai kelola bisnis dengan sistem yang lebih cepat, lebih rapi, dan siap tumbuh.')}
                        </p>

                        <Link
                            href={goToDashboard}
                            className="group mt-6 inline-flex items-center rounded-2xl bg-[#D8F380] px-6 py-3.5 text-sm font-black text-[#17182A] shadow-xl transition hover:-translate-y-1 hover:bg-white sm:text-base"
                        >
                            {t('landing.finalCta.button', 'Coba Gratis Sekarang')}
                            <ArrowRight className="ml-2 size-5 transition group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                        {stats.map(([value, label]) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                                <p className="text-2xl font-black text-[#D8F380]">{value}</p>

                                <p className="mt-1 text-[9px] font-bold text-white/60">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
