import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiCheckSquare, FiFileText } from 'react-icons/fi';
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
            change: 'All registered',
            icon: FiUsers,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            title: 'Appointments',
            value: appointmentCount,
            change: 'Assigned to you',
            icon: FiCalendar,
            color: 'text-sky-600',
            bg: 'bg-sky-50',
        },
        {
            title: 'Active Tasks',
            value: taskCount,
            change: 'Assigned by you',
            icon: FiCheckSquare,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            title: 'Active Meds',
            value: medicationCount,
            change: 'Prescribed recently',
            icon: FiFileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="group p-6 rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-5 h-5 stroke-[2.5]" />
                        </div>
                    </div>
                    <div className="text-3xl font-extrabold tracking-tight text-slate-800 mb-1.5">{stat.value}</div>
                    <div className="text-[14px] font-semibold text-slate-500">{stat.title}</div>
                    <div className="text-[12px] font-medium text-slate-400 mt-2">{stat.change}</div>
                </div>
            ))}
        </div>
    );
}
