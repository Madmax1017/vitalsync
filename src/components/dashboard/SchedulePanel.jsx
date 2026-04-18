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
        <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-6">

            {/* Calendar Mini */}
            <div className="p-6 rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight mb-5">
                    {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedDay(i)}
                            className={`flex flex-col items-center py-2.5 rounded-2xl text-[11px] font-bold transition-all duration-300 ${i === selectedDay
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <span className="mb-1">{d}</span>
                            <span className={`text-[14px] font-extrabold ${i === selectedDay ? 'text-white' : 'text-slate-800'}`}>
                                {new Date().getDate() - todayIdx + i}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="p-6 rounded-3xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden flex-1 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-slate-200">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[16px] font-extrabold text-slate-800 tracking-tight">Today's Schedule</h3>
                    <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                        {loading ? '...' : `${appointments.length} events`}
                    </span>
                </div>

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                            <FiLoader className="w-5 h-5 animate-spin mb-2" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Loading...</span>
                        </div>
                    ) : appointments.length > 0 ? (
                        appointments.map((apt, i) => (
                            <div key={apt.id || i} className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 hover:bg-slate-50 hover:border-slate-100 hover:shadow-sm transition-all duration-300 cursor-pointer">
                                <div className={`w-1 h-full min-h-[36px] rounded-full ${statusColors[apt.status?.toLowerCase()] || 'bg-slate-300'} shrink-0`} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[13px] font-bold text-slate-800 truncate leading-tight">
                                        {apt.patient_name} {apt.notes ? `- ${apt.notes}` : ''}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <FiClock className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[11px] font-semibold text-slate-500">{formatTime(apt.time)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <FiInbox className="w-6 h-6 mb-2 opacity-50" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">No appointments</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Event Button */}
            <button className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-indigo-700 hover:shadow-[0_8px_30px_-5px_rgba(79,70,229,0.4)] active:scale-95">
                <FiPlus className="w-4 h-4 stroke-[2.5]" />
                Add New Event
            </button>
        </div>
    );
}
