import React, { useState, useEffect } from 'react';
import { FiBell, FiChevronDown } from 'react-icons/fi';

export default function TopBar() {
    const [userProfile, setUserProfile] = useState({
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=80&h=80'
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
            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Notification */}
                <button className="relative w-10 h-10 rounded-xl bg-white/40 border border-white/30 flex items-center justify-center text-[#6b6490] hover:bg-white/60 hover:text-violet-600 transition-all duration-300 hover:shadow-sm">
                    <FiBell className="w-5 h-5 stroke-[1.5]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">3</span>
                </button>

                {/* Profile */}
                <button className="flex items-center gap-3 bg-white/40 border border-white/30 rounded-xl px-3 py-2 hover:bg-white/60 transition-all duration-300 hover:shadow-sm">
                    <img
                        src={userProfile.avatar}
                        alt="Doctor"
                        className="w-8 h-8 rounded-lg object-cover shadow-sm"
                    />
                    <div className="hidden sm:flex flex-col items-start">
                        <span className="text-[13px] font-bold text-[#1e1b32] leading-tight">{userProfile.name}</span>
                        <span className="text-[11px] text-[#6b6490] font-medium">Cardiologist</span>
                    </div>
                    <FiChevronDown className="w-4 h-4 text-[#6b6490] hidden sm:block" />
                </button>
            </div>
        </header>
    );
}
