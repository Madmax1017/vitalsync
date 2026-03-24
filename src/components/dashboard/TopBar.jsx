import React from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

export default function TopBar() {
    return (
        <header className="w-full flex items-center justify-between gap-4 py-4 px-6 glass-strong rounded-2xl border border-white/20 shadow-sm">
            {/* Search */}
            <div className="flex items-center gap-3 bg-white/40 rounded-xl px-4 py-2.5 border border-white/30 flex-1 max-w-md transition-all duration-300 focus-within:bg-white/60 focus-within:shadow-sm focus-within:border-violet-200/50">
                <FiSearch className="w-4.5 h-4.5 text-[#6b6490] shrink-0" />
                <input
                    type="text"
                    placeholder="Search patients, records..."
                    className="bg-transparent outline-none text-sm font-medium text-[#1e1b32] placeholder-[#a09cb5] w-full"
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notification */}
                <button className="relative w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center text-[#6b6490] hover:bg-white/60 hover:text-violet-600 transition-all duration-300 hover:shadow-sm">
                    <FiBell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">3</span>
                </button>

                {/* Profile */}
                <button className="flex items-center gap-3 bg-white/40 border border-white/30 rounded-xl px-3 py-2 hover:bg-white/60 transition-all duration-300 hover:shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=80&h=80"
                        alt="Doctor"
                        className="w-8 h-8 rounded-lg object-cover shadow-sm"
                    />
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[13px] font-bold text-[#1e1b32] leading-tight">Dr. Sarah Chen</span>
                        <span className="text-[11px] text-[#6b6490] font-medium">Cardiologist</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-[#6b6490] hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
