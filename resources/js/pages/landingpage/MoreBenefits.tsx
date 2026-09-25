import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MoreBenefits() {
    const { t } = useTranslation();

    const items = [
        [
            t('landing.moreBenefits.items.0.title', 'Order makin cepat'),
            t('landing.moreBenefits.items.0.text', 'Transaksi lebih lancar tanpa kerja manual berulang.'),
            '#5E4BF2',
            '#F1EEFF',
        ],
        [
            t('landing.moreBenefits.items.1.title', 'Stok lebih aman'),
            t('landing.moreBenefits.items.1.text', 'Data real-time membantu mencegah kehabisan atau overstock.'),
            '#FF8C67',
            '#FFF2ED',
        ],
        [
            t('landing.moreBenefits.items.2.title', 'Tim lebih fokus'),
            t('landing.moreBenefits.items.2.text', 'Semua orang jelas tugas dan aksesnya masing-masing.'),
            '#1777FB',
            '#EEF6FF',
        ],
        [
            t('landing.moreBenefits.items.3.title', 'Keputusan lebih tepat'),
            t('landing.moreBenefits.items.3.text', 'Laporan jelas jadi bahan pertimbangan bisnis.'),
            '#1E2A0A',
            '#F0F5E6',
        ],
    ] as const;

    return (
        <section className="bg-[linear-gradient(180deg,#F7F5FF_0%,#F3F0EC_100%)] px-6 py-16 lg:px-10">
            <div className="mx-auto max-w-7xl">
                <div
                    data-reveal
                    className="reveal-hidden mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div>
                        <span className="rounded-full bg-[#D8F380] px-4 py-2 text-[10px] font-black uppercase text-[#17182A]">
                            {t('landing.moreBenefits.badge', 'Kenapa lebih cepat')}
                        </span>

                        <h2 className="mt-4 text-[2rem] font-black leading-tight tracking-[-0.04em] sm:text-3xl">
                            {t('landing.moreBenefits.title1', 'Rapi di dalam,')}
                            <span className="text-[#5E4BF2]">
                                {' '}
                                {t('landing.moreBenefits.titleHighlight', 'lebih kuat di luar.')}
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-xl text-sm font-semibold leading-relaxed text-[#66677A] sm:text-base">
                        {t('landing.moreBenefits.description', 'Suasana kerja yang lebih teratur membuat tim lebih fokus, lebih cepat, dan lebih siap bertumbuh tanpa hambatan manual.')}
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {items.map(
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
                                        backgroundColor: color,
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
