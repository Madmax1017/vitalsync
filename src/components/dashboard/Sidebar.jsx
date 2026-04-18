import React, { useState } from 'react';
import {
    FiGrid, FiUsers, FiCalendar, FiFileText, FiUser,
    FiLogOut, FiChevronLeft, FiChevronRight, FiHeart, FiBarChart2, FiCheckSquare, FiCoffee
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/doctor' },
    { icon: FiUsers, label: 'Patients', path: '/doctor/patients' },
    { icon: FiCalendar, label: 'Appointments', path: '/doctor/appointments' },
    { icon: FiCheckSquare, label: 'Tasks', path: '/doctor/tasks' },
    { icon: FiHeart, label: 'Medications', path: '/doctor/medications' },
    { icon: FiBarChart2, label: 'Analytics', path: '/doctor/analytics' },
    { icon: FiCoffee, label: 'Canteen', path: '/doctor/canteen' },
    { icon: FiFileText, label: 'Reports', path: '/doctor/reports' },
    { icon: FiUser, label: 'Profile', path: '/doctor/profile' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className={`${collapsed ? 'w-[80px]' : 'w-[260px]'} h-screen sticky top-0 flex flex-col glass-strong border-r border-white/20 transition-all duration-500 ease-out z-50 shrink-0`}>
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/15">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <FiHeart className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
                {!collapsed && <span className="text-lg font-extrabold tracking-tight text-[#1e1b32] whitespace-nowrap cursor-pointer" onClick={() => navigate('/')}>VitalSync</span>}
            </div>

            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                {menuItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={i}
                            onClick={() => navigate(item.path)}
                            className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 w-full text-left ${isActive
                                ? 'bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-violet-700 shadow-sm'
                                : 'text-[#6b6490] hover:bg-white/50 hover:text-[#1e1b32]'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon className={`w-5 h-5 stroke-[1.5] shrink-0 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
                            {!collapsed && <span className="text-[14px] font-semibold whitespace-nowrap">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-4 border-t border-white/15 pt-3">
                <button
                    onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        window.location.href = '/';
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[#6b6490] hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 w-full ${collapsed ? 'justify-center' : ''}`}
                >
                    <FiLogOut className="w-5 h-5 stroke-[1.5] shrink-0" />
                    {!collapsed && <span className="text-[14px] font-semibold">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full glass-strong shadow-md flex items-center justify-center text-[#6b6490] hover:text-violet-600 transition-all duration-300 hover:scale-110 z-50 border border-white/30"
            >
                {collapsed ? <FiChevronRight className="w-3.5 h-3.5" /> : <FiChevronLeft className="w-3.5 h-3.5" />}
            </button>
        </aside>
    );
}
