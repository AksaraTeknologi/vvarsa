import { Link } from '@inertiajs/react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
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
                <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-10">
                    <Link
                        href={route('home')}
                        className="group flex items-center gap-3"
                    >
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#5E4BF2] p-2 text-white shadow-lg shadow-[#5E4BF2]/25 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                            <AppLogoIcon className="size-full object-contain" />
                        </span>

                        <div>
                            <div className="text-xl font-black tracking-tight">
                                VVAR<span className="text-[#5E4BF2]">SA</span>
                            </div>

                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-[#9693AA]">
                                Business Suite
                            </div>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {navItems.map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className="rounded-full px-4 py-2 text-sm font-bold text-[#53556A] transition hover:bg-[#F1EFFD] hover:text-[#5E4BF2]"
                            >
                                {label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 md:flex">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-full border-2 border-[#5E4BF2] px-5 py-2.5 text-sm font-black text-[#5E4BF2] transition hover:bg-[#5E4BF2] hover:text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2.5 text-sm font-black text-[#35364A] transition hover:text-[#5E4BF2]"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="group rounded-full bg-[#5E4BF2] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#5E4BF2]/25 transition hover:-translate-y-0.5 hover:bg-[#4938D9]"
                                >
                                    Mulai Gratis

                                    <ArrowRight className="ml-1 inline size-4 transition group-hover:translate-x-1" />
                                </Link>
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
                <div className="sticky top-[76px] z-40 mx-4 mt-2 rounded-3xl border border-[#E7E3FA] bg-white p-4 shadow-2xl md:hidden">
                    {navItems.map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-2xl px-4 py-3 font-bold hover:bg-[#F1EFFD]"
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
                        className="mt-2 block rounded-2xl bg-[#5E4BF2] px-4 py-3 text-center font-black text-white"
                    >
                        {auth.user ? 'Dashboard' : 'Masuk'}
                    </Link>
                </div>
            )}
        </>
    );
}
