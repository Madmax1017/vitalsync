import React, { useState, useEffect } from 'react';
import NurseSidebar from './NurseSidebar';
import NurseTopBar from './NurseTopBar';
import { supabase } from '../../supabaseClient';
import { FiSearch, FiLoader, FiCoffee, FiPlus, FiCheck, FiX, FiCheckCircle, FiMinus, FiUser, FiHome, FiInfo } from 'react-icons/fi';

const CATEGORIZED_MENU = {
    "Meals": [
        { id: 'm1', name: 'Rice Plate', icon: '🍛', price: 80 },
        { id: 'm2', name: 'Dal Khichdi', icon: '🍲', price: 70 },
        { id: 'm3', name: 'Veg Thali', icon: '🍱', price: 120 },
    ],
    "Snacks": [
        { id: 's1', name: 'Sandwich', icon: '🥪', price: 50 },
        { id: 's2', name: 'Idli', icon: '🍘', price: 40 },
        { id: 's3', name: 'Poha', icon: '🍛', price: 35 },
    ],
    "Beverages": [
        { id: 'b1', name: 'Tea', icon: '🍵', price: 15 },
        { id: 'b2', name: 'Coffee', icon: '☕', price: 20 },
        { id: 'b3', name: 'Juice', icon: '🧃', price: 30 },
    ]
};

export default function NurseCanteenPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Order Modal / Form State
    const [selectedItem, setSelectedItem] = useState(null);
    const [orderType, setOrderType] = useState('patient');
    const [patientName, setPatientName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [formLoading, setFormLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Meals");

    const nurseEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        fetchOrders();

        const sub = supabase.channel('nurse-canteen-db')
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

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const { error } = await supabase.from('canteen_orders').insert([{
                email: nurseEmail,
                item: selectedItem.name,
                quantity,
                patient_name: orderType === 'patient' ? patientName : null,
                room_number: orderType === 'patient' ? roomNumber : null,
                status: 'pending',
                order_type: orderType,
                ordered_by: nurseEmail
            }]);

            if (error) throw error;

            setSelectedItem(null);
            setPatientName('');
            setRoomNumber('');
            setQuantity(1);
        } catch (err) {
            alert('Failed to place order.');
        } finally {
            setFormLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        await supabase.from('canteen_orders').update({ status }).eq('id', id);
        fetchOrders();
    };

    const StatusBadge = ({ status }) => {
        const s = status?.toLowerCase() || 'pending';
        const styles = {
            pending: "bg-amber-100 text-amber-700",
            preparing: "bg-blue-100 text-blue-700",
            delivered: "bg-emerald-100 text-emerald-700"
        };
        return <span className={`px-2.5 py-1 ${styles[s] || styles.pending} text-[10px] font-bold rounded-lg uppercase tracking-wider`}>{s}</span>;
    };

    return (
        <div className="flex min-h-screen w-full bg-[#f8fafc]">
            <NurseSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 p-4 md:p-6 lg:p-8 space-y-8">
                <NurseTopBar />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Canteen Dashboard</h1>
                        <p className="text-[#64748b] font-medium mt-1">Order meals for yourself or your patients</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-white/40 shadow-sm w-fit">
                    {Object.keys(CATEGORIZED_MENU).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-rose-500 text-white shadow-md' : 'text-[#64748b] hover:bg-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu items for Nurse */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CATEGORIZED_MENU[activeCategory].map(item => (
                        <div key={item.id} className="glass border border-white/40 p-5 rounded-3xl bg-white/40 flex items-center justify-between hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl bg-white/60 p-3 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-[#1e1b32]">{item.name}</h3>
                                    <p className="text-xs font-bold text-rose-500">₹{item.price}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedItem(item)} className="p-2.5 rounded-xl bg-[#1e1b32] text-white hover:bg-rose-500 transition-colors shadow-md">
                                <FiPlus className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Orders List for Nurse */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#1e1b32] flex items-center gap-2">
                        <FiInfo className="text-rose-500" /> Recent Canteen Orders
                    </h2>

                    {loading ? (
                        <div className="py-12 flex justify-center"><FiLoader className="w-8 h-8 animate-spin text-rose-500" /></div>
                    ) : orders.length === 0 ? (
                        <div className="glass border border-white/40 rounded-3xl p-12 text-center bg-white/40">
                            <FiCoffee className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="font-bold text-slate-500">No orders yet</p>
                        </div>
                    ) : (
                        <div className="glass border border-white/40 rounded-3xl overflow-hidden bg-white/40 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/50 border-b border-slate-100">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Item</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Order Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Target</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id} className="border-b border-slate-50 hover:bg-white/40 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{order.item} <span className="text-rose-500 ml-1">x{order.quantity}</span></div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${order.order_type === 'self' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                                        {order.order_type || 'Patient'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.order_type === 'self' ? (
                                                        <div className="text-sm font-bold text-slate-700">Self</div>
                                                    ) : (
                                                        <>
                                                            <div className="font-bold text-slate-700">{order.patient_name || '--'}</div>
                                                            <div className="text-[11px] text-slate-500">Room: {order.room_number || '--'}</div>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <StatusBadge status={order.status} />
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

            {/* ORDER MODAL FOR NURSE */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6">
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 text-white">
                                <div className="text-4xl bg-white/20 p-3 rounded-2xl backdrop-blur-md">{selectedItem.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Order {selectedItem.name}</h3>
                                    <p className="text-sm opacity-90 font-medium">Qty Selection & Destination</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
                            <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
                                <button type="button" onClick={() => setOrderType('patient')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${orderType === 'patient' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>
                                    <FiUser /> Patient
                                </button>
                                <button type="button" onClick={() => setOrderType('self')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${orderType === 'self' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>
                                    <FiHome /> Myself
                                </button>
                            </div>

                            <div className="space-y-4">
                                {orderType === 'patient' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                                            <input required type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-bold text-slate-700" placeholder="eg. John Doe" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[12px] font-bold text-slate-500 uppercase ml-1">Room No.</label>
                                            <input required type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-rose-500/20 outline-none transition-all font-bold text-slate-700" placeholder="eg. 104" />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5 text-center">
                                    <label className="text-[12px] font-bold text-slate-500 uppercase">Quantity</label>
                                    <div className="flex items-center justify-center gap-6">
                                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><FiMinus /></button>
                                        <span className="text-2xl font-black text-slate-800 w-10">{quantity}</span>
                                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><FiPlus /></button>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={formLoading} className="w-full py-4 rounded-2xl bg-[#1e1b32] hover:bg-rose-500 text-white font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                {formLoading ? <FiLoader className="animate-spin" /> : <>Confirm Order <FiCheckCircle /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
