import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';

const areaData = [
    { name: 'Jan', inflow: 400 },
    { name: 'Feb', inflow: 600 },
    { name: 'Mar', inflow: 500 },
    { name: 'Apr', inflow: 900 },
    { name: 'May', inflow: 700 },
    { name: 'Jun', inflow: 1100 },
    { name: 'Jul', inflow: 1300 },
];

const barData = [
    { name: 'Cardiology', workload: 85 },
    { name: 'Neurology', workload: 65 },
    { name: 'Pediatrics', workload: 45 },
    { name: 'Orthopedics', workload: 75 },
    { name: 'General', workload: 90 },
];

const pieData = [
    { name: 'Occupied', value: 86, color: '#7c3aed' },
    { name: 'Available', value: 14, color: '#e0e7ff' },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-strong rounded-2xl px-4 py-3 shadow-2xl border border-white/50 backdrop-blur-2xl">
                <p className="font-black text-[#1e1b32] text-sm mb-1">{label}</p>
                <p className="font-extrabold text-violet-600 text-lg">
                    {payload[0].value} <span className="text-xs text-[#a09cb5]">{payload[0].dataKey === 'inflow' ? 'Patients' : '%'}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function AdminChartsSection() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Area Chart: Patient Inflow */}
            <div className="lg:col-span-8 p-8 rounded-[2.5rem] glass-strong border border-white/40 shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Patient Inflow</h3>
                        <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider mt-1">Monthly Analytics</p>
                    </div>
                </div>

                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorInflow" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a09cb5', fontSize: 12, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a09cb5', fontSize: 12, fontWeight: 700 }}
                                dx={-10}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed33', strokeWidth: 2 }} />
                            <Area
                                type="monotone"
                                dataKey="inflow"
                                stroke="#7c3aed"
                                strokeWidth={4}
                                fillOpacity={1}
                                fill="url(#colorInflow)"
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Resource Usage */}
            <div className="lg:col-span-4 p-8 rounded-[2.5rem] glass-strong border border-white/40 shadow-sm relative overflow-hidden flex flex-col items-center">
                <div className="w-full text-left mb-8">
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Bed Occupancy</h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider mt-1">Real-time Usage</p>
                </div>

                <div className="h-[220px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={10}
                                dataKey="value"
                                startAngle={90}
                                endAngle={450}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-black text-[#1e1b32]">86%</span>
                        <span className="text-[11px] font-bold text-[#a09cb5] uppercase tracking-widest">Occupied</span>
                    </div>
                </div>

                <div className="mt-6 flex gap-6">
                    {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[13px] font-bold text-[#6b6490]">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart: Department Workload */}
            <div className="lg:col-span-12 p-8 rounded-[2.5rem] glass-strong border border-white/40 shadow-sm mt-8 relative overflow-hidden">
                <div className="mb-8">
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Departmental Workload</h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider mt-1">Staff Utilization Index</p>
                </div>

                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} barGap={0} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a09cb5', fontSize: 12, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#a09cb5', fontSize: 12, fontWeight: 700 }}
                                dx={-10}
                                domain={[0, 100]}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#7c3aed05' }} />
                            <Bar
                                dataKey="workload"
                                radius={[10, 10, 0, 0]}
                                animationDuration={2000}
                                animationEasing="ease-in-out"
                            >
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#7c3aed' : '#818cf8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
