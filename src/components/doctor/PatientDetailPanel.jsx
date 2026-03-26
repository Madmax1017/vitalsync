import React, { useState } from 'react';
import { FiX, FiActivity, FiUser, FiMapPin, FiClock, FiPlus, FiClipboard, FiFileText, FiTarget } from 'react-icons/fi';
import AddTaskModal from './AddTaskModal';

export default function PatientDetailPanel({ isOpen, onClose, patient }) {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    if (!patient) return null;

    return (
        <>
            <div
                className={`fixed inset-0 bg-[#0f172a]/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white border-l border-slate-100 shadow-2xl z-[70] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-violet-600 border border-violet-100">
                                <FiUser className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-xl font-extrabold text-[#1e1b32]">{patient.name}</h2>
                                <p className="text-[13px] text-[#64748b] font-medium uppercase tracking-wider">{patient.room} • {patient.age} Yrs</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 transition-all shadow-sm border border-slate-100"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {/* Status Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-wide">
                                    <FiActivity className="w-3.5 h-3.5" />
                                    Condition
                                </div>
                                <div className="text-[15px] font-bold text-[#1e1b32] truncate">{patient.condition}</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400 uppercase tracking-wide">
                                    <FiTarget className="w-3.5 h-3.5" />
                                    Status
                                </div>
                                <div className="inline-flex px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[12px] font-bold">
                                    {patient.status}
                                </div>
                            </div>
                        </div>

                        {/* Vitals */}
                        <div className="space-y-4">
                            <h3 className="text-[14px] font-bold text-[#1e1b32] uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-violet-500 rounded-full" />
                                Current Vitals
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-50 flex flex-col items-center text-center">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Heart Rate</span>
                                    <span className="text-lg font-extrabold text-rose-500 mt-1">{patient.vitals.heartRate}</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-50 flex flex-col items-center text-center">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Blood Pressure</span>
                                    <span className="text-lg font-extrabold text-violet-600 mt-1">{patient.vitals.bp}</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-[#fafafa] border border-slate-50 flex flex-col items-center text-center">
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">Temp</span>
                                    <span className="text-lg font-extrabold text-emerald-500 mt-1">{patient.vitals.temp}</span>
                                </div>
                            </div>
                        </div>

                        {/* Medications */}
                        <div className="space-y-4">
                            <h3 className="text-[14px] font-bold text-[#1e1b32] uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                                Medications
                            </h3>
                            <div className="space-y-2.5">
                                {patient.medications.map((med, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm group hover:border-indigo-100 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            <FiClipboard className="w-5 h-5" />
                                        </div>
                                        <span className="text-[14px] font-bold text-[#334155]">{med}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-4">
                            <h3 className="text-[14px] font-bold text-[#1e1b32] uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
                                Doctor's Notes
                            </h3>
                            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 text-[14px] text-[#64748b] leading-relaxed font-medium italic relative overflow-hidden">
                                <FiFileText className="absolute -bottom-2 -right-2 w-16 h-16 text-amber-500/10 -rotate-12" />
                                "{patient.notes}"
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-50 bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)]">
                        <button
                            onClick={() => setIsAddTaskOpen(true)}
                            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-[15px] hover:shadow-xl hover:shadow-violet-500/20 active:scale-[0.98] transition-all"
                        >
                            <FiPlus className="w-5 h-5 stroke-[3]" />
                            Assign Task
                        </button>
                    </div>
                </div>
            </aside>

            {/* Add Task Modal */}
            <AddTaskModal
                isOpen={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                patientName={patient.name}
                patientId={patient.id}
            />
        </>
    );
}
