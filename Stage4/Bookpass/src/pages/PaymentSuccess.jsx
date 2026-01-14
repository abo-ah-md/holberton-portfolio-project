import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, XCircle, Home, RotateCcw, ShoppingBag } from 'lucide-react';
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
        <div className="min-h-screen flex flex-col font-sans bg-[#2c3e50] pt-20 relative" dir="rtl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
            <Navbar />

            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 w-full relative z-10"
            >
                {/* Hero Section - Orange Pill */}
                <section className="py-12 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className={`${isSuccess ? 'bg-brand-orange' : 'bg-red-500'} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
                            style={{
                                clipPath: 'polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl border border-white/30 text-white">
                                        {isVerifying ? (
                                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : isSuccess ? (
                                            <CheckCircle size={48} />
                                        ) : (
                                            <XCircle size={48} />
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                                            {isVerifying ? 'جاري التحقق...' : isSuccess ? 'تمت العملية بنجاح' : 'تعذر إتمام الدفع'}
                                        </h1>
                                        <p className="text-white/80 text-lg font-medium">
                                            {isVerifying ? 'يرجى عدم إغلاق الصفحة' : isSuccess ? 'شكراً لثقتك بنا، تم تأكيد طلبك.' : 'حدث خطأ أثناء معالجة العملية.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-3xl mx-auto w-full px-4 md:px-8 pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 overflow-hidden"
                    >
                        {isVerifying ? (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-xl font-black text-brand-slate">جاري معالجة طلبك...</h3>
                                <p className="text-gray-400 mt-2">نقوم الآن بتأكيد تفاصيل الدفع مع Moyasar</p>
                            </div>
                        ) : (
                            <>
                                {/* Status Icon & Main Title */}
                                <div className="text-center mb-10">
                                    <div className={`w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center rotate-3 shadow-lg ${isSuccess ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {isSuccess ? <ShoppingBag size={48} /> : <XCircle size={48} />}
                                    </div>
                                    <h2 className="text-3xl font-black text-brand-slate mb-3">
                                        {isSuccess ? 'اكتملت العملية!' : 'فشل الدفع'}
                                    </h2>
                                    {isSuccess && (
                                        <div className="bg-green-50 text-green-700 px-6 py-2 rounded-full inline-flex font-black text-sm uppercase tracking-wide">
                                            رقم الطلب: #{paymentId?.slice(-6).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary Card - Premium Styling */}
                                <div className="bg-[#2c3e50] text-white rounded-2xl p-8 mb-10 shadow-xl border border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-orange to-orange-600"></div>

                                    <div className="space-y-4 relative z-10 font-bold">
                                        {paymentId && (
                                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                <span className="text-white/50">رقم العملية</span>
                                                <span className="font-mono text-xs">{paymentId}</span>
                                            </div>
                                        )}
                                        {purchasedCount > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-white/10">
                                                <span className="text-white/50">عدد الكتب</span>
                                                <span className="text-brand-orange">{purchasedCount}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                                            <span className="text-white/50">الحالة</span>
                                            <span className={statusConfig.color}>{statusConfig.text}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4">
                                            <span className="text-xl font-black">إجمالي المبلغ</span>
                                            <span className="text-3xl font-black text-brand-orange">{totalAmount.toFixed(2)} ر.س</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Pickup Instructions */}
                                {isSuccess && checkoutResult?.purchasedBooks?.[0] && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="mb-10 p-6 bg-brand-orange/5 border-2 border-brand-orange/20 rounded-3xl flex items-center gap-6"
                                    >
                                        <div className="w-16 h-16 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                                            <ShoppingBag size={32} />
                                        </div>
                                        <div className="text-right">
                                            <h4 className="font-black text-brand-slate text-lg mb-1">تعليمات الاستلام</h4>
                                            <p className="text-brand-orange font-bold">
                                                يرجى استلام الكتب من مكتبة جامعة {checkoutResult.purchasedBooks[0].university}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Purchased Books */}
                                {isSuccess && checkoutResult?.purchasedBooks?.length > 0 && (
                                    <div className="mb-10">
                                        <h3 className="text-brand-slate font-black text-lg mb-6 flex items-center gap-3">
                                            <div className="w-1 h-6 bg-brand-orange rounded-full"></div>
                                            الكتب التي تم شراؤها
                                        </h3>
                                        <div className="space-y-4">
                                            {checkoutResult.purchasedBooks.map((book, index) => (
                                                <motion.div
                                                    key={book.id || index}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.6 + (index * 0.1) }}
                                                    className="flex gap-6 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg transition-all group"
                                                >
                                                    <div className="w-20 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-md transform group-hover:-rotate-2 transition-transform">
                                                        {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-center text-right">
                                                        <h4 className="font-black text-brand-slate text-lg group-hover:text-brand-orange transition-colors">{book.title}</h4>
                                                        <p className="text-brand-orange font-black mt-1">{book.price} ر.س</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Error Context if any */}
                                {(message || verificationError) && !isSuccess && (
                                    <div className="mb-10 p-6 bg-red-50 border-2 border-red-100 rounded-2xl flex items-start gap-4">
                                        <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm">
                                            <XCircle size={24} />
                                        </div>
                                        <div className="text-right">
                                            <h4 className="font-black text-red-700">تفاصيل الخطأ</h4>
                                            <p className="text-red-600 text-sm font-bold mt-1">{verificationError || message}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-4">
                                    {!isSuccess ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate('/cart')}
                                            className="bg-slate-100 text-brand-slate font-black py-4 rounded-2xl hover:bg-slate-200 transition shadow-sm flex items-center justify-center gap-3"
                                        >
                                            <RotateCcw size={20} />
                                            <span>العودة للسلة</span>
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => navigate('/profile')}
                                            className="bg-slate-100 text-brand-slate font-black py-4 rounded-2xl hover:bg-slate-200 transition shadow-sm flex items-center justify-center gap-3"
                                        >
                                            <ShoppingBag size={20} />
                                            <span>طلباتي</span>
                                        </motion.button>
                                    )}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/')}
                                        className="bg-brand-orange text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition shadow-xl flex items-center justify-center gap-3"
                                    >
                                        <Home size={20} />
                                        <span>الرئيسية</span>
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default PaymentSuccess;
