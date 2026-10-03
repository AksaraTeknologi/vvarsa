import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function TikTokIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.2 8.2 0 004.79 1.53V6.82a4.85 4.85 0 01-1.02-.13z" />
        </svg>
    );
}

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export function Footer() {
    const { t } = useTranslation();

    const scrollToTop = (e: React.MouseEvent) => {
        e.preventDefault();
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const pages: [string, string, ((e: React.MouseEvent) => void) | undefined][] = [
        [t('landing.nav.home', 'Home'), '#', scrollToTop],
        [t('landing.nav.benefits', 'Manfaat'), '#manfaat', undefined],
        [t('landing.nav.features', 'Fitur'), '#produk', undefined],
        [t('landing.nav.pricing', 'Paket'), '#paket', undefined],
        [t('landing.nav.stories', 'Testimoni'), '#cerita', undefined],
    ];

    const features: [string, string][] = [
        [t('footer.inventory', 'Manajemen Inventori'), route('login')],
        [t('footer.pos', 'Kasir (POS)'), route('login')],
        [t('footer.finance', 'Laporan Keuangan'), route('login')],
        [t('footer.team', 'Manajemen Tim'), route('login')],
        [t('footer.privacy', 'Kebijakan Privasi'), route('login')],
    ];

    return (
        <footer
            className="relative overflow-hidden font-['Plus_Jakarta_Sans'] text-[#E2E0EE]"
            style={{
                background: 'radial-gradient(125% 125% at 50% 0%, #1c1d36 0%, #121324 75%, #0d0e1a 100%)',
            }}
        >
            {/* Top Multi-layer Ambient Glow Lines & Particles */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5E4BF2] to-transparent opacity-80" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8F380] to-transparent opacity-40 blur-[1px]" />

            {/* Glowing Ambient Blobs with CSS animation */}
            <div
                className="pointer-events-none absolute -top-24 left-1/4 h-80 w-[30rem] rounded-full opacity-20 blur-[100px]"
                style={{ background: 'radial-gradient(circle, #5E4BF2 0%, transparent 70%)' }}
            />
            <div
                className="pointer-events-none absolute top-1/2 right-10 h-72 w-72 rounded-full opacity-15 blur-[90px]"
                style={{ background: 'radial-gradient(circle, #D8F380 0%, transparent 70%)' }}
            />

            {/* Subtle background grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-12">
                {/* ── Main Content Grid (Balanced 12 columns layout) ── */}
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

                    {/* ── Column 1: Brand, Badge, Description & Socials (5 Cols) ── */}
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {/* Logo + Tagline */}
                        <div className="flex flex-col gap-3">
                            <Link href={route('home')} className="group flex items-center gap-3 w-fit">
                                <span
                                    className="flex size-11 items-center justify-center rounded-xl p-2 shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-110"
                                    style={{
                                        background: 'linear-gradient(135deg, #5E4BF2 0%, #4335c4 100%)',
                                        boxShadow: '0 4px 20px rgba(94, 75, 242, 0.45)',
                                    }}
                                >
                                    <AppLogoIcon className="size-full fill-white text-white object-contain" />
                                </span>
                                <div>
                                    <div className="text-2xl font-extrabold tracking-tight text-white">
                                        VVAR<span style={{ color: '#D8F380' }}>SA</span>
                                    </div>
                                    <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#9A97B0]">
                                        Business Suite
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Description */}
                        <p className="max-w-md text-sm font-medium leading-relaxed text-[#A4A1B8]">
                            {t(
                                'footer.tagline',
                                'Platform manajemen bisnis all-in-one terpadu untuk UMKM Indonesia. Kelola stok, kasir POS, dan laporan keuangan dalam satu sistem modern.',
                            )}
                        </p>

                        {/* Social Media Links */}
                        <div className="flex flex-col gap-2.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#73708A]">
                                {t('footer.followUs', 'Ikuti Kami')}
                            </span>
                            <div className="flex items-center gap-3">
                                {[
                                    { href: 'https://www.tiktok.com', label: 'TikTok', Icon: TikTokIcon },
                                    { href: 'https://www.instagram.com', label: 'Instagram', Icon: InstagramIcon },
                                    { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: LinkedInIcon },
                                ].map(({ href, label, Icon }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="group relative flex size-10 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#A4A1B8] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-[#5E4BF2] hover:bg-[#5E4BF2] hover:text-white hover:shadow-[0_0_20px_rgba(94,75,242,0.5)]"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Column 2: Navigation Links (2 Cols) ── */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-0.5 rounded-full bg-[#D8F380]" />
                            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#86839C]">
                                {t('footer.pages', 'Halaman')}
                            </h3>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {pages.map(([label, href, onClick]) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        onClick={onClick}
                                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C5C3D6] transition-all duration-200 hover:translate-x-1 hover:text-[#D8F380]"
                                    >
                                        <ChevronRight className="size-3.5 text-[#5E4BF2] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-[#D8F380]" />
                                        <span>{label}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Column 3: Features Links (2 Cols) ── */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-0.5 rounded-full bg-[#5E4BF2]" />
                            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#86839C]">
                                {t('footer.features', 'Fitur VVARSA')}
                            </h3>
                        </div>
                        <ul className="flex flex-col gap-3">
                            {features.map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C5C3D6] transition-all duration-200 hover:translate-x-1 hover:text-[#D8F380]"
                                    >
                                        <ChevronRight className="size-3.5 text-[#5E4BF2] opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-[#D8F380]" />
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Column 4: Contact & Location Info Box (3 Cols) ── */}
                    <div className="flex flex-col gap-4 lg:col-span-3">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-0.5 rounded-full bg-[#D8F380]" />
                            <h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#86839C]">
                                {t('footer.contactTitle', 'Kontak & Lokasi')}
                            </h3>
                        </div>

                        {/* Interactive Info Card */}
                        <div className="flex flex-col gap-3.5 rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] p-4 backdrop-blur-md transition-all duration-300 hover:border-[rgba(94,75,242,0.3)] hover:bg-[rgba(255,255,255,0.05)]">
                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(94,75,242,0.15)] text-[#A594F9]">
                                    <MapPin className="size-4" />
                                </div>
                                <p className="text-xs font-medium leading-relaxed text-[#B6B4C8]">
                                    Perumahan Permata Permadani, Blok B1. Kel. Pendem Kec. Junrejo Kota Batu, Jawa Timur 65324
                                </p>
                            </div>

                            <div className="h-px w-full bg-[rgba(255,255,255,0.06)]" />

                            {/* Email */}
                            <a
                                href="mailto:aksarateknologimandiri@gmail.com"
                                className="group flex items-center gap-3 text-xs font-semibold text-[#D2D0E2] transition-colors hover:text-[#D8F380]"
                            >
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(94,75,242,0.15)] text-[#A594F9] transition-colors group-hover:bg-[#5E4BF2] group-hover:text-white">
                                    <Mail className="size-4" />
                                </div>
                                <span className="truncate">aksarateknologimandiri@gmail.com</span>
                            </a>

                            {/* Phone */}
                            <a
                                href="tel:+6285142505797"
                                className="group flex items-center gap-3 text-xs font-semibold text-[#D2D0E2] transition-colors hover:text-[#D8F380]"
                            >
                                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(94,75,242,0.15)] text-[#A594F9] transition-colors group-hover:bg-[#5E4BF2] group-hover:text-white">
                                    <Phone className="size-4" />
                                </div>
                                <span>+62-851-4250-5797</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
