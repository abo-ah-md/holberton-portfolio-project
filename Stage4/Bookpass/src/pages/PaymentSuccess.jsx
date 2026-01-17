import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, XCircle, Home, RotateCcw, ShoppingBag, AlertCircle } from 'lucide-react';
import { checkoutCart } from '../services/bookService';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [bookIds, setBookIds] = useState([]);

    // Checkout result state
    const [checkoutResult, setCheckoutResult] = useState(null);

    // Verification State
    const [isVerifying, setIsVerifying] = useState(true);
    const [verificationError, setVerificationError] = useState(null);

    // Track if verification has been initiated to prevent duplicate calls
    const hasVerifiedRef = useRef(false);

    useEffect(() => {
        const statusParam = searchParams.get('status');
        const messageParam = searchParams.get('message');
        const idParam = searchParams.get('id');

        // SECURITY: Retrieve transaction details from session storage
        // We do NOT trust URL parameters for bookIds to prevent manipulation
        const pendingTransactionStr = sessionStorage.getItem('pendingTransaction');
        let pendingTransaction = null;

        try {
            if (pendingTransactionStr) {
                pendingTransaction = JSON.parse(pendingTransactionStr);
            }
        } catch (e) {
            console.error("Failed to parse pending transaction", e);
        }

        const validBookIds = pendingTransaction ? pendingTransaction.bookIds : [];

        setStatus(statusParam);
        setMessage(messageParam);
        setPaymentId(idParam);
        setBookIds(validBookIds);

        const verifyPayment = async () => {
            // Only verify if status is paid and we have payment ID and VALID book IDs from session
            // AND we haven't already initiated verification
            if (statusParam === 'paid' && idParam && validBookIds.length > 0 && !hasVerifiedRef.current) {
                hasVerifiedRef.current = true; // Mark as verified to prevent duplicate calls

                try {
                    setIsVerifying(true);

                    // Use the securely stored book IDs
                    const { data, error } = await checkoutCart(validBookIds, idParam);

                    if (error) {
                        setVerificationError(error);
                        setStatus('failed');
                    } else if (data) {
                        // Success - store checkout result and clear cart
                        setCheckoutResult(data);
                        clearCart();
                        setVerificationError(null);

                        // Clear the secure transaction from session
                        sessionStorage.removeItem('pendingTransaction');
                        sessionStorage.removeItem('lastCheckoutState');

                        // Check if all books were purchased
                        if (data.status !== 'COMPLETED') {
                            setVerificationError(`حالة الطلب: ${data.status}`);
                        }
                    }
                } catch (err) {
                    setVerificationError(err.message || 'Verification failed');
                    setStatus('failed');
                } finally {
                    setIsVerifying(false);
                }
            } else if (!hasVerifiedRef.current) {
                // If failed query param or missing ID or missing SESSION context
                if (statusParam === 'paid' && validBookIds.length === 0) {
                    setVerificationError('لم يتم العثور على بيانات العملية. الرجاء المحاولة مرة أخرى.');
                    setStatus('failed');
                }
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]); // Removed clearCart from dependencies to prevent re-triggers

    const getStatusConfig = (currentStatus) => {
        switch (currentStatus) {
            case 'paid':
                return { text: 'مقبولة ومؤكدة', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
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
    const isSuccess = status === 'paid' && !verificationError && checkoutResult?.status === 'COMPLETED';
    const purchasedCount = checkoutResult?.totalBooks || 0;
    const totalAmount = checkoutResult?.totalAmount || 0;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto font-sans rtl text-white py-10">
            <style>{`
                @keyframes gradient-xy {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .error-bg-animated {
                        background: linear-gradient(135deg, #C17554, #3A4958, #C17554);
                        background-size: 200% 200%;
                        animation: gradient-xy 3s ease infinite;
                }
            `}</style>

            {/* Background with blur and gradient */}
            <div className="absolute inset-0 error-bg-animated opacity-95"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center justify-center text-center"
            >
                {/* Main Glass Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 w-full shadow-2xl">

                    {isVerifying ? (
                        <div className="py-12 flex flex-col items-center">
                            <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mb-8 shadow-lg"></div>
                            <h2 className="text-3xl font-black mb-4 drop-shadow-md">جاري معالجة طلبك...</h2>
                            <p className="text-white/70 text-lg">نقوم الآن بتأكيد تفاصيل الدفع مع البنك</p>
                        </div>
                    ) : (
                        <>
                            {/* Icon & Title */}
                            <div className="mb-10">
                                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl animate-in zoom-in duration-500 ${isSuccess ? 'bg-[#61BF8D] text-white' : 'bg-red-500 text-white'}`}>
                                    {isSuccess ? <CheckCircle size={48} /> : <XCircle size={48} />}
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg">
                                    {isSuccess ? 'اكتمل الدفع بنجاح!' : 'لم تكتمل العملية'}
                                </h1>
                                {isSuccess && paymentId && (
                                    <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-mono text-lg tracking-wider border border-white/10">
                                        #{paymentId.slice(-6).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Details Card */}
                            {isSuccess ? (
                                <div className="bg-black/20 rounded-2xl p-6 md:p-8 text-right mb-8 border border-white/10">
                                    {purchasedCount > 0 && (
                                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                                            <span className="text-white/60 font-bold">عدد الكتب</span>
                                            <span className="text-xl font-black">{purchasedCount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                                        <span className="text-white/60 font-bold">الحالة</span>
                                        <span className="text-[#61BF8D] font-black flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            مقبولة
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4">
                                        <span className="text-white/80 font-bold text-lg">الإجمالي</span>
                                        <span className="text-3xl font-black text-brand-primary drop-shadow-md">{totalAmount.toFixed(2)} ر.س</span>
                                    </div>

                                    {/* Pickup Info Alert inside Glass */}
                                    {checkoutResult?.purchasedBooks?.[0] && (
                                        <div className="mt-6 bg-brand-primary/20 border border-brand-primary/30 rounded-xl p-4 flex gap-4 items-start">
                                            <ShoppingBag className="text-brand-primary shrink-0 mt-1" />
                                            <div>
                                                <p className="font-bold text-white text-sm mb-1">تعليمات الاستلام</p>
                                                <p className="text-white/80 text-sm">
                                                    يرجى التوجه إلى مكتبة جامعة <span className="font-black text-white underline">{checkoutResult.purchasedBooks[0].university}</span> لاستلام كتبك.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 mb-8 text-right">
                                    <h3 className="font-bold text-red-200 mb-2 flex items-center gap-2">
                                        <AlertCircle size={20} />
                                        سبب الخطأ
                                    </h3>
                                    <p className="text-white font-medium">
                                        {verificationError || message || 'حدث خطأ غير متوقع أثناء معالجة الدفع. يرجى التأكد من رصيدك أو بيانات البطاقة.'}
                                    </p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {!isSuccess ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            const lastStateStr = sessionStorage.getItem('lastCheckoutState');
                                            if (lastStateStr) {
                                                try {
                                                    const lastState = JSON.parse(lastStateStr);
                                                    navigate('/checkout', { state: lastState });
                                                } catch (e) {
                                                    navigate('/cart');
                                                }
                                            } else {
                                                navigate('/cart');
                                            }
                                        }}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-xl transition-all border border-white/20 backdrop-blur-md flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={20} />
                                        <span>محاولة مجدداً</span>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/profile')}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 rounded-xl transition-all border border-white/20 backdrop-blur-md flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag size={20} />
                                        <span>متابعة طلباتي</span>
                                    </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-white text-brand-secondary font-black py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <Home size={20} />
                                    <span>الرئيسية</span>
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
