import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

export default function NurseTopBar() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [userProfile, setUserProfile] = useState({
        name: user.name || 'Nurse',
        avatar: null
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
        <header className="w-full flex items-center justify-end gap-4 py-4 px-6 glass-strong rounded-2xl border border-white/20 shadow-sm">
            <div className="flex items-center gap-3">
                {/* Shift Status */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 rounded-xl px-3 py-2">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">On Shift</span>
                </div>

                <button className="relative w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center text-[#6b6490] hover:bg-white/60 hover:text-rose-500 transition-all duration-300 hover:shadow-sm">
                    <FiBell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">5</span>
                </button>

                <button className="flex items-center gap-3 bg-white/40 border border-white/30 rounded-xl px-3 py-2 hover:bg-white/60 transition-all duration-300 hover:shadow-sm">
                    <div className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 text-rose-700 font-bold text-sm shrink-0">
                        {userProfile.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span>{userProfile.name?.charAt(0)?.toUpperCase() || 'N'}</span>
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[13px] font-bold text-[#1e1b32] leading-tight">{userProfile.name}</span>
                        <span className="text-[11px] text-[#6b6490] font-medium">ICU Ward</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-[#6b6490] hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
