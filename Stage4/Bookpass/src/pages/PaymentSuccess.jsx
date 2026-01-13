import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, XCircle, Home, RotateCcw, ShoppingBag } from 'lucide-react';
import { checkoutCart } from '../services/bookService';
import { useCart } from '../context/CartContext';

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

        // Support both single bookId and multiple bookIds (comma-separated)
        const bookIdParam = searchParams.get('bookId');
        const bookIdsParam = searchParams.get('bookIds');

        // Parse book IDs
        let parsedBookIds = [];
        if (bookIdsParam) {
            parsedBookIds = bookIdsParam.split(',').filter(id => id.trim());
        } else if (bookIdParam) {
            parsedBookIds = [bookIdParam];
        }

        setStatus(statusParam);
        setMessage(messageParam);
        setPaymentId(idParam);
        setBookIds(parsedBookIds);

        const verifyPayment = async () => {
            // Only verify if status is paid and we have payment ID and book IDs
            // AND we haven't already initiated verification
            if (statusParam === 'paid' && idParam && parsedBookIds.length > 0 && !hasVerifiedRef.current) {
                hasVerifiedRef.current = true; // Mark as verified to prevent duplicate calls

                try {
                    setIsVerifying(true);

                    // Use the new single checkout API for all books
                    const { data, error } = await checkoutCart(parsedBookIds, idParam);

                    if (error) {
                        setVerificationError(error);
                        setStatus('failed');
                    } else if (data) {
                        // Success - store checkout result and clear cart
                        setCheckoutResult(data);
                        clearCart();
                        setVerificationError(null);

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
                // If failed query param or missing ID, stop verifying
                setIsVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams]); // Removed clearCart from dependencies to prevent re-triggers

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
    const isSuccess = status === 'paid' && !verificationError && checkoutResult?.status === 'COMPLETED';
    const purchasedCount = checkoutResult?.totalBooks || 0;
    const totalAmount = checkoutResult?.totalAmount || 0;

    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 text-center border border-gray-100">

                    {isVerifying ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4"></div>
                            <h2 className="text-xl font-bold text-gray-700">جاري التحقق من عملية الدفع...</h2>
                            <p className="text-gray-500 text-sm mt-2">
                                {bookIds.length > 1
                                    ? `جاري معالجة ${bookIds.length} كتب...`
                                    : 'يرجى الانتظار قليلاً'}
                            </p>
                        </div>
                    ) : (
                        <div className="animate-in zoom-in duration-300">
                            <div className={`w-20 h-20 ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                {isSuccess ? <CheckCircle size={48} /> : <XCircle size={48} />}
                            </div>

                            <h1 className="text-3xl font-black text-brand-slate mb-2">
                                {isSuccess
                                    ? (purchasedCount > 1 ? `تم شراء ${purchasedCount} كتب بنجاح!` : 'تم الدفع بنجاح!')
                                    : 'حدث خطأ في الدفع'}
                            </h1>

                            <p className="text-gray-500 mb-8">
                                {isSuccess
                                    ? 'شكراً لك، تم التحقق من الدفع وتأكيد شراء الكتب.'
                                    : 'عذراً، لم نتمكن من إتمام عملية الدفع.'}
                            </p>

                            {/* Error Message if any */}
                            {(message || verificationError) && !isSuccess && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">
                                    {verificationError || message}
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-sm text-right border border-gray-200/50">
                                {paymentId && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">رقم العملية</span>
                                        <span className="font-mono font-bold text-gray-700 text-xs">{paymentId}</span>
                                    </div>
                                )}
                                {purchasedCount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">عدد الكتب</span>
                                        <span className="font-bold text-gray-700">{purchasedCount} كتب</span>
                                    </div>
                                )}
                                {totalAmount > 0 && (
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-500">المبلغ الإجمالي</span>
                                        <span className="font-bold text-brand-orange">{totalAmount} ر.س</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">الحالة</span>
                                    <span className={`font-bold ${statusConfig.color}`}>
                                        {checkoutResult?.status === 'COMPLETED' ? 'مكتملة' : statusConfig.text}
                                    </span>
                                </div>
                            </div>

                            {/* Purchased Books List */}
                            {isSuccess && checkoutResult?.purchasedBooks?.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2 justify-center">
                                        <ShoppingBag size={16} />
                                        الكتب المشتراة
                                    </h3>
                                    <div className="bg-brand-slate/5 rounded-xl p-3 max-h-[200px] overflow-y-auto">
                                        {checkoutResult.purchasedBooks.map((book, index) => (
                                            <div key={book.id || index} className="flex items-center gap-3 py-2 border-b border-gray-200 last:border-0">
                                                <div className="w-10 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                    {book.image && <img src={book.image} alt={book.title} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-1 text-right min-w-0">
                                                    <p className="font-bold text-sm text-brand-slate truncate">{book.title}</p>
                                                    <p className="text-xs text-gray-500">{book.price} ر.س</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                {!isSuccess && (
                                    <button
                                        onClick={() => navigate('/cart')}
                                        className="flex-1 bg-brand-slate text-white font-bold py-3 rounded-xl hover:bg-brand-slate/90 transition shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={18} />
                                        <span>العودة للسلة</span>
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
