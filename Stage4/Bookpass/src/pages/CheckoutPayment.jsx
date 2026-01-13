import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Lock, CheckCircle, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CheckoutPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    // Support both single book (from Buy Now) and multiple books (from Cart)
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [showTestGuide, setShowTestGuide] = useState(false);

    useEffect(() => {
        // Check for cart items first (multi-book checkout)
        if (location.state?.cartItems && location.state.cartItems.length > 0) {
            setItems(location.state.cartItems);
            setTotal(location.state.total || location.state.cartItems.reduce((sum, item) => sum + item.price, 0));
        }
        // Fall back to single book (Buy Now button)
        else if (location.state?.book) {
            setItems([location.state.book]);
            setTotal(parseFloat(location.state.book.price));
        }
        else {
            // Redirect if no items found
            navigate('/');
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (items.length > 0 && window.Moyasar) {
            const amountInHalalas = Math.round(total * 100);

            // Build description with all book titles
            const description = items.length === 1
                ? `Payment for ${items[0].title}`
                : `Payment for ${items.length} books: ${items.map(b => b.title).join(', ')}`;

            // Build callback URL with all book IDs
            const bookIds = items.map(b => b.id).join(',');

            try {
                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: amountInHalalas,
                    currency: 'SAR',
                    description: description,
                    publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLIC_KEY,
                    callback_url: window.location.origin + `/payment-success?bookIds=${bookIds}`,
                    methods: ['creditcard', 'stcpay']
                });
            } catch (error) {
                console.error("Moyasar init error:", error);
            }
        }
    }, [items, total, clearCart]);

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">

                <h1 className="text-3xl font-bold mb-8 text-brand-slate text-center">صفحة الدفع الآمن</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Payment Form */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 order-2 md:order-1">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <CreditCard className="text-brand-orange" />
                            <h2 className="text-xl font-bold text-brand-slate">بيانات الدفع</h2>
                        </div>

                        {/* Moyasar Form Container */}
                        <div className="mysr-form"></div>

                        {/* Test Guide Section */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <button
                                onClick={() => setShowTestGuide(!showTestGuide)}
                                className="w-full flex items-center justify-between text-brand-slate font-bold p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                            >
                                <span className="flex items-center gap-2">
                                    <Lock size={18} className="text-brand-orange" />
                                    <span>كيف تختبر الدفع ؟ (بطاقات تجريبية)</span>
                                </span>
                                <span>{showTestGuide ? '▲' : '▼'}</span>
                            </button>

                            {showTestGuide && (
                                <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm animate-in slide-in-from-top-2 fade-in">
                                    <p className="mb-3 text-blue-800 font-bold">استخدم البطاقات التالية لاختبار الدفع بنجاح:</p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left bg-white rounded-lg border border-blue-100 overflow-hidden">
                                            <thead>
                                                <tr className="bg-blue-100 text-blue-900 border-b border-blue-200">
                                                    <th className="p-2 text-right">النوع</th>
                                                    <th className="p-2 text-center" dir="ltr">Card Number</th>
                                                    <th className="p-2 text-center" dir="ltr">CVV</th>
                                                    <th className="p-2 text-center" dir="ltr">Expiry</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-2 font-bold text-right">مدى (Mada)</td>
                                                    <td className="p-2 font-mono text-center select-all" dir="ltr">4000 0000 0000 0000</td>
                                                    <td className="p-2 text-center">123</td>
                                                    <td className="p-2 text-center" dir="ltr">12/26</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-2 font-bold text-right">فيزا (Visa)</td>
                                                    <td className="p-2 font-mono text-center select-all" dir="ltr">4111 1111 1111 1111</td>
                                                    <td className="p-2 text-center">123</td>
                                                    <td className="p-2 text-center" dir="ltr">12/26</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-2 font-bold text-right">ماستركارد</td>
                                                    <td className="p-2 font-mono text-center select-all" dir="ltr">5111 1111 1111 1111</td>
                                                    <td className="p-2 text-center">123</td>
                                                    <td className="p-2 text-center" dir="ltr">12/26</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-3 text-xs text-blue-600">
                                        * الاسم: Test Card <br />
                                        * كلمة المرور (OTP) للتجربة: 1234
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-1 md:order-2">
                        <div className="bg-brand-slate text-white rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="p-8 bg-[#3A4958]">
                                <h3 className="text-lg font-bold opacity-80 mb-1">ملخص الطلب</h3>
                                <div className="text-3xl font-black">
                                    {total.toFixed(2)} <span className="text-sm font-bold opacity-60">ر.س</span>
                                </div>
                                {items.length > 1 && (
                                    <div className="mt-2 flex items-center gap-2 text-sm opacity-70">
                                        <ShoppingCart size={16} />
                                        <span>{items.length} كتب</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-[#2C3945] max-h-[400px] overflow-y-auto">
                                {/* Book list */}
                                <div className="space-y-4 mb-6">
                                    {items.map((item, index) => (
                                        <div key={item.id || index} className="flex gap-4">
                                            <div className="w-16 h-20 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate leading-tight mb-1">{item.title}</h4>
                                                <p className="text-xs opacity-60 mb-1">{item.author}</p>
                                                <span className="text-brand-orange font-bold text-sm">{item.price} ر.س</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t border-white/10">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>الإجمالي</span>
                                        <span className="text-brand-orange">{total.toFixed(2)} ر.س</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CheckoutPayment;
