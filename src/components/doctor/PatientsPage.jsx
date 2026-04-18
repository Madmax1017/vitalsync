import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import { supabase } from '../../supabaseClient';
import { FiUsers, FiSearch, FiLoader, FiFilter, FiActivity, FiUser, FiMapPin, FiX, FiPlus, FiFileText, FiClipboard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PatientsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [patients, setPatients] = useState([]);
    const [medications, setMedications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Detail View Modal
    const [selectedPatient, setSelectedPatient] = useState(null);
    const navigate = useNavigate();

    const userEmail = localStorage.getItem('userEmail') || '';

    useEffect(() => {
        fetchData();
        const sub1 = supabase.channel('doctor-patients-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchData)
            .subscribe();

        return () => supabase.removeChannel(sub1);
    }, []);

    const fetchData = async () => {
        const [pRes, mRes, tRes, nRes] = await Promise.all([
            // Filter only patients assigned to this doctor if required, but usually doctors can view all. For now, fetch all.
            supabase.from('patients').select('*').order('created_at', { ascending: false }),
            supabase.from('medications').select('*'),
            supabase.from('tasks').select('*'),
            supabase.from('notes').select('*'),
        ]);

        if (pRes.data) setPatients(pRes.data);
        if (mRes.data) setMedications(mRes.data);
        if (tRes.data) setTasks(tRes.data);
        if (nRes.data) setNotes(nRes.data);

        setLoading(false);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            stable: "bg-amber-100 text-amber-700 border-amber-200",
            critical: "bg-rose-100 text-rose-700 border-rose-200",
            observing: "bg-orange-100 text-orange-700 border-orange-200",
            recovering: "bg-emerald-100 text-emerald-700 border-emerald-200",
            recovered: "bg-blue-100 text-blue-700 border-blue-200"
        };
        const s = status?.toLowerCase() || 'stable';
        return <span className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wider ${styles[s] || styles.stable}`}>{status}</span>;
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (p.patient_id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || p.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc] overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-sky-400/5 rounded-full blur-[140px]" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-screen relative z-10 w-full min-w-0">
                <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto space-y-8">
                    <TopBar />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">My Patients</h1>
                            <p className="text-[#64748b] font-medium mt-1">Review cases, vitals, and issue clinical orders</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                            <input
                                type="text"
                                placeholder="Search by name or PT-ID"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium appearance-none min-w-[150px]"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Stable">Stable</option>
                                <option value="Observing">Observing</option>
                                <option value="Recovering">Recovering</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <FiLoader className="w-10 h-10 animate-spin text-violet-400 mb-4" />
                            <span className="text-sm font-bold text-[#64748b] uppercase tracking-widest">Loading Patient Data...</span>
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <FiSearch className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e1b32]">No patients found</h3>
                                <p className="text-[#64748b]">Try adjusting your search query</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredPatients.map(p => (
                                <div key={p.id} className={`glass border rounded-2xl p-5 transition-all duration-300 relative group cursor-pointer 
                                    ${p.status === 'Critical' ? 'border-rose-200/50 hover:shadow-rose-500/10' : 'border-white/40 hover:shadow-violet-500/10'} 
                                    hover:shadow-xl hover:-translate-y-1.5`} onClick={() => setSelectedPatient(p)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 font-bold text-lg">
                                                {p.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1e1b32] leading-tight group-hover:text-violet-600 transition-colors">{p.name}</h3>
                                                <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">{p.patient_id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#64748b] font-medium flex items-center gap-1.5"><FiActivity className="w-4 h-4" /> Cond.</span>
                                            <span className="font-semibold text-[#1e1b32] truncate max-w-[120px] text-right">{p.condition}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#64748b] font-medium flex items-center gap-1.5"><FiMapPin className="w-4 h-4" /> Room</span>
                                            <span className="font-semibold text-[#1e1b32]">{p.room_number || p.room}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <StatusBadge status={p.status} />
                                        <span className="text-[11px] font-bold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">View Details &rarr;</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* PATIENT DETAIL MODAL */}
            {selectedPatient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedPatient(null)} />
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 flex-1">
                            <button onClick={() => setSelectedPatient(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
                                    {selectedPatient.name?.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#1e1b32] flex items-center gap-3">
                                        {selectedPatient.name}
                                        <StatusBadge status={selectedPatient.status} />
                                    </h2>
                                    <p className="text-[#64748b] font-medium flex items-center gap-2">
                                        <span className="font-mono text-sm">{selectedPatient.patient_id}</span> •
                                        {selectedPatient.age} yo {selectedPatient.gender} •
                                        Room {selectedPatient.room_number || selectedPatient.room}
                                    </p>
                                </div>
                            </div>

                            {/* QUICK ACTIONS FOR DOCTOR */}
                            <div className="flex flex-wrap gap-3 mb-8 mt-6">
                                <button onClick={() => navigate('/doctor/tasks')} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors text-sm">
                                    <FiPlus className="w-4 h-4" /> Assign Task
                                </button>
                                <button onClick={() => navigate('/doctor/medications')} className="flex items-center gap-2 px-4 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold rounded-xl transition-colors text-sm">
                                    <FiClipboard className="w-4 h-4" /> Prescribe Meds
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="p-5 rounded-2xl bg-slate-50 space-y-3">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Medical Info</h4>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <span className="text-slate-500">Blood Group</span><span className="font-semibold text-slate-800">{selectedPatient.blood_group || 'N/A'}</span>
                                        <span className="text-slate-500">Condition</span><span className="font-semibold text-slate-800">{selectedPatient.condition}</span>
                                        <span className="text-slate-500">Contact No.</span><span className="font-semibold text-slate-800">{selectedPatient.contact || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="p-5 rounded-2xl bg-slate-50 space-y-3">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Care Team</h4>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <span className="text-slate-500">Assigned Dr.</span><span className="font-semibold text-slate-800 truncate" title={selectedPatient.assigned_doctor}>{selectedPatient.assigned_doctor || 'Unassigned'}</span>
                                        <span className="text-slate-500">Assigned Nurse</span><span className="font-semibold text-slate-800 truncate" title={selectedPatient.assigned_nurse}>{selectedPatient.assigned_nurse || 'Unassigned'}</span>
                                        <span className="text-slate-500">Admitted</span><span className="font-semibold text-slate-800">{new Date(selectedPatient.admission_date || selectedPatient.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* RELATIONAL DATA */}
                            <div className="space-y-8">
                                {/* Medications */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#1e1b32] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-violet-500"></span> Prescribed Medications
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {medications.filter(m => m.patient_name === selectedPatient.name).length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">No medications prescribed.</p>
                                        ) : medications.filter(m => m.patient_name === selectedPatient.name).map(m => (
                                            <div key={m.id} className="p-3 rounded-xl border border-slate-100 flex flex-col gap-1">
                                                <div className="flex justify-between">
                                                    <p className="font-bold text-sm text-[#1e1b32]">{m.medication_name}</p>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.status === 'active' ? 'bg-violet-50 text-violet-600' : 'bg-slate-100 text-slate-500'}`}>{m.status}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{m.dosage} • {m.frequency} • {m.route}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div>
                                    <h4 className="text-sm font-bold text-[#1e1b32] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Tasks / Orders
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {tasks.filter(t => t.title.includes(selectedPatient.name)).length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">No tasks assigned.</p>
                                        ) : tasks.filter(t => t.title.includes(selectedPatient.name)).map(t => (
                                            <div key={t.id} className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-sm">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="font-semibold text-slate-800">{t.title}</p>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>{t.status || 'pending'}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">Nurse: {t.assigned_to}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
