import React, { useState } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiClock, FiFileText, FiLink } from 'react-icons/fi';

export default function AddTaskModal({ isOpen, onClose, patientName, patientId }) {
    const [task, setTask] = useState({
        description: '',
        priority: 'Medium',
        time: 'Immediately'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save to localStorage
        const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const newTask = {
            ...task,
            id: Date.now(),
            patientId,
            patientName,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        localStorage.setItem('tasks', JSON.stringify([...existingTasks, newTask]));

        // Reset and close
        setTask({ description: '', priority: 'Medium', time: 'Immediately' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-100">
                {/* Header */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                    <div className="w-16 h-16 rounded-[22px] bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20">
                        <FiCheck className="w-8 h-8 stroke-[3]" />
                    </div>
                    <h2 className="text-2xl font-extrabold">Assign Task</h2>
                    <p className="text-white/70 font-medium text-[15px] mt-1">Assigning to {patientName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FiFileText className="w-4 h-4" />
                            Description
                        </label>
                        <textarea
                            required
                            rows="2"
                            placeholder="e.g., Administer morning doses..."
                            value={task.description}
                            onChange={(e) => setTask({ ...task, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-slate-300"
                        />
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FiAlertCircle className="w-4 h-4" />
                            Priority
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Low', 'Medium', 'High'].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setTask({ ...task, priority: p })}
                                    className={`py-2.5 rounded-xl text-[13px] font-bold border transition-all duration-300 ${task.priority === p
                                        ? p === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100 ring-2 ring-rose-500/5'
                                            : p === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100 ring-2 ring-amber-500/5'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-2 ring-emerald-500/5'
                                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FiClock className="w-4 h-4" />
                            Time Frame
                        </label>
                        <select
                            value={task.time}
                            onChange={(e) => setTask({ ...task, time: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-bold text-slate-600 appearance-none cursor-pointer"
                        >
                            <option>Immediately</option>
                            <option>Within 1 Hour</option>
                            <option>Morning Shift</option>
                            <option>Evening Shift</option>
                        </select>
                    </div>

                    {/* Action */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-[15px] shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        Create Task
                        <FiLink className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full text-slate-400 font-bold text-[13px] hover:text-slate-600 transition-colors uppercase tracking-widest"
                    >
                        Maybe Later
                    </button>
                </form>
            </div>
        </div>
    );
}
