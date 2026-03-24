import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    FiUsers,
    FiCheckSquare,
    FiActivity,
    FiPieChart,
    FiCoffee,
    FiCalendar
} from 'react-icons/fi';
import FeatureCard from './FeatureCard';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(gridRef.current.children,
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden z-10 flex justify-center">
            {/* Background orbs */}
            <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto">
                {/* Section Header */}
                <div className="mb-16 md:mb-24 text-left max-w-2xl">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full glass shadow-sm w-fit mb-6">
                        <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                        <span className="text-xs font-semibold text-violet-700 tracking-wider uppercase">Platform Capabilities</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1e1b32] leading-[1.1] mb-6">
                        Everything you need to <br className="hidden md:block" />
                        run a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-400">modern hospital.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#6b6490] font-light leading-relaxed max-w-xl">
                        VitalSync connects all your departments—from the ICU to the cafeteria—into one unified, intelligent workspace.
                    </p>
                </div>

                {/* Bento Grid layout */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(260px,auto)]">

                    {/* Large Feature - Span 2 cols */}
                    <FeatureCard
                        title="Smart Patient Management"
                        description="Access patient histories, vitals, and treatment plans in a unified timeline. AI highlights critical changes instantly."
                        icon={FiUsers}
                        className="md:col-span-2 lg:col-span-2"
                        gradientClass="bg-violet-500"
                    >
                        <div className="relative w-full h-[120px] mt-2 rounded-xl bg-white/40 border border-white/30 backdrop-blur-sm flex flex-col p-3 gap-2 overflow-hidden group-hover:bg-white/50 transition-colors duration-500">
                            <div className="flex items-center justify-between transform transition-all duration-700 group-hover:-translate-y-0.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-violet-100 overflow-hidden border border-white shadow-sm shrink-0">
                                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" alt="Patient" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col gap-1 w-24">
                                        <div className="h-2 w-full bg-[#1e1b32]/60 rounded-full"></div>
                                        <div className="h-1.5 w-16 bg-violet-200 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-5 bg-emerald-50 rounded-full flex items-center gap-1.5 border border-emerald-200/50 px-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[ping_2s_ease-in-out_infinite]"></div>
                                    <div className="h-1 w-5 bg-emerald-600/50 rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[50px] transform transition-all duration-700 group-hover:-translate-y-0.5">
                                <svg className="w-full h-full text-violet-500/15" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,20 L5,15 L10,18 L15,10 L20,15 L25,5 L30,12 L35,8 L40,15 L45,10 L50,14 L55,6 L60,11 L65,4 L70,12 L75,8 L80,15 L85,7 L90,12 L95,5 L100,10 L100,20 Z" fill="currentColor" />
                                </svg>
                                <svg className="absolute inset-0 w-full h-full text-violet-500/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,20 L5,15 L10,18 L15,10 L20,15 L25,5 L30,12 L35,8 L40,15 L45,10 L50,14 L55,6 L60,11 L65,4 L70,12 L75,8 L80,15 L85,7 L90,12 L95,5 L100,10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Real-Time Medication Tracking"
                        description="Track dispensing, monitor patient adherence, and prevent contraindications with real-time alerting."
                        icon={FiActivity}
                        className="lg:col-span-1 lg:row-span-1"
                        gradientClass="bg-emerald-500"
                    />

                    <FeatureCard
                        title="Hospital Analytics"
                        description="Deep insights into bed occupancy, wait times, and department efficiency at a glance."
                        icon={FiPieChart}
                        className="lg:col-span-1 lg:row-span-1"
                        gradientClass="bg-purple-500"
                    />

                    <FeatureCard
                        title="Nurse Task Coordination"
                        description="Route patient requests and treatments to the right staff based on proximity and workload."
                        icon={FiCheckSquare}
                        className="md:col-span-2 lg:col-span-2"
                        gradientClass="bg-indigo-500"
                    >
                        <div className="relative w-full h-[110px] mt-2 rounded-xl bg-white/40 border border-white/30 backdrop-blur-sm flex flex-col p-3 gap-2 overflow-hidden group-hover:bg-white/50 transition-colors duration-500">
                            <div className="w-full bg-white/70 rounded-lg p-2.5 border border-white/40 shadow-sm flex items-center justify-between transform transition-transform duration-700 group-hover:-translate-y-0.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-[8px] shrink-0">AI</div>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-1.5 w-20 bg-violet-200 rounded-full"></div>
                                        <div className="h-1 w-12 bg-violet-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-3 w-8 bg-emerald-100 rounded-full border border-emerald-200/50 shrink-0"></div>
                            </div>
                            <div className="w-full bg-white/40 rounded-lg p-2.5 border border-white/30 flex items-center justify-between transform transition-all duration-700 group-hover:-translate-y-0.5 group-hover:bg-white/60 group-hover:shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 border border-white/40 flex items-center justify-center text-indigo-400 font-bold text-[8px] shrink-0">ICU</div>
                                    <div className="flex flex-col gap-1">
                                        <div className="h-1.5 w-16 bg-indigo-200 rounded-full"></div>
                                        <div className="h-1 w-20 bg-indigo-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-3 w-8 bg-violet-100 rounded-full shrink-0"></div>
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Canteen Integration"
                        description="Dietary tracking integrated directly with hospital kitchen orders."
                        icon={FiCoffee}
                        className="md:col-span-1 lg:col-span-1"
                        gradientClass="bg-orange-500"
                    />

                    <FeatureCard
                        title="Attendance & Leave"
                        description="Streamlined shift management and PTO tracking for all staff."
                        icon={FiCalendar}
                        className="md:col-span-1 lg:col-span-1"
                        gradientClass="bg-rose-500"
                    />

                </div>
            </div>
        </section>
    );
}
