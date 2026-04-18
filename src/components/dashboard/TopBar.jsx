import React, { useState, useEffect } from 'react';
import { FiBell, FiChevronDown } from 'react-icons/fi';

export default function TopBar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = localStorage.getItem('role') || 'doctor';

    const [userProfile, setUserProfile] = useState({
        name: user.name || 'Doctor',
        avatar: null,
        specialization: user.specialization || (role === 'doctor' ? 'Cardiologist' : 'Specialist')
    });

    useEffect(() => {
        const updateUserData = () => {
            const lsUser = JSON.parse(localStorage.getItem('user') || '{}');
            const email = localStorage.getItem('userEmail');
            const lsAvatar = email ? localStorage.getItem(`avatar_${email}`) : null;
            if (lsUser.name || lsAvatar) {
                setUserProfile(prev => ({
                    ...prev,
                    name: lsUser.name || prev.name,
                    avatar: lsAvatar || prev.avatar
                }));
            }
        };
        updateUserData();
        window.addEventListener('user-profile-updated', updateUserData);
        return () => window.removeEventListener('user-profile-updated', updateUserData);
    }, []);

    return (
        <header className="w-full flex items-center justify-end gap-4 py-4 px-6 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notification */}
                <button className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300 hover:shadow-sm">
                    <FiBell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm border border-white">3</span>
                </button>

                {/* Profile */}
                <button className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 hover:bg-slate-100 transition-all duration-300 hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center bg-indigo-50 text-indigo-700 font-bold text-[13px] shrink-0">
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span>{userProfile.name?.charAt(0)?.toUpperCase() || 'D'}</span>
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start gap-0.5">
                        <span className="text-[13px] font-bold text-slate-800 leading-none">{userProfile.name}</span>
                        <span className="text-[11px] text-slate-500 font-medium leading-none">{userProfile.specialization}</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-slate-400 hidden sm:block ml-1" />
                </button>
            </div>
        </header>
    );
}
