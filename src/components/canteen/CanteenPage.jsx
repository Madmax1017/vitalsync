import React, { useState } from 'react';
import { FiCoffee, FiPlus, FiMinus, FiX, FiCheckCircle, FiLoader, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';

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

export default function CanteenPage() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Form fields
    const [email, setEmail] = useState('');
    const [patientName, setPatientName] = useState('');
    const [roomNumber, setRoomNumber] = useState('');

    // Status
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [activeCategory, setActiveCategory] = useState("Meals");

    const openOrderModal = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setSuccess(false);
        setError('');
    };

    const closeOrderModal = () => {
        setSelectedItem(null);
        setSuccess(false);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: dbError } = await supabase
                .from('canteen_orders')
                .insert([{
                    email,
                    item: selectedItem.name,
                    quantity,
                    patient_name: patientName || null,
                    room_number: roomNumber || null,
                    status: 'pending',
                    order_type: 'patient', // Public orders are assumed to be for patients or visitors
                    ordered_by: email
                }]);

            if (dbError) throw dbError;

            setSuccess(true);
            setTimeout(() => {
                closeOrderModal();
            }, 2500);

        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Failed to place order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] w-full relative overflow-hidden flex flex-col items-center justify-start p-4 md:p-8">
            {/* Background elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-30 bg-orange-300 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[140px] opacity-30 bg-rose-300 pointer-events-none" />

            {/* Header */}
            <div className="max-w-5xl w-full text-center relative z-10 pt-8 pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e1b32] to-[#3a355a] shadow-xl mb-6 text-white">
                    <FiShoppingBag className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#1e1b32] tracking-tight mb-4">VitalSync <span className="text-orange-500">Canteen</span></h1>
                <p className="text-lg text-[#64748b] font-medium max-w-xl mx-auto italic">Fresh, healthy, and timely meals for our patients and staff.</p>
            </div>

            {/* Category Tabs */}
            <div className="relative z-10 flex gap-2 mb-8 bg-white/50 p-1.5 rounded-2xl border border-white/40 shadow-sm">
                {Object.keys(CATEGORIZED_MENU).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-[#1e1b32] text-white shadow-md' : 'text-[#64748b] hover:bg-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu Grid */}
            <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 pb-20">
                {CATEGORIZED_MENU[activeCategory].map((item) => (
                    <div key={item.id} className="glass border border-white/40 rounded-3xl p-6 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group bg-white/60 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                            <FiCoffee className="w-12 h-12" />
                        </div>
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-rose-50 rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#1e1b32] mb-1">{item.name}</h3>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-lg font-black text-[#1e1b32]">₹{item.price}</span>
                            <button
                                onClick={() => openOrderModal(item)}
                                className="px-5 py-2 rounded-xl bg-[#1e1b32] hover:bg-orange-600 text-white font-bold transition-all shadow-md active:scale-95 flex items-center gap-2 text-sm"
                            >
                                Order Now <FiArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Order Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeOrderModal} />
                    <div className="bg-white rounded-3xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="bg-gradient-to-r from-[#1e1b32] to-[#3a355a] p-6 relative">
                            <button onClick={closeOrderModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                                <FiX className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-4 text-white">
                                <div className="text-4xl bg-white/20 p-3 rounded-2xl backdrop-blur-md">{selectedItem.icon}</div>
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight">{selectedItem.name}</h3>
                                    <p className="font-medium opacity-90 text-sm">₹{selectedItem.price} per unit</p>
                                </div>
                            </div>
                        </div>

                        {success ? (
                            <div className="p-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <FiCheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1e1b32]">Order Placed!</h3>
                                <p className="text-slate-500">Redirecting to menu...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                                {error && (
                                    <div className="p-3 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold border border-rose-100">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-bold text-slate-700 ml-1 mb-1.5 block">Quantity</label>
                                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 w-fit">
                                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-slate-200 text-slate-600 shadow-sm transition-colors">
                                            <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white hover:bg-slate-200 text-slate-600 shadow-sm transition-colors">
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-slate-700 ml-1 mb-1.5 block">Your Email (Required)</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-[#1e1b32] outline-none transition-all font-medium placeholder:text-slate-400 text-slate-700"
                                        placeholder="visitor@vitalsync.com"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 ml-1 mb-1.5 block">Patient Name</label>
                                        <input
                                            type="text"
                                            value={patientName}
                                            onChange={e => setPatientName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-[#1e1b32] outline-none transition-all font-medium text-slate-700"
                                            placeholder="eg. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 ml-1 mb-1.5 block">Room No.</label>
                                        <input
                                            type="text"
                                            value={roomNumber}
                                            onChange={e => setRoomNumber(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-[#1e1b32] outline-none transition-all font-medium text-slate-700"
                                            placeholder="eg. 204"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 rounded-xl bg-[#1e1b32] hover:bg-[#2d294a] text-white font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {loading ? <FiLoader className="w-5 h-5 animate-spin" /> : `Place Order • ₹${selectedItem.price * quantity}`}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
