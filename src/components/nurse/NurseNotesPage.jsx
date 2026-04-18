import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import NurseSidebar from './NurseSidebar';
import { FiPlus, FiClock, FiUser, FiLoader, FiInbox } from 'react-icons/fi';

export default function NurseNotesPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [patientName, setPatientName] = useState('');
    const [noteText, setNoteText] = useState('');

    const nurseEmail = localStorage.getItem('userEmail') || 'nurse@vitalsync.com';

    useEffect(() => {
        fetchNotes();

        const channel = supabase
            .channel('public:notes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
                fetchNotes();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchNotes = async () => {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .eq('created_by', nurseEmail)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notes:', error);
        } else {
            setNotes(data || []);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientName.trim() || !noteText.trim()) return;

        setIsSubmitting(true);
        const { error } = await supabase
            .from('notes')
            .insert([
                {
                    created_by: nurseEmail,
                    patient_name: patientName,
                    content: noteText
                }
            ]);

        setIsSubmitting(false);
        if (error) {
            console.error('Error adding note:', error);
            alert('Failed to add note.');
        } else {
            setPatientName('');
            setNoteText('');
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8f9fc]">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-rose-400/8 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-400/8 rounded-full blur-[140px]" />
            </div>

            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 p-6 relative z-10 flex flex-col h-screen overflow-hidden">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1e1b32] mb-2">
                            My Notes
                        </h1>
                        <p className="text-[#6b6490] font-medium">Record and view patient observations</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
                    {/* Add Note Form */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="p-6 rounded-3xl glass-strong border border-white/20 shadow-xl">
                            <h3 className="text-xl font-extrabold text-[#1e1b32] mb-6 flex items-center gap-2">
                                <span className="bg-rose-100 text-rose-500 p-2 rounded-xl">
                                    <FiPlus className="w-5 h-5" />
                                </span>
                                Add New Note
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1e1b32] mb-1.5">Patient Name</label>
                                    <input
                                        type="text"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#1e1b32] mb-1.5">Note Details</label>
                                    <textarea
                                        value={noteText}
                                        onChange={(e) => setNoteText(e.target.value)}
                                        placeholder="Enter clinical observations..."
                                        className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/50 h-32 resize-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm hover:scale-[1.02] transition-all duration-300 shadow-md shadow-rose-200 disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? <FiLoader className="animate-spin w-4 h-4" /> : 'Save Note'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Notes List */}
                    <div className="flex-1 flex flex-col p-6 rounded-3xl glass-strong border border-white/20 shadow-xl overflow-hidden">
                        <h3 className="text-xl font-extrabold text-[#1e1b32] mb-6">Recent Notes</h3>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full text-[#6b6490]">
                                    <FiLoader className="w-8 h-8 animate-spin mb-3 text-rose-400" />
                                    <p className="font-medium text-sm">Loading notes...</p>
                                </div>
                            ) : notes.length > 0 ? (
                                notes.map((note) => (
                                    <div key={note.id} className="p-5 rounded-2xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-rose-100 flex items-center justify-center text-violet-700">
                                                    <FiUser className="w-4 h-4" />
                                                </div>
                                                <span className="font-extrabold text-[#1e1b32]">{note.patient_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/60 rounded-lg text-[11px] font-bold text-[#6b6490] border border-white/40">
                                                <FiClock className="w-3 h-3 text-rose-500" />
                                                {new Date(note.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                        </div>
                                        <p className="text-[#6b6490] text-[14px] leading-relaxed font-medium pl-[40px]">
                                            {note.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-[#a09cb5] gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center">
                                        <FiInbox className="w-8 h-8 text-[#6b6490] opacity-50" />
                                    </div>
                                    <p className="font-semibold">No notes found. Add your first note.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
