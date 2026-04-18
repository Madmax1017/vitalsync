import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import AdminStatsCards from './AdminStatsCards';
import AdminChartsSection from './AdminChartsSection';
import Admin3DWidget from './Admin3DWidget';

export default function AdminDashboard() {
    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = localStorage.getItem('role') || 'admin';
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    const nameStr = user.name?.split(' ')[0] || 'Admin';
    const prefix = role === 'doctor' && !nameStr.toLowerCase().startsWith('dr') ? 'Dr. ' : '';

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
        <div className="flex min-h-screen w-full bg-[#f8fafc] overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Removed for cleaner SaaS look */}
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
                        <div className="inline-flex items-center gap-2 py-2 px-4 rounded-2xl bg-white border border-slate-100 shadow-sm mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                            <span className="text-[12px] font-bold text-indigo-700 tracking-wider">System Control Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-3 leading-tight">
                            Dashboard <span className="text-indigo-600">Overview</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                            {timeGreeting}, {prefix}{nameStr}. Real-time monitoring for VitalSync systems is stable.
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
                <div className="mt-auto pt-10 pb-4 text-center">
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">
                        Powered by VitalSync Intelligent Workflow Engine © 2026
                    </p>
                </div>
            </main>
        </div>
    );
}
