export function Stats() {
    return (
                    <section className="bg-white px-6 py-20 lg:px-10">
                        <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-[2.25rem] border border-[#EAE4F7] bg-[linear-gradient(135deg,#FDFBFF_0%,#F3F0FF_100%)] shadow-[0_24px_60px_rgba(94,75,242,0.06)] sm:grid-cols-4">
                            {[
                                ['1,200+', 'Bisnis aktif', '#5E4BF2'],
                                ['24/7', 'Data tersimpan', '#FF8C67'],
                                ['4.9/5', 'Rating pengguna', '#1777FB'],
                                ['4.8x', 'Lebih cepat', '#1E2A0A'],
                            ].map(([value, label, color], index) => (
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
