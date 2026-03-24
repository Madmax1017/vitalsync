import React from 'react';
import {
    AreaChart, Area, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const vitalsData = [
    { time: '6AM', hr: 72, bp: 120 },
    { time: '8AM', hr: 78, bp: 125 },
    { time: '10AM', hr: 85, bp: 130 },
    { time: '12PM', hr: 80, bp: 128 },
    { time: '2PM', hr: 76, bp: 122 },
    { time: '4PM', hr: 82, bp: 126 },
    { time: '6PM', hr: 74, bp: 118 },
];

const appointmentsData = [
    { day: 'Mon', count: 6 },
    { day: 'Tue', count: 9 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 12 },
    { day: 'Sat', count: 7 },
    { day: 'Sun', count: 3 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-strong rounded-xl px-3 py-2 shadow-lg border border-white/30">
                <p className="text-[11px] font-bold text-[#1e1b32] mb-0.5">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-[10px] font-semibold" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Charts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Vitals Line Chart */}
            <div className="p-5 rounded-2xl glass overflow-hidden transition-all duration-500 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.1)]">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Patient Vitals</h3>
                        <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">Heart rate & blood pressure trends</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6b6490]"><span className="w-2 h-2 rounded-full bg-violet-500"></span>HR</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[#6b6490]"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>BP</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={vitalsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.06)" />
                        <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#a09cb5', fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#a09cb5', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="hr" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} name="Heart Rate" />
                        <Line type="monotone" dataKey="bp" stroke="#818cf8" strokeWidth={2.5} dot={{ r: 4, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }} name="Blood Pressure" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Appointments Area Chart */}
            <div className="p-5 rounded-2xl glass overflow-hidden transition-all duration-500 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.1)]">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Weekly Appointments</h3>
                        <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">This week's appointment volume</p>
                    </div>
                    <div className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">This Week</div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={appointmentsData}>
                        <defs>
                            <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.06)" />
                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#a09cb5', fontWeight: 600 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#a09cb5', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorAppt)" name="Appointments" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
