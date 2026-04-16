import React, { useState, useEffect } from 'react';
import { FiPlus, FiClock, FiLoader, FiInbox } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const today = new Date().getDay(); // 0=Sun, adjust for Mon-based
const todayIdx = today === 0 ? 6 : today - 1;

const statusColors = {
    scheduled: 'bg-blue-500',
    confirmed: 'bg-emerald-500',
    'in progress': 'bg-amber-400',
    completed: 'bg-violet-500',
    cancelled: 'bg-rose-400',
};

export default function SchedulePanel() {
    const [selectedDay, setSelectedDay] = useState(todayIdx);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const userEmail = localStorage.getItem('userEmail') || '';

    const fetchAppointments = async () => {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('doctor_email', userEmail)
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching schedule:', error);
        } else {
            setAppointments(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();

        const sub = supabase
            .channel('doctor-schedule')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const formatTime = (time) => {
        if (!time) return '';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${m} ${ampm}`;
    };

    return (
        <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">

            {/* Calendar Mini */}
            <div className="p-5 rounded-2xl glass overflow-hidden">
                <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight mb-4">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-3">
                    {daysOfWeek.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDay(i)}
                            className={`flex flex-col items-center py-2 rounded-xl text-[10px] font-bold transition-all duration-300 ${i === selectedDay
                                ? 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md scale-105'
                                : 'text-[#6b6490] hover:bg-white/50'
                                }`}
                        >
                            <span className="mb-0.5">{d}</span>
                            <span className={`text-sm font-extrabold ${i === selectedDay ? 'text-white' : 'text-[#1e1b32]'}`}>
                                {new Date().getDate() - todayIdx + i}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="p-5 rounded-2xl glass overflow-hidden flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Today's Schedule</h3>
                    <span className="text-[10px] font-bold text-violet-600 bg-violet-100 px-2 py-1 rounded-lg">
                        {loading ? '...' : `${appointments.length} events`}
                    </span>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-[#a09cb5]">
                            <FiLoader className="w-5 h-5 animate-spin mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map((apt, i) => (
                            <div key={apt.id || i} className="group flex items-start gap-3 p-3 rounded-xl bg-white/30 border border-white/20 hover:bg-white/60 hover:shadow-sm transition-all duration-300 cursor-pointer">
                                <div className={`w-1 h-full min-h-[36px] rounded-full ${statusColors[apt.status?.toLowerCase()] || 'bg-gray-400'} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-bold text-[#1e1b32] truncate leading-tight">
                                        {apt.patient_name} {apt.notes ? `- ${apt.notes}` : ''}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1.5">
                                        <FiClock className="w-3 h-3 text-[#a09cb5]" />
                                        <span className="text-[10px] font-semibold text-[#a09cb5]">{formatTime(apt.time)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-[#a09cb5]">
                            <FiInbox className="w-5 h-5 mb-2 opacity-50" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No appointments</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Event Button */}
            <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_-5px_rgba(124,58,237,0.4)] active:scale-95">
                <FiPlus className="w-4 h-4 stroke-[2.5]" />
                Add New Event
            </button>
        </div>
    );
}
