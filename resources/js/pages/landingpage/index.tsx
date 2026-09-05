import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { FlashMessageToaster } from '@/lib/toast';
import { type SharedData } from '@/types';

import { Header } from './Header';
import { Hero } from './Hero';
import { Benefits } from './Benefits';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { MoreBenefits } from './MoreBenefits';
import { Stats } from './Stats';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FinalCta } from './FinalCta';

export default function LandingPage() {
    const { auth } = usePage<SharedData>().props;
    const goToDashboard = auth.user ? route('dashboard') : route('register');
    const [featureAutoRotate, setFeatureAutoRotate] = useState(true);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)',
        );
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
                    50% { transform: translate3d(2.5%, -2%, 0) scale(1.08); }
                    100% { transform: translate3d(-2%, 2.5%, 0) scale(1.02); }
                }
                @keyframes gridShift {
                    0% { background-position: 0 0, 0 0; }
                    100% { background-position: 40px 40px, 40px 40px; }
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
                .bg-drift { animation: driftSlow 18s ease-in-out infinite alternate; }
                .bg-grid { animation: gridShift 24s linear infinite; }
                .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
                .reveal-visible { opacity: 1; transform: translateY(0); }
                .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
                .animate-float { animation: floatSlow 5s ease-in-out infinite; }
                .animate-float-delay { animation: floatDelay 6.5s ease-in-out infinite; }
                .animate-float-delay-2 { animation: floatDelay 7.2s ease-in-out infinite reverse; }
                .animate-sway { animation: sway 7s ease-in-out infinite; }
                .animate-glow { animation: glowPulse 4s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; } }
            `}</style>

            <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#FDFBFF_0%,#F5F2EE_28%,#F0EEE9_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#D8F380] selection:text-[#17182A]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="bg-drift absolute -left-16 top-20 h-[26rem] w-[26rem] rounded-full bg-[#C9C2FF]/35 blur-3xl" />
                    <div className="bg-drift absolute -right-12 top-32 h-[28rem] w-[28rem] rounded-full bg-[#D8F380]/25 blur-3xl [animation-delay:2s]" />
                    <div className="bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#F5D9C7]/30 blur-3xl [animation-delay:4s]" />
                    <div
                        className="bg-grid absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(94,75,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,75,242,0.06) 1px, transparent 1px)',
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
