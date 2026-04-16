import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSliders, FiCalendar, FiClock, FiUser, FiFileText, FiMoreVertical } from 'react-icons/fi';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';
import { FiLoader, FiInbox } from 'react-icons/fi';

export default function AppointmentsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardsRef = useRef([]);

    const userEmail = localStorage.getItem('userEmail') || '';

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_email', userEmail)
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            setAppointments(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();

        const subscription = supabase
            .channel('doctor-appointments-page')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, []);

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(cardsRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }
            );
        }
    }, [searchQuery, appointments]);

    const filteredAppointments = appointments.filter(a =>
        a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.status || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'in progress': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'completed': return 'bg-violet-50 text-violet-600 border-violet-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${m} ${ampm}`;
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-[140px]" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <TopBar />

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Appointments</h1>
                            <p className="text-[#64748b] font-medium">View and manage your scheduled appointments</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                            <button className="p-2.5 rounded-xl border border-white/40 glass bg-white/40 text-[#64748b] hover:text-blue-600 hover:bg-white/80 transition-all duration-300 shadow-sm">
                                <FiSliders className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Appointments Grid */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#a09cb5]">
                                <FiLoader className="w-12 h-12 animate-spin mb-4" />
                                <span className="text-[14px] font-bold uppercase tracking-widest">Loading Appointments...</span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {appointments && appointments.length > 0 ? (
                                        filteredAppointments.map((apt, index) => (
                                            <div
                                                key={apt.id}
                                                ref={el => cardsRef.current[index] = el}
                                                className="group relative bg-white/60 border border-white/40 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-blue-600 shadow-inner">
                                                                <FiCalendar className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-[#1e1b32] group-hover:text-blue-700 transition-colors duration-300">{apt.patient_name}</h3>
                                                                <p className="text-[13px] text-[#64748b] font-medium">{apt.date}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-[#94a3b8] hover:text-[#1e1b32] p-1 transition-colors">
                                                            <FiMoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 py-2">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                                                <FiClock className="w-3.5 h-3.5" />
                                                                Time
                                                            </div>
                                                            <div className="text-[14px] font-semibold text-[#334155]">{formatTime(apt.time)}</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                                                <FiFileText className="w-3.5 h-3.5" />
                                                                Notes
                                                            </div>
                                                            <div className="text-[14px] font-semibold text-[#334155] truncate">{apt.notes || '—'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                                                        <div className={`px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusStyles(apt.status)}`}>
                                                            {apt.status}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b]">
                                                            <FiClock className="w-3.5 h-3.5" />
                                                            {apt.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FiInbox className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1e1b32]">No appointments found</h3>
                                                <p className="text-[#64748b]">Appointments will appear here when assigned by Admin</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {appointments.length > 0 && filteredAppointments.length === 0 && (
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
