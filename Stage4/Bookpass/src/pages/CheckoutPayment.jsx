import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, CreditCard, CheckCircle, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { usePageLoading } from '../components/PageTransition';
import { getBookById } from '../services/bookService';
import usePageTitle from '../hooks/usePageTitle';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
};

const CheckoutPayment = () => {
    usePageTitle('الدفع');
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { setIsLoading, setLoadingMessage } = usePageLoading();

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loadingBook, setLoadingBook] = useState(false);

    useEffect(() => {
        const initCheckout = async () => {
            const searchParams = new URLSearchParams(location.search);
            const bookId = searchParams.get('bookId');

            if (location.state?.cartItems && location.state.cartItems.length > 0) {
                setItems(location.state.cartItems);
                setTotal(location.state.total || location.state.cartItems.reduce((sum, item) => sum + item.price, 0));
            }
            else if (location.state?.book) {
                setItems([location.state.book]);
                setTotal(parseFloat(location.state.book.price));
            }
            else if (bookId) {
                // Fetch book by ID
                setLoadingBook(true);
                const { data, error } = await getBookById(bookId);
                setLoadingBook(false);

                if (data) {
                    setItems([data]);
                    setTotal(parseFloat(data.price));
                } else {
                    console.error("Failed to load book", error);
                    navigate('/');
                }
            }
            else {
                navigate('/');
            }
        };

        initCheckout();
    }, [location.state, location.search, navigate]);


    useEffect(() => {
        if (items.length > 0 && window.Moyasar) {
            const amountInHalalas = Math.round(total * 100);
            const description = items.length === 1
                ? `Payment for ${items[0].title}`
                : `Payment for ${items.length} books: ${items.map(b => b.title).join(', ')}`;

            sessionStorage.setItem('pendingTransaction', JSON.stringify({
                bookIds: items.map(b => b.id),
                total: total,
                timestamp: Date.now()
            }));

            // Save state for "Try Again" functionality
            if (location.state) {
                sessionStorage.setItem('lastCheckoutState', JSON.stringify(location.state));
            }

            try {
                window.Moyasar.init({
                    element: '.mysr-form',
                    amount: amountInHalalas,
                    currency: 'SAR',
                    description: description,
                    publishable_api_key: import.meta.env.VITE_MOYASAR_PUBLIC_KEY,
                    callback_url: window.location.origin + `/payment-success`,
                    methods: ['creditcard', 'stcpay']
                });
            } catch (error) {
                console.error("Moyasar init error:", error);
            }
        }
    }, [items, total]);

    if (items.length === 0) return null;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-secondary pt-20 relative" dir="rtl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>
            <Navbar />

            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="flex-1 w-full relative z-10"
            >
                {/* Dark Navy Hero Section */}
                <motion.section
                    variants={fadeInUp}
                    className="bg-brand-secondary py-12 px-4 md:px-8 relative"
                >
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Orange Pill Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-brand-primary rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                            style={{
                                clipPath: 'polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl border border-white/30 text-white">
                                        <Lock size={48} />
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                                            إتمام عملية الدفع
                                        </h1>
                                        <p className="text-white/80 text-lg font-medium flex items-center gap-2">
                                            <ShieldCheck size={20} />
                                            بوابة دفع آمنة 100%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Payment Form */}
                        <motion.div variants={fadeInUp} className="order-2 lg:order-1">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-brand-border">
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-brand-background uppercase tracking-widest text-brand-muted font-black text-sm">
                                    <CreditCard className="text-brand-primary" size={20} />
                                    <span>بيانات بطاقة الدفع</span>
                                </div>

                                <div className="mysr-form mb-10"></div>

                                {/* Test Guide Section */}
                                <div className="pt-8 border-t-2 border-gray-50">
                                    <div className="flex flex-col gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02, backgroundColor: '#f0f9ff' }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={async () => {
                                                const form = document.querySelector('.mysr-form');
                                                if (form) {
                                                    const fields = {
                                                        'mysr-cc-name': 'Test User',
                                                        'mysr-cc-number': '4111 1111 1111 1111',
                                                        'mysr-cc-csc': '123',
                                                        'mysr-cc-exp': '12 / 26'
                                                    };

                                                    const typeCharByChar = async (element, text) => {
                                                        element.focus();
                                                        element.value = '';

                                                        const valueDescriptor = Object.getOwnPropertyDescriptor(element, 'value');
                                                        const valueSetter = valueDescriptor ? valueDescriptor.set : null;
                                                        const prototype = Object.getPrototypeOf(element);
                                                        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value') ? Object.getOwnPropertyDescriptor(prototype, 'value').set : null;

                                                        const setNative = (val) => {
                                                            if (valueSetter && valueSetter !== prototypeValueSetter) {
                                                                prototypeValueSetter.call(element, val);
                                                            } else if (prototypeValueSetter) {
                                                                prototypeValueSetter.call(element, val);
                                                            } else {
                                                                element.value = val;
                                                            }
                                                        };

                                                        for (let i = 0; i < text.length; i++) {
                                                            const char = text[i];

                                                            element.dispatchEvent(new KeyboardEvent('keydown', { key: char, bubbles: true }));
                                                            element.dispatchEvent(new KeyboardEvent('keypress', { key: char, bubbles: true }));

                                                            const currentVal = element.value + char;
                                                            setNative(currentVal);

                                                            element.dispatchEvent(new Event('input', { bubbles: true }));
                                                            element.dispatchEvent(new Event('change', { bubbles: true }));
                                                            element.dispatchEvent(new KeyboardEvent('keyup', { key: char, bubbles: true }));

                                                            await new Promise(resolve => setTimeout(resolve, 10));
                                                        }

                                                        element.blur();
                                                        element.dispatchEvent(new Event('blur', { bubbles: true }));
                                                    };

                                                    for (const [id, value] of Object.entries(fields)) {
                                                        const input = document.getElementById(id);
                                                        if (input) {
                                                            await typeCharByChar(input, value);
                                                            await new Promise(resolve => setTimeout(resolve, 600));
                                                        }
                                                    }
                                                }
                                            }}
                                            className="w-full flex items-center justify-center gap-3 text-blue-700 font-black p-5 bg-blue-50/50 rounded-2xl transition-all border-2 border-blue-100 hover:border-blue-200 shadow-sm"
                                        >
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                                <CheckCircle size={20} />
                                            </div>
                                            <span>تعبئة بيانات بطاقة التجربة تلقائياً (Visa)</span>
                                        </motion.button>

                                        <p className="text-center text-gray-400 text-xs font-bold italic">
                                            * استخدم الرمز <span className="text-blue-600">1234</span> عند طلب رمز التحقق (OTP)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Summary Sidebar */}
                        <motion.div variants={fadeInUp} className="order-1 lg:order-2">
                            <div className="bg-brand-secondary text-white rounded-3xl shadow-2xl overflow-hidden sticky top-24 border border-white/10">
                                <div className="p-10 bg-brand-primary">
                                    <h3 className="text-white/80 font-black text-sm uppercase tracking-widest mb-2 text-right">إجمالي المبلغ المستحق</h3>
                                    <div className="text-5xl font-black text-white text-right drop-shadow-xl">
                                        {total.toFixed(2)} <span className="text-xl">ر.س</span>
                                    </div>
                                    {items.length > 1 && (
                                        <div className="mt-4 flex items-center gap-2 text-white/90 font-bold bg-white/10 self-start px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 w-fit mr-0 ml-auto">
                                            <ShoppingCart size={18} />
                                            <span>{items.length} كتب في طلبك</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-10 space-y-8">
                                    <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pl-4">
                                        {items.map((item, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + (index * 0.1) }}
                                                key={item.id || index}
                                                className="flex gap-6 group"
                                            >
                                                <div className="w-20 h-24 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-white/5 group-hover:border-white/20 transition-colors duration-500">
                                                    {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                                                </div>
                                                <div className="flex-1 min-w-0 flex flex-col justify-center text-right">
                                                    <h4 className="font-black text-lg truncate leading-tight mb-1 text-white group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                                    <p className="text-sm text-white/50 font-bold mb-2 uppercase tracking-wide">{item.author}</p>
                                                    <span className="text-brand-primary font-black text-lg">{item.price} ر.س</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Final Summary Row */}
                                    <div className="pt-8 border-t border-white/10">
                                        <div className="flex justify-between items-center text-xl font-black">
                                            <span className="text-white opacity-80">الإجمالي</span>
                                            <span className="text-brand-primary text-3xl">{total.toFixed(2)} ر.س</span>
                                        </div>
                                        <p className="text-center text-white/40 font-bold text-xs mt-6 flex items-center gap-2 justify-center">
                                            <ShieldCheck size={14} />
                                            <span>دفع مشفر وآمن عبر بوابة Moyasar</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default CheckoutPayment;
