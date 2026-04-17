import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch, FiCheckSquare, FiUser, FiFileText, FiMail,
    FiClock, FiLoader, FiInbox, FiCheckCircle, FiAlertCircle
} from 'react-icons/fi';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';

const priorityConfig = {
    high: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
};

export default function NurseTasksPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(null);
    const cardsRef = useRef([]);

    const userEmail = localStorage.getItem('userEmail') || '';

    // Fetch tasks assigned TO this nurse
    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('assigned_to', userEmail)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();

        const subscription = supabase
            .channel('nurse-tasks-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchTasks)
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, []);

    // Card entrance animation
    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(cardsRef.current.filter(Boolean),
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' }
            );
        }
    }, [tasks, searchQuery]);

    const handleComplete = async (taskId) => {
        setCompleting(taskId);
        const { error } = await supabase
            .from('tasks')
            .update({ status: 'completed' })
            .eq('id', taskId);

        if (error) {
            console.error('Error completing task:', error);
            alert('Failed to update task. Please try again.');
        }
        setCompleting(null);
    };

    const filteredTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assigned_by?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingTasks = filteredTasks.filter(t => t.status === 'pending');
    const completedTasks = filteredTasks.filter(t => t.status === 'completed');

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const TaskCard = ({ task, index }) => {
        const pCfg = priorityConfig[task.priority] || priorityConfig.medium;
        const isPending = task.status === 'pending';
        const isCompleting = completing === task.id;

        return (
            <div
                ref={el => cardsRef.current[index] = el}
                className={`group relative bg-white/60 border border-white/40 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl transition-all duration-500 overflow-hidden ${isPending ? 'hover:shadow-rose-500/5 hover:-translate-y-1.5' : 'opacity-80'}`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${isPending ? 'from-rose-500/0 via-rose-500/0 to-rose-500/[0.03]' : 'from-emerald-500/0 via-emerald-500/0 to-emerald-500/[0.03]'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10 space-y-4">
                    {/* Top: Priority + Status */}
                    <div className="flex justify-between items-start">
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${pCfg.bg} ${pCfg.text} ${pCfg.border} border`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                            {task.priority}
                        </div>
                        {isPending ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                <FiClock className="w-3 h-3" /> Pending
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                <FiCheckCircle className="w-3 h-3" /> Completed
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-[15px] font-bold text-[#1e1b32] leading-tight transition-colors duration-300 ${isPending ? 'group-hover:text-rose-600' : 'line-through text-[#94a3b8]'}`}>
                        {task.title}
                    </h3>

                    {/* Description */}
                    {task.description && (
                        <p className="text-[13px] text-[#64748b] font-medium leading-relaxed line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-3 py-2">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                <FiUser className="w-3 h-3" /> Patient
                            </div>
                            <div className="text-[13px] font-semibold text-[#334155] truncate">{task.patient_name || '—'}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                <FiMail className="w-3 h-3" /> Assigned By
                            </div>
                            <div className="text-[13px] font-semibold text-[#334155] truncate">{task.assigned_by}</div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b]">
                            <FiClock className="w-3.5 h-3.5" />
                            {formatDate(task.created_at)}
                        </div>
                    </div>

                    {/* Mark as Completed */}
                    {isPending && (
                        <button
                            onClick={() => handleComplete(task.id)}
                            disabled={isCompleting}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-[13px] shadow-lg shadow-rose-500/20 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60"
                        >
                            {isCompleting ? (
                                <FiLoader className="w-4 h-4 animate-spin" />
                            ) : (
                                <FiCheckCircle className="w-4 h-4 stroke-[2.5]" />
                            )}
                            {isCompleting ? 'Updating...' : 'Mark as Completed'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-pink-400/5 rounded-full blur-[140px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <NurseTopBar />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">My Tasks</h1>
                            <p className="text-[#64748b] font-medium">Tasks assigned to you by doctors</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                            {/* Live Sync Indicator */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/40 border border-white/40 backdrop-blur-md">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                <span className="text-[12px] font-bold text-[#1e1b32]">Live Sync</span>
                            </div>
                        </div>
                    </div>

                    {/* Task Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                <FiAlertCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold text-[#1e1b32]">{pendingTasks.length}</div>
                                <div className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">Pending</div>
                            </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                                <FiCheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold text-[#1e1b32]">{completedTasks.length}</div>
                                <div className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">Completed</div>
                            </div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center gap-3 col-span-2 md:col-span-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                                <FiCheckSquare className="w-5 h-5 text-rose-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold text-[#1e1b32]">{tasks.length}</div>
                                <div className="text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">Total</div>
                            </div>
                        </div>
                    </div>

                    {/* Tasks Content */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#a09cb5]">
                                <FiLoader className="w-12 h-12 animate-spin mb-4" />
                                <span className="text-[14px] font-bold uppercase tracking-widest">Loading Tasks...</span>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <FiInbox className="w-10 h-10" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1e1b32]">No tasks assigned</h3>
                                    <p className="text-[#64748b]">Tasks assigned by doctors will appear here</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Pending Section */}
                                {pendingTasks.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                                            <span className="text-[14px] font-extrabold text-[#1e1b32] uppercase tracking-widest">Pending Tasks</span>
                                            <span className="text-[12px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100/50">
                                                {pendingTasks.length}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {pendingTasks.map((task, i) => (
                                                <TaskCard key={task.id} task={task} index={i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Completed Section */}
                                {completedTasks.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                                            <span className="text-[14px] font-extrabold text-[#1e1b32] uppercase tracking-widest">Completed Tasks</span>
                                            <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100/50">
                                                {completedTasks.length}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {completedTasks.map((task, i) => (
                                                <TaskCard key={task.id} task={task} index={pendingTasks.length + i} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* No search results */}
                                {filteredTasks.length === 0 && tasks.length > 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <FiSearch className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1e1b32]">No search results</h3>
                                            <p className="text-[#64748b]">Try adjusting your search query</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
