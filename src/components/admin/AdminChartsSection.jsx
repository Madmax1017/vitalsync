import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
                <p className="font-bold text-slate-800 text-[13px] mb-3">{label}</p>
                <div className="space-y-2">
                    {payload.map((pl, i) => (
                        <div key={i} className="flex items-center justify-between gap-6">
                            <span className="text-[13px] font-medium text-slate-500 capitalize flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pl.color }} />
                                {pl.name}
                            </span>
                            <span className="font-bold text-[14px]" style={{ color: pl.color }}>
                                {pl.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function AdminChartsSection() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            const today = new Date();
            const daysArr = [];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                daysArr.push({
                    dateStr: d.toISOString().split('T')[0],
                    name: dayNames[d.getDay()],
                    patients: 0,
                    appointments: 0,
                    tasks: 0,
                    medications: 0
                });
            }

            const [pRes, aRes, tRes, mRes] = await Promise.all([
                supabase.from('patients').select('created_at'),
                supabase.from('appointments').select('appointment_date'),
                supabase.from('tasks').select('created_at, status'),
                supabase.from('medications').select('created_at')
            ]);

            const processResults = (res, dateField, mappedField, condition = () => true) => {
                if (res.data) {
                    res.data.forEach(item => {
                        if (item[dateField] && condition(item)) {
                            const dateStr = item[dateField].split('T')[0];
                            const dayMatch = daysArr.find(d => d.dateStr === dateStr);
                            if (dayMatch) dayMatch[mappedField] += 1;
                        }
                    });
                }
            };

            processResults(pRes, 'created_at', 'patients');
            processResults(aRes, 'appointment_date', 'appointments');
            processResults(tRes, 'created_at', 'tasks', item => item.status === 'completed');
            processResults(mRes, 'created_at', 'medications');

            setData(daysArr);
        };
        fetchAllData();

        const ch = supabase.channel('admin-charts-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchAllData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, fetchAllData)
            .subscribe();

        return () => supabase.removeChannel(ch);
    }, []);

    const ChartCard = ({ title, subtitle, className = "", children }) => (
        <div className={`p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 ${className}`}>
            <div className="mb-8 relative z-10">
                <h3 className="text-[18px] font-extrabold text-slate-800 tracking-tight">{title}</h3>
                <p className="text-[13px] text-slate-500 font-medium mt-1">{subtitle}</p>
            </div>
            <div className="h-[280px] w-full relative z-10 w-[calc(100%+20px)] -ml-2">
                {children}
            </div>
        </div>
    );

    const defaultAxisProps = {
        axisLine: false,
        tickLine: false,
        tick: { fill: '#a09cb5', fontSize: 11, fontWeight: 700 },
        dy: 10
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <ChartCard title="Overview Trend" subtitle="Patients & Appointments (Last 7 Days)" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPatients" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorAppts" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" {...defaultAxisProps} />
                        <YAxis {...defaultAxisProps} dx={-10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f8fafc', strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="patients" name="Patients" stroke="#4f46e5" strokeWidth={3} strokeLinecap="round" fillOpacity={1} fill="url(#colorPatients)" animationDuration={1000} activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                        <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#0ea5e9" strokeWidth={3} strokeLinecap="round" fillOpacity={1} fill="url(#colorAppts)" animationDuration={1000} activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Tasks Completed" subtitle="Total completed system tasks">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" {...defaultAxisProps} />
                        <YAxis {...defaultAxisProps} dx={-10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="tasks" name="Tasks" radius={[6, 6, 6, 6]} fill="#6366f1" animationDuration={1000}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#c7d2fe'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Medication Activity" subtitle="Prescriptions issued by day">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" {...defaultAxisProps} />
                        <YAxis {...defaultAxisProps} dx={-10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="medications" name="Medications" radius={[6, 6, 6, 6]} fill="#10b981" animationDuration={1000}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#059669' : '#a7f3d0'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </section>
    );
}
