import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart } = useCart();

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <main className="flex flex-col md:flex-row gap-8">

                    {/* Cart Items Section */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-8 text-brand-slate flex items-center gap-3">
                            <ShoppingCart className="text-brand-orange" />
                            سلة المشتريات
                        </h1>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                            {cartItems.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item) => (
                                        <div key={item.cartId} className="p-6 flex gap-6 items-center hover:bg-gray-50 transition">
                                            <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {item.image &&
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                }
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-brand-slate mb-1">{item.title}</h3>
                                                <p className="text-sm text-gray-500 mb-2">{item.author}</p>
                                                <p className="text-xs text-gray-400">الجامعة: {item.university}</p>
                                            </div>
                                            <div className="text-left flex flex-col items-end gap-4">
                                                <span className="font-black text-xl text-brand-orange">{item.price} ر.س</span>
                                                <button onClick={() => removeFromCart(item.cartId)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400">
                                    <ShoppingCart size={64} className="mb-4 opacity-50" />
                                    <p className="text-xl font-bold">السلة فارغة</p>
                                    <button onClick={() => navigate('/')} className="mt-6 text-brand-orange hover:underline font-bold">
                                        تصفح الكتب
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full md:w-[380px]">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h2 className="font-bold text-xl text-brand-slate mb-6 pb-4 border-b border-gray-100">ملخص الطلب</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>المجموع الفرعي</span>
                                    <span className="font-bold">{calculateTotal()} ر.س</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>ضريبة القيمة المضافة (15%)</span>
                                    <span className="font-bold">{(calculateTotal() * 0.15).toFixed(2)} ر.س</span>
                                </div>
                                <div className="flex justify-between text-brand-slate text-lg pt-4 border-t border-dashed border-gray-200">
                                    <span className="font-black">الإجمالي</span>
                                    <span className="font-black text-brand-orange">{(calculateTotal() * 1.15).toFixed(2)} ر.س</span>
                                </div>
                            </div>

                            <button className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl shadow-lg hover:bg-brand-orange/90 transition transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
                                <span>إتمام الشراء</span>
                                <ArrowRight size={18} className="rotate-180" />
                            </button>
                            <button onClick={() => navigate('/')} className="w-full bg-gray-50 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-100 transition">
                                متابعة التسوق
                            </button>
                        </div>
                    </div>

                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Cart;
