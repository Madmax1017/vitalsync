import React from 'react';
import { FiHeart } from 'react-icons/fi';

const footerLinks = [
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
    { label: 'Dashboards', href: '#dashboards' },
    { label: 'Contact', href: '#contact' },
];

export default function Footer() {
    return (
        <footer className="glass-dark text-white relative overflow-hidden">
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-violet-500/8 rounded-full blur-[80px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-16 md:pt-20 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12 md:mb-16">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
                                <FiHeart className="w-5 h-5 text-white stroke-[2.5]" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight">VitalSync</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed font-medium">
                            A unified digital platform designed to streamline hospital operations by connecting doctors, nurses, administrators, and patients into one intelligent workflow.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-x-12 gap-y-4 md:justify-end items-start">
                        {footerLinks.map((link, i) => (
                            <a
                                key={i}
                                href={link.href}
                                className="text-sm font-medium text-white/40 hover:text-violet-300 transition-colors duration-300 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 transition-all duration-300 group-hover:w-full" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/8 mb-6" />

                {/* Bottom */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30 font-medium">
                        © {new Date().getFullYear()} VitalSync. All rights reserved.
                    </p>
                    <p className="text-xs text-white/20 font-medium flex items-center gap-1.5">
                        Built with <FiHeart className="w-3 h-3 text-rose-400 inline" /> for modern healthcare
                    </p>
                </div>
            </div>
        </footer>
    );
}
