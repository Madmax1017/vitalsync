import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiHeart,
    FiCalendar,
    FiFileText,
    FiMessageSquare,
    FiClock,
    FiLogOut,
    FiChevronRight
} from 'react-icons/fi';

const quickActions = [
    {
        title: 'Book Appointment',
        description: 'Reserve your next consultation with your doctor.',
        icon: FiCalendar,
        accent: 'from-emerald-500 to-teal-500'
    },
    {
        title: 'Medical Records',
        description: 'View lab reports, prescriptions, and care notes.',
        icon: FiFileText,
        accent: 'from-cyan-500 to-sky-500'
    },
    {
        title: 'Care Team Chat',
        description: 'Message your nurse or doctor for quick follow-ups.',
        icon: FiMessageSquare,
        accent: 'from-indigo-500 to-blue-500'
    }
];

export default function PatientPortal() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const patientName = parsedUser?.name || 'Patient';

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f6faf8] relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[460px] h-[460px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] left-[-10%] w-[520px] h-[520px] rounded-full bg-cyan-300/20 blur-[140px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-12 space-y-8">
                <header className="glass rounded-[2rem] p-6 md:p-8 border border-white/40 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div className="space-y-2">
                            <p className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-700">VitalSync Patient Portal</p>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0f172a]">
                                Welcome back, {patientName}
                            </h1>
                            <p className="text-[#4b5563] max-w-2xl">
                                Manage your care journey in one place: appointments, records, updates, and communication with your healthcare team.
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                        >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {quickActions.map((action) => (
                        <article
                            key={action.title}
                            className="glass rounded-[1.75rem] p-6 border border-white/50 shadow-lg hover:-translate-y-1 transition-transform"
                        >
                            <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${action.accent} text-white shadow-md mb-5`}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-[#0f172a] mb-2">{action.title}</h2>
                            <p className="text-[#4b5563] leading-relaxed mb-5">{action.description}</p>
                            <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                                Open
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </article>
                    ))}
                </section>

                <section className="glass rounded-[2rem] p-6 md:p-8 border border-white/40 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                            <FiClock className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-[#0f172a]">Next Visit</h3>
                            <p className="text-[#4b5563]">Tuesday, 10:30 AM with Dr. Sharma at Outpatient Wing B.</p>
                            <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                                View Appointment Details
                                <FiChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>

                <footer className="text-center text-sm text-[#6b7280] font-medium flex items-center justify-center gap-2">
                    <FiHeart className="w-4 h-4 text-rose-500" />
                    Your health data is protected and encrypted.
                </footer>
            </div>
        </div>
    );
}
