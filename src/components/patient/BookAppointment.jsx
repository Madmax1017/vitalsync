import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiFileText, FiLoader, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

const BookAppointment = ({ user }) => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('name, email, specialization')
                    .eq('role', 'doctor');

                if (error) throw error;
                if (data) setDoctors(data);
            } catch (err) {
                console.error('Error fetching doctors:', err);
                setError('Failed to load doctors');
            } finally {
                setFetching(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorChange = (e) => {
        const docEmail = e.target.value;
        setSelectedDoctor(docEmail);
        const doc = doctors.find(d => d.email === docEmail);
        if (doc && doc.specialization) {
            setSpecialization(doc.specialization);
        } else {
            setSpecialization('General'); // Fallback if no specialization is set
        }
    };

    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedDoctor || !date || !time || !reason) {
            setError('Please fill in all details');
            return;
        }

        setLoading(true);

        try {
            const { error: insertError } = await supabase
                .from('appointments')
                .insert([{
                    patient_name: user.name,
                    patient_email: user.email,
                    doctor_email: selectedDoctor,
                    specialization,
                    date,
                    time,
                    reason,
                    status: 'scheduled',
                    created_at: new Date().toISOString()
                }]);

            if (insertError) throw insertError;

            setSuccess('Appointment booked successfully!');
            // Reset form
            setSelectedDoctor('');
            setSpecialization('');
            setDate('');
            setTime('');
            setReason('');

            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Booking error:', err);
            setError('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Book New Appointment</h2>
                <p className="text-sm text-gray-500">Schedule a visit with our specialists</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-3">
                    <FiAlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-600 flex items-center gap-3 animate-fade-in">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{success}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Name (Auto-filled) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Patient Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={user.name || ''}
                                disabled
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Doctor Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Doctor</label>
                        <select
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-700 font-medium disabled:opacity-50 shadow-sm"
                            disabled={fetching}
                        >
                            <option value="">Select a Doctor</option>
                            {doctors.map((doc, idx) => (
                                <option key={idx} value={doc.email}>
                                    Dr. {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Specialization (Auto-filled) */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Specialization</label>
                        <div className="relative">
                            <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={specialization}
                                disabled
                                placeholder="Auto-filled"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-medium"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Date</label>
                        <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                min={getTodayString()}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-700 font-medium cursor-pointer shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Time</label>
                        <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-700 font-medium cursor-pointer shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Reason for Visit</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please briefly describe your symptoms or reason for booking..."
                        rows="3"
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-700 font-medium resize-none shadow-sm"
                    ></textarea>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full md:w-auto px-8 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>
                                <FiLoader className="w-5 h-5 animate-spin" />
                                <span>Booking...</span>
                            </>
                        ) : (
                            <span>Book Appointment</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookAppointment;
