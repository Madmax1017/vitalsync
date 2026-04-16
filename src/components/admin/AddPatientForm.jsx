import React, { useState } from 'react';
import { FiUser, FiHash, FiActivity, FiMapPin, FiPlus, FiLoader, FiCheckCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function AddPatientForm() {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [condition, setCondition] = useState('');
    const [room, setRoom] = useState('');
    const [status, setStatus] = useState('Stable');
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
                .from('patients')
                .insert([
                    { name, age: parseInt(age), condition, room, status }
                ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setName('');
            setAge('');
            setCondition('');
            setRoom('');
            setStatus('Stable');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error adding patient:', err.message);
            setError(err.message || 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 overflow-hidden relative group">
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                    <FiPlus className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">Add New Patient</h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider">Registration Form</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Patient Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-violet-500 transition-colors">
                                <FiUser className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Age</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-violet-500 transition-colors">
                                <FiHash className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="45"
                            />
                        </div>
                    </div>

                    {/* Condition */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Condition</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-violet-500 transition-colors">
                                <FiActivity className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="text"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="Hypertension"
                            />
                        </div>
                    </div>

                    {/* Room */}
                    <div className="space-y-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Room Number</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-violet-500 transition-colors">
                                <FiMapPin className="w-5 h-5" />
                            </div>
                            <input
                                required
                                type="text"
                                value={room}
                                onChange={(e) => setRoom(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-bold text-[#111827] placeholder:text-[#9ca3af] placeholder:font-medium"
                                placeholder="302-A"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[13px] font-black text-[#374151] ml-1">Current Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all duration-300 font-bold text-[#111827] appearance-none cursor-pointer"
                        >
                            <option value="Stable">Stable</option>
                            <option value="Observing">Observing</option>
                            <option value="Critical">Critical</option>
                            <option value="Recovered">Recovered</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-shake">
                        <FiUser className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                        Patient successfully registered in VitalSync
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[16px] shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                >
                    {loading ? (
                        <>
                            <FiLoader className="w-6 h-6 animate-spin" />
                            <span className="tracking-widest uppercase">Syncing to Database...</span>
                        </>
                    ) : (
                        <>
                            <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="tracking-widest uppercase">Register Patient</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
