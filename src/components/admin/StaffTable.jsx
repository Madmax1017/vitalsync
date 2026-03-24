import React from 'react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiFilter } from 'react-icons/fi';

const staffData = [
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Chief of Medicine', department: 'Cardiology', status: 'Active', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ca2737d3?auto=format&fit=crop&w=80&h=80' },
    { id: 2, name: 'Dr. Michael Chen', role: 'Senior Surgeon', department: 'Neurology', status: 'On Duty', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=80&h=80' },
    { id: 3, name: 'Nurse Emily Davis', role: 'Head Nurse', department: 'ICU', status: 'Active', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&w=80&h=80' },
    { id: 4, name: 'Dr. James Wilson', role: 'Specialist', department: 'Pediatrics', status: 'Off Duty', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=80&h=80' },
    { id: 5, name: 'Nurse David Brown', role: 'Staff Nurse', department: 'General', status: 'Active', avatar: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=80&h=80' },
];

const getStatusStyles = (status) => {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'On Duty': return 'bg-violet-100 text-violet-700 border-violet-200';
        case 'Off Duty': return 'bg-slate-100 text-slate-500 border-slate-200';
        default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
};

export default function StaffTable() {
    return (
        <div className="p-8 rounded-[2.5rem] glass-strong border border-white/40 shadow-sm mt-8 relative overflow-hidden group">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Staff Management</h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider mt-1">Personnel Directory</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 rounded-xl bg-white/60 border border-white/50 text-[#6b6490] hover:bg-white/90 hover:text-violet-600 transition-all shadow-sm">
                        <FiFilter className="w-5 h-5" />
                    </button>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09cb5]" />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            className="pl-10 pr-4 py-2.5 rounded-xl bg-white/60 border border-white/50 text-sm font-bold text-[#1e1b32] outline-none focus:border-violet-300 transition-all w-full sm:w-64 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/20">
                            <th className="text-left py-4 px-4 text-[12px] font-black text-[#a09cb5] uppercase tracking-widest">Name & Role</th>
                            <th className="text-left py-4 px-4 text-[12px] font-black text-[#a09cb5] uppercase tracking-widest">Department</th>
                            <th className="text-left py-4 px-4 text-[12px] font-black text-[#a09cb5] uppercase tracking-widest">Status</th>
                            <th className="text-right py-4 px-4 text-[12px] font-black text-[#a09cb5] uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {staffData.map((staff) => (
                            <tr key={staff.id} className="group/row transition-all duration-300 hover:bg-white/40">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
                                            <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="text-[14px] font-black text-[#1e1b32]">{staff.name}</div>
                                            <div className="text-[11px] font-bold text-[#a09cb5]">{staff.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-[13px] font-bold text-[#6b6490] opacity-80">{staff.department}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black border uppercase tracking-wider ${getStatusStyles(staff.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${staff.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                                        {staff.status}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-row-hover:opacity-100 transition-all duration-300">
                                        <button className="p-2 rounded-lg bg-white/60 text-[#6b6490] hover:text-violet-600 hover:bg-white transition-all shadow-sm">
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/60 text-[#6b6490] hover:text-rose-600 hover:bg-white transition-all shadow-sm">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/60 text-[#6b6490] hover:text-[#1e1b32] hover:bg-white transition-all shadow-sm">
                                            <FiMoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-6">
                <span className="text-[13px] font-bold text-[#a09cb5]">Showing <span className="text-[#6b6490]">5</span> staff members</span>
                <div className="flex gap-2">
                    <button className="px-5 py-2 rounded-xl glass border border-white/50 text-[13px] font-black text-[#1e1b32] hover:bg-white/80 transition-all shadow-sm active:scale-95 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-5 py-2 rounded-xl bg-violet-600 text-white text-[13px] font-black hover:bg-violet-700 transition-all shadow-md active:scale-95">Next</button>
                </div>
            </div>
        </div>
    );
}
