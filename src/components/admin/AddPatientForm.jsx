import React, { useState, useEffect } from 'react';
import { FiUser, FiHash, FiActivity, FiMapPin, FiPlus, FiLoader, FiCheckCircle, FiDroplet, FiPhone, FiEdit3 } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

export default function AddPatientForm({ initialData = null, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        blood_group: 'O+',
        condition: '',
        room_number: '',
        status: 'Stable',
        contact: '',
        assigned_doctor: '',
        assigned_nurse: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                age: initialData.age || '',
                gender: initialData.gender || 'Male',
                blood_group: initialData.blood_group || 'O+',
                condition: initialData.condition || '',
                room_number: initialData.room_number || initialData.room || '', // fallback to old room
                status: initialData.status || 'Stable',
                contact: initialData.contact || '',
                assigned_doctor: initialData.assigned_doctor || '',
                assigned_nurse: initialData.assigned_nurse || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            if (initialData?.id) {
                // EDIT MODE
                const { error: updateError } = await supabase
                    .from('patients')
                    .update({
                        ...formData,
                        age: parseInt(formData.age),
                        room: formData.room_number // Keeping legacy room synced
                    })
                    .eq('id', initialData.id);

                if (updateError) throw updateError;
            } else {
                // CREATE MODE
                const patientId = "PT-" + Date.now().toString().slice(-6);
                const { error: insertError } = await supabase
                    .from('patients')
                    .insert([{
                        ...formData,
                        patient_id: patientId,
                        age: parseInt(formData.age),
                        room: formData.room_number // Keeping legacy room synced
                    }]);

                if (insertError) throw insertError;
            }

            setSuccess(true);

            if (!initialData) {
                setFormData({
                    name: '', age: '', gender: 'Male', blood_group: 'O+', condition: '',
                    room_number: '', status: 'Stable', contact: '', assigned_doctor: '', assigned_nurse: ''
                });
            }

            setTimeout(() => {
                setSuccess(false);
                if (onSuccess) onSuccess();
            }, 1500);

        } catch (err) {
            console.error('Error saving patient:', err.message);
            setError(err.message || 'Failed to save patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 relative">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
                    {initialData ? <FiEdit3 className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="text-xl font-black text-[#1e1b32] tracking-tight">
                        {initialData ? 'Edit Patient' : 'Add New Patient'}
                    </h3>
                    <p className="text-[13px] text-[#a09cb5] font-bold uppercase tracking-wider">Registration Form</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="John Doe" />
                    </div>

                    {/* Age */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Age</label>
                        <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="45" />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Blood Group */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Blood Group</label>
                        <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]">
                            <option value="A+">A+</option><option value="A-">A-</option>
                            <option value="B+">B+</option><option value="B-">B-</option>
                            <option value="O+">O+</option><option value="O-">O-</option>
                            <option value="AB+">AB+</option><option value="AB-">AB-</option>
                        </select>
                    </div>

                    {/* Condition */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Condition</label>
                        <input required type="text" name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="Hypertension" />
                    </div>

                    {/* Room */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Room Number</label>
                        <input required type="text" name="room_number" value={formData.room_number} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="302-A" />
                    </div>

                    {/* Status */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]">
                            <option value="Stable">Stable</option>
                            <option value="Observing">Observing</option>
                            <option value="Recovering">Recovering</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    {/* Contact */}
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Contact No.</label>
                        <input required type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="+1 234 567 8900" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 pt-4 border-t border-white/20">
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Assigned Doctor (Email)</label>
                        <input type="email" name="assigned_doctor" value={formData.assigned_doctor} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="doctor@vitalsync.com" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[12px] font-bold text-[#6b6490] uppercase tracking-wider ml-1">Assigned Nurse (Email)</label>
                        <input type="email" name="assigned_nurse" value={formData.assigned_nurse} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-white/50 bg-white/40 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all font-semibold text-[#1e1b32]" placeholder="nurse@vitalsync.com" />
                    </div>
                </div>

                {error && <div className="text-rose-500 text-sm font-bold mt-2">{error}</div>}
                {success && <div className="text-emerald-500 text-sm font-bold mt-2 flex items-center gap-2"><FiCheckCircle /> Successfully Saved!</div>}

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-violet-600 text-white font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all w-full md:w-auto">
                        {loading ? 'Saving...' : initialData ? 'Update Patient' : 'Register Patient'}
                    </button>
                </div>
            </form>
        </div>
    );
}
