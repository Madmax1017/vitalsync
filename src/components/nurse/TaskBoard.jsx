import React, { useState, useEffect } from 'react';
import { FiClock, FiArrowRight, FiCheckCircle, FiPlayCircle, FiLoader } from 'react-icons/fi';

const priorityStyles = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

const columnConfig = {
    pending: { label: 'Pending', accent: 'bg-amber-400', next: 'in-progress' },
    'in-progress': { label: 'In Progress', accent: 'bg-indigo-500', next: 'completed' },
    completed: { label: 'Completed', accent: 'bg-emerald-500', next: null },
};

export default function TaskBoard() {
    const [tasksByStatus, setTasksByStatus] = useState({
        pending: [],
        'in-progress': [],
        completed: []
    });

    const loadTasks = () => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

        const organized = {
            pending: [],
            'in-progress': [],
            completed: []
        };

        allTasks.forEach(task => {
            if (organized[task.status]) {
                organized[task.status].push(task);
            } else {
                // Fallback for any tasks with status not in our columns
                organized.pending.push(task);
            }
        });

        setTasksByStatus(organized);
    };

    useEffect(() => {
        loadTasks();

        // Simulating real-time updates via polling
        const interval = setInterval(() => {
            loadTasks();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const moveTask = (taskId, newStatus) => {
        const allTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const updatedTasks = allTasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });

        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadTasks(); // Update immediate UI
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FiLoader className="w-3 h-3 animate-spin-slow" />;
            case 'in-progress': return <FiPlayCircle className="w-3 h-3" />;
            case 'completed': return <FiCheckCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="p-6 rounded-3xl glass-strong border border-white/20 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-extrabold text-[#1e1b32] tracking-tight">Assigned Tasks</h3>
                    <p className="text-[13px] text-[#6b6490] font-medium mt-1">Real-time task synchronization from doctors</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(columnConfig).map(([colKey, col]) => (
                    <div key={colKey} className="flex flex-col gap-4">
                        {/* Column Header */}
                        <div className="flex items-center gap-3 px-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${col.accent} shadow-sm`} />
                            <span className="text-[14px] font-extrabold text-[#1e1b32] uppercase tracking-widest">{col.label}</span>
                            <span className="text-[12px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg ml-auto border border-violet-100/50">
                                {tasksByStatus[colKey].length}
                            </span>
                        </div>

                        {/* Tasks Container */}
                        <div className="flex flex-col gap-3 min-h-[400px] p-2 rounded-2xl bg-slate-50/30 border border-slate-100/50">
                            {tasksByStatus[colKey].map((task) => (
                                <div
                                    key={task.id}
                                    className={`group p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-violet-100 ${col.next ? 'cursor-default' : 'opacity-80'}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
                                            {task.priority}
                                        </div>
                                        <div className="text-[11px] text-[#a09cb5] font-bold flex items-center gap-1">
                                            <FiClock className="w-3 h-3" />
                                            {task.time}
                                        </div>
                                    </div>

                                    <div className="text-[14px] font-bold text-[#1e1b32] mb-1 leading-tight group-hover:text-violet-700 transition-colors">
                                        {task.description || task.task}
                                    </div>

                                    <div className="text-[12px] text-[#6b6490] font-semibold mb-4 flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                                            {task.patientName ? task.patientName.charAt(0) : 'P'}
                                        </div>
                                        {task.patientName || task.patient}
                                    </div>

                                    {col.next && (
                                        <button
                                            onClick={() => moveTask(task.id, col.next)}
                                            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-50 text-[#1e1b32] font-bold text-[12px] hover:bg-violet-600 hover:text-white transition-all duration-300 active:scale-95 border border-slate-100 group/btn"
                                        >
                                            {colKey === 'pending' ? 'Start Task' : 'Complete Task'}
                                            <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                        </button>
                                    )}

                                    {colKey === 'completed' && (
                                        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-[12px] border border-emerald-100">
                                            <FiCheckCircle className="w-3.5 h-3.5" />
                                            Done
                                        </div>
                                    )}
                                </div>
                            ))}

                            {tasksByStatus[colKey].length === 0 && (
                                <div className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-slate-200 text-slate-300 gap-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center opacity-50">
                                        {getStatusIcon(colKey)}
                                    </div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-50">Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
