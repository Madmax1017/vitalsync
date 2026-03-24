import React from 'react';
import { FiClock, FiPlusCircle, FiUserCheck, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const activities = [
    {
        id: 1,
        user: 'Admin Master',
        action: 'added new staff member',
        target: 'Dr. Michael Chen',
        time: 'Just now',
        icon: FiPlusCircle,
        color: 'text-violet-600',
        bg: 'bg-violet-50'
    },
    {
        id: 2,
        user: 'Dr. Sarah Johnson',
        action: 'updated record for',
        target: 'Emily Watson',
        time: '12 minutes ago',
        icon: FiTrendingUp,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        id: 3,
        user: 'System Monitor',
        action: 'alerted high occupancy in',
        target: 'ER Ward A',
        time: '45 minutes ago',
        icon: FiAlertCircle,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 4,
        user: 'Nurse Emily Davis',
        action: 'assigned shift duty to',
        target: '5 staff members',
        time: '2 hours ago',
        icon: FiUserCheck,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    },
    {
        id: 5,
        user: 'Dr. Sharma',
        action: 'signed off from',
        target: 'Day Shift',
        time: 'Yesterday',
        icon: FiClock,
        color: 'text-[#6b6490]',
        bg: 'bg-slate-50'
    }
];

export default function ActivityFeed() {
    return (
        <div className="p-8 rounded-[2.5rem] glass-strong border border-white/40 shadow-sm mt-8 relative overflow-hidden h-full flex flex-col">
            <div className="mb-8">
                <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">System Activity</h3>
                <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider mt-1">Live Audit Logs</p>
            </div>

            <div className="flex-1 space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-violet-200 before:via-violet-100 before:to-transparent">
                {activities.map((activity, i) => (
                    <div key={activity.id} className="relative flex gap-5 group">
                        <div className={`relative z-10 w-10 h-10 rounded-xl ${activity.bg} ${activity.color} flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                            <activity.icon className="w-5 h-5 stroke-[2.5]" />
                        </div>

                        <div className="flex-1 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                <p className="text-[14px] font-black text-[#1e1b32]">
                                    {activity.user}
                                </p>
                                <span className="text-[11px] font-bold text-[#a09cb5] flex items-center gap-1">
                                    <FiClock className="w-3 h-3" />
                                    {activity.time}
                                </span>
                            </div>
                            <p className="text-[13px] font-bold text-[#6b6490] leading-relaxed">
                                {activity.action} <span className="text-[#1e1b32]">{activity.target}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-10 w-full py-4 rounded-2xl glass border border-white/50 text-[13px] font-black text-[#1e1b32] hover:bg-white/90 transition-all shadow-sm active:scale-95 group">
                View All Activity Logs
                <FiTrendingUp className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
        </div>
    );
}
