import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch, FiActivity, FiUser, FiFileText, FiAlertCircle,
    FiMail, FiPlus, FiClock, FiLoader, FiInbox, FiCheck, FiHeart, FiEdit2, FiTrash2
} from 'react-icons/fi';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';

export default function MedicationsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [editingId, setEditingId] = useState(null);
    const cardsRef = useRef([]);
    const formRef = useRef(null);

    const userEmail = localStorage.getItem('userEmail') || '';

    const [form, setForm] = useState({
        patient_name: '',
        medication_name: '',
        dosage: '',
        frequency: 'once daily',
        route: 'Oral',
        assigned_to: '',
        next_dose_time: '',
    });

    const fetchMedications = async () => {
        const { data, error } = await supabase
            .from('medications')
            .select('*')
            // To be comprehensive, allow doctor to edit any meds, but strictly fetch all or fetch by email. Assuming they fetch all meds for simplicity if the admin also sees them. Let's fetch all for patients.
            // For now, retaining the original behavior of fetching 'prescribed_by: userEmail' or fetching all.
            // .eq('prescribed_by', userEmail)  <- removing this lets doctors see all meds, which is more realistic in a real ward. We will fetch all.
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching medications:', error);
        } else {
            setMedications(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMedications();

        const subscription = supabase
            .channel('doctor-medications-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, fetchMedications)
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, []);

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(cardsRef.current.filter(Boolean),
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' }
            );
        }
    }, [medications, searchQuery]);

    useEffect(() => {
        if (showForm && formRef.current) {
            gsap.fromTo(formRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
            );
        }
    }, [showForm]);

    const handlePrescribe = () => {
        setEditingId(null);
        setForm({ patient_name: '', medication_name: '', dosage: '', frequency: 'once daily', route: 'Oral', assigned_to: '', next_dose_time: '' });
        setShowForm(true);
    };

    const handleEdit = (med) => {
        setEditingId(med.id);
        const dt = new Date(med.next_dose_time);
        // Correctly format datetime localized string for the datetime-local input
        const iso = dt.getTime() ? new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
        setForm({
            patient_name: med.patient_name,
            medication_name: med.medication_name,
            dosage: med.dosage,
            frequency: med.frequency,
            route: med.route,
            assigned_to: med.assigned_to,
            next_dose_time: iso,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to discontinue and delete this medication?")) return;
        const { error } = await supabase.from('medications').delete().eq('id', id);
        if (error) {
            console.error('Error deleting:', error);
            alert('Failed to delete medication.');
        } else {
            fetchMedications();
            setSuccessMsg('Medication discontinued and deleted.');
            setTimeout(() => setSuccessMsg(''), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const localTime = new Date(form.next_dose_time);
        const isoTime = localTime.toISOString();

        if (editingId) {
            const { error } = await supabase.from('medications').update({
                patient_name: form.patient_name,
                medication_name: form.medication_name,
                dosage: form.dosage,
                frequency: form.frequency,
                route: form.route,
                prescribed_by: userEmail,
                assigned_to: form.assigned_to,
                next_dose_time: isoTime,
            }).eq('id', editingId);

            if (error) {
                console.error('Error updating medication:', error);
                alert('Failed to update medication. Please try again.');
            } else {
                setForm({ patient_name: '', medication_name: '', dosage: '', frequency: 'once daily', route: 'Oral', assigned_to: '', next_dose_time: '' });
                setSuccessMsg('Medication updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
                setShowForm(false);
                setEditingId(null);
                fetchMedications();
            }
        } else {
            const { error } = await supabase.from('medications').insert([{
                patient_name: form.patient_name,
                medication_name: form.medication_name,
                dosage: form.dosage,
                frequency: form.frequency,
                route: form.route,
                prescribed_by: userEmail,
                assigned_to: form.assigned_to,
                status: 'active',
                next_dose_time: isoTime,
            }]);

            if (error) {
                console.error('Error creating medication:', error);
                alert('Failed to prescribe medication. Please try again.');
            } else {
                setForm({ patient_name: '', medication_name: '', dosage: '', frequency: 'once daily', route: 'Oral', assigned_to: '', next_dose_time: '' });
                setSuccessMsg('Medication prescribed successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
                setShowForm(false);
                fetchMedications();
            }
        }
        setSubmitting(false);
    };

    const filteredMeds = medications.filter(m =>
        m.medication_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-[140px]" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <TopBar />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Medication Control</h1>
                            <p className="text-[#64748b] font-medium">Prescribe and monitor active medications.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search medications..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                            <button
                                onClick={handlePrescribe}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <FiPlus className="w-4.5 h-4.5 stroke-[2.5]" />
                                <span className="hidden sm:inline">Prescribe</span>
                            </button>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[14px] shadow-sm animate-pulse">
                            <FiCheck className="w-5 h-5 stroke-[2.5]" />
                            {successMsg}
                        </div>
                    )}

                    {showForm && (
                        <div ref={formRef} className="bg-white/70 backdrop-blur-xl border border-emerald-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-500/5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                                    <FiActivity className="w-5 h-5 text-white stroke-[2.5]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-extrabold text-[#1e1b32]">{editingId ? 'Update Medication' : 'Prescribe Medication'}</h2>
                                    <p className="text-[13px] text-[#64748b] font-medium">{editingId ? 'Modify active prescription details' : 'Add a new medication to the ward schedule'}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiUser className="w-3.5 h-3.5" /> Patient Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.patient_name}
                                            onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiFileText className="w-3.5 h-3.5" /> Medication Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.medication_name}
                                            onChange={(e) => setForm({ ...form, medication_name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiAlertCircle className="w-3.5 h-3.5" /> Dosage
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. 500mg"
                                            value={form.dosage}
                                            onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiActivity className="w-3.5 h-3.5" /> Frequency
                                        </label>
                                        <select
                                            value={form.frequency}
                                            onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium text-slate-700"
                                        >
                                            <option value="once daily">Once daily</option>
                                            <option value="twice daily">Twice daily</option>
                                            <option value="every 8 hours">Every 8 hours</option>
                                            <option value="every 6 hours">Every 6 hours</option>
                                            <option value="as needed">As needed (PRN)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiHeart className="w-3.5 h-3.5" /> Route
                                        </label>
                                        <select
                                            value={form.route}
                                            onChange={(e) => setForm({ ...form, route: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium text-slate-700"
                                        >
                                            <option value="Oral">Oral</option>
                                            <option value="IV">IV</option>
                                            <option value="Injection">Injection</option>
                                            <option value="Topical">Topical</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiMail className="w-3.5 h-3.5" /> Assign To (Nurse Email)
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={form.assigned_to}
                                            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2 lg:col-span-3">
                                        <label className="text-[13px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FiClock className="w-3.5 h-3.5" /> First Dose Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={form.next_dose_time}
                                            onChange={(e) => setForm({ ...form, next_dose_time: e.target.value })}
                                            className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[14px] shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <FiLoader className="w-4.5 h-4.5 animate-spin" />
                                        ) : (
                                            <FiCheck className="w-4.5 h-4.5 stroke-[2.5]" />
                                        )}
                                        {submitting ? 'Processing...' : (editingId ? 'Update Medication' : 'Prescribe Details')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-6 py-3.5 rounded-2xl text-slate-400 font-bold text-[14px] hover:text-slate-600 hover:bg-slate-50 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Medications List */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#a09cb5]">
                                <FiLoader className="w-12 h-12 animate-spin mb-4" />
                                <span className="text-[14px] font-bold uppercase tracking-widest">Loading Medications...</span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {medications && medications.length > 0 ? (
                                        filteredMeds.map((med, index) => (
                                            <div
                                                key={med.id}
                                                ref={el => cardsRef.current[index] = el}
                                                className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-6 -mt-6"></div>

                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`px-2 py-1 flex items-center justify-center rounded bg-emerald-100 text-emerald-700 text-xs font-bold leading-none uppercase`}>
                                                                {med.status}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleEdit(med); }}
                                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                title="Edit Medication"
                                                            >
                                                                <FiEdit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(med.id); }}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                                title="Delete Medication"
                                                            >
                                                                <FiTrash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className="text-[16px] font-extrabold text-[#1e1b32] leading-tight group-hover:text-emerald-600 transition-colors duration-300">
                                                            {med.medication_name} <span className="text-[#94a3b8] font-semibold text-[13px]">{med.dosage}</span>
                                                        </h3>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-50">
                                                        <div className="space-y-0.5">
                                                            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Patient</span>
                                                            <p className="text-[13px] font-semibold text-[#1e1b32] truncate">{med.patient_name}</p>
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Route</span>
                                                            <p className="text-[13px] font-semibold text-[#1e1b32] truncate">{med.route}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center text-[12px]">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">Assigned to</span>
                                                            <div className="flex items-center gap-1.5 font-medium text-[#64748b]">
                                                                <FiUser className="w-3.5 h-3.5 text-emerald-500" />
                                                                {med.assigned_to.split('@')[0]}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[#94a3b8] font-bold uppercase tracking-wider text-[10px]">Next Dose</span>
                                                            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                                {formatDate(med.next_dose_time)}
                                                            </span>
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
                                                <h3 className="text-xl font-bold text-[#1e1b32]">No active medications</h3>
                                                <p className="text-[#64748b]">Click "Prescribe" to add a new medication.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
