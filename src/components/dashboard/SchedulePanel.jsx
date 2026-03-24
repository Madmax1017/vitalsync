import React, { useState } from 'react';
import { FiPlus, FiClock } from 'react-icons/fi';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = 3; // Thursday index

const schedule = [
    { time: '9:00 AM', title: 'Emily Watson - Post-op review', color: 'bg-violet-500' },
    { time: '10:30 AM', title: 'James Miller - Cardiac checkup', color: 'bg-rose-400' },
    { time: '11:00 AM', title: 'Sophia Lee - Diabetes follow-up', color: 'bg-emerald-400' },
    { time: '1:30 PM', title: 'David Park - Respiratory eval', color: 'bg-amber-400' },
    { time: '3:00 PM', title: 'Maria Garcia - Prenatal visit', color: 'bg-blue-400' },
];

export default function SchedulePanel() {
    const [selectedDay, setSelectedDay] = useState(today);

    return (
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">

            {/* Calendar Mini */}
            <div className="p-5 rounded-2xl glass overflow-hidden">
                <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight mb-4">March 2026</h3>
                <div className="grid grid-cols-7 gap-1 mb-3">
                    {daysOfWeek.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDay(i)}
                            className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all duration-300 ${i === selectedDay
                                    ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md scale-105'
                                    : 'text-[#6b6490] hover:bg-white/50'
                                }`}
                        >
                            <span className="mb-0.5">{d}</span>
                            <span className={`text-sm font-extrabold ${i === selectedDay ? 'text-white' : 'text-[#1e1b32]'}`}>
                                {20 + i}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="p-5 rounded-2xl glass overflow-hidden flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Today's Schedule</h3>
                    <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">{schedule.length} events</span>
                </div>

                <div className="space-y-3">
                    {schedule.map((item, i) => (
                        <div key={i} className="group flex items-start gap-3 p-3 rounded-xl bg-white/30 border border-white/20 hover:bg-white/60 hover:shadow-sm transition-all duration-300 cursor-pointer">
                            <div className={`w-1 h-full min-h-[36px] rounded-full ${item.color} shrink-0`} />
                            <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-bold text-[#1e1b32] truncate leading-tight">{item.title}</div>
                                <div className="flex items-center gap-1 mt-1.5">
                                    <FiClock className="w-3 h-3 text-[#a09cb5]" />
                                    <span className="text-[10px] font-semibold text-[#a09cb5]">{item.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Event Button */}
            <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_-5px_rgba(124,58,237,0.4)] active:scale-95">
                <FiPlus className="w-4 h-4 stroke-[2.5]" />
                Add New Event
            </button>
        </div>
    );
}
