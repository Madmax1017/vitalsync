import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import DoctorHero from '../common/DoctorHero';
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

                    <DoctorHero name={user.name} />

                    {/* Bento Grid Content */}
                    <div className="flex flex-col gap-6">
                        <StatsCards />
                        <Charts />
                        <PatientList />
                    </div>
                </div>

                {/* Right Panel */}
                <SchedulePanel />
            </div>
        </div>
    );
}
