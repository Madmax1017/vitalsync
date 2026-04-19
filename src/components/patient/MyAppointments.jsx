import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiActivity } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

const MyAppointments = ({ user, setStats }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*')
                .eq('patient_email', user.email)
                .order('date', { ascending: false });

            if (error) throw error;

            if (data) {
                setAppointments(data);

                // Update stats
                const upcoming = data.filter(a => a.status === 'scheduled').length;
                const completed = data.filter(a => a.status === 'completed').length;

                if (setStats) {
                    setStats({
                        upcoming,
                        completed,
                        total: data.length
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.email) {
            fetchAppointments();

            // Real-time listener
            const subscription = supabase
                .channel(`appointments_pt_${user.email}`)
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'appointments', filter: `patient_email=eq.${user.email}` },
                    () => {
                        fetchAppointments(); // Re-fetch on any change
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        }
    }, [user.email]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'completed':
                return 'bg-green-50 text-green-600 border-green-200';
            case 'cancelled':
                return 'bg-red-50 text-red-600 border-red-200';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
                    <p className="text-sm text-gray-500">View and track your scheduled visits</p>
                </div>
            </div>

            {appointments.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FiCalendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No appointments yet</h3>
                    <p className="text-gray-500 text-sm">When you book an appointment, it will appear here.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="p-5 border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all group bg-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">Dr. {apt.doctor_email.split('@')[0]}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                            <FiActivity className="w-4 h-4 text-gray-400" />
                                            {apt.specialization || 'General'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                        <FiCalendar className="w-4 h-4 text-blue-500" />
                                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                        <FiClock className="w-4 h-4 text-amber-500" />
                                        {apt.time}
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-lg border text-sm font-bold uppercase tracking-wider ${getStatusStyle(apt.status)}`}>
                                        {apt.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointments;
