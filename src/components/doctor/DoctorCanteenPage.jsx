import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../dashboard/Sidebar';
import DoctorTopBar from '../dashboard/TopBar';
import { supabase } from '../../supabaseClient';
import { FiSearch, FiLoader, FiCoffee, FiPlus, FiCheckCircle, FiX, FiMinus, FiInfo, FiClock } from 'react-icons/fi';

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

export default function DoctorCanteenPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Order Modal / Form State
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [formLoading, setFormLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Meals");

    const doctorEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        fetchOrders();

        const sub = supabase.channel('doctor-canteen-db')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'canteen_orders' }, fetchOrders)
            .subscribe();

        return () => supabase.removeChannel(sub);
    }, []);

    const fetchOrders = async () => {
        const { data } = await supabase
            .from('canteen_orders')
            .select('*')
            .eq('ordered_by', doctorEmail)
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const { error } = await supabase.from('canteen_orders').insert([{
                email: doctorEmail,
                item: selectedItem.name,
                quantity,
                status: 'pending',
                order_type: 'self',
                ordered_by: doctorEmail
            }]);

            if (error) throw error;

            setSelectedItem(null);
            setQuantity(1);
            fetchOrders();
        } catch (err) {
            alert('Failed to place order.');
        } finally {
            setFormLoading(false);
        }
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
            <DoctorSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10 p-4 md:p-6 lg:p-8 space-y-8">
                <DoctorTopBar />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1e1b32]">Hospital Canteen</h1>
                        <p className="text-[#64748b] font-medium mt-1">Pre-order meals and beverages for quick pickup</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 bg-white/50 p-1.5 rounded-2xl border border-white/40 shadow-sm w-fit">
                    {Object.keys(CATEGORIZED_MENU).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-[#64748b] hover:bg-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu items for Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {CATEGORIZED_MENU[activeCategory].map(item => (
                        <div key={item.id} className="glass border border-white/40 p-5 rounded-3xl bg-white/40 flex items-center justify-between hover:shadow-lg transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl bg-white/60 p-3 rounded-2xl group-hover:scale-110 transition-transform">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-[#1e1b32]">{item.name}</h3>
                                    <p className="text-xs font-bold text-indigo-600">₹{item.price}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedItem(item)} className="p-2.5 rounded-xl bg-[#1e1b32] text-white hover:bg-indigo-600 transition-colors shadow-md">
                                <FiPlus className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Orders List for Doctor */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#1e1b32] flex items-center gap-2">
                        <FiClock className="text-indigo-500" /> My Recent Orders
                    </h2>

                    {loading ? (
                        <div className="py-12 flex justify-center"><FiLoader className="w-8 h-8 animate-spin text-indigo-500" /></div>
                    ) : orders.length === 0 ? (
                        <div className="glass border border-white/40 rounded-3xl p-12 text-center bg-white/40">
                            <FiCoffee className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="font-bold text-slate-500">You haven't placed any orders yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {orders.map(order => (
                                <div key={order.id} className="glass border border-white/40 p-5 rounded-3xl bg-white/40 shadow-sm relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-[#1e1b32] text-lg">{order.item} <span className="text-indigo-600">x{order.quantity}</span></h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <StatusBadge status={order.status} />
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                                        <span className="text-xs font-bold text-slate-500 italic">Self Order</span>
                                        <button onClick={() => { setSelectedItem(CATEGORIZED_MENU[Object.keys(CATEGORIZED_MENU).find(k => CATEGORIZED_MENU[k].some(i => i.name === order.item))].find(i => i.name === order.item)); setQuantity(order.quantity); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline">Order Again</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ORDER MODAL FOR DOCTOR */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
                            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 text-white">
                                <div className="text-4xl bg-white/20 p-3 rounded-2xl backdrop-blur-md">{selectedItem.icon}</div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">Order {selectedItem.name}</h3>
                                    <p className="text-sm opacity-90 font-medium">Healthy choice, Doctor!</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
                            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex gap-3 text-indigo-700">
                                <FiInfo className="w-5 h-5 shrink-0 mt-0.5" />
                                <p className="text-xs font-medium leading-relaxed">This order will be placed as <strong>Self Order</strong> for your pickup at the canteen.</p>
                            </div>

                            <div className="space-y-1.5 text-center">
                                <label className="text-[12px] font-bold text-slate-500 uppercase">Select Quantity</label>
                                <div className="flex items-center justify-center gap-6">
                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><FiMinus /></button>
                                    <span className="text-2xl font-black text-slate-800 w-10">{quantity}</span>
                                    <button type="button" onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"><FiPlus /></button>
                                </div>
                            </div>

                            <button type="submit" disabled={formLoading} className="w-full py-4 rounded-2xl bg-[#1e1b32] hover:bg-indigo-600 text-white font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                {formLoading ? <FiLoader className="animate-spin" /> : <>Place Order • ₹{selectedItem.price * quantity} <FiCheckCircle /></>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
