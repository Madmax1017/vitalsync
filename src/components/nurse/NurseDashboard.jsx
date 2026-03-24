import React, { useState } from 'react';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import TaskBoard from './TaskBoard';
import NursePatientList from './NursePatientList';
import VitalsChart from './VitalsChart';
import PatientDetail from './PatientDetail';

export default function NurseDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    return (
        <div className="flex min-h-screen w-full">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
                <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-pink-300/8 rounded-full blur-[100px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-auto relative z-10">
                {/* Center Column */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <NurseTopBar />

                    <div className="px-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-1">
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Nurse</span> 💊
                        </h1>
                        <p className="text-[14px] text-[#a09cb5] font-medium">You have 5 patients assigned and 5 pending tasks.</p>
                    </div>

                    <TaskBoard />
                    <VitalsChart />
                    <NursePatientList selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
                </div>

                {/* Right Panel */}
                <PatientDetail patient={selectedPatient} />
            </div>
        </div>
    );
}
