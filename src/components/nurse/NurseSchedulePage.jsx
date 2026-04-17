import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import NurseSidebar from './NurseSidebar';
import { FiLoader, FiInbox, FiClock, FiCalendar, FiUser } from 'react-icons/fi';

export default function NurseSchedulePage() {
    const [collapsed, setCollapsed] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();

        const channel = supabase
            .channel('public:appointments')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
                fetchAppointments();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchAppointments = async () => {
        // Fetch all upcoming appointments to give an overview of the schedule
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            setAppointments(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9fc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 p-6 lg:p-10 relative z-10 flex flex-col h-screen overflow-hidden">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-2">
                        Schedule Overview
                    </h1>
                    <p className="text-[#6b6490] font-medium">Upcoming patient appointments and procedures</p>
                </div>

                <div className="flex-1 p-8 rounded-3xl glass-strong border border-white/20 shadow-xl overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto pr-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-[#6b6490]">
                                <FiLoader className="w-8 h-8 animate-spin mb-3 text-rose-400" />
                                <p className="font-medium text-sm">Loading schedule...</p>
                            </div>
                        ) : appointments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {appointments.map((appt) => (
                                    <div key={appt.id} className="p-5 rounded-2xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-sm group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-700 font-extrabold group-hover:scale-110 transition-transform">
                                                    {appt.patient_name ? appt.patient_name.charAt(0) : 'P'}
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-[#1e1b32] text-[15px]">{appt.patient_name}</h3>
                                                    <span className="text-[12px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-lg border border-violet-100 mt-1 inline-block">
                                                        {appt.issue}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4 bg-white/40 p-3 rounded-xl border border-white/50">
                                            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6b6490]">
                                                <FiCalendar className="w-4 h-4 text-pink-500" />
                                                {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#6b6490]">
                                                <FiClock className="w-4 h-4 text-amber-500" />
                                                {appt.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-[#a09cb5] gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center">
                                    <FiInbox className="w-8 h-8 text-[#6b6490] opacity-50" />
                                </div>
                                <p className="font-semibold">No upcoming appointments.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
