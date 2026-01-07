import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import { purchaseBook } from '../services/bookService';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [bookId, setBookId] = useState('');

    // Verification State
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationError, setVerificationError] = useState(null);

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const messageParam = searchParams.get('message');
        const idParam = searchParams.get('id');
        const bookIdParam = searchParams.get('bookId');

        setStatus(statusParam);
        setMessage(messageParam);
        setPaymentId(idParam);
        setBookId(bookIdParam);

        const verifyPayment = async () => {
            // Only verify if status is paid and we have both IDs
            if (statusParam === 'paid' && idParam && bookIdParam) {
                try {
                    setIsVerifying(true);
                    // Call Backend to Verify with Moyasar
                    const { data, error } = await purchaseBook(bookIdParam, idParam);

                    if (error) {
                        setVerificationError(error);
                        setStatus('failed'); // Override status to failed on backend rejection
                    } else {
                        // Success!
                        setVerificationError(null);
                    }
                } catch (err) {
                    setVerificationError(err.message || 'Verification failed');
                    setStatus('failed');
                } finally {
                    setIsVerifying(false);
                }
            } else {
                // If failed query param or missing ID, stop verifying
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    const getStatusConfig = (currentStatus) => {
        switch (currentStatus) {
            case 'paid':
                return { text: 'مقبولة ومؤكدة', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
            case 'authorized':
                return { text: 'مفوضة (بانتظار السحب)', color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle };
            case 'refunded':
                return { text: 'تم الاسترجاع', color: 'text-orange-600', bg: 'bg-orange-100', icon: RotateCcw };
            case 'voided':
                return { text: 'ملغاة', color: 'text-gray-600', bg: 'bg-gray-100', icon: XCircle };
            case 'failed':
            default:
                return { text: 'مرفوضة / فشلت', color: 'text-red-600', bg: 'bg-red-100', icon: XCircle };
        }
    };

    const statusConfig = getStatusConfig(status);
    const isSuccess = status === 'paid' && !verificationError;

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center border border-gray-100">

                    {isVerifying ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h2 className="text-xl font-bold text-gray-700">جاري التحقق من عملية الدفع...</h2>
                            <p className="text-gray-500 text-sm mt-2">يرجى الانتظار قليلاً</p>
                        </div>
                    ) : (
                        <div className="animate-in zoom-in duration-300">
                            <div className={`w-20 h-20 ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                {isSuccess ? <CheckCircle size={48} /> : <XCircle size={48} />}
                            </div>

                            <h1 className="text-3xl font-black text-brand-slate mb-2">
                                {isSuccess ? 'تم الدفع بنجاح!' : 'حدث خطأ في الدفع'}
                            </h1>

                            <p className="text-gray-500 mb-8">
                                {isSuccess
                                    ? 'شكراً لك، تم التحقق من الدفع وتأكيد شراء الكتاب.'
                                    : 'عذراً، لم نتمكن من إتمام عملية الدفع.'}
                            </p>

                            {/* Error Message if any */}
                            {(message || verificationError) && !isSuccess && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100 dir-ltr">
                                    {message || `Verification Error: ${verificationError}`}
                                </div>
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
                                    <span className={`font-bold ${statusConfig.color}`}>
                                        {statusConfig.text}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {!isSuccess && (
                                    <button
                                        onClick={() => navigate('/marketplace')}
                                        className="flex-1 bg-brand-slate text-white font-bold py-3 rounded-xl hover:bg-brand-slate/90 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        <span>المحاولة مرة أخرى</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/')}
                                    className={`flex-1 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 ${isSuccess ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
