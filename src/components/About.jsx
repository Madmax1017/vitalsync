import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiMonitor, FiUsers, FiBarChart2, FiZap } from 'react-icons/fi';
import AboutVisual from './AboutVisual';

gsap.registerPlugin(ScrollTrigger);

const bulletPoints = [
    { icon: FiMonitor, text: 'Real-time patient monitoring' },
    { icon: FiUsers, text: 'Seamless staff coordination' },
    { icon: FiBarChart2, text: 'Data-driven hospital insights' },
    { icon: FiZap, text: 'Reduced operational delays' },
];

export default function About() {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const bulletsRef = useRef(null);
    const visualRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(textRef.current.children,
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );

            gsap.fromTo(bulletsRef.current.children,
                { x: -30, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: bulletsRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );

            gsap.fromTo(visualRef.current,
                { y: 40, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );

            gsap.to(visualRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -30,
                ease: 'none'
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden z-10">
            {/* Background Glows */}
            <div className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side */}
                    <div>
                        <div ref={textRef}>
                            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full glass shadow-sm w-fit mb-6">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                <span className="text-xs font-semibold text-violet-700 tracking-wider uppercase">About VitalSync</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tighter text-[#1e1b32] leading-[1.1] mb-6">
                                Built for <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-500">Modern Healthcare</span>
                            </h2>

                            <p className="text-lg md:text-xl text-[#6b6490] font-light leading-relaxed max-w-lg mb-10">
                                VitalSync is a unified digital platform designed to streamline hospital operations by connecting doctors, nurses, administrators, and patients into one intelligent workflow.
                            </p>
                        </div>

                        <div ref={bulletsRef} className="space-y-3">
                            {bulletPoints.map((item, i) => (
                                <div key={i} className="group flex items-center gap-4 p-3 -ml-3 rounded-2xl transition-all duration-300 hover:bg-white/50 hover:shadow-sm hover:backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-xl bg-white/60 border border-white/40 flex items-center justify-center text-[#3b3260] transition-all duration-300 group-hover:bg-violet-100 group-hover:text-violet-600 group-hover:border-violet-200/50 group-hover:scale-110 group-hover:-rotate-3 shrink-0 shadow-sm">
                                        <item.icon className="w-5 h-5 stroke-[1.5]" />
                                    </div>
                                    <span className="text-base font-medium text-[#3b3260] group-hover:text-[#1e1b32] transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div ref={visualRef}>
                        <AboutVisual />
                    </div>

                </div>
            </div>
        </section>
    );
}
