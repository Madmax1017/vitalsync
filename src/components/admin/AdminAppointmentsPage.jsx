import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { FiCalendar, FiClock, FiUser, FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AddAppointmentForm from './AddAppointmentForm';

export default function AdminAppointmentsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
        const channel = supabase.channel('admin-appts-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchAppointments = async () => {
        const { data } = await supabase.from('appointments').select('*').order('date', { ascending: true });
        if (data) setAppointments(data);
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff] overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-violet-200/20 rounded-full blur-[140px]" />
            </div>

            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative z-10 max-w-[1600px] mx-auto w-full">
                <AdminTopBar />

                <div className="mt-10 mb-8 px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1e1b32] mb-2">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Appointments</span>
                        </h1>
                        <p className="text-[#6b6490] font-bold opacity-80">
                            Manage and view all appointments scheduled across the hospital.
                        </p>
                    </div>
                </div>

                <div className="mb-10 admin-fade-in">
                    <AddAppointmentForm />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#6b6490]">
                        <FiLoader className="w-10 h-10 animate-spin mb-4 text-violet-500" />
                        <span className="font-bold tracking-widest uppercase">Loading Schedule...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {appointments.map(appt => (
                            <div key={appt.id} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-lg">
                                            {appt.patient_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-[#1e1b32] text-[15px]">{appt.patient_name}</h3>
                                            <span className="text-[12px] font-bold text-[#6b6490]">{appt.doctor_email || 'Unassigned'}</span>
                                        </div>
                                    </div>
                                    {appt.status === 'confirmed' ? (
                                        <FiCheckCircle className="text-emerald-500 w-5 h-5" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                                    )}
                                </div>
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3 text-[13px] font-medium text-[#6b6490]">
                                        <FiCalendar className="w-4 h-4 text-violet-500" /> {appt.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] font-medium text-[#6b6490]">
                                        <FiClock className="w-4 h-4 text-amber-500" /> {appt.time}
                                    </div>
                                    <div className="flex items-center gap-3 text-[13px] font-medium text-[#6b6490]">
                                        <FiUser className="w-4 h-4 text-blue-500" /> {appt.reason || 'No reason specified'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${appt.status === 'scheduled' ? 'bg-blue-50 text-blue-600' : appt.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {appt.status}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex gap-2">
                                    {appt.status === 'scheduled' && (
                                        <>
                                            <button onClick={() => updateStatus(appt.id, 'completed')} className="flex-1 text-[13px] font-bold py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                                                Complete
                                            </button>
                                            <button onClick={() => updateStatus(appt.id, 'cancelled')} className="flex-1 text-[13px] font-bold py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
