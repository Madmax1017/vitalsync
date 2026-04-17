import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
// We will reuse the internal list component if possible, but actually it's easier to just build the wrapper
// Wait, the simplest way is to fetch patients and display them here.
import { supabase } from '../../supabaseClient';
import { FiUsers, FiSearch, FiLoader, FiFilter, FiActivity } from 'react-icons/fi';
import AddPatientForm from './AddPatientForm';

export default function AdminPatientsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        fetchPatients();
        const channel = supabase.channel('admin-patients-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchPatients)
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, []);

    const fetchPatients = async () => {
        const { data } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
        if (data) setPatients(data);
        setLoading(false);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            stable: "bg-emerald-100 text-emerald-700",
            critical: "bg-red-100 text-red-700",
            observing: "bg-amber-100 text-amber-700",
            recovered: "bg-blue-100 text-blue-700"
        };
        const s = status?.toLowerCase() || 'stable';
        return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[s] || styles.stable}`}>{status}</span>;
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff] overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[140px]" />
            </div>

            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative z-10 max-w-[1600px] mx-auto w-full">
                <AdminTopBar />

                <div className="mt-10 mb-8 px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1e1b32] mb-2">
                            Patient <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Database</span>
                        </h1>
                        <p className="text-[#6b6490] font-bold opacity-80">
                            Centralized view of all registered patients across all departments.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-5 py-2.5 border border-white/50 focus-within:bg-white/80 focus-within:border-violet-300 transition-all flex-1 md:w-[300px]">
                            <FiSearch className="text-[#6b6490]" />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="bg-transparent outline-none text-sm font-semibold text-[#1e1b32] placeholder-[#a09cb5] w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-10 admin-fade-in">
                    <AddPatientForm />
                </div>

                <div className="glass-strong rounded-3xl border border-white/30 p-1 overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <FiLoader className="w-8 h-8 animate-spin text-violet-500 mb-4" />
                            <span className="text-[12px] font-bold text-[#6b6490] uppercase tracking-widest">Fetching...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/40 border-b border-white/30">
                                        <th className="p-5 text-[12px] font-black text-[#6b6490] uppercase tracking-widest">Patient</th>
                                        <th className="p-5 text-[12px] font-black text-[#6b6490] uppercase tracking-widest">Age/Gender</th>
                                        <th className="p-5 text-[12px] font-black text-[#6b6490] uppercase tracking-widest">Condition</th>
                                        <th className="p-5 text-[12px] font-black text-[#6b6490] uppercase tracking-widest">Room</th>
                                        <th className="p-5 text-[12px] font-black text-[#6b6490] uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                        <tr key={p.id} className="border-b border-white/20 hover:bg-white/50 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700">
                                                        {p.name?.charAt(0)}
                                                    </div>
                                                    <div className="font-extrabold text-[#1e1b32]">{p.name}</div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm font-semibold text-[#6b6490]">{p.age} · {p.gender}</td>
                                            <td className="p-5 text-sm font-semibold text-[#1e1b32]">{p.condition}</td>
                                            <td className="p-5 text-sm font-bold text-[#6b6490]">Rm {p.room}</td>
                                            <td className="p-5"><StatusBadge status={p.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
