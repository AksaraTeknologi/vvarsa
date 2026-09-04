import { Star } from 'lucide-react';

const testimonials = [
    {
        name: 'Rina Pratiwi',
        role: 'Owner Kedai Kopi',
        text: 'Dulu setiap malam saya rekap penjualan manual. Sekarang tinggal buka VVARSA dan semuanya langsung kelihatan.',
        avatar: 'RP',
        rating: 5,
    },
    {
        name: 'Budi Santoso',
        role: 'Owner Cafe & Resto',
        text: 'Yang paling membantu itu stok otomatisnya. Jadi saya nggak perlu bolak-balik cek spreadsheet lagi.',
        avatar: 'BS',
        rating: 5,
    },
    {
        name: 'Alya Ramadhani',
        role: 'UMKM Kuliner',
        text: 'Tampilannya gampang dipahami dan laporan bisnis jadi jauh lebih rapi. Cocok banget buat usaha yang lagi berkembang.',
        avatar: 'AR',
        rating: 5,
    },
];

export function Testimonials() {
    return (
                    <section
                        id="cerita"
                        className="px-6 py-20 lg:px-10 lg:py-28"
                    >
                        <div className="mx-auto max-w-7xl">
                            <div
                                data-reveal
                                className="reveal-hidden flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
                            >
                                <div>
                                    <span className="rounded-full bg-[#BDB5FF] px-4 py-2 text-[10px] font-black uppercase text-[#40349A]">
                                        Cerita pengguna
                                    </span>

                                    <h2 className="mt-5 text-[2.2rem] font-black tracking-[-0.04em] sm:text-5xl">
                                        Mereka sudah
                                        <span className="text-[#5E4BF2]">
                                            {' '}
                                            merasakan.
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {['R', 'B', 'A', 'D', 'S'].map(
                                            (item) => (
                                                <span
                                                    key={item}
                                                    className="flex size-8 items-center justify-center rounded-full border-2 border-[#F7F5FF] bg-[#D8F380] text-[9px] font-black"
                                                >
                                                    {item}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    <span className="text-xs font-black text-[#17182A]">
                                        +1,200 pengguna
                                    </span>
                                </div>
                            </div>

                            <div className="mt-14 grid gap-7 md:grid-cols-3">
                                {[
                                    {
                                        bg: 'linear-gradient(180deg, #F2EEFF 0%, #FFFFFF 100%)',
                                        accent: '#5E4BF2',
                                        name: testimonials[0].name,
                                        role: testimonials[0].role,
                                        text: testimonials[0].text,
                                        avatar: testimonials[0].avatar,
                                    },
                                    {
                                        bg: 'linear-gradient(180deg, #F3FFF2 0%, #FFFFFF 100%)',
                                        accent: '#76C978',
                                        name: testimonials[1].name,
                                        role: testimonials[1].role,
                                        text: testimonials[1].text,
                                        avatar: testimonials[1].avatar,
                                    },
                                    {
                                        bg: 'linear-gradient(180deg, #FFF4EE 0%, #FFFFFF 100%)',
                                        accent: '#FF8C67',
                                        name: testimonials[2].name,
                                        role: testimonials[2].role,
                                        text: testimonials[2].text,
                                        avatar: testimonials[2].avatar,
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        data-reveal
                                        className="reveal-hidden group rounded-[2rem] border border-[#E9E6F1] bg-white p-6 shadow-[0_18px_45px_rgba(94,75,242,0.06)] transition duration-500 hover:-translate-y-2 hover:border-[#D8D2FF] hover:shadow-[0_28px_70px_rgba(94,75,242,0.12)]"
                                        style={{
                                            background: item.bg,
                                        }}
                                    >
                                        <div className="flex gap-1">
                                            {Array.from({
                                                length: 5,
                                            }).map(
                                                (_, starIndex) => (
                                                    <Star
                                                        key={
                                                            starIndex
                                                        }
                                                        className="size-4 fill-[#FFB800] text-[#FFB800]"
                                                    />
                                                ),
                                            )}
                                        </div>

                                        <p className="mt-6 text-sm font-bold leading-relaxed text-[#555667]">
                                            “{item.text}”
                                        </p>

                                        <div className="mt-7 flex items-center gap-3 border-t border-[#EEEAF4] pt-5">
                                            <span
                                                className="flex size-11 items-center justify-center rounded-full text-xs font-black text-[#17182A]"
                                                style={{
                                                    backgroundColor:
                                                        item.accent,
                                                }}
                                            >
                                                {item.avatar}
                                            </span>

                                            <div>
                                                <p className="text-xs font-black text-[#17182A]">
                                                    {item.name}
                                                </p>

                                                <p className="text-[10px] font-semibold text-[#9998A8]">
                                                    {item.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
    );
}
