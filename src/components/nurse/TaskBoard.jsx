import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiClock, FiLoader, FiInbox } from 'react-icons/fi';

const priorityStyles = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

export default function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTasks = async () => {
        const nurseEmail = localStorage.getItem('userEmail') || 'nurse@vitalsync.com';

        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to', nurseEmail)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks for dashboard:', error);
        } else {
            setTasks(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadTasks();

        const channel = supabase
            .channel('dashboard-tasks')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
                loadTasks();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="p-6 rounded-3xl glass-strong border border-white/20 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-extrabold text-[#1e1b32] tracking-tight">Pending Tasks</h3>
                    <p className="text-[13px] text-[#6b6490] font-medium mt-1">Live updates from assigned doctors</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[12px] font-bold text-[#1e1b32] bg-white/50 px-3 py-1 rounded-full border border-white/20">
                        Live Sync
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="col-span-full py-12 flex flex-col items-center text-[#a09cb5]">
                        <FiLoader className="w-8 h-8 animate-spin mb-3 text-rose-400" />
                        <span className="text-sm font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="group p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-100"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
                                    {task.priority || 'Medium'}
                                </div>
                            </div>

                            <div className="text-[15px] font-extrabold text-[#1e1b32] mb-1.5 leading-tight group-hover:text-violet-700 transition-colors">
                                {task.title}
                            </div>

                            {task.description && (
                                <div className="text-[13px] text-[#6b6490] font-medium leading-relaxed mb-4 line-clamp-2">
                                    {task.description}
                                </div>
                            )}

                            <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-2 text-[12px] text-[#6b6490] font-bold">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] text-[#1e1b32]">
                                    {task.patient_name ? task.patient_name.charAt(0) : 'P'}
                                </div>
                                <span className="text-[#1e1b32]">{task.patient_name || 'No Patient'}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-[#a09cb5]">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center mb-3">
                            <FiInbox className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">No Pending Tasks</span>
                    </div>
                )}
            </div>
        </div>
    );
}
