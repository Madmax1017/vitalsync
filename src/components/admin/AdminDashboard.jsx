import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import AdminStatsCards from './AdminStatsCards';
import AdminChartsSection from './AdminChartsSection';
import Admin3DWidget from './Admin3DWidget';

export default function AdminDashboard() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.admin-fade-in', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                clearProps: 'all'
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff] overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-400/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-purple-300/5 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar */}
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative z-10 max-w-[1600px] mx-auto w-full">
                {/* Top Section */}
                <div className="admin-fade-in">
                    <AdminTopBar />
                </div>

                {/* Greeting & Header */}
                <div className="admin-fade-in mt-10 mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 py-2 px-4 rounded-2xl glass-strong border border-white/50 shadow-sm mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse" />
                            <span className="text-[12px] font-black text-violet-700 tracking-widest uppercase">System Control Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1e1b32] mb-3 leading-tight">
                            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600">Overview</span>
                        </h1>
                        <p className="text-lg text-[#6b6490] font-bold opacity-80 max-w-2xl leading-relaxed">
                            Welcome back, {JSON.parse(localStorage.getItem('user') || '{}').name?.split(' ')[0] || 'Admin'}. Real-time monitoring for VitalSync systems is stable. Staff utilization at 82% across all departments.
                        </p>
                    </div>

                    <div className="hidden lg:block shrink-0">
                        <Admin3DWidget />
                    </div>
                </div>

                {/* Content Grid */}
                <div className="admin-fade-in">
                    <AdminStatsCards />
                </div>

                <div className="admin-fade-in">
                    <AdminChartsSection />
                </div>



                {/* Footer Quote / Hint */}
                <div className="mt-auto pt-10 pb-4 border-t border-white/20 text-center">
                    <p className="text-[13px] font-bold text-[#a09cb5] uppercase tracking-[0.2em]">
                        Powered by VitalSync Intelligent Workflow Engine © 2026
                    </p>
                </div>
            </main>
        </div>
    );
}
