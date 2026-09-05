import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { type PropsWithChildren } from 'react';

interface AuthSplitLayoutProps {
    title?: string;
    description?: string;
    reverse?: boolean;
}

interface LottieVisualProps {
    label: string;
    isActive: boolean;
}

function LottieVisual({ label, isActive }: LottieVisualProps) {
    return (
        <div
            className={`relative flex w-full max-w-[430px] flex-col items-center pt-12 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] select-none ${
                isActive
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-y-4 scale-95 opacity-0'
            }`}
        >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

            {/* Container Card Putih / Light Card */}
            <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] bg-[#f8fafc] p-20 shadow-2xl ring-1 ring-white/20">
                {/* Mini Top Bar Dekoratif */}
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex gap-1.5">
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">{label}</span>
                </div>

                {/* dotLottie Player */}
                <div className="flex w-full items-center justify-center">
                    <DotLottieReact src="/animation/auth/Login.lottie" autoplay loop className="h-auto w-full translate-y-10 scale-[2.5]" />
                </div>
            </div>

            {/* Tagline Badge */}
            <div className="mt-5 text-center">
                <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 shadow-lg backdrop-blur-md">
                    ✦ Login & Register Experience
                </span>
            </div>
        </div>
    );
}


export default function AuthSplitLayout({ children, title, description, reverse = false }: PropsWithChildren<AuthSplitLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-dvh w-full overflow-hidden bg-purple font-sans antialiased">
                {/* =========================================================================
                1. BACKGROUND VISUAL (FADING LOTTIE CONTENT)
               ========================================================================= */}
            <div className="absolute inset-0 z-0 hidden h-dvh w-full grid-cols-2 lg:grid">
                {/* Sisi Kiri (Tampilan saat form di kanan / Login) */}
                <div className="relative flex h-full flex-col justify-between overflow-hidden border-r border-white/10 bg-purple p-12 text-white">
                    <Link
                        href={route('home')}
                        className="relative z-20 flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
                    >
                        <div className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        </div>
                        <span>{name}</span>
                    </Link>

                    {/* Lottie Card dengan Fade State & Login Access */}
                    <div className="relative z-10 mt-auto mb-6 flex w-full justify-center">
                        <LottieVisual label="LOGIN ACCESS" isActive={!reverse} />
                    </div>

                    {quote && (
                        <div className={`relative z-20 mt-auto transition-opacity duration-700 ${!reverse ? 'opacity-100' : 'opacity-0'}`}>
                            <blockquote className="space-y-2 border-l-2 border-white/20 pl-4">
                                <p className="text-sm font-normal text-white/60">&ldquo;{quote.message}&rdquo;</p>
                                <footer className="text-xs font-medium text-white/40">{quote.author}</footer>
                            </blockquote>
                        </div>
                    )}
                </div>

                {/* Sisi Kanan (Tampilan saat form meluncur ke kiri / Register) */}
                <div className="relative flex h-full flex-col justify-between overflow-hidden bg-purple p-12 text-white">
                    <div className="relative z-20 flex justify-end">
                        <Link
                            href={route('home')}
                            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
                        >
                            <span>{name}</span>
                            <div className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
                                <AppLogoIcon className="size-6 fill-current text-white" />
                            </div>
                        </Link>
                    </div>

                    {/* Lottie Card dengan Fade State & Register Access */}
                    <div className="relative z-10 mt-auto mb-6 flex w-full justify-center">
                        <LottieVisual label="REGISTER ACCESS" isActive={reverse} />
                    </div>

                    <div className={`relative z-20 mt-auto text-right transition-opacity duration-700 ${reverse ? 'opacity-100' : 'opacity-0'}`}>
                        <blockquote className="space-y-2 border-r-2 border-white/20 pr-4">
                            <p className="text-sm font-normal text-white/60">
                                &ldquo;Improve your warehouse efficiency. Explore our system's features and sign up for full access.&rdquo;
                            </p>
                            <footer className="text-xs font-medium text-white/40">{name} Team</footer>
                        </blockquote>
                    </div>
                </div>
            </div>

            <div
                className={`relative z-20 flex min-h-dvh w-full items-center justify-center bg-white p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2 lg:p-12 ${
                    reverse
                        ? 'lg:-translate-x-full lg:rounded-l-none lg:rounded-r-[2.5rem]' // Meluncur ke kiri (Register)
                        : 'lg:translate-x-0 lg:rounded-l-[2.5rem] lg:rounded-r-none' // Tetap di kanan (Login)
                }`}
            >
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
                    {/* Mobile Logo */}
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-purple shadow-md shadow-purple/30">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </div>
                    </Link>

                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-1.5 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-3xl">{title}</h1>
                        {description && <p className="text-sm text-balance text-neutral-500">{description}</p>}
                    </div>

                    {/* Inputs & Controls */}
                    <div className="w-full text-neutral-900 [&_a]:font-semibold [&_a]:text-purple [&_a]:hover:text-purple/70 [&_a]:hover:underline [&_input]:rounded-xl [&_input]:border-neutral-300 [&_input]:bg-white [&_input]:text-neutral-900 [&_input]:placeholder:text-neutral-400 [&_input]:focus:border-purple [&_input]:focus:ring-purple/10 [&_input[type=checkbox]]:rounded [&_input[type=checkbox]]:border-neutral-300 [&_input[type=checkbox]]:text-purple [&_input[type=checkbox]]:focus:ring-purple [&_label]:font-medium [&_label]:text-neutral-900 [&_p.text-muted-foreground]:text-neutral-500">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
