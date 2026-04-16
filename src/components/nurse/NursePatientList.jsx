import React from 'react';
import { supabase } from '../../supabaseClient';
import { FiLoader, FiInbox } from 'react-icons/fi';

export default function NursePatientList({ selectedPatient, setSelectedPatient }) {
    const [patients, setPatients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchPatients = async () => {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients(data || []);
            // If no patient selected, select the first one
            if (!selectedPatient && data && data.length > 0) {
                setSelectedPatient(data[0]);
            }
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchPatients();

        const subscription = supabase
            .channel('nurse-patients-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchPatients)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'stable': return { bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
            case 'critical': return { bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
            case 'observing': return { bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
            case 'recovered': return { bg: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
            default: return { bg: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
        }
    };

    console.log("Patients:", patients);

    return (
        <div className="p-5 rounded-2xl glass">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">Assigned Patients</h3>
                    <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">
                        {loading ? '---' : patients.length} patients in your care
                    </p>
                </div>
            </div>

            <div className="space-y-2 min-h-[100px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8 text-[#a09cb5]">
                        <FiLoader className="w-6 h-6 animate-spin mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : patients && patients.length > 0 ? (
                    patients.map((p) => {
                        const styles = getStatusStyles(p.status);
                        return (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${selectedPatient?.id === p.id
                                    ? 'bg-white/70 border-rose-200/50 shadow-sm shadow-rose-100'
                                    : 'bg-white/30 border-white/20 hover:bg-white/60 hover:shadow-sm'
                                    }`}
                            >
                                <div className="relative shrink-0">
                                    <div className={`w-2 h-2 rounded-full ${styles.dot} absolute -top-0.5 -right-0.5 z-10 shadow-sm`} />
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center text-[13px] font-extrabold text-[#3b3260]">
                                        {p.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-bold text-[#1e1b32] truncate">{p.name}</div>
                                    <div className="text-[10px] text-[#a09cb5] font-medium">Rm {p.room} · {p.condition}</div>
                                </div>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${styles.bg}`}>{p.status}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-[#a09cb5] bg-white/10 rounded-xl border border-dashed border-white/20">
                        <FiInbox className="w-6 h-6 mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No patients</span>
                    </div>
                )}
            </div>
        </div>
    );
}
