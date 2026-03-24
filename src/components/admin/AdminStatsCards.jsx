import React from 'react';
import { FiUsers, FiUserCheck, FiActivity, FiCalendar, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';

const stats = [
    {
        title: 'Total Patients',
        value: '12,842',
        change: '+12.5%',
        isUp: true,
        icon: FiUsers,
        gradient: 'from-violet-600 to-indigo-600',
        bg: 'bg-violet-50',
        color: 'text-violet-600'
    },
    {
        title: 'Active Staff',
        value: '348',
        change: '+4.2%',
        isUp: true,
        icon: FiUserCheck,
        gradient: 'from-indigo-600 to-blue-600',
        bg: 'bg-indigo-50',
        color: 'text-indigo-600'
    },
    {
        title: 'Bed Occupancy',
        value: '86%',
        change: '-2.1%',
        isUp: false,
        icon: FiActivity,
        gradient: 'from-blue-600 to-cyan-600',
        bg: 'bg-blue-50',
        color: 'text-blue-600'
    },
    {
        title: 'Today Appointments',
        value: '156',
        change: '+8.7%',
        isUp: true,
        icon: FiCalendar,
        gradient: 'from-cyan-600 to-emerald-600',
        bg: 'bg-cyan-50',
        color: 'text-cyan-600'
    }
];

export default function AdminStatsCards() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="group relative p-6 rounded-[2rem] glass-strong border border-white/40 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/90 hover:shadow-xl hover:border-violet-200/50">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            <stat.icon className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div className={`flex items-center gap-1 font-black text-[12px] px-2.5 py-1 rounded-full ${stat.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {stat.isUp ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                            {stat.change}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[#6b6490] tracking-wide mb-1 uppercase">{stat.title}</span>
                        <h3 className="text-3xl font-black text-[#1e1b32] tracking-tighter">{stat.value}</h3>
                    </div>

                    {/* Subtle bottom gradient bar */}
                    <div className={`absolute bottom-0 left-6 right-6 h-1 w-0 opacity-0 bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-500 group-hover:w-[calc(100%-3rem)] group-hover:opacity-100`} />
                </div>
            ))}
        </section>
    );
}
