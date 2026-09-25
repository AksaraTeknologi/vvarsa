import { useTranslation } from 'react-i18next';

export function Stats() {
    const { t } = useTranslation();

    const items = [
        ['1,200+', t('landing.stats.businesses', 'Bisnis aktif'), '#5E4BF2'],
        ['24/7', t('landing.stats.dataSaved', 'Data tersimpan'), '#FF8C67'],
        ['4.9/5', t('landing.stats.rating', 'Rating pengguna'), '#1777FB'],
        ['4.8x', t('landing.stats.speed', 'Lebih cepat'), '#1E2A0A'],
    ] as const;

    return (
        <section className="bg-white px-6 py-14 lg:px-10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-[2.25rem] border border-[#EAE4F7] bg-[linear-gradient(135deg,#FDFBFF_0%,#F3F0FF_100%)] shadow-[0_24px_60px_rgba(94,75,242,0.06)] sm:grid-cols-4">
                {items.map(([value, label, color], index) => (
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
    );
}
