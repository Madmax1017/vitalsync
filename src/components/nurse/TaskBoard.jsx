import React, { useState } from 'react';
import { FiClock, FiArrowRight } from 'react-icons/fi';

const initialTasks = {
    pending: [
        { id: 1, patient: 'Emily Watson', task: 'Administer IV medication', time: '9:15 AM', priority: 'High', room: '204A' },
        { id: 2, patient: 'David Park', task: 'Check respiratory therapy', time: '9:45 AM', priority: 'Medium', room: '310B' },
        { id: 3, patient: 'Maria Garcia', task: 'Prenatal vitals check', time: '10:00 AM', priority: 'Low', room: '115C' },
    ],
    inProgress: [
        { id: 4, patient: 'James Miller', task: 'Cardiac monitoring update', time: '8:30 AM', priority: 'Critical', room: '401A' },
        { id: 5, patient: 'Sophia Lee', task: 'Blood sugar reading', time: '9:00 AM', priority: 'Medium', room: '208B' },
    ],
    completed: [
        { id: 6, patient: 'Alex Chen', task: 'Post-op wound dressing', time: '7:30 AM', priority: 'High', room: '302A' },
    ],
};

const priorityStyles = {
    Critical: 'bg-red-100 text-red-700',
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-emerald-100 text-emerald-700',
};

const columnConfig = {
    pending: { label: 'Pending', accent: 'bg-amber-400', next: 'inProgress' },
    inProgress: { label: 'In Progress', accent: 'bg-violet-500', next: 'completed' },
    completed: { label: 'Completed', accent: 'bg-emerald-500', next: null },
};

export default function TaskBoard() {
    const [tasks, setTasks] = useState(initialTasks);

    const moveTask = (fromCol, taskId) => {
        const nextCol = columnConfig[fromCol].next;
        if (!nextCol) return;

        const taskIndex = tasks[fromCol].findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const task = tasks[fromCol][taskIndex];
        setTasks(prev => ({
            ...prev,
            [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
            [nextCol]: [...prev[nextCol], task],
        }));
    };

    return (
        <div className="p-5 rounded-2xl glass">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Task Board</h3>
                    <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">Click a task to move it forward</p>
                </div>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">
                    {tasks.pending.length + tasks.inProgress.length} active
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(columnConfig).map(([colKey, col]) => (
                    <div key={colKey} className="flex flex-col gap-2">
                        {/* Column Header */}
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${col.accent}`} />
                            <span className="text-[12px] font-bold text-[#1e1b32] uppercase tracking-wider">{col.label}</span>
                            <span className="text-[10px] font-bold text-[#a09cb5] bg-white/50 px-1.5 py-0.5 rounded-md ml-auto">{tasks[colKey].length}</span>
                        </div>

                        {/* Tasks */}
                        <div className="flex flex-col gap-2 min-h-[120px]">
                            {tasks[colKey].map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => moveTask(colKey, task.id)}
                                    className={`group p-3 rounded-xl bg-white/40 border border-white/25 transition-all duration-300 ${col.next ? 'cursor-pointer hover:bg-white/70 hover:shadow-sm hover:-translate-y-0.5' : 'opacity-70'}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${priorityStyles[task.priority]}`}>{task.priority}</span>
                                        {col.next && <FiArrowRight className="w-3 h-3 text-[#a09cb5] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />}
                                    </div>
                                    <div className="text-[12px] font-bold text-[#1e1b32] mb-0.5 leading-tight">{task.task}</div>
                                    <div className="text-[11px] text-[#6b6490] font-medium mb-1.5">{task.patient} · Rm {task.room}</div>
                                    <div className="flex items-center gap-1 text-[#a09cb5]">
                                        <FiClock className="w-3 h-3" />
                                        <span className="text-[10px] font-semibold">{task.time}</span>
                                    </div>
                                </div>
                            ))}
                            {tasks[colKey].length === 0 && (
                                <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/30 text-[11px] text-[#a09cb5] font-medium">
                                    No tasks
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
