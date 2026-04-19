import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LuStethoscope, LuHeartPulse, LuLayoutDashboard, LuUser } from 'react-icons/lu';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const roles = [
    {
        title: 'Doctor Dashboard',
        description: 'Manage patients, appointments, and prescriptions from a single, intelligent command center.',
        icon: LuStethoscope,
        link: '/login/doctor',
        gradient: 'from-violet-500 to-indigo-500',
        iconBg: 'bg-violet-100',
        iconColor: 'text-violet-600',
        glowColor: 'rgba(139, 92, 246, 0.4)',
    },
    {
        title: 'Nurse Dashboard',
        description: 'Coordinate tasks, track vitals, and manage patient workflows in real time.',
        icon: LuHeartPulse,
        link: '/login/nurse',
        gradient: 'from-rose-400 to-pink-500',
        iconBg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        glowColor: 'rgba(251, 113, 133, 0.4)',
    },
    {
        title: 'Admin Panel',
        description: 'Oversee hospital operations, staffing, analytics, and system configurations.',
        icon: LuLayoutDashboard,
        link: '/login/admin',
        gradient: 'from-indigo-500 to-purple-500',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600',
        glowColor: 'rgba(99, 102, 241, 0.4)',
    },
    {
        title: 'Patient Portal',
        description: 'Access records, book appointments, and communicate with your care team.',
        icon: LuUser,
        link: '/login/patient',
        gradient: 'from-emerald-400 to-teal-500',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        glowColor: 'rgba(52, 211, 153, 0.15)',
    },
];

export default function NavigationHub() {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(gridRef.current.children,
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 md:py-32 px-6 md:px-12 lg:px-24 relative overflow-hidden z-10">
            {/* Ambient Glows */}
            <div className="absolute top-[15%] right-[-8%] w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[15%] left-[-8%] w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
                    <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full glass shadow-sm w-fit mb-6 mx-auto">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="text-xs font-semibold text-violet-700 tracking-wider uppercase">Get Started</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-[#1e1b32] leading-[1.1] mb-6">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Role</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[#6b6490] font-light leading-relaxed">
                        Select your dashboard to access your personalized workspace within VitalSync.
                    </p>
                </div>

                {/* Role Cards Grid */}
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {roles.map((role, i) => (
                        <Link
                            key={i}
                            to={role.link}
                            className="group relative flex flex-col p-7 rounded-[2rem] glass overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:bg-white/90 hover:shadow-[0_20px_40px_-15px_var(--glow-color)] cursor-pointer no-underline"
                            style={{ '--glow-color': role.glowColor }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: `inset 0 0 0 2px var(--glow-color)` }} />

                            {/* Subtle grid on hover */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#c4b5fd22_1px,transparent_1px),linear-gradient(to_bottom,#c4b5fd22_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_20%,transparent_100%)]" />

                            <div className="relative z-10 flex flex-col h-full">
                                {/* Icon */}
                                <div className={`inline-flex p-4 rounded-[1.25rem] ${role.iconBg} border border-white/50 ${role.iconColor} mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg w-fit`}>
                                    <role.icon className="w-7 h-7 stroke-[1.5]" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-extrabold tracking-tight text-[#1e1b32] mb-2">{role.title}</h3>

                                {/* Description */}
                                <p className="text-[15px] text-[#6b6490] font-medium leading-[1.6] mb-6">{role.description}</p>

                                {/* CTA */}
                                <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-[#6b6490] group-hover:text-violet-600 transition-all duration-500">
                                    <span className="tracking-wide">Enter</span>
                                    <svg className="w-4 h-4 transform transition-transform duration-500 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>

                            {/* Bottom gradient bar */}
                            <div className={`absolute bottom-0 left-0 h-1 w-full opacity-0 scale-x-0 origin-left transition-all duration-500 ease-out group-hover:opacity-80 group-hover:scale-x-100 bg-gradient-to-r ${role.gradient}`} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
