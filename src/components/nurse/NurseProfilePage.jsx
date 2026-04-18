import React, { useState } from 'react';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import Profile from '../common/Profile';

export default function NurseProfilePage() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff]">
            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-auto relative z-10">
                <NurseTopBar />
                <Profile />
            </div>
        </div>
    );
}
