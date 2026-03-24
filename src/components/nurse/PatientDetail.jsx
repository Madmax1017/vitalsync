import React from 'react';
import { FiEdit3, FiCheckCircle, FiFileText, FiActivity, FiThermometer, FiHeart } from 'react-icons/fi';

const medications = [
    { name: 'Metoprolol 50mg', schedule: 'Every 12 hrs', next: '2:00 PM' },
    { name: 'Lisinopril 10mg', schedule: 'Once daily', next: '8:00 AM (tomorrow)' },
    { name: 'Aspirin 81mg', schedule: 'Once daily', next: '8:00 AM (tomorrow)' },
];

const notes = [
    { time: '8:30 AM', text: 'Patient reported mild chest discomfort. Vitals stable.' },
    { time: '7:15 AM', text: 'Administered morning medications. No adverse reactions.' },
];

export default function PatientDetail({ patient }) {
    if (!patient) {
        return (
            <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col items-center justify-center gap-3 p-8 rounded-2xl glass min-h-[400px]">
                <div className="w-14 h-14 rounded-2xl bg-white/40 flex items-center justify-center text-[#a09cb5]">
                    <FiActivity className="w-7 h-7 stroke-[1.5]" />
                </div>
                <p className="text-[13px] font-semibold text-[#a09cb5] text-center">Select a patient to view details</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-4">
            {/* Patient Info */}
            <div className="p-5 rounded-2xl glass">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center text-[16px] font-extrabold text-[#3b3260] shadow-sm">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="text-[14px] font-extrabold text-[#1e1b32]">{patient.name}</div>
                        <div className="text-[11px] text-[#6b6490] font-medium">Room {patient.room} · {patient.condition}</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${patient.statusColor}`}>{patient.status}</span>
                    <span className={`w-2 h-2 rounded-full ${patient.dotColor}`} />
                </div>

                {/* Quick Vitals */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-white/40 rounded-lg p-2.5 border border-white/25 text-center">
                        <FiHeart className="w-3.5 h-3.5 text-rose-500 mx-auto mb-1" />
                        <div className="text-[13px] font-extrabold text-[#1e1b32]">74</div>
                        <div className="text-[9px] text-[#a09cb5] font-bold">BPM</div>
                    </div>
                    <div className="bg-white/40 rounded-lg p-2.5 border border-white/25 text-center">
                        <FiActivity className="w-3.5 h-3.5 text-violet-500 mx-auto mb-1" />
                        <div className="text-[13px] font-extrabold text-[#1e1b32]">118/76</div>
                        <div className="text-[9px] text-[#a09cb5] font-bold">BP</div>
                    </div>
                    <div className="bg-white/40 rounded-lg p-2.5 border border-white/25 text-center">
                        <FiThermometer className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
                        <div className="text-[13px] font-extrabold text-[#1e1b32]">98.4</div>
                        <div className="text-[9px] text-[#a09cb5] font-bold">°F</div>
                    </div>
                </div>
            </div>

            {/* Medications */}
            <div className="p-5 rounded-2xl glass">
                <h4 className="text-[13px] font-extrabold text-[#1e1b32] mb-3">Medications</h4>
                <div className="space-y-2">
                    {medications.map((med, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/30 border border-white/20">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[11px] font-bold text-[#1e1b32] truncate">{med.name}</div>
                                <div className="text-[10px] text-[#a09cb5] font-medium">{med.schedule} · Next: {med.next}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className="p-5 rounded-2xl glass flex-1">
                <h4 className="text-[13px] font-extrabold text-[#1e1b32] mb-3">Recent Notes</h4>
                <div className="space-y-2 mb-4">
                    {notes.map((note, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/30 border border-white/20">
                            <div className="text-[10px] font-bold text-[#6b6490] mb-1">{note.time}</div>
                            <div className="text-[11px] text-[#1e1b32] font-medium leading-relaxed">{note.text}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_-5px_rgba(244,63,94,0.35)] active:scale-95">
                    <FiEdit3 className="w-3.5 h-3.5" /> Update Vitals
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_20px_-5px_rgba(124,58,237,0.35)] active:scale-95">
                    <FiCheckCircle className="w-3.5 h-3.5" /> Mark Done
                </button>
            </div>
            <button className="w-full py-2.5 rounded-xl glass text-[11px] font-bold text-[#3b3260] flex items-center justify-center gap-1.5 transition-all duration-300 hover:bg-white/70 hover:shadow-sm active:scale-95">
                <FiFileText className="w-3.5 h-3.5" /> Add Note
            </button>
        </div>
    );
}
