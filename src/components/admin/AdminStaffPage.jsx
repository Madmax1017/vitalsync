import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { supabase } from '../../supabaseClient';

import { FiSearch, FiLoader, FiFilter, FiTrash2, FiUserPlus, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

export default function AdminStaffPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // UI States
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'doctor', specialization: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchStaff();
        const sub = supabase.channel('admin-staff-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, fetchStaff)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const fetchStaff = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .in('role', ['doctor', 'nurse'])
            .order('created_at', { ascending: false });

        if (!error && data) {
            setStaff(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete staff member ${name}?`)) return;

        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) alert('Error deleting staff: ' + error.message);
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        try {
            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', formData.email)
                .single();

            if (existingUser) {
                setFormError('Email is already in use.');
                setFormLoading(false);
                return;
            }

            // Insert new user
            const { error } = await supabase
                .from('users')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    specialization: formData.role === 'doctor' ? formData.specialization : null
                }]);

            if (error) throw error;

            // Success
            setFormData({ name: '', email: '', password: '', role: 'doctor', specialization: '' });
            setShowAddForm(false);
            fetchStaff();

        } catch (error) {
            setFormError(error.message || 'An error occurred while adding staff.');
        } finally {
            setFormLoading(false);
        }
    };

    const RoleBadge = ({ role }) => {
        const isDoctor = role === 'doctor';
        return (
            <span className={`px-2.5 py-1 rounded-md border text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit
                ${isDoctor ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                {role}
            </span>
        );
    };

    const filteredStaff = staff.filter(s => {
        const matchesSearch = (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || s.role?.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc] overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-[140px]" />
            </div>

            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-screen relative z-10 w-full min-w-0">
                <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto space-y-8">
                    <AdminTopBar />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Staff Management</h1>
                            <p className="text-[#64748b] font-medium mt-1">Manage hospital doctors and nurses</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button onClick={() => setShowAddForm(!showAddForm)} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md active:scale-95 text-sm flex items-center gap-2">
                                <FiUserPlus className="w-4 h-4" />
                                {showAddForm ? 'Close Form' : 'Add Staff'}
                            </button>
                        </div>
                    </div>

                    {showAddForm && (
                        <div className="mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
                            <div className="glass border border-white/40 rounded-3xl p-6 md:p-8 relative overflow-hidden bg-white/50 backdrop-blur-xl">
                                <h2 className="text-xl font-bold text-[#1e1b32] mb-6">Register New Staff Member</h2>

                                {formError && (
                                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600">
                                        <FiAlertCircle className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-semibold">{formError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleAddStaff} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium" placeholder="Dr. Sarah Smith" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                            <div className="relative">
                                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium" placeholder="sarah@vitalsync.com" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                            <div className="relative">
                                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium" placeholder="••••••••" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Role</label>
                                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium cursor-pointer">
                                                <option value="doctor">Doctor</option>
                                                <option value="nurse">Nurse</option>
                                            </select>
                                        </div>
                                        {formData.role === 'doctor' && (
                                            <div className="space-y-1.5 md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <label className="text-sm font-bold text-slate-700 ml-1">Specialization</label>
                                                <select required={formData.role === 'doctor'} value={formData.specialization} onChange={e => setFormData({ ...formData, specialization: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all font-medium cursor-pointer">
                                                    <option value="" disabled>Select Specialization</option>
                                                    <option value="Cardiologist">Cardiologist</option>
                                                    <option value="Neurologist">Neurologist</option>
                                                    <option value="Orthopedic">Orthopedic</option>
                                                    <option value="General Physician">General Physician</option>
                                                    <option value="Pediatrician">Pediatrician</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button disabled={formLoading} type="submit" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2">
                                            {formLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                                            {formLoading ? 'Creating...' : 'Create Staff Member'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                            <select
                                value={roleFilter}
                                onChange={e => setRoleFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium appearance-none min-w-[150px]"
                            >
                                <option value="All">All Roles</option>
                                <option value="doctor">Doctors</option>
                                <option value="nurse">Nurses</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <FiLoader className="w-10 h-10 animate-spin text-violet-400 mb-4" />
                            <span className="text-sm font-bold text-[#64748b] uppercase tracking-widest">Loading Staff...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredStaff.map(s => (
                                <div key={s.id} className="glass border border-white/40 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between h-full bg-white/40">
                                    <div className="mb-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center font-bold text-lg
                                                    ${s.role === 'doctor' ? 'bg-gradient-to-br from-blue-100 to-sky-100 text-blue-600' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600'}`}>
                                                    {s.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#1e1b32] text-lg leading-tight group-hover:text-violet-600 transition-colors">{s.name}</h3>
                                                    <p className="text-xs font-semibold text-[#94a3b8] mt-0.5 max-w-[150px] truncate" title={s.email}>{s.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start gap-2 mt-2">
                                            <RoleBadge role={s.role} />
                                            {s.role === 'doctor' && s.specialization && (
                                                <span className="px-2.5 py-1 rounded-md border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit bg-purple-100 text-purple-700 border-purple-200">
                                                    {s.specialization}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end pt-4 border-t border-slate-200/60 mt-auto">
                                        <button onClick={() => handleDelete(s.id, s.name)} className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-2 group/btn">
                                            <FiTrash2 className="w-4 h-4" />
                                            <span className="text-xs font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity absolute right-12">Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
