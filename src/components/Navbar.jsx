import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiHeart } from 'react-icons/fi';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { label: 'Home', href: '#' },
        { label: 'Features', href: '#features' },
        { label: 'About', href: '#about' },
    ];

    const handleScrollTo = (e, href) => {
        e.preventDefault();

        // If href is just '#' go to top, otherwise scroll to element
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer z-50"
                    onClick={(e) => handleScrollTo(e, '#')}
                >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
                        <FiHeart className="w-5 h-5 text-white stroke-[2.5]" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#1e1b32]">VitalSync</span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex flex-1 justify-center">
                    <div className="flex items-center gap-8 bg-white/40 border border-white/30 backdrop-blur-sm px-8 py-3 rounded-full">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="text-[14px] font-bold text-[#6b6490] hover:text-violet-600 transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Desktop Login Button */}
                <div className="hidden md:flex items-center">
                    <a
                        href="/login/doctor"
                        onClick={(e) => {
                            e.preventDefault();
                            // Just link to default login or Navigation hub
                            const element = document.querySelector('#roles') || document.querySelector('section:nth-of-type(4)');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                            else window.location.href = "/login/doctor";
                        }}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14px] hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Login
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-[#1e1b32] z-50"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                </button>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-[#f8f7ff]/95 backdrop-blur-md z-40 transition-all duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    {navLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            onClick={(e) => handleScrollTo(e, link.href)}
                            className="text-2xl font-black text-[#1e1b32] hover:text-violet-600 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href="/login/doctor"
                        onClick={(e) => {
                            e.preventDefault();
                            const element = document.querySelector('#roles') || document.querySelector('section:nth-of-type(4)');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                            setIsMobileMenuOpen(false);
                        }}
                        className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-xl w-[200px] text-center shadow-lg shadow-violet-500/25 mt-4"
                    >
                        Login
                    </a>
                </div>
            </div>
        </nav>
    );
}
