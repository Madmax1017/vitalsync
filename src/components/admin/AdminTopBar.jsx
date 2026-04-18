import React, { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiChevronDown, FiPlus } from 'react-icons/fi';

export default function AdminTopBar() {
    const [userProfile, setUserProfile] = useState({
        name: localStorage.getItem('userEmail')?.split('@')[0] || 'Admin Master',
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
                    name: lsUser.name || localStorage.getItem('userEmail')?.split('@')[0] || prev.name,
                    avatar: lsAvatar || prev.avatar
                }));
            }
        };
        updateUserData();
        window.addEventListener('user-profile-updated', updateUserData);
        return () => window.removeEventListener('user-profile-updated', updateUserData);
    }, []);

    return (
        <header className="w-full flex items-center justify-end gap-6 py-4 px-6 glass-strong rounded-3xl border border-white/30 shadow-sm backdrop-blur-xl">
            {/* Right side */}
            <div className="flex items-center gap-4">

                {/* Notification */}
                <button className="relative w-11 h-11 rounded-2xl bg-white/60 border border-white/50 flex items-center justify-center text-[#6b6490] hover:bg-white/90 hover:text-violet-600 transition-all duration-300 hover:shadow-md active:scale-95">
                    <FiBell className="w-5 h-5 stroke-[2]" />
                    <span className="absolute top-2 right-2 w-4.5 h-4.5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-black shadow-sm">12</span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                    <div className="flex flex-col items-end hidden md:flex">
                        <span className="text-[14px] font-black text-[#1e1b32] leading-tight capitalize">{userProfile.name}</span>
                        <span className="text-[11px] text-violet-600 font-bold uppercase tracking-widest">System Controller</span>
                    </div>
                    <button className="flex items-center gap-2 group">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105 active:scale-95 flex items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 font-bold text-lg">
                            {userProfile.avatar ? (
                                <img
                                    src={userProfile.avatar}
                                    alt="Admin Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>{userProfile.name?.charAt(0)?.toUpperCase()}</span>
                            )}
                        </div>
                        <FiChevronDown className="w-4 h-4 text-[#6b6490] group-hover:text-violet-600 transition-colors" />
                    </button>
                </div>
            </div>
        </header>
    );
}
