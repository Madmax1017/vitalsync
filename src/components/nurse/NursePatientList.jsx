import React from 'react';

const patients = [
    { id: 1, name: 'James Miller', room: '401A', condition: 'Cardiac arrest recovery', status: 'Critical', statusColor: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
    { id: 2, name: 'Emily Watson', room: '204A', condition: 'Post hip surgery', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
    { id: 3, name: 'Sophia Lee', room: '208B', condition: 'Type 2 diabetes', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
    { id: 4, name: 'David Park', room: '310B', condition: 'Pneumonia treatment', status: 'Observing', statusColor: 'bg-amber-100 text-amber-700', dotColor: 'bg-amber-500' },
    { id: 5, name: 'Maria Garcia', room: '115C', condition: 'Prenatal care', status: 'Stable', statusColor: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
];

export default function NursePatientList({ selectedPatient, setSelectedPatient }) {
    return (
        <div className="p-5 rounded-2xl glass">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Assigned Patients</h3>
                    <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">{patients.length} patients in your care</p>
                </div>
            </div>

            <div className="space-y-2">
                {patients.map((p) => (
                    <div
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${selectedPatient?.id === p.id
                                ? 'bg-white/70 border-rose-200/50 shadow-sm'
                                : 'bg-white/30 border-white/20 hover:bg-white/60 hover:shadow-sm'
                            }`}
                    >
                        <div className="relative shrink-0">
                            <div className={`w-2 h-2 rounded-full ${p.dotColor} absolute -top-0.5 -right-0.5 z-10`} />
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center text-[13px] font-extrabold text-[#3b3260]">
                                {p.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-bold text-[#1e1b32] truncate">{p.name}</div>
                            <div className="text-[10px] text-[#a09cb5] font-medium">Rm {p.room} · {p.condition}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${p.statusColor}`}>{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
