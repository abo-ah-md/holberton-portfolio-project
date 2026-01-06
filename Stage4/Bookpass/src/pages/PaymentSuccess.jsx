import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [paymentId, setPaymentId] = useState('');

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const messageParam = searchParams.get('message');
        const idParam = searchParams.get('id');

        setStatus(statusParam);
        setMessage(messageParam);
        setPaymentId(idParam);
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center border border-gray-100">

                    {status === 'paid' ? (
                        <div className="animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle size={48} strokeWidth={2} />
                            </div>
                            <h1 className="text-3xl font-black text-brand-slate mb-2">تم الدفع بنجاح!</h1>
                            <p className="text-gray-500 mb-8">شكراً لك، تم استلام مبلغ الدفع وتأكيد طلبك.</p>

                            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-right border border-gray-200/50">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">رقم العملية</span>
                                    <span className="font-mono font-bold text-gray-700">{paymentId}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">الحالة</span>
                                    <span className="font-bold text-green-600">مقبولة</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-brand-orange/90 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Home size={18} />
                                    <span>العودة للرئيسية</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                                <XCircle size={48} strokeWidth={2} />
                            </div>
                            <h1 className="text-3xl font-black text-brand-slate mb-2">فشلت عملية الدفع</h1>
                            <p className="text-gray-500 mb-2">عذراً، لم نتمكن من إتمام عملية الدفع.</p>
                            {message && (
                                <p className="text-sm text-red-500 bg-red-50 px-3 py-1 rounded-full inline-block mb-8 font-bold dir-ltr">
                                    {message}
                                </p>
                            )}

                            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-right border border-gray-200/50">
                                {paymentId && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">رقم العملية</span>
                                        <span className="font-mono font-bold text-gray-700">{paymentId}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">الحالة</span>
                                    <span className="font-bold text-red-600">مرفوضة</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/checkout', { replace: true })}
                                    className="flex-1 bg-brand-slate text-white font-bold py-3 rounded-xl hover:bg-brand-slate/90 transition shadow-lg flex items-center justify-center gap-2"
                                >
                                    <RotateCcw size={18} />
                                    <span>المحاولة مرة أخرى</span>
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                                >
                                    <Home size={18} />
                                    <span>الرئيسية</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentSuccess;
