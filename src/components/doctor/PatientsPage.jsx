"use client";
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSliders, FiPlus, FiMoreVertical, FiActivity, FiUser, FiMapPin, FiClock } from 'react-icons/fi';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import PatientDetailPanel from './PatientDetailPanel';
import gsap from 'gsap';

const defaultVitals = { heartRate: '—', bp: '—', temp: '—' };

function normalizePatient(raw) {
    const vitals =
        raw.vitals && typeof raw.vitals === 'object' && !Array.isArray(raw.vitals)
            ? { ...defaultVitals, ...raw.vitals }
            : { ...defaultVitals };
    return {
        ...raw,
        vitals,
        medications: Array.isArray(raw.medications) ? raw.medications : [],
        notes: raw.notes ?? '',
    };
}

export default function PatientsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [loadState, setLoadState] = useState({ status: 'loading', error: null });

    const cardsRef = useRef([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/patients');
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || 'Failed to load patients');
                }
                const list = (json.data || []).map(normalizePatient);
                if (!cancelled) {
                    setPatients(list);
                    setLoadState({ status: 'ready', error: null });
                }
            } catch (e) {
                if (!cancelled) {
                    setLoadState({
                        status: 'error',
                        error: e instanceof Error ? e.message : 'Failed to load patients',
                    });
                }
            }
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        if (loadState.status !== 'ready') return;
        const nodes = cardsRef.current.filter(Boolean);
        if (!nodes.length) return;
        gsap.fromTo(nodes,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }
        );
    }, [searchQuery, loadState.status, patients]);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.room.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'stable': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'critical': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'recovering': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const handlePatientClick = (patient) => {
        setSelectedPatient(patient);
        setIsPanelOpen(true);
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            {/* Ambient bg orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-violet-400/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-400/5 rounded-full blur-[140px]" />
            </div>

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <div className="p-4 md:p-6 lg:p-8 space-y-8">
                    <TopBar />

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Patients</h1>
                            <p className="text-[#64748b] font-medium">Manage and view all assigned patients</p>
                        </div>

                        {/* Search & Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                                <input
                                    type="text"
                                    placeholder="Search patients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/40 glass bg-white/40 focus:bg-white/80 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 outline-none transition-all duration-300 text-[14px] font-medium placeholder:text-[#94a3b8]"
                                />
                            </div>
                            <button className="p-2.5 rounded-xl border border-white/40 glass bg-white/40 text-[#64748b] hover:text-violet-600 hover:bg-white/80 transition-all duration-300 shadow-sm">
                                <FiSliders className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {loadState.status === 'loading' && (
                        <p className="text-[#64748b] font-medium">Loading patients…</p>
                    )}
                    {loadState.status === 'error' && (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-800 text-sm">
                            <p className="font-bold">Could not load patients from the database.</p>
                            <p className="mt-1">{loadState.error}</p>
                            <p className="mt-2 text-rose-700/90">Run <code className="rounded bg-white/60 px-1">sql/init-doctor-module.sql</code> in pgAdmin, then refresh.</p>
                        </div>
                    )}

                    {/* Patients Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredPatients.map((patient, index) => (
                            <div
                                key={patient.id}
                                ref={el => cardsRef.current[index] = el}
                                onClick={() => handlePatientClick(patient)}
                                className="group relative bg-white/60 border border-white/40 backdrop-blur-md rounded-2xl p-5 hover:shadow-2xl hover:shadow-violet-500/5 hover:-translate-y-1.5 transition-all duration-500 cursor-pointer overflow-hidden"
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-violet-500/0 to-violet-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600 shadow-inner">
                                                <FiUser className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1e1b32] group-hover:text-violet-700 transition-colors duration-300">{patient.name}</h3>
                                                <p className="text-[13px] text-[#64748b] font-medium">{patient.age} years old</p>
                                            </div>
                                        </div>
                                        <button className="text-[#94a3b8] hover:text-[#1e1b32] p-1 transition-colors">
                                            <FiMoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                                <FiActivity className="w-3.5 h-3.5" />
                                                Condition
                                            </div>
                                            <div className="text-[14px] font-semibold text-[#334155] truncate">{patient.condition}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#94a3b8] uppercase tracking-wider">
                                                <FiMapPin className="w-3.5 h-3.5" />
                                                Room
                                            </div>
                                            <div className="text-[14px] font-semibold text-[#334155]">{patient.room}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/50">
                                        <div className={`px-3 py-1 rounded-full text-[12px] font-bold border ${getStatusStyles(patient.status)}`}>
                                            {patient.status}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#64748b]">
                                            <FiClock className="w-3.5 h-3.5" />
                                            Updated 2h ago
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredPatients.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <FiSearch className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#1e1b32]">No patients found</h3>
                                <p className="text-[#64748b]">Try adjusting your search query</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Patient Detail Side Panel */}
            <PatientDetailPanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                patient={selectedPatient}
            />
        </div>
    );
}
