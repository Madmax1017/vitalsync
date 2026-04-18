import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import StatsCards from './StatsCards';
import Charts from './Charts';
import PatientList from './PatientList';
import SchedulePanel from './SchedulePanel';

export default function DoctorDashboard() {
    const [collapsed, setCollapsed] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = localStorage.getItem('role') || 'doctor';
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const nameStr = user.name?.split(' ')[0] || 'Doctor';
    const prefix = role === 'doctor' && !nameStr.toLowerCase().startsWith('dr') ? 'Dr. ' : '';

    return (
        <div className="flex min-h-screen w-full bg-[#F8FAFC]">
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 md:p-8 overflow-auto relative z-10 w-full max-w-[1600px] mx-auto">
                {/* Center Column */}
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    <TopBar />

                    {/* Greeting */}
                    <div className="px-1 mt-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-800 mb-1">
                            {timeGreeting}, {prefix}{nameStr}
                        </h1>
                        <p className="text-[14px] text-slate-500 font-medium">Here's your overview for today.</p>
                    </div>

                    <StatsCards />
                    <Charts />
                    <PatientList />
                </div>

                {/* Right Panel */}
                <SchedulePanel />
            </div>
        </div>
    );
}
