import React from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

export default function NurseTopBar() {
    return (
        <header className="w-full flex items-center justify-between gap-4 py-4 px-6 glass-strong rounded-2xl border border-white/20 shadow-sm">
            <div className="flex items-center gap-3 bg-white/40 rounded-xl px-4 py-2.5 border border-white/30 flex-1 max-w-md transition-all duration-300 focus-within:bg-white/60 focus-within:shadow-sm focus-within:border-rose-200/50">
                <FiSearch className="w-4 h-4 text-[#6b6490] shrink-0" />
                <input
                    type="text"
                    placeholder="Search tasks, patients..."
                    className="bg-transparent outline-none text-sm font-medium text-[#1e1b32] placeholder-[#a09cb5] w-full"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Shift Status */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 rounded-xl px-3 py-2">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">On Shift</span>
                </div>

                <button className="relative w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center text-[#6b6490] hover:bg-white/60 hover:text-rose-500 transition-all duration-300 hover:shadow-sm">
                    <FiBell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">5</span>
                </button>

                <button className="flex items-center gap-3 bg-white/40 border border-white/30 rounded-xl px-3 py-2 hover:bg-white/60 transition-all duration-300 hover:shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&w=80&h=80"
                        alt="Nurse"
                        className="w-8 h-8 rounded-lg object-cover shadow-sm"
                    />
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[13px] font-bold text-[#1e1b32] leading-tight">Nurse Priya</span>
                        <span className="text-[11px] text-[#6b6490] font-medium">ICU Ward</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-[#6b6490] hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
