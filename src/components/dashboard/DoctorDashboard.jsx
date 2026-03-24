import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import StatsCards from './StatsCards';
import Charts from './Charts';
import PatientList from './PatientList';
import SchedulePanel from './SchedulePanel';

export default function DoctorDashboard() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-400/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-400/8 rounded-full blur-[140px]" />
                <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-purple-300/10 rounded-full blur-[100px]" />
            </div>

            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-auto relative z-10">
                {/* Center Column */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <TopBar />

                    {/* Greeting */}
                    <div className="px-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-1">
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Doctor</span> 👋
                        </h1>
                        <p className="text-[14px] text-[#a09cb5] font-medium">Here's your day at a glance. You have 8 appointments today.</p>
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
