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

export default function Charts() {
    const [data, setData] = useState([]);

    const userEmail = localStorage.getItem('userEmail') || '';

    useEffect(() => {
        const fetchDailyData = async () => {
            const today = new Date();
            const daysArr = [];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // Initialize last 7 days
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                daysArr.push({
                    dateStr: d.toISOString().split('T')[0],
                    name: dayNames[d.getDay()],
                    patients: 0,
                    appointments: 0,
                    tasks: 0
                });
            }

            const [pRes, aRes, tRes] = await Promise.all([
                supabase.from('patients').select('created_at'),
                supabase.from('appointments').select('appointment_date').eq('doctor_email', userEmail),
                supabase.from('tasks').select('created_at, status').eq('assigned_by', userEmail)
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

            setData(daysArr);
        };

        fetchDailyData();

        const sub = supabase.channel('doctor-charts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchDailyData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchDailyData)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchDailyData)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, [userEmail]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Overview */}
            <div className="p-7 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-[18px] font-extrabold text-slate-800 tracking-tight">Daily Activity</h3>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">Patients and Appointments over last 7 days</p>
                    </div>
                </div>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f8fafc', strokeWidth: 2 }} />
                            <Area type="monotone" dataKey="patients" name="Patients" stroke="#4f46e5" strokeWidth={3} strokeLinecap="round" fillOpacity={1} fill="url(#colorPatients)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} animationDuration={1000} />
                            <Area type="monotone" dataKey="appointments" name="Appointments" stroke="#0ea5e9" strokeWidth={3} strokeLinecap="round" fillOpacity={1} fill="url(#colorAppts)" activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }} animationDuration={1000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tasks Completed */}
            <div className="p-7 bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-[18px] font-extrabold text-slate-800 tracking-tight">Tasks Completed</h3>
                        <p className="text-[13px] text-slate-500 font-medium mt-1">Tasks successfully finished each day</p>
                    </div>
                </div>
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={20} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="tasks" name="Completed Tasks" radius={[6, 6, 6, 6]} fill="#6366f1" animationDuration={1000}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#4f46e5' : '#c7d2fe'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

