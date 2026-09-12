import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { type LandingProps } from './types';

const navItems = [
    ['Manfaat', '#manfaat'],
    ['Fitur', '#produk'],
    ['Cara Kerja', '#cara-kerja'],
    ['Paket', '#paket'],
    ['Cerita', '#cerita'],
] as const;

export function Header({ auth }: LandingProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#E7E3FA] bg-white/85 backdrop-blur-xl">
                <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
                    <Link
                        href={route('home')}
                        className="group flex items-center gap-2.5"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-[#5E4BF2] p-1.5 text-white shadow-md shadow-[#5E4BF2]/25 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                            <AppLogoIcon className="size-full object-contain" />
                        </span>

                        <div>
                            <div className="text-lg font-black tracking-tight leading-none">
                                VVAR<span className="text-[#5E4BF2]">SA</span>
                            </div>

                            <div className="text-[8px] font-black uppercase tracking-[0.18em] text-[#9693AA]">
                                Business Suite
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navItems.map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#53556A] transition hover:bg-[#F1EFFD] hover:text-[#5E4BF2]"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-2 md:flex">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border border-[#5E4BF2] px-3 py-1.5 text-xs font-bold text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-3 py-1.5 text-xs font-bold text-[#35364A] transition hover:text-[#5E4BF2]"
                                >
                                    Masuk
                                </Link>

                                <Button asChild variant="owner" size="sm" className="group !h-7 !px-3 !py-1 rounded-full text-[9px] !font-semibold shadow-md shadow-[#5E4BF2]/20 transition hover:-translate-y-0.5">
                                    <Link href={route('register')} className="inline-flex items-center gap-1">
                                        Mulai Gratis
                                        <ArrowRight className="inline size-3 transition group-hover:translate-x-0.5" />
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-2xl bg-[#F1EFFD] p-2.5 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                    </button>
                </div>
            </header>

            {menuOpen && (
                <div className="sticky top-[68px] z-40 mx-4 mt-2 rounded-3xl border border-[#E7E3FA] bg-white p-3 shadow-2xl md:hidden">
                    {navItems.map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-[#F1EFFD]"
                        >
                            {label}
                        </a>
                    ))}

                    <Link
                        href={
                            auth.user
                                ? route('dashboard')
                                : route('login')
                        }
                        className="mt-2 block rounded-xl bg-[#5E4BF2] px-3 py-2.5 text-center text-sm font-bold text-white"
                    >
                        {auth.user ? 'Dashboard' : 'Masuk'}
                    </Link>
                </div>
            )}
        </>
    );
}
