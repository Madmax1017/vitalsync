import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import { supabase } from '../../supabaseClient';
import { FiSearch, FiLoader, FiCoffee, FiCheckCircle, FiTruck, FiClock, FiFilter } from 'react-icons/fi';

export default function AdminCanteenPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();

        const sub = supabase.channel('admin-canteen-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'canteen_orders' }, fetchOrders)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('canteen_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        const { error } = await supabase.from('canteen_orders').update({ status }).eq('id', id);
        if (error) alert(error.message);
        fetchOrders();
    };

    const StatusBadge = ({ status }) => {
        const s = status?.toLowerCase() || 'pending';
        const styles = {
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            preparing: "bg-blue-100 text-blue-700 border-blue-200",
            delivered: "bg-emerald-100 text-emerald-700 border-emerald-200"
        };
        return <span className={`px-2.5 py-1 ${styles[s] || styles.pending} border text-[10px] font-black rounded-lg uppercase tracking-wider`}>{s}</span>;
    };

    const filteredOrders = orders.filter(o => {
        const matchesStatus = statusFilter === 'All' || o.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = o.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.ordered_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.patient_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 p-4 md:p-6 lg:p-8 space-y-8">
                <AdminTopBar />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Canteen Monitoring</h1>
                        <p className="text-[#64748b] font-medium mt-1">Manage and track all food and beverage orders</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                        <input
                            type="text"
                            placeholder="Search by item, orderer, or patient..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] w-4.5 h-4.5" />
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-xl border border-white/60 bg-white/60 focus:bg-white focus:ring-2 focus:ring-violet-500/20 outline-none transition-all text-sm font-medium appearance-none min-w-[150px]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <FiLoader className="w-10 h-10 animate-spin text-violet-400 mb-4" />
                        <span className="text-sm font-bold text-[#64748b] uppercase tracking-widest text-[10px]">Fetching Live Orders...</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="glass border border-white/40 rounded-3xl p-20 text-center bg-white/40">
                        <FiCoffee className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold italic">No canteen orders found for current filters</p>
                    </div>
                ) : (
                    <div className="glass border border-white/40 rounded-3xl overflow-hidden bg-white/40 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Details</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Type</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="border-b border-white/40 hover:bg-white/60 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
                                                        {order.item === 'Tea' ? '🍵' : order.item === 'Coffee' ? '☕' : order.item === 'Sandwich' ? '🥪' : order.item === 'Idli' ? '🍘' : order.item === 'Rice Plate' ? '🍛' : order.item === 'Juice' ? '🧃' : '🍱'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{order.item} <span className="text-violet-600 ml-1">x{order.quantity}</span></div>
                                                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5"><FiClock className="w-3 h-3" /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.ordered_by}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${order.order_type === 'self' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                    {order.order_type || 'Patient'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.order_type === 'self' ? (
                                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Self Pickup</div>
                                                ) : (
                                                    <div>
                                                        <div className="font-bold text-slate-700 text-sm">{order.patient_name || '--'}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 mt-0.5">ROOM {order.room_number || '--'}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'preparing')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-all shadow-sm"
                                                        >
                                                            <FiCoffee className="w-3.5 h-3.5" /> Prepare
                                                        </button>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <button
                                                            onClick={() => updateStatus(order.id, 'delivered')}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all shadow-sm"
                                                        >
                                                            <FiTruck className="w-3.5 h-3.5" /> Deliver
                                                        </button>
                                                    )}
                                                    {order.status === 'delivered' && (
                                                        <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-black uppercase px-2 py-1">
                                                            <FiCheckCircle className="w-4 h-4" /> Delivered
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
