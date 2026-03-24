import React from 'react';

const patients = [
    {
        name: 'Emily Watson',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
        condition: 'Post-surgery recovery',
        time: '9:00 AM',
        status: 'Stable',
        statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        name: 'James Miller',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        condition: 'Cardiac monitoring',
        time: '10:30 AM',
        status: 'Critical',
        statusColor: 'bg-rose-100 text-rose-700',
    },
    {
        name: 'Sophia Lee',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
        condition: 'Diabetes checkup',
        time: '11:00 AM',
        status: 'Stable',
        statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
        name: 'David Park',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
        condition: 'Respiratory therapy',
        time: '1:30 PM',
        status: 'Observing',
        statusColor: 'bg-amber-100 text-amber-700',
    },
    {
        name: 'Maria Garcia',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
        condition: 'Prenatal visit',
        time: '3:00 PM',
        status: 'Stable',
        statusColor: 'bg-emerald-100 text-emerald-700',
    },
];

export default function PatientList() {
    return (
        <div className="p-5 rounded-2xl glass overflow-hidden transition-all duration-500 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.08)]">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Today's Patients</h3>
                    <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">Scheduled for today</p>
                </div>
                <button className="text-[12px] font-bold text-violet-600 hover:text-violet-700 transition-colors">View All</button>
            </div>

            <div className="space-y-3">
                {patients.map((patient, i) => (
                    <div key={i} className="group flex items-center gap-4 p-3 rounded-xl bg-white/30 border border-white/20 hover:bg-white/60 hover:shadow-sm transition-all duration-300 cursor-pointer">
                        <img
                            src={patient.image}
                            alt={patient.name}
                            className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-bold text-[#1e1b32] truncate">{patient.name}</div>
                            <div className="text-[11px] text-[#a09cb5] font-medium truncate">{patient.condition}</div>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-[11px] font-semibold text-[#6b6490] mb-1">{patient.time}</div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${patient.statusColor}`}>
                                {patient.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
