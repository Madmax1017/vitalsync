import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import Profile from '../common/Profile';

export default function AdminProfilePage() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff]">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-auto relative z-10">
                <AdminTopBar />
                <Profile />
            </div>
        </div>
    );
}
