import React from 'react';

export default function DoctorHero({ name }) {
    // Determine greeting
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // Format name to ensure it starts with Dr. if necessary
    const nameStr = name?.split(' ')[0] || 'Doctor';
    const prefix = !nameStr.toLowerCase().startsWith('dr') ? 'Dr. ' : '';

    return (
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-soft p-8 relative overflow-hidden flex justify-between items-center text-white">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="50" r="150" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
                    <circle cx="700" cy="300" r="250" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
                    <path d="M 0 200 Q 400 100 800 300" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
                </svg>
            </div>

            <div className="relative z-10">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    {timeGreeting}, {prefix}{nameStr}!
                </h1>
                <p className="text-blue-100 text-sm font-medium">Have a Nice Day!</p>
            </div>

            <div className="relative z-10 hidden md:flex items-center gap-4">
                {/* Doctor Illustration (using a nice SVG placeholder) */}
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
