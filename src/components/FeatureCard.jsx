import React from 'react';

const FeatureCard = ({ title, description, icon: Icon, className, gradientClass, children }) => {
    return (
        <div className={`group relative p-7 rounded-[1.75rem] glass overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-12px_rgba(124,58,237,0.12)] hover:bg-white/80 flex flex-col ${className}`}>

            {/* Ambient Background Glow */}
            <div className={`absolute -right-24 -top-24 w-72 h-72 rounded-full blur-[90px] opacity-[0.08] transition-all duration-700 ease-out group-hover:opacity-[0.25] group-hover:scale-125 pointer-events-none ${gradientClass}`} />

            <div className="relative z-10 flex flex-col h-full w-full">
                {/* Header Row: Icon + Arrow */}
                <div className="flex items-start justify-between mb-7">
                    <div className="relative inline-flex p-3.5 rounded-2xl bg-white/60 border border-white/40 text-[#3b3260] transition-all duration-500 group-hover:shadow-[0_8px_20px_-6px_rgba(124,58,237,0.15)] group-hover:bg-white/90 group-hover:scale-110 group-hover:-rotate-3 z-10">
                        <Icon className="w-6 h-6 stroke-[1.5] group-hover:scale-105 transition-transform duration-500" />
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 blur-md rounded-2xl transition-opacity duration-500 pointer-events-none ${gradientClass}`} />
                    </div>
                    {/* Hover Arrow */}
                    <div className="w-9 h-9 rounded-full flex flex-shrink-0 items-center justify-center bg-transparent opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-white/60 group-hover:border group-hover:border-white/40 group-hover:shadow-sm">
                        <svg className="w-3.5 h-3.5 text-[#5b5675] group-hover:text-violet-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="text-[1.25rem] leading-[1.2] font-extrabold tracking-tight text-[#1e1b32] mb-2.5 group-hover:text-[#1e1b32] transition-colors">{title}</h3>
                    <p className={`text-[#6b6490] font-medium leading-[1.6] text-[14px] group-hover:text-[#5b5675] transition-colors ${!children ? 'mt-auto' : 'mb-5 max-w-lg'}`}>{description}</p>

                    {children && (
                        <div className="mt-auto relative w-full h-full overflow-hidden transition-transform duration-500">
                            {children}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className={`absolute bottom-0 left-0 h-1 w-full opacity-0 scale-x-0 origin-left transition-all duration-500 ease-out group-hover:opacity-80 group-hover:scale-x-100 bg-gradient-to-r from-violet-500 to-indigo-500`} />
        </div>
    );
};

export default FeatureCard;
