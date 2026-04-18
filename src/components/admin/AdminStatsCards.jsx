import React, { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiCheckSquare, FiFileText } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function AdminStatsCards() {
    const [patientCount, setPatientCount] = useState('—');
    const [appointmentCount, setAppointmentCount] = useState('—');
    const [taskCount, setTaskCount] = useState('—');
    const [medicationCount, setMedicationCount] = useState('—');

    useEffect(() => {
        const fetchCounts = async () => {
            const { count: pCount } = await supabase
                .from('patients')
                .select('*', { count: 'exact', head: true });
            setPatientCount(pCount ?? 0);

            const { count: aCount } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true });
            setAppointmentCount(aCount ?? 0);

            const { count: tCount } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true });
            setTaskCount(tCount ?? 0);

            const { count: mCount } = await supabase
                .from('medications')
                .select('*', { count: 'exact', head: true });
            setMedicationCount(mCount ?? 0);
        };

        fetchCounts();

        const sub = supabase
            .channel('admin-stats')
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
            change: 'All time',
            icon: FiUsers,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            title: 'Appointments',
            value: appointmentCount,
            change: 'Scheduled',
            icon: FiCalendar,
            color: 'text-sky-600',
            bg: 'bg-sky-50',
        },
        {
            title: 'Tasks',
            value: taskCount,
            change: 'Total system',
            icon: FiCheckSquare,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            title: 'Medications',
            value: medicationCount,
            change: 'Prescriptions',
            icon: FiFileText,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <div key={i} className="group p-7 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-6 h-6 stroke-[2.5]" />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-1.5">{stat.value}</h3>
                        <span className="text-[14px] font-semibold text-slate-500">{stat.title}</span>
                    </div>
                </div>
            ))}
        </section>
    );
}
