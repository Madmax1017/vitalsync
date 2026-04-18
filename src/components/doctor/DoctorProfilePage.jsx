import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import TopBar from '../dashboard/TopBar';
import Profile from '../common/Profile';

export default function DoctorProfilePage() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff]">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-auto relative z-10">
                <TopBar />
                <Profile />
            </div>
        </div>
    );
}
