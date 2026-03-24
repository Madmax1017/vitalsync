import React from 'react';
import { FiSearch, FiBell, FiChevronDown, FiPlus } from 'react-icons/fi';

export default function AdminTopBar() {
    return (
        <header className="w-full flex items-center justify-between gap-6 py-4 px-6 glass-strong rounded-3xl border border-white/30 shadow-sm backdrop-blur-xl">
            {/* Search */}
            <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-5 py-3 border border-white/50 flex-1 max-w-lg transition-all duration-300 focus-within:bg-white/80 focus-within:shadow-md focus-within:border-violet-300/50 group">
                <FiSearch className="w-5 h-5 text-[#6b6490] shrink-0 group-focus-within:text-violet-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Search for staff, reports, system logs..."
                    className="bg-transparent outline-none text-[14px] font-semibold text-[#1e1b32] placeholder-[#a09cb5] w-full"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Quick Action */}
                <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-[0_8px_20px_-5px_rgba(124,58,237,0.4)] hover:shadow-[0_12px_25px_-5px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-95">
                    <FiPlus className="w-4 h-4 stroke-[2.5]" />
                    Add Staff
                </button>

                {/* Notification */}
                <button className="relative w-11 h-11 rounded-2xl bg-white/60 border border-white/50 flex items-center justify-center text-[#6b6490] hover:bg-white/90 hover:text-violet-600 transition-all duration-300 hover:shadow-md active:scale-95">
                    <FiBell className="w-5 h-5 stroke-[2]" />
                    <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-black shadow-sm">12</span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-[14px] font-black text-[#1e1b32] leading-tight">Admin Master</span>
                        <span className="text-[11px] text-violet-600 font-bold uppercase tracking-widest">System Controller</span>
                    </div>
                    <button className="flex items-center gap-2 group">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105 active:scale-95">
                            <img
                                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=80&h=80"
                                alt="Admin Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <FiChevronDown className="w-4 h-4 text-[#6b6490] group-hover:text-violet-600 transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
}
