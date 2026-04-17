import React, { useState } from 'react';
import NurseSidebar from './NurseSidebar';
import NursePatientList from './NursePatientList';
import PatientDetail from './PatientDetail';

export default function NursePatientsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9fc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col p-6 lg:p-10 relative z-10 overflow-hidden h-screen">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-2">
                            Patients Overview
                        </h1>
                        <p className="text-[#6b6490] font-medium">Manage and view details of all assigned patients.</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 rounded-3xl glass-strong border border-white/20 shadow-xl p-6">
                        <NursePatientList selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
                    </div>
                    <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 overflow-y-auto rounded-3xl glass-strong border border-white/20 shadow-xl p-6">
                        <PatientDetail patient={selectedPatient} />
                    </div>
                </div>
            </div>
        </div>
    );
}
