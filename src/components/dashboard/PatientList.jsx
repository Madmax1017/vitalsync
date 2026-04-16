import React from 'react';
import { supabase } from '../../supabaseClient';
import { FiLoader, FiInbox } from 'react-icons/fi';

export default function PatientList() {
    const [patients, setPatients] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchPatients = async () => {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching patients:', error);
            } else {
                setPatients(data || []);
            }
            setLoading(false);
        };

        fetchPatients();

        // Optional: Real-time subscription
        const subscription = supabase
            .channel('patients-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchPatients)
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'stable': return 'bg-emerald-100 text-emerald-700';
            case 'critical': return 'bg-rose-100 text-rose-700';
            case 'observing': return 'bg-amber-100 text-amber-700';
            case 'recovered': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    console.log("Patients:", patients);

    return (
        <div className="p-5 rounded-2xl glass overflow-hidden transition-all duration-500 hover:shadow-[0_16px_40px_-12px_rgba(124,58,237,0.08)]">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight">System Patients</h3>
                    <p className="text-[11px] text-[#a09cb5] font-medium mt-0.5">Real-time database records</p>
                </div>
                <button className="text-[12px] font-bold text-violet-600 hover:text-violet-700 transition-colors">View All</button>
            </div>

            <div className="space-y-3 min-h-[100px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-[#a09cb5]">
                        <FiLoader className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-[12px] font-bold uppercase tracking-widest">Fetching Patients...</span>
                    </div>
                ) : patients && patients.length > 0 ? (
                    patients.map((patient, i) => (
                        <div key={patient.id || i} className="group flex items-center gap-4 p-3 rounded-xl bg-white/30 border border-white/20 hover:bg-white/60 hover:shadow-sm transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-[14px] font-black text-violet-700 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300">
                                {patient.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-[#1e1b32] truncate">{patient.name}</div>
                                <div className="text-[11px] text-[#a09cb5] font-medium truncate">Age {patient.age} · {patient.condition}</div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="text-[11px] font-semibold text-[#6b6490] mb-1">Rm {patient.room}</div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusStyles(patient.status)}`}>
                                    {patient.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-[#a09cb5] bg-white/10 rounded-xl border border-dashed border-white/20">
                        <FiInbox className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-[12px] font-bold uppercase tracking-widest">No patients found</span>
                    </div>
                )}
            </div>
        </div>
    );
}
