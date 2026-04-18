import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiAlertTriangle, FiFileText } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function StatsCards() {
    const [patientCount, setPatientCount] = useState('—');
    const [appointmentCount, setAppointmentCount] = useState('—');
    const [taskCount, setTaskCount] = useState('—');
    const [medicationCount, setMedicationCount] = useState('—');

    const userEmail = localStorage.getItem('userEmail') || '';

    useEffect(() => {
        const fetchCounts = async () => {
            const { count: pCount } = await supabase
                .from('patients')
                .select('*', { count: 'exact', head: true });
            setPatientCount(pCount ?? 0);

            const { count: aCount } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('doctor_email', userEmail);
            setAppointmentCount(aCount ?? 0);

            const { count: tCount } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('assigned_by', userEmail);
            setTaskCount(tCount ?? 0);

            const { count: mCount } = await supabase
                .from('medications')
                .select('*', { count: 'exact', head: true })
                .eq('prescribed_by', userEmail)
                .eq('status', 'active');
            setMedicationCount(mCount ?? 0);
        };

        fetchCounts();

        const sub = supabase
            .channel('doctor-stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchCounts)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchCounts)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchCounts)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, fetchCounts)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const stats = [
        {
            title: 'Total Patients',
            value: patientCount,
            change: 'Live count',
            icon: FiUsers,
            gradient: 'from-violet-500 to-indigo-500',
            bgAccent: 'bg-violet-100',
            textAccent: 'text-violet-600',
        },
        {
            title: 'My Appointments',
            value: appointmentCount,
            change: 'Assigned to you',
            icon: FiCalendar,
            gradient: 'from-blue-500 to-cyan-500',
            bgAccent: 'bg-blue-100',
            textAccent: 'text-blue-600',
        },
        {
            title: 'Active Tasks',
            value: taskCount,
            change: 'Assigned by you',
            icon: FiAlertTriangle,
            gradient: 'from-rose-400 to-pink-500',
            bgAccent: 'bg-rose-100',
            textAccent: 'text-rose-600',
        },
        {
            title: 'Active Meds',
            value: medicationCount,
            change: 'Prescribed recently',
            icon: FiFileText,
            gradient: 'from-emerald-400 to-teal-500',
            bgAccent: 'bg-emerald-100',
            textAccent: 'text-emerald-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className="group relative p-5 rounded-2xl glass overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.12)] hover:bg-white/80">
                    {/* Glow */}
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-[0.08] group-hover:opacity-[0.2] transition-opacity duration-500 bg-gradient-to-br ${stat.gradient}`} />

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.bgAccent} ${stat.textAccent} transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                                <stat.icon className="w-5 h-5 stroke-[1.5]" />
                            </div>
                            <div className={`w-12 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-1">{stat.value}</div>
                        <div className="text-[13px] font-semibold text-[#6b6490] mb-1">{stat.title}</div>
                        <div className="text-[11px] font-medium text-[#a09cb5]">{stat.change}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
