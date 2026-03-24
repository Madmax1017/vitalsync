import React from 'react';

export default function AboutVisual() {
    return (
        <div className="relative w-full max-w-md mx-auto group" style={{ animation: 'float-gentle 4s ease-in-out infinite' }}>
            {/* Ambient glow */}
            <div className="absolute -inset-8 bg-violet-400/15 rounded-[3rem] blur-[60px] pointer-events-none" />
            <div className="absolute -inset-8 bg-indigo-400/10 rounded-[3rem] blur-[80px] pointer-events-none translate-x-8 translate-y-8" />

            {/* Main Dashboard Card */}
            <div className="relative glass-strong rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(124,58,237,0.12)] p-6 transition-all duration-700 hover:shadow-[0_30px_80px_-15px_rgba(124,58,237,0.2)] hover:-translate-y-1 overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-[#1e1b32] tracking-tight">Hospital Overview</div>
                            <div className="text-[11px] text-[#6b6490] font-medium">Live Dashboard</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-white/50 rounded-xl p-3 border border-white/40">
                        <div className="text-[10px] font-bold text-[#6b6490] uppercase tracking-wider mb-1">Patients</div>
                        <div className="text-xl font-extrabold text-[#1e1b32] tracking-tight">1,284</div>
                        <div className="flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                        </div>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 border border-white/40">
                        <div className="text-[10px] font-bold text-[#6b6490] uppercase tracking-wider mb-1">Beds</div>
                        <div className="text-xl font-extrabold text-[#1e1b32] tracking-tight">89%</div>
                        <div className="flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            <span className="text-[10px] font-bold text-amber-600">+3%</span>
                        </div>
                    </div>
                    <div className="bg-white/50 rounded-xl p-3 border border-white/40">
                        <div className="text-[10px] font-bold text-[#6b6490] uppercase tracking-wider mb-1">Staff</div>
                        <div className="text-xl font-extrabold text-[#1e1b32] tracking-tight">342</div>
                        <div className="flex items-center gap-1 mt-1">
                            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                            <span className="text-[10px] font-bold text-violet-600">Active</span>
                        </div>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="relative h-[80px] w-full rounded-xl bg-white/40 border border-white/30 overflow-hidden mb-5">
                    <div className="absolute top-3 left-3">
                        <div className="text-[10px] font-bold text-[#6b6490] uppercase tracking-wider">Weekly Admissions</div>
                    </div>
                    <svg className="absolute bottom-0 w-full h-[55px] text-violet-500/12" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L8,14 L16,16 L24,8 L32,12 L40,6 L48,10 L56,4 L64,9 L72,7 L80,11 L88,5 L96,8 L100,6 L100,20 Z" fill="currentColor" />
                    </svg>
                    <svg className="absolute bottom-0 w-full h-[55px] text-violet-500" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L8,14 L16,16 L24,8 L32,12 L40,6 L48,10 L56,4 L64,9 L72,7 L80,11 L88,5 L96,8 L100,6" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" opacity="0.4" />
                    </svg>
                </div>

                {/* Recent Activity */}
                <div className="space-y-2.5">
                    <div className="text-[10px] font-bold text-[#6b6490] uppercase tracking-wider mb-2">Recent Activity</div>
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-2.5 border border-white/40">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                            <div className="h-2 w-28 bg-violet-200 rounded-full"></div>
                            <div className="h-1.5 w-16 bg-violet-100 rounded-full"></div>
                        </div>
                        <div className="text-[9px] font-medium text-[#6b6490] shrink-0">2m ago</div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/30 rounded-lg p-2.5 border border-white/25">
                        <div className="w-7 h-7 rounded-full bg-violet-50 flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                            <div className="h-2 w-24 bg-violet-200 rounded-full"></div>
                            <div className="h-1.5 w-20 bg-violet-100 rounded-full"></div>
                        </div>
                        <div className="text-[9px] font-medium text-[#6b6490] shrink-0">5m ago</div>
                    </div>
                </div>
            </div>

            {/* Floating accent cards behind */}
            <div className="absolute -bottom-4 -right-4 w-[70%] h-[40%] bg-violet-200/40 rounded-[1.5rem] border border-violet-200/20 -z-10 blur-[1px]" />
            <div className="absolute -top-3 -left-3 w-[50%] h-[30%] bg-indigo-200/30 rounded-[1.5rem] border border-indigo-200/20 -z-10 blur-[1px]" />
        </div>
    );
}
