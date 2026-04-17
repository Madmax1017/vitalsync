import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import TaskBoard from './TaskBoard';
import NursePatientList from './NursePatientList';
import VitalsChart from './VitalsChart';
import PatientDetail from './PatientDetail';
import { FiClock, FiUser } from 'react-icons/fi';

function RecentNotes() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const nurseEmail = localStorage.getItem('userEmail') || 'nurse@vitalsync.com';

        const fetchNotes = async () => {
            const { data } = await supabase
                .from('notes')
                .select('*')
                .eq('nurse_email', nurseEmail)
                .order('created_at', { ascending: false })
                .limit(3);

            if (data) setNotes(data);
        };

        fetchNotes();

        const channel = supabase
            .channel('dashboard-notes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, () => {
                fetchNotes();
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    if (notes.length === 0) return null;

    return (
        <div className="p-5 rounded-2xl glass mt-4">
            <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight mb-4">Recent Notes</h3>
            <div className="space-y-3">
                {notes.map(note => (
                    <div key={note.id} className="p-3 bg-white/40 border border-white/30 rounded-xl shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-[#1e1b32] text-[13px] flex items-center gap-1.5">
                                <FiUser className="w-3.5 h-3.5 text-violet-500" />
                                {note.patient_name}
                            </span>
                            <span className="text-[10px] text-[#6b6490] font-bold flex items-center gap-1">
                                <FiClock className="w-3 h-3 text-rose-400" />
                                {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-[12px] text-[#6b6490] font-medium leading-relaxed pl-5 line-clamp-2">
                            {note.note}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function NurseDashboard() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [stats, setStats] = useState({ patients: 0, pendingTasks: 0 });

    useEffect(() => {
        const nurseEmail = localStorage.getItem('userEmail') || 'nurse@vitalsync.com';

        const fetchStats = async () => {
            const { count: tasksCount } = await supabase
                .from('tasks')
                .select('*', { count: 'exact', head: true })
                .eq('assigned_to', nurseEmail)
                .eq('status', 'pending');

            const { count: patientsCount } = await supabase
                .from('patients')
                .select('*', { count: 'exact', head: true });

            setStats({
                patients: patientsCount || 0,
                pendingTasks: tasksCount || 0
            });
        };

        fetchStats();

        const channelTasks = supabase.channel('stats-tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchStats).subscribe();
        const channelPts = supabase.channel('stats-patients').on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchStats).subscribe();

        return () => {
            supabase.removeChannel(channelTasks);
            supabase.removeChannel(channelPts);
        };
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
                <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-pink-300/8 rounded-full blur-[100px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-auto relative z-10">
                {/* Center Column */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    <NurseTopBar />

                    <div className="px-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-1">
                            Good Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Nurse</span> 💊
                        </h1>
                        <p className="text-[14px] text-[#a09cb5] font-medium">
                            You have {stats.patients} patients assigned and {stats.pendingTasks} pending tasks.
                        </p>
                    </div>

                    <TaskBoard />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <VitalsChart />
                        <NursePatientList selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-4">
                    <PatientDetail patient={selectedPatient} />
                    <RecentNotes />
                </div>
            </div>
        </div>
    );
}
