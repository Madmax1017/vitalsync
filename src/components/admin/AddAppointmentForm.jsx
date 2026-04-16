import React, { useState } from 'react';
import { FiCalendar, FiClock, FiUser, FiMail, FiFileText, FiPlus, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function AddAppointmentForm() {
    const [patientName, setPatientName] = useState('');
    const [doctorEmail, setDoctorEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('Scheduled');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error: insertError } = await supabase
                .from('appointments')
                .insert([
                    {
                        patient_name: patientName,
                        doctor_email: doctorEmail,
                        date,
                        time,
                        status,
                        notes
                    }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setPatientName('');
            setDoctorEmail('');
            setDate('');
            setTime('');
            setStatus('Scheduled');
            setNotes('');

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error creating appointment:', err.message);
            setError(err.message || 'Failed to create appointment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 overflow-hidden relative group">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg">
                    <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Create Appointment</h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider">Scheduling Form</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Name */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Patient Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-blue-500 transition-colors">
                                <FiUser className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="text"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Doctor Email */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Doctor Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-blue-500 transition-colors">
                                <FiMail className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="email"
                                value={doctorEmail}
                                onChange={(e) => setDoctorEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="doctor@vitalsync.com"
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Date</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-blue-500 transition-colors">
                                <FiCalendar className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827]"
                            />
                        </div>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Time</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-blue-500 transition-colors">
                                <FiClock className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827]"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827] appearance-none cursor-pointer"
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Notes</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-blue-500 transition-colors">
                                <FiFileText className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="Follow-up checkup, bring reports..."
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3">
                        <FiCalendar className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold flex items-center gap-3">
                        <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                        Appointment successfully created in VitalSync
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-[16px] shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                    {loading ? (
                        <>
                            <FiLoader className="w-6 h-6 animate-spin" />
                            <span className="tracking-widest uppercase">Creating Appointment...</span>
                        </>
                    ) : (
                        <>
                            <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="tracking-widest uppercase">Create Appointment</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
