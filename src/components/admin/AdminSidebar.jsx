import React from 'react';
import {
    FiGrid, FiUsers, FiBarChart2, FiFileText, FiSettings,
    FiLogOut, FiChevronLeft, FiChevronRight, FiShield, FiBriefcase
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
    { icon: FiGrid, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: FiBriefcase, label: 'Staff Management', path: '#' },
    { icon: FiUsers, label: 'Patients', path: '#' },
    { icon: FiFileText, label: 'Reports', path: '#' },
    { icon: FiBarChart2, label: 'Analytics', path: '#' },
    { icon: FiSettings, label: 'Settings', path: '#' },
];

export default function AdminSidebar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className={`${collapsed ? 'w-[80px]' : 'w-[260px]'} h-screen sticky top-0 flex flex-col glass-strong border-r border-white/20 transition-all duration-500 ease-out z-50 shrink-0`}>
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 py-6 border-b border-white/15">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <FiShield className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                {!collapsed && <span className="text-xl font-extrabold tracking-tight text-[#1e1b32] whitespace-nowrap cursor-pointer" onClick={() => navigate('/')}>VitalSync <span className="text-violet-600">Admin</span></span>}
            </div>

            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-1.5 px-3 py-6 overflow-y-auto">
                {menuItems.map((item, i) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={i}
                            onClick={() => item.path !== '#' && navigate(item.path)}
                            className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 w-full text-left relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-violet-600/10 to-indigo-600/5 text-violet-700 shadow-sm border border-violet-200/50'
                                    : 'text-[#6b6490] hover:bg-white/60 hover:text-[#1e1b32]'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600 rounded-r-full" />}
                            <item.icon className={`w-5 h-5 stroke-[2] shrink-0 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110 group-hover:text-violet-600'}`} />
                            {!collapsed && <span className="text-[15px] font-bold whitespace-nowrap">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 pb-6 border-t border-white/15 pt-4">
                <button className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[#6b6490] hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 w-full font-bold ${collapsed ? 'justify-center' : ''}`}>
                    <FiLogOut className="w-5 h-5 stroke-[2] shrink-0" />
                    {!collapsed && <span className="text-[15px]">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-7 h-7 rounded-full glass-strong shadow-lg flex items-center justify-center text-[#6b6490] hover:text-violet-600 transition-all duration-300 hover:scale-110 z-50 border border-white/40"
            >
                {collapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
            </button>
        </aside>
    );
}
