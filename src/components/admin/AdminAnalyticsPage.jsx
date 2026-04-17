import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiUsers, FiCalendar, FiCheckSquare, FiLoader, FiPieChart, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';

const COLORS = ['#8b5cf6', '#f43f5e', '#3b82f6'];
const PIE_COLORS = ['#10b981', '#f59e0b'];

export default function AdminAnalyticsPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalAppointments: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });

    useEffect(() => {
        fetchAnalyticsData();

        const channelTasks = supabase.channel('analytics-tasks').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchAnalyticsData).subscribe();
        const channelPatients = supabase.channel('analytics-patients').on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, fetchAnalyticsData).subscribe();
        const channelAppts = supabase.channel('analytics-appts').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAnalyticsData).subscribe();

        return () => {
            supabase.removeChannel(channelTasks);
            supabase.removeChannel(channelPatients);
            supabase.removeChannel(channelAppts);
        };
    }, []);

    const fetchAnalyticsData = async () => {
        // Fetch raw counts
        const [{ count: patientsCount }, { count: apptsCount }, { data: tasks }] = await Promise.all([
            supabase.from('patients').select('*', { count: 'exact', head: true }),
            supabase.from('appointments').select('*', { count: 'exact', head: true }),
            supabase.from('tasks').select('status')
        ]);

        const completed = tasks?.filter(t => t.status === 'completed').length || 0;
        const pending = tasks?.filter(t => t.status === 'pending').length || 0;

        setStats({
            totalPatients: patientsCount || 0,
            totalAppointments: apptsCount || 0,
            totalTasks: tasks?.length || 0,
            completedTasks: completed,
            pendingTasks: pending
        });

        setLoading(false);
    };

    // Prepare chart data
    const barData = [
        { name: 'Patients', value: stats.totalPatients },
        { name: 'Appointments', value: stats.totalAppointments },
        { name: 'Total Tasks', value: stats.totalTasks }
    ];

    const pieData = [
        { name: 'Completed', value: stats.completedTasks },
        { name: 'Pending', value: stats.pendingTasks }
    ];

    // Mock trend line for demo purposes (usually would aggregate created_at timestamps)
    const trendData = [
        { name: 'Mon', appointments: Math.max(1, stats.totalAppointments - 5), patients: Math.max(1, stats.totalPatients - 2) },
        { name: 'Tue', appointments: Math.max(2, stats.totalAppointments - 3), patients: Math.max(2, stats.totalPatients - 1) },
        { name: 'Wed', appointments: Math.max(1, stats.totalAppointments - 2), patients: Math.max(1, stats.totalPatients) },
        { name: 'Thu', appointments: Math.max(3, stats.totalAppointments - 1), patients: Math.max(3, stats.totalPatients + 1) },
        { name: 'Fri', appointments: stats.totalAppointments, patients: stats.totalPatients },
    ];

    const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }) => (
        <div className={`p-6 rounded-3xl bg-white border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${borderClass}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6 stroke-[2]" />
                </div>
            </div>
            <div className="text-[14px] font-bold text-[#6b6490] mb-1">{title}</div>
            <div className="text-3xl font-black text-[#1e1b32]">{loading ? '--' : value}</div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-[#f8f7ff] overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-violet-300/20 rounded-full blur-[140px]" />
            </div>

            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto relative z-10 max-w-[1600px] mx-auto w-full">
                <AdminTopBar />

                {/* Header */}
                <div className="mt-10 mb-8 px-2 flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1e1b32] mb-3">
                            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Analytics</span>
                        </h1>
                        <p className="text-lg text-[#6b6490] font-bold opacity-80 max-w-2xl">
                            Comprehensive overview of clinical metrics, patient intake, and staff tasks.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#6b6490]">
                        <FiLoader className="w-10 h-10 animate-spin mb-4 text-violet-500" />
                        <span className="font-bold tracking-widest uppercase">Aggregating Data...</span>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-2">
                            <StatCard title="Total Patients" value={stats.totalPatients} icon={FiUsers} colorClass="bg-blue-50 text-blue-600" borderClass="border-blue-100" />
                            <StatCard title="Appointments" value={stats.totalAppointments} icon={FiCalendar} colorClass="bg-violet-50 text-violet-600" borderClass="border-violet-100" />
                            <StatCard title="Total Tasks" value={stats.totalTasks} icon={FiCheckSquare} colorClass="bg-rose-50 text-rose-600" borderClass="border-rose-100" />
                            <StatCard title="Completed Tasks" value={stats.completedTasks} icon={FiPieChart} colorClass="bg-emerald-50 text-emerald-600" borderClass="border-emerald-100" />
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 mb-10">
                            {/* Trend Line Chart */}
                            <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg">
                                <h3 className="text-xl font-extrabold text-[#1e1b32] mb-6 flex items-center gap-2">
                                    <FiTrendingUp className="text-indigo-500" /> Activity Trends
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b6490', fontSize: 12, fontWeight: 600 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b6490', fontSize: 12, fontWeight: 600 }} />
                                            <RechartsTooltip
                                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                                            />
                                            <Line type="smooth" dataKey="appointments" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Appointments" />
                                            <Line type="smooth" dataKey="patients" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Patients Intake" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Task Distribution Pie Chart */}
                                <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-lg flex-1">
                                    <h3 className="text-xl font-extrabold text-[#1e1b32] mb-2 flex items-center gap-2">
                                        <FiPieChart className="text-emerald-500" /> Task Status
                                    </h3>
                                    <div className="h-[200px]">
                                        {stats.totalTasks > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-[#a09cb5] font-bold text-sm">No tasks assigned</div>
                                        )}
                                    </div>
                                </div>

                                {/* Summary Bar Chart */}
                                <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 transition-all duration-300 hover:shadow-indigo-300 hover:-translate-y-1 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                                    <h3 className="text-lg font-extrabold mb-4 relative z-10 flex items-center gap-2">
                                        <FiBarChart2 className="text-indigo-200" /> Core Overview
                                    </h3>
                                    <div className="h-[140px] relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                                                <XAxis dataKey="name" hide />
                                                <YAxis hide />
                                                <RechartsTooltip
                                                    cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                                    contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', border: 'none', color: '#1e1b32', fontWeight: 'bold' }}
                                                    itemStyle={{ color: '#1e1b32' }}
                                                />
                                                <Bar dataKey="value" fill="rgba(255,255,255,0.9)" radius={[4, 4, 0, 0]} barSize={30} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
