import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiCheckCircle, FiLogOut } from 'react-icons/fi';
import BookAppointment from './BookAppointment';
import MyAppointments from './MyAppointments';

const PatientDashboard = () => {
    const [user, setUser] = useState({ name: 'Patient' });
    const [stats, setStats] = useState({ upcoming: 0, completed: 0, total: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login/patient');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] bg-grid-pattern p-8 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1a2b4b] mb-1">
                        Hello, {user.name}
                    </h1>
                    <p className="text-slate-500 font-medium">Welcome back to your health portal</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-purple-200 text-purple-600 font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-300 group"
                >
                    <FiLogOut className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Stats Cards with Glassmorphism */}
                <div className="glass-patient p-6 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300">
                    <div className="p-4 bg-blue-500/10 text-blue-600 rounded-xl">
                        <FiCalendar className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Upcoming</p>
                        <p className="text-3xl font-black text-[#1a2b4b]">{stats.upcoming}</p>
                    </div>
                </div>

                <div className="glass-patient p-6 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300">
                    <div className="p-4 bg-green-500/10 text-green-600 rounded-xl">
                        <FiCheckCircle className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</p>
                        <p className="text-3xl font-black text-[#1a2b4b]">{stats.completed}</p>
                    </div>
                </div>

                <div className="glass-patient p-6 rounded-2xl flex items-center gap-4 transition-transform hover:scale-[1.02] duration-300">
                    <div className="p-4 bg-purple-500/10 text-purple-600 rounded-xl">
                        <FiClock className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Visits</p>
                        <p className="text-3xl font-black text-[#1a2b4b]">{stats.total}</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <BookAppointment user={user} />
                </div>
                <div className="lg:col-span-2">
                    <MyAppointments user={user} setStats={setStats} />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
