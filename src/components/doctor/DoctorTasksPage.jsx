import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch, FiCheckSquare, FiUser, FiFileText, FiAlertCircle,
    FiMail, FiPlus, FiClock, FiLoader, FiInbox, FiCheck
} from 'react-icons/fi';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';

const priorityConfig = {
    high: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', dot: 'bg-amber-500' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
};

const statusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', label: 'Pending' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Completed' },
};

export default function DoctorTasksPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const cardsRef = useRef([]);
    const formRef = useRef(null);

    const userEmail = localStorage.getItem('userEmail') || '';

    const [form, setForm] = useState({
        title: '',
        description: '',
        patient_name: '',
        assigned_to: '',
        priority: 'medium',
    });

    // Fetch tasks assigned by this doctor
    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('assigned_by', userEmail)
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
            .channel('doctor-tasks-channel')
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

    // Form toggle animation
    useEffect(() => {
        if (showForm && formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }
    }, [showForm]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const { error } = await supabase.from('tasks').insert([{
            title: form.title,
            description: form.description,
            patient_name: form.patient_name,
            assigned_by: userEmail,
            assigned_to: form.assigned_to,
            priority: form.priority,
            status: 'pending',
        }]);

        if (error) {
            console.error('Error creating task:', error);
            alert('Failed to assign task. Please try again.');
        } else {
            setForm({ title: '', description: '', patient_name: '', assigned_to: '', priority: 'medium' });
            setSuccessMsg('Task assigned successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
            setShowForm(false);
        }
        setSubmitting(false);
    };

    const filteredTasks = tasks.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-[140px]" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <TopBar />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Task Assignment</h1>
                            <p className="text-[#64748b] font-medium">Assign and track tasks for your nursing team</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <FiPlus className="w-4.5 h-4.5 stroke-[2.5]" />
                                <span className="hidden sm:inline">Assign Task</span>
                            </button>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMsg && (
                        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[14px] shadow-sm animate-pulse">
                            <FiCheck className="w-5 h-5 stroke-[2.5]" />
                            {successMsg}
                        </div>
                    )}

                    {/* Task Creation Form */}
                    {showForm && (
                        <div ref={formRef} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 shadow-xl shadow-violet-500/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
                                    <FiCheckSquare className="w-5 h-5 text-white stroke-[2.5]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-[#1e1b32]">New Task Assignment</h2>
                                    <p className="text-[13px] text-[#64748b] font-medium">Assign a task to a nurse</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiFileText className="w-3.5 h-3.5" /> Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., Administer medication"
                                            value={form.title}
                                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-slate-300"
                                        />
                                    </div>

                                    {/* Patient Name */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiUser className="w-3.5 h-3.5" /> Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g., John Doe"
                                            value={form.patient_name}
                                            onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-slate-300"
                                        />
                                    </div>

                                    {/* Nurse Email */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiMail className="w-3.5 h-3.5" /> Assign To (Nurse Email)
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="e.g., nurse@vitalsync.com"
                                            value={form.assigned_to}
                                            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-slate-300"
                                        />
                                    </div>

                                    {/* Priority */}
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiAlertCircle className="w-3.5 h-3.5" /> Priority
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['low', 'medium', 'high'].map((p) => {
                                                const cfg = priorityConfig[p];
                                                return (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setForm({ ...form, priority: p })}
                                                        className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all duration-300 capitalize ${form.priority === p
                                                            ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-${p === 'high' ? 'rose' : p === 'medium' ? 'amber' : 'emerald'}-500/5`
                                                            : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FiFileText className="w-3.5 h-3.5" /> Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder="Detailed task instructions..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-slate-300 resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] shadow-xl shadow-violet-500/20 hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <FiLoader className="w-4.5 h-4.5 animate-spin" />
                                        ) : (
                                            <FiCheckSquare className="w-4.5 h-4.5 stroke-[2.5]" />
                                        )}
                                        {submitting ? 'Assigning...' : 'Assign Task'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3.5 rounded-2xl text-slate-400 font-bold text-[14px] hover:text-slate-600 hover:bg-slate-50 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tasks List */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#a09cb5]">
                                <FiLoader className="w-12 h-12 animate-spin mb-4" />
                                <span className="text-[14px] font-bold uppercase tracking-widest">Loading Tasks...</span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {tasks && tasks.length > 0 ? (
                                        filteredTasks.map((task, index) => {
                                            const pCfg = priorityConfig[task.priority] || priorityConfig.medium;
                                            const sCfg = statusConfig[task.status] || statusConfig.pending;
                                            return (
                                                <div
                                                    key={task.id}
                                                    ref={el => cardsRef.current[index] = el}
                                                    className="group relative bg-white/60 border border-white/40 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl hover:shadow-violet-500/5 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                    <div className="relative z-10 space-y-4">
                                                        {/* Top: Priority + Status */}
                                                        <div className="flex justify-between items-start">
                                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${pCfg.bg} ${pCfg.text} ${pCfg.border} border`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${pCfg.dot}`} />
                                                                {task.priority}
                                                            </div>
                                                            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${sCfg.bg} ${sCfg.text} ${sCfg.border}`}>
                                                                {sCfg.label}
                                                            </div>
                                                        </div>

                                                        {/* Title */}
                                                        <h3 className="text-[15px] font-bold text-[#1e1b32] leading-tight group-hover:text-violet-700 transition-colors duration-300">
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
                                                                    <FiMail className="w-3 h-3" /> Assigned To
                                                                </div>
                                                                <div className="text-[13px] font-semibold text-[#334155] truncate">{task.assigned_to}</div>
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                                                            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b]">
                                                                <FiClock className="w-3.5 h-3.5" />
                                                                {formatDate(task.created_at)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FiInbox className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1e1b32]">No tasks assigned yet</h3>
                                                <p className="text-[#64748b]">Click "Assign Task" to create your first task</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {tasks.length > 0 && filteredTasks.length === 0 && (
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
