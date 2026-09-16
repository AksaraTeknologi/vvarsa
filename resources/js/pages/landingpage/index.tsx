import { FlashMessageToaster } from '@/lib/toast';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { Benefits } from './Benefits';
import { Features } from './Features';
import { FinalCta } from './FinalCta';
import { Header } from './Header';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { MoreBenefits } from './MoreBenefits';
import { Pricing } from './Pricing';
import { Stats } from './Stats';
import { Testimonials } from './Testimonials';

export default function LandingPage() {
    const { auth } = usePage<SharedData>().props;
    const goToDashboard = auth.user ? route('dashboard') : route('register');
    const [featureAutoRotate, setFeatureAutoRotate] = useState(true);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12 },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)');
        const syncMotionMode = () => setFeatureAutoRotate(!mediaQuery.matches);

        syncMotionMode();
        mediaQuery.addEventListener('change', syncMotionMode);
        return () => mediaQuery.removeEventListener('change', syncMotionMode);
    }, []);

    return (
        <>
            <FlashMessageToaster />
            <Head title="VVARSA — Kelola Bisnis Jadi Seru &amp; Rapi">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                @keyframes driftSlow {
                    0% { transform: translate3d(0, 0, 0) scale(1); }
                    25% { transform: translate3d(8%, -6%, 0) scale(1.1); }
                    50% { transform: translate3d(-5%, 7%, 0) scale(0.98); }
                    75% { transform: translate3d(-8%, -4%, 0) scale(1.06); }
                    100% { transform: translate3d(5%, 6%, 0) scale(1); }
                }
                @keyframes gridShift {
                    0% { background-position: 0 0, 0 0; }
                    100% { background-position: 40px 40px, 40px 40px; }
                }
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes greenFlow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes floatDelay {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    50% { transform: translateY(-10px) translateX(6px); }
                }
                @keyframes sway {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(2deg); }
                }
                @keyframes glowPulse {
                    0%, 100% { box-shadow: 0 0 0 rgba(94,75,242,0); }
                    50% { box-shadow: 0 0 28px rgba(94,75,242,0.22); }
                }
                .bg-drift, .bg-grid, .hero-gradient, .green-flow { animation: none; }
                .hero-gradient, .green-flow { background-size: 100% 100%; }
                .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.45s ease, transform 0.45s ease; will-change: auto; }
                .reveal-visible { opacity: 1; transform: translateY(0); }
                .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
                .animate-float { animation: floatSlow 5s ease-in-out infinite; }
                .animate-float-delay { animation: floatDelay 6.5s ease-in-out infinite; }
                .animate-float-delay-2 { animation: floatDelay 7.2s ease-in-out infinite reverse; }
                .animate-sway { animation: sway 7s ease-in-out infinite; }
                .animate-glow { animation: glowPulse 4s ease-in-out infinite; }
            `}</style>

            <div className="landing-motion relative min-h-screen overflow-x-hidden bg-[linear-gradient(120deg,#f7fff9_0%,#ffffff_30%,#e5f7ea_54%,#ffffff_78%,#effbf2_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#b9e8c7] selection:text-[#17182A]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="green-flow absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(113,194,132,0.12)_24%,rgba(255,255,255,0.58)_43%,rgba(113,194,132,0.16)_62%,transparent_82%)]" />
                    <div className="bg-drift absolute top-20 -left-16 h-[26rem] w-[26rem] rounded-full bg-[#9edcaf]/50 blur-3xl" />
                    <div className="bg-drift absolute top-32 -right-12 h-[28rem] w-[28rem] rounded-full bg-[#d8f3e0]/60 blur-3xl [animation-delay:1s]" />
                    <div className="bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/80 blur-3xl [animation-delay:2s]" />
                    <div
                        className="bg-grid absolute inset-0 opacity-60"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(53,145,79,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(53,145,79,0.07) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative z-10">
                    <Header auth={auth} goToDashboard={goToDashboard} />
                    <main>
                        <Hero auth={auth} goToDashboard={goToDashboard} />
                        <Benefits />
                        <Features autoRotate={featureAutoRotate} />
                        <HowItWorks />
                        <MoreBenefits />
                        <Stats />
                        <Testimonials />
                        <Pricing auth={auth} goToDashboard={goToDashboard} />
                        <FinalCta auth={auth} goToDashboard={goToDashboard} />
                    </main>
                </div>
            </div>
        </>
    );
}
