import React from 'react';

const phrases = [
    'Smart Healthcare',
    'Real-time Monitoring',
    'AI Insights',
    'Seamless Coordination',
    'Patient-First Design',
    'Unified Workflows',
    'Hospital Analytics',
    'Secure Platform',
];

export default function Marquee() {
    const content = phrases.map(p => `${p}  •  `).join('');
    const repeatedContent = content.repeat(4);

    return (
        <section className="py-10 md:py-14 glass-dark relative overflow-hidden select-none">
            {/* Edge fades */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1e1b32]/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1e1b32]/90 to-transparent z-10 pointer-events-none" />

            <div className="relative flex overflow-hidden">
                <div className="flex shrink-0 animate-[marquee_40s_linear_infinite]">
                    <span className="text-lg md:text-xl lg:text-2xl font-semibold text-white/15 tracking-wide whitespace-nowrap">
                        {repeatedContent}
                    </span>
                </div>
                <div className="flex shrink-0 animate-[marquee_40s_linear_infinite]">
                    <span className="text-lg md:text-xl lg:text-2xl font-semibold text-white/15 tracking-wide whitespace-nowrap">
                        {repeatedContent}
                    </span>
                </div>
            </div>

            <div className="relative flex overflow-hidden mt-4">
                <div className="flex shrink-0 animate-[marquee-reverse_35s_linear_infinite]">
                    <span className="text-lg md:text-xl lg:text-2xl font-semibold text-violet-300/10 tracking-wide whitespace-nowrap">
                        {repeatedContent}
                    </span>
                </div>
                <div className="flex shrink-0 animate-[marquee-reverse_35s_linear_infinite]">
                    <span className="text-lg md:text-xl lg:text-2xl font-semibold text-violet-300/10 tracking-wide whitespace-nowrap">
                        {repeatedContent}
                    </span>
                </div>
            </div>
        </section>
    );
}
