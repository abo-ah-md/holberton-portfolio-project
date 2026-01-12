import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CreditCard, Lock, CheckCircle, ArrowRight } from 'lucide-react';

const CheckoutPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [showTestGuide, setShowTestGuide] = useState(false);

    useEffect(() => {
        if (location.state?.book) {
            setItem(location.state.book);
        } else {
            // Redirect if no item found
            navigate('/');
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (item && window.Moyasar) {
            const price = parseFloat(item.price);
            const totalAmount = price; // Removed tax calculation
            const amountInHalalas = Math.round(totalAmount * 100);

            try {
                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: amountInHalalas,
                    currency: 'SAR',
                    description: `Payment for ${item.title}`,
                    publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLIC_KEY,
                    callback_url: window.location.origin + `/payment-success?bookId=${item.id}`,
                    methods: ['creditcard', 'stcpay']
                });
            } catch (error) {
                console.error("Moyasar init error:", error);
            }
        }
    }, [item]);

    if (!item) return null;

    const total = parseFloat(item.price).toFixed(2);

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
                                <div className="text-3xl font-black">{total} <span className="text-sm font-bold opacity-60">ر.س</span></div>
                            </div>

                            <div className="p-8 bg-[#2C3945]">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-20 h-24 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-lg truncate leading-tight mb-1">{item.title}</h4>
                                        <p className="text-sm opacity-60 mb-2">{item.author}</p>
                                        <div className="inline-block bg-white/10 px-2 py-1 rounded text-xs">
                                            {item.university}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                                    <div className="flex justify-between opacity-70">
                                        <span>سعر الكتاب</span>
                                        <span className="font-mono">{item.price} ر.س</span>
                                    </div>

                                    <div className="flex justify-between font-bold text-lg pt-2">
                                        <span>الإجمالي</span>
                                        <span className="text-brand-orange">{total} ر.س</span>
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

// Simple Icon Component needed if Lucide fails to import specific icons? No standard imports work.
const ShieldCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

export default CheckoutPayment;
