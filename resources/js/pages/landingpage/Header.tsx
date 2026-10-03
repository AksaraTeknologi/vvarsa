import AppLogoIcon from '@/components/app-logo-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type LandingProps } from './types';

export function Header({ auth }: LandingProps) {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';
    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

    const navItems = [
        [t('landing.nav.benefits', 'Manfaat'), '#manfaat'],
        [t('landing.nav.features', 'Fitur'), '#produk'],
        [t('landing.nav.howItWorks', 'Cara Kerja'), '#cara-kerja'],
        [t('landing.nav.pricing', 'Paket'), '#paket'],
        [t('landing.nav.stories', 'Cerita'), '#cerita'],
    ] as const;

    return (
        <>
            <header className="fixed top-0 right-0 left-0 z-50 border-b border-[#E7E3FA] bg-white/95 backdrop-blur-md dark:border-[#2b2d4b] dark:bg-[#121324]/95">
                <div className="mx-auto flex h-[84px] max-w-[1520px] items-center justify-between px-5 sm:px-7 lg:px-10">
                    <Link href={route('home')} className="group flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-[0.9rem] bg-[#5E4BF2] p-2 text-white shadow-md shadow-[#5E4BF2]/25 transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <AppLogoIcon className="size-full object-contain" />
                        </span>

                        <div>
                            <div className="text-[1.4rem] leading-none font-black tracking-tight text-neutral-900 dark:text-white">
                                VVAR<span className="text-[#5E4BF2]">SA</span>
                            </div>

                            <div className="text-[10px] font-black tracking-[0.18em] text-[#9693AA] uppercase dark:text-[#807D99]">Business Suite</div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-2 md:flex">
                        {navItems.map(([label, href]) => (
                            <a
                                key={href}
                                href={href}
                                className="rounded-full px-4 py-2 text-sm font-semibold text-[#53556A] transition hover:bg-[#F1EFFD] hover:text-[#5E4BF2] dark:text-[#C5C3D6] dark:hover:bg-[#1e1f38] dark:hover:text-[#D8F380]"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        <LanguageSwitcher />

                        {/* Dark / Light mode toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="flex size-9 items-center justify-center rounded-full border border-[#E7E3FA] bg-[#F1EFFD] text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white dark:border-[#2b2d4b] dark:bg-[#1e1f38] dark:text-[#D8F380] dark:hover:bg-[#5E4BF2] dark:hover:text-white"
                        >
                            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        </button>

                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-[#5E4BF2] px-4 py-2 text-sm font-bold text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white dark:text-[#D8F380] dark:border-[#5E4BF2] dark:hover:bg-[#5E4BF2] dark:hover:text-white"
                            >
                                {t('landing.nav.dashboard', 'Dashboard')}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="px-3 py-2 text-sm font-bold text-[#35364A] transition hover:text-[#5E4BF2] dark:text-[#C5C3D6] dark:hover:text-[#D8F380]">
                                    {t('landing.nav.login', 'Masuk')}
                                </Link>

                                <Button
                                    asChild
                                    variant="default"
                                    size="sm"
                                    className="group !h-9 rounded-full !px-4 !py-2 text-xs !font-semibold shadow-md shadow-[#5E4BF2]/20 transition hover:-translate-y-0.5"
                                >
                                    <Link href={route('register')} className="inline-flex items-center gap-1">
                                        {t('landing.nav.startFree', 'Mulai Gratis')}
                                        <ArrowRight className="inline size-3.5 transition group-hover:translate-x-0.5" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <LanguageSwitcher />

                        {/* Dark / Light mode toggle (mobile) */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            className="flex size-9 items-center justify-center rounded-full bg-[#F1EFFD] text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white dark:bg-[#1e1f38] dark:text-[#D8F380]"
                        >
                            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="rounded-2xl bg-[#F1EFFD] p-2.5 dark:bg-[#1e1f38] dark:text-white"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="sticky top-[84px] z-40 mx-4 mt-2 rounded-3xl border border-[#E7E3FA] bg-white p-3 shadow-2xl md:hidden dark:border-[#2b2d4b] dark:bg-[#18192d]">
                    {navItems.map(([label, href]) => (
                        <a
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[#F1EFFD] dark:text-[#C5C3D6] dark:hover:bg-[#1e1f38] dark:hover:text-[#D8F380]"
                        >
                            {label}
                        </a>
                    ))}

                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className="mt-2 block rounded-xl bg-[#5E4BF2] px-3 py-2.5 text-center text-sm font-bold text-white"
                    >
                        {auth.user ? t('landing.nav.dashboard', 'Dashboard') : t('landing.nav.login', 'Masuk')}
                    </Link>
                </div>
            )}
        </>
    );
}
