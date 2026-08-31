import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link, usePage } from '@inertiajs/react';
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
            className={`relative flex w-full max-w-[430px] flex-col items-center select-none pt-12 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isActive
                    ? 'opacity-100 scale-100 blur-0 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 blur-sm translate-y-4 pointer-events-none'
            }`}
        >
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full bg-white/5 blur-[120px] pointer-events-none" />

            {/* Container Card Putih / Light Card */}
            <div className="relative z-10 w-full overflow-hidden rounded-[2.5rem] bg-[#f8fafc] p-20 shadow-2xl ring-1 ring-white/20">

                {/* Mini Top Bar Dekoratif */}
                <div className="mb-4 flex items-center justify-between px-2">
                    <div className="flex gap-1.5">
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                        <div className="size-2.5 rounded-full bg-neutral-300" />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                        {label}
                    </span>
                </div>

                {/* dotLottie Player */}
                <div className="flex w-full items-center justify-center">
                    <DotLottieReact
                        src="/animation/auth/Login.lottie"
                        autoplay
                        loop
                        className="w-full h-auto scale-[2.5] translate-y-10"
                    />
                </div>
            </div>

            {/* Tagline Badge */}
            <div className="mt-5 text-center">
                <span className="inline-block rounded-full bg-neutral-900/90 border border-neutral-800 px-4 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-md shadow-lg">
                    ✦ Login & Register Experience
                </span>
            </div>
        </div>
    );
}

export default function AuthSplitLayout({
    children,
    title,
    description,
    reverse = false
}: PropsWithChildren<AuthSplitLayoutProps>) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative min-h-dvh w-full overflow-hidden bg-black font-sans antialiased">

            {/* =========================================================================
                1. BACKGROUND VISUAL (FADING LOTTIE CONTENT)
               ========================================================================= */}
            <div className="hidden lg:grid grid-cols-2 h-dvh w-full absolute inset-0 z-0">

                {/* Sisi Kiri (Tampilan saat form di kanan / Login) */}
                <div className="relative h-full flex flex-col justify-between p-12 text-white border-r border-neutral-900 overflow-hidden bg-black">
                    <Link href={route('home')} className="relative z-20 flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 backdrop-blur-md">
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
                            <blockquote className="space-y-2 border-l-2 border-neutral-800 pl-4">
                                <p className="text-sm font-normal text-neutral-400">&ldquo;{quote.message}&rdquo;</p>
                                <footer className="text-xs font-medium text-neutral-600">{quote.author}</footer>
                            </blockquote>
                        </div>
                    )}
                </div>

                {/* Sisi Kanan (Tampilan saat form meluncur ke kiri / Register) */}
                <div className="relative h-full flex flex-col justify-between p-12 text-white overflow-hidden bg-black">
                    <div className="relative z-20 flex justify-end">
                        <Link href={route('home')} className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80">
                            <span>{name}</span>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 backdrop-blur-md">
                                <AppLogoIcon className="size-6 fill-current text-white" />
                            </div>
                        </Link>
                    </div>

                    {/* Lottie Card dengan Fade State & Register Access */}
                    <div className="relative z-10 mt-auto mb-6 flex w-full justify-center">
                        <LottieVisual label="REGISTER ACCESS" isActive={reverse} />
                    </div>

                    <div className={`relative z-20 mt-auto text-right transition-opacity duration-700 ${reverse ? 'opacity-100' : 'opacity-0'}`}>
                        <blockquote className="space-y-2 border-r-2 border-neutral-800 pr-4">
                            <p className="text-sm font-normal text-neutral-400">&ldquo;Improve your warehouse efficiency. Explore our system's features and sign up for full access.&rdquo;</p>
                            <footer className="text-xs font-medium text-neutral-600">{name} Team</footer>
                        </blockquote>
                    </div>
                </div>

            </div>

            {/* =========================================================================
                2. PANEL FORM PUTIH (ROUNDED & FULL SLIDE ANIMATION TETAP AKTIF)
               ========================================================================= */}
            <div
                className={`relative z-20 flex min-h-dvh w-full items-center justify-center bg-white p-6 shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-1/2 lg:p-12 ${
                    reverse
                        ? 'lg:-translate-x-full lg:rounded-r-[2.5rem] lg:rounded-l-none' // Meluncur ke kiri (Register)
                        : 'lg:translate-x-0 lg:rounded-l-[2.5rem] lg:rounded-r-none'      // Tetap di kanan (Login)
                }`}
            >
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">

                    {/* Mobile Logo */}
                    <Link href={route('home')} className="relative z-20 flex items-center justify-center lg:hidden">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-black shadow-md shadow-black/30">
                            <AppLogoIcon className="size-7 fill-current text-white" />
                        </div>
                    </Link>

                    {/* Form Header */}
                    <div className="flex flex-col items-start gap-1.5 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">{title}</h1>
                        {description && (
                            <p className="text-sm text-balance text-neutral-500">{description}</p>
                        )}
                    </div>

                    {/* Inputs & Controls */}
                    <div className="w-full text-neutral-900
                        [&_label]:text-neutral-900 [&_label]:font-medium
                        [&_input]:rounded-xl [&_input]:border-neutral-300 [&_input]:bg-white [&_input]:text-neutral-900 [&_input]:placeholder:text-neutral-400 [&_input]:focus:border-black [&_input]:focus:ring-black/10
                        [&_a]:text-black [&_a]:font-semibold [&_a]:hover:text-neutral-700 [&_a]:hover:underline
                        [&_input[type=checkbox]]:rounded [&_input[type=checkbox]]:border-neutral-300 [&_input[type=checkbox]]:text-black [&_input[type=checkbox]]:focus:ring-black
                        [&_p.text-muted-foreground]:text-neutral-500
                    ">
                        {children}
                    </div>

                </div>
            </div>

        </div>
    );
}
