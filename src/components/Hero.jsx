import React, { useEffect, useRef, Suspense } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import ThreeDModel from './ThreeDModel';
import { OrbitControls } from "@react-three/drei";

export default function Hero() {
    const heroRef = useRef(null);
    const textRef = useRef(null);
    const btnsRef = useRef(null);
    const modelRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(textRef.current.children, {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from(btnsRef.current.children, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.8
            });

            gsap.from(modelRef.current, {
                scale: 0.8,
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: 'power3.out',
                delay: 0.5
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden px-6 md:px-12 lg:px-24 z-0">

            {/* Ambient Gradient Orbs */}
            <div className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-indigo-400/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-purple-300/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 z-[-2] pointer-events-none">
                <div
                    className="absolute inset-0 bg-[linear-gradient(to_right,#c4b5fd33_1px,transparent_1px),linear-gradient(to_bottom,#c4b5fd33_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.3]"
                    style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)" }}
                ></div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Side: Text & Buttons */}
                <div className="flex flex-col justify-center text-left pt-20 lg:pt-0 xl:pr-10" ref={textRef}>

                    {/* Glassmorphic Badge */}
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full glass w-fit mb-8 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-violet-700 tracking-wide pr-1">VitalSync OS 2.0 is live</span>
                        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#1e1b32] leading-[1.1] mb-6">
                        The ultimate <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-500">healthcare</span> workspace.
                    </h1>

                    {/* Paragraph */}
                    <p className="text-lg md:text-xl text-[#5b5675] max-w-xl mb-10 leading-relaxed font-light">
                        Bring your doctors, administrators, and patient data into one beautiful, unified platform. Built precisely for the modern hospital.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center mb-12" ref={btnsRef}>
                        <button className="group relative inline-flex items-center justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 px-8 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_30px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_12px_40px_-5px_rgba(124,58,237,0.5)]">
                            <span className="relative z-10 tracking-wide transition-transform duration-300 group-hover:-translate-x-1">Start Free Trial</span>
                            <svg className="w-5 h-5 absolute right-4 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        <button className="inline-flex items-center justify-center glass text-[#3b3260] font-semibold py-3.5 px-8 rounded-2xl transition-all duration-300 hover:bg-white/80 active:scale-95 shadow-sm hover:shadow-md">
                            Book a Demo
                        </button>
                    </div>

                    {/* Refined Micro-copy */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-sm border-l-2 border-violet-500/30 pl-4 py-1 text-[#5b5675] font-medium tracking-wide">
                            Seamlessly connecting <span className="font-semibold text-[#1e1b32]">healthcare professionals</span><br />for better patient outcomes.
                        </div>
                    </div>
                </div>

                {/* Right Side: 3D Element */}
                <div className="flex justify-center items-center h-[400px] md:h-[600px] w-full relative" ref={modelRef}>
                    {/* Glow behind 3D model */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                        <div className="w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,rgba(0,0,0,0)_70%)] blur-[40px]" />
                        <div className="absolute w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,rgba(0,0,0,0)_70%)] blur-[30px] translate-x-12 translate-y-8" />
                    </div>
                    <div className="relative z-10 w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-700">
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-full w-full">
                                <div className="w-16 h-16 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        }>
                            <ThreeDModel />
                        </Suspense>
                    </div>
                </div>
            </div>
        </section>
    );
}
