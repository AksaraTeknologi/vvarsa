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
        const hero = document.querySelector<HTMLElement>('.hero-gradient');
        if (!hero) return;

        let frame = 0;
        const startedAt = performance.now();
        const moveGradient = (now: number) => {
            const progress = (now - startedAt) / 420;
            const position = 50 + Math.sin(progress) * 50;
            const oppositePosition = 100 - position;
            const slowPosition = 50 + Math.sin(progress * 0.65) * 50;
            hero.style.backgroundPosition = `${position}% 50%, ${oppositePosition}% 50%, ${slowPosition}% 50%`;
            document.querySelectorAll<HTMLElement>('.hero-orb').forEach((orb, index) => {
                const phase = progress + index * 1.7;
                orb.style.transform = `translate3d(${Math.sin(phase) * 70}px, ${Math.cos(phase) * 45}px, 0) scale(${1 + Math.sin(phase) * 0.08})`;
            });
            frame = requestAnimationFrame(moveGradient);
        };

        frame = requestAnimationFrame(moveGradient);
        return () => cancelAnimationFrame(frame);
    }, []);

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
                .bg-drift { animation: driftSlow 2.5s ease-in-out infinite; will-change: transform; }
                .bg-grid { animation: gridShift 24s linear infinite; }
                .hero-gradient { background-size: 220% 220%; animation: gradientShift 1.8s ease-in-out infinite; }
                .green-flow { background-size: 200% 100%; animation: greenFlow 3.2s linear infinite; }
                .hero-orb { will-change: transform; }
                .reveal-hidden { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
                .reveal-visible { opacity: 1; transform: translateY(0); }
                .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
                .animate-float { animation: floatSlow 5s ease-in-out infinite; }
                .animate-float-delay { animation: floatDelay 6.5s ease-in-out infinite; }
                .animate-float-delay-2 { animation: floatDelay 7.2s ease-in-out infinite reverse; }
                .animate-sway { animation: sway 7s ease-in-out infinite; }
                .animate-glow { animation: glowPulse 4s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .landing-motion .bg-drift { animation: driftSlow 2.5s ease-in-out infinite !important; }
                    .landing-motion .hero-gradient { animation: gradientShift 1.8s ease-in-out infinite !important; }
                }
            `}</style>

            <div className="landing-motion relative min-h-screen overflow-x-hidden bg-[linear-gradient(120deg,#f7fff9_0%,#ffffff_30%,#e5f7ea_54%,#ffffff_78%,#effbf2_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#b9e8c7] selection:text-[#17182A]">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="green-flow absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(113,194,132,0.12)_24%,rgba(255,255,255,0.58)_43%,rgba(113,194,132,0.16)_62%,transparent_82%)]" />
                    <div className="bg-drift absolute -left-16 top-20 h-[26rem] w-[26rem] rounded-full bg-[#9edcaf]/50 blur-3xl" />
                    <div className="bg-drift absolute -right-12 top-32 h-[28rem] w-[28rem] rounded-full bg-[#d8f3e0]/60 blur-3xl [animation-delay:1s]" />
                    <div className="bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-white/80 blur-3xl [animation-delay:2s]" />
                    <div
                        className="bg-grid absolute inset-0 opacity-60"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(53,145,79,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(53,145,79,0.07) 1px, transparent 1px)',
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
