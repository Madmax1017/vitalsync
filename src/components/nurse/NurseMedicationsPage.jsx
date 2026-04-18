import React, { useState, useEffect, useRef } from 'react';
import {
    FiSearch, FiActivity, FiUser, FiClock, FiLoader, FiInbox, FiCheck, FiHeart
} from 'react-icons/fi';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';

export default function NurseMedicationsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const cardsRef = useRef([]);

    const userEmail = localStorage.getItem('userEmail') || '';

    const fetchMedications = async () => {
        const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('assigned_to', userEmail)
            .eq('status', 'active')
            .order('next_dose_time', { ascending: true });

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
            .channel('nurse-meds-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'medications', filter: `assigned_to=eq.${userEmail}` }, fetchMedications)
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, [userEmail]);

    useEffect(() => {
        if (cardsRef.current.length > 0) {
            gsap.fromTo(cardsRef.current.filter(Boolean),
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)' }
            );
        }
    }, [medications, searchQuery]);

    const handleAdminister = async (id) => {
        setProcessingId(id);

        const { error } = await supabase
            .from('medications')
            .update({
                status: 'completed',
                last_administered: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error('Error administering medication:', error);
            alert('Failed to update medication status');
        } else {
            // GSAP remove animation before fetching
            const cardIndex = medications.findIndex(m => m.id === id);
            if (cardsRef.current[cardIndex]) {
                gsap.to(cardsRef.current[cardIndex], {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.3,
                    onComplete: fetchMedications
                });
            } else {
                fetchMedications();
            }
        }
        setProcessingId(null);
    };

    const filteredMeds = medications.filter(m =>
        m.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.medication_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-[140px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <NurseTopBar />

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Medication Schedule</h1>
                            <p className="text-[#64748b] font-medium">Active medications assigned to your shift</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search patients or meds..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-[#a09cb5]">
                                <FiLoader className="w-12 h-12 animate-spin mb-4" />
                                <span className="text-[14px] font-bold uppercase tracking-widest">Loading Schedule...</span>
                            </div>
                        ) : (
                            <div className="w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {medications && medications.length > 0 ? (
                                        filteredMeds.map((med, index) => {
                                            const isOverdue = new Date(med.next_dose_time) < new Date();
                                            return (
                                                <div
                                                    key={med.id}
                                                    ref={el => cardsRef.current[index] = el}
                                                    className={`group relative bg-white border ${isOverdue ? 'border-rose-200' : 'border-slate-100'} rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden`}
                                                >
                                                    <div className={`absolute top-0 right-0 w-24 h-24 ${isOverdue ? 'bg-rose-50' : 'bg-emerald-50'} rounded-full blur-2xl -mr-6 -mt-6`}></div>

                                                    <div className="relative z-10 space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider border ${isOverdue ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                                {isOverdue ? 'Overdue' : 'Scheduled'}
                                                            </div>
                                                            <span className="text-[11px] font-bold text-slate-400 capitalize">{med.frequency}</span>
                                                        </div>

                                                        <div>
                                                            <h3 className="text-[16px] font-extrabold text-[#1e1b32] leading-tight">
                                                                {med.medication_name} <span className="text-emerald-500 font-semibold">{med.dosage}</span>
                                                            </h3>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-50">
                                                            <div className="space-y-0.5">
                                                                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Patient</span>
                                                                <p className="flex items-center gap-1 text-[13px] font-semibold text-[#1e1b32] truncate">
                                                                    <FiUser className="w-3.5 h-3.5 text-slate-400" />
                                                                    {med.patient_name}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">Route</span>
                                                                <p className="flex items-center gap-1 text-[13px] font-semibold text-[#1e1b32] truncate">
                                                                    <FiHeart className="w-3.5 h-3.5 text-slate-400" />
                                                                    {med.route}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center pt-2">
                                                            <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#1e1b32]">
                                                                <FiClock className={`w-4 h-4 ${isOverdue ? 'text-rose-500' : 'text-emerald-500'}`} />
                                                                {formatTime(med.next_dose_time)}
                                                            </div>
                                                            <button
                                                                onClick={() => handleAdminister(med.id)}
                                                                disabled={processingId === med.id}
                                                                className={`px-4 py-2 rounded-xl text-white font-bold text-[12px] transition-all shadow-md active:scale-95 ${processingId === med.id ? 'bg-slate-300' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/30'}`}
                                                            >
                                                                {processingId === med.id ? 'Processing...' : 'Administer'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 xl:col-span-3 flex flex-col items-center justify-center py-20 text-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <FiCheck className="w-10 h-10" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1e1b32]">No upcoming meds</h3>
                                                <p className="text-[#64748b]">All your assigned medications have been administered.</p>
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
