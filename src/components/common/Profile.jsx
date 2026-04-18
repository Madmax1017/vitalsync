import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiLogOut, FiUsers, FiCalendar, FiCheckSquare, FiCamera } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [stats, setStats] = useState({
        patients: 0,
        appointments: 0,
        tasks: 0
    });

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        avatar_url: ''
    });

    const navigate = useNavigate();

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar_url: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const fetchProfile = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            if (!email) {
                navigate('/');
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    console.error('User not found in database.');
                }
                throw error;
            }
            if (data) {
                setUser(data);
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    avatar_url: data.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [patientsRes, apptsRes, tasksRes] = await Promise.all([
                supabase.from('patients').select('*', { count: 'exact', head: true }),
                supabase.from('appointments').select('*', { count: 'exact', head: true }),
                supabase.from('tasks').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                patients: patientsRes.count || 0,
                appointments: apptsRes.count || 0,
                tasks: tasksRes.count || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('users')
                .update({
                    name: formData.name,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;

            setUser({ ...user, ...formData });

            const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...lsUser, name: formData.name }));

            const email = localStorage.getItem('userEmail');
            if (email) {
                localStorage.setItem(`avatar_${email}`, formData.avatar_url);
            }

            // Custom event so topbar can listen and update instantly
            window.dispatchEvent(new Event('user-profile-updated'));

            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex-1 min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex-1 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center bg-[#f8fafc] rounded-3xl p-10 m-4">
                <p className="text-[#6b6490] font-medium">Could not load profile. Please check database configuration.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-[calc(100vh-80px)] overflow-y-auto p-8 relative scrollbar-hide">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#1e1b32] tracking-tight mb-2">My Profile</h1>
                    <p className="text-[#5b5675] font-medium text-sm">Manage your personal settings and activity.</p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={() => { setIsEditing(false); setFormData({ name: user.name || '', phone: user.phone || '', avatar_url: user.avatar_url || '' }); }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#e2e8f0] bg-white text-[#6b6490] font-bold text-sm tracking-wide shadow-sm hover:bg-[#f8fafc] transition-all"
                            >
                                <FiX className="w-4 h-4" /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-sm tracking-wide shadow-md shadow-violet-500/20 hover:bg-violet-700 hover:shadow-lg transition-all"
                            >
                                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave className="w-4 h-4" />}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-violet-100 text-violet-600 font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <FiEdit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 z-0" />

                        <div className="relative z-10 p-2 glass rounded-[2.5rem] mt-6 mb-4 shadow-sm group">
                            {user.avatar_url ? (
                                <img src={formData.avatar_url || user.avatar_url} alt="Profile" className="w-28 h-28 rounded-[2rem] object-cover" />
                            ) : (
                                <div className="w-28 h-28 rounded-[2rem] bg-indigo-100 text-indigo-500 flex items-center justify-center text-3xl font-bold">
                                    {(formData.name || user.email).charAt(0).toUpperCase()}
                                </div>
                            )}
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiCamera className="w-6 h-6 text-white mb-1" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change URL</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-[#1e1b32]">{user.name || 'Set your name'}</h2>
                        <div className="inline-flex items-center justify-center bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 mb-4">
                            {user.role}
                        </div>

                        <div className="w-full space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#6b6490]">
                                    <FiMail className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-[#475569]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#6b6490]">
                                    <FiPhone className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-[#475569]">{formData.phone || user.phone || 'No phone added'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="font-bold text-[#1e1b32] mb-4">Account Info</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[11px] font-bold text-[#6b6490] uppercase tracking-wider mb-1">Created At</p>
                                <p className="text-sm font-medium text-[#1e1b32]">{new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-[#6b6490] uppercase tracking-wider mb-1">User ID</p>
                                <p className="text-xs font-medium text-slate-400 font-mono tracking-tighter truncate" title={user.id}>{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings & Stats */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stats Widget */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-emerald-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-sm font-bold text-[#6b6490] mb-1">Total Patients</p>
                                    <h4 className="text-3xl font-extrabold text-[#1e1b32]">{stats.patients}</h4>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:rotate-6">
                                    <FiUsers className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-indigo-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-sm font-bold text-[#6b6490] mb-1">Appointments</p>
                                    <h4 className="text-3xl font-extrabold text-[#1e1b32]">{stats.appointments}</h4>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 transition-transform group-hover:rotate-6">
                                    <FiCalendar className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-amber-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl -mr-6 -mt-6"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="text-sm font-bold text-[#6b6490] mb-1">Tasks</p>
                                    <h4 className="text-3xl font-extrabold text-[#1e1b32]">{stats.tasks}</h4>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 transition-transform group-hover:rotate-6">
                                    <FiCheckSquare className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form / Detail View */}
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h3 className="text-xl font-bold text-[#1e1b32] mb-6 border-b border-slate-100 pb-4">Personal Details</h3>

                        <div className="space-y-6">
                            {/* row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6b6490] uppercase tracking-wider mb-2">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-[#1e1b32] shadow-sm"
                                            placeholder="John Doe"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-transparent font-medium text-[#1e1b32]">
                                            {user.name || '-'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6b6490] uppercase tracking-wider mb-2">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-[#1e1b32] shadow-sm"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 rounded-xl bg-slate-50 border border-transparent font-medium text-[#1e1b32]">
                                            {user.phone || '-'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* row 2 */}
                            <div>
                                <label className="block text-[11px] font-bold text-[#6b6490] uppercase tracking-wider mb-2">Profile Picture</label>
                                {isEditing ? (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUpload}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all font-medium text-[#1e1b32] shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
                                    />
                                ) : (
                                    <div className="px-4 py-3 rounded-xl bg-slate-50 border border-transparent font-medium text-[#1e1b32] overflow-hidden text-ellipsis whitespace-nowrap">
                                        {user.avatar_url ? 'Custom avatar set' : 'No avatar set'}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Dangerous Actions */}
                    <div className="bg-rose-50/50 rounded-3xl p-6 border border-rose-100 flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-rose-900 mb-1">Session Management</h4>
                            <p className="text-sm font-medium text-rose-700/80">Log out of your current session across all modules.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-sm shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-all"
                        >
                            <FiLogOut className="w-4 h-4" /> Log out
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
