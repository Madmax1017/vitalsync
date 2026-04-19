import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiChevronRight, FiAlertCircle, FiLoader } from 'react-icons/fi';
import gsap from 'gsap';
import { supabase } from '../../supabaseClient';

const PatientSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const cardRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(cardRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
            );

            gsap.fromTo(contentRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            );
        });
        return () => ctx.revert();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // First check if email exists
            const { data: existingUser } = await supabase
                .from('users')
                .select('email')
                .eq('email', email)
                .single();

            if (existingUser) {
                setError('Email is already registered');
                setLoading(false);
                return;
            }

            // Insert new user
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        name,
                        email,
                        password,
                        role: 'patient',
                        created_at: new Date().toISOString()
                    }
                ]);

            if (insertError) {
                console.error('Supabase error:', insertError.message);
                setError('Failed to create account. Please try again.');
                setLoading(false);
                return;
            }

            // Auto-login after successful signup
            localStorage.setItem('user', JSON.stringify({
                name,
                email,
                role: 'patient'
            }));
            localStorage.setItem('userEmail', email);

            navigate('/patient/dashboard');

        } catch (err) {
            console.error('Unexpected signup error:', err);
            setError('An error occurred during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8fafc] relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-gradient-to-br from-teal-500 to-emerald-600" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 bg-gradient-to-tl from-teal-500 to-emerald-600" />

            <div ref={cardRef} className="w-full max-w-md relative z-10">
                <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/40 backdrop-blur-xl bg-white/70 overflow-hidden group">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />

                    <div ref={contentRef} className="relative z-10">
                        {/* Header */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg mb-6 ring-8 ring-white/50 animate-pulse-slow">
                                <FiUser className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight mb-2">
                                Patient Signup
                            </h1>
                            <p className="text-[#6b7280] font-medium text-center">
                                Create your secure account
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-600 animate-shake">
                                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm font-semibold">{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[#374151] ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-teal-500 transition-colors">
                                        <FiUser className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all duration-300 font-medium text-[#111827] placeholder:text-[#9ca3af]"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[#374151] ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-teal-500 transition-colors">
                                        <FiMail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all duration-300 font-medium text-[#111827] placeholder:text-[#9ca3af]"
                                        placeholder="patient@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[#374151] ml-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-teal-500 transition-colors">
                                        <FiLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all duration-300 font-medium text-[#111827] placeholder:text-••••••••"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-[#374151] ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9ca3af] group-focus-within:text-teal-500 transition-colors">
                                        <FiLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#e5e7eb] bg-white/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all duration-300 font-medium text-[#111827] placeholder:text-••••••••"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-teal-500/20 hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden relative ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="w-6 h-6 animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign Up</span>
                                        <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-[#6b7280] text-sm">
                                Already have an account?{' '}
                                <Link to="/login/patient" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSignup;
