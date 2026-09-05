import{K as f,r as n,j as e,L as d}from"./app-CV1-Ju8z.js";import{F as p}from"./toast-D93tb7xE.js";import{Header as c}from"./Header-BH6zNHyh.js";import{Hero as u}from"./Hero-BwxK6Pza.js";import{Benefits as x}from"./Benefits-ZJ1ZDsKl.js";import{Features as g}from"./Features-NnrOWsPS.js";import{HowItWorks as h}from"./HowItWorks-E5mRyzf1.js";import{MoreBenefits as b}from"./MoreBenefits-BRSgXSjz.js";import{Stats as j}from"./Stats-BCgwzzRP.js";import{Testimonials as v}from"./Testimonials-2XZyCUk5.js";import{Pricing as y}from"./Pricing-DoTgUgZz.js";import{FinalCta as w}from"./FinalCta-LhmtfsGm.js";import"./app-DPy2se2H.js";import"./chef-hat-npvtp8Ax.js";import"./createLucideIcon-BgOqmyOR.js";import"./arrow-right-_jXeW-8n.js";import"./x-DdyfyM-w.js";import"./star-DPLqjSSE.js";import"./bell-Dpnv3-FJ.js";import"./trending-up-zNpkAfc8.js";import"./package-DhtSqFR_.js";import"./check-DFSQ7cvp.js";import"./boxes-CrCawGsj.js";import"./chart-column-DIru_mqI.js";import"./chevron-right-D5FMaivO.js";import"./sparkles-DLAaK0Jr.js";import"./crown-QprGz5BD.js";function G(){const{auth:a}=f().props,s=a.user?route("dashboard"):route("register"),[l,m]=n.useState(!0);return n.useEffect(()=>{const r=document.querySelectorAll("[data-reveal]"),t=new IntersectionObserver(o=>{o.forEach(i=>{i.isIntersecting&&(i.target.classList.add("reveal-visible"),t.unobserve(i.target))})},{threshold:.12});return r.forEach(o=>t.observe(o)),()=>t.disconnect()},[]),n.useEffect(()=>{const r=window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 768px)"),t=()=>m(!r.matches);return t(),r.addEventListener("change",t),()=>r.removeEventListener("change",t)},[]),e.jsxs(e.Fragment,{children:[e.jsx(p,{}),e.jsxs(d,{title:"VVARSA — Kelola Bisnis Jadi Seru & Rapi",children:[e.jsx("link",{rel:"preconnect",href:"https://fonts.googleapis.com"}),e.jsx("link",{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"}),e.jsx("link",{href:"https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap",rel:"stylesheet"})]}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#FDFBFF_0%,#F5F2EE_28%,#F0EEE9_100%)] font-['Plus_Jakarta_Sans'] text-[#17182A] selection:bg-[#D8F380] selection:text-[#17182A]",children:[e.jsxs("div",{className:"pointer-events-none absolute inset-0 overflow-hidden",children:[e.jsx("div",{className:"bg-drift absolute -left-16 top-20 h-[26rem] w-[26rem] rounded-full bg-[#C9C2FF]/35 blur-3xl"}),e.jsx("div",{className:"bg-drift absolute -right-12 top-32 h-[28rem] w-[28rem] rounded-full bg-[#D8F380]/25 blur-3xl [animation-delay:2s]"}),e.jsx("div",{className:"bg-drift absolute bottom-0 left-1/2 h-[20rem] w-[34rem] -translate-x-1/2 rounded-full bg-[#F5D9C7]/30 blur-3xl [animation-delay:4s]"}),e.jsx("div",{className:"bg-grid absolute inset-0 opacity-60",style:{backgroundImage:"linear-gradient(rgba(94,75,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,75,242,0.06) 1px, transparent 1px)",backgroundSize:"40px 40px"}})]}),e.jsxs("div",{className:"relative z-10",children:[e.jsx(c,{auth:a,goToDashboard:s}),e.jsxs("main",{children:[e.jsx(u,{auth:a,goToDashboard:s}),e.jsx(x,{}),e.jsx(g,{autoRotate:l}),e.jsx(h,{}),e.jsx(b,{}),e.jsx(j,{}),e.jsx(v,{}),e.jsx(y,{auth:a,goToDashboard:s}),e.jsx(w,{auth:a,goToDashboard:s})]})]})]})]})}export{G as default};
