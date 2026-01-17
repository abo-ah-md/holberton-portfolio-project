import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Animation variants
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

import usePageTitle from '../hooks/usePageTitle';

const Cart = () => {
    usePageTitle('سلة المشتريات');
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart();

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price, 0);
    };

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
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-xl border border-white/30 text-white">
                                        <ShoppingCart size={48} />
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                                            سلة المشتريات
                                        </h1>
                                        <p className="text-white/80 text-lg font-medium">
                                            {cartItems.length} كتب في انتظارك
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Cart Items Section */}
                        <motion.div variants={fadeInUp} className="flex-1">
                            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[400px] border border-gray-100">
                                <AnimatePresence mode="popLayout">
                                    {cartItems.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {cartItems.map((item) => (
                                                <motion.div
                                                    layout
                                                    key={item.cartId}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    className="p-8 flex flex-col sm:flex-row gap-8 items-center hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <div className="w-28 h-36 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                                                        {item.image &&
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 text-center sm:text-right">
                                                        <h3 className="font-black text-2xl text-brand-secondary mb-2">{item.title}</h3>
                                                        <p className="text-lg text-brand-muted font-bold mb-3">{item.author}</p>
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-black">
                                                            <BookOpen size={14} />
                                                            <span>جامعة {item.university}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-center sm:items-end gap-6 w-full sm:w-auto">
                                                        <span className="font-black text-3xl text-brand-primary leading-none">{item.price} <span className="text-base font-bold">ر.س</span></span>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeFromCart(item.cartId)}
                                                            className="text-red-400 hover:text-red-600 p-3 rounded-2xl hover:bg-red-50 transition-all border-2 border-transparent hover:border-red-100"
                                                        >
                                                            <Trash2 size={24} />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-20 text-center">
                                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                <ShoppingCart size={48} className="text-gray-300" />
                                            </div>
                                            <p className="text-2xl font-black text-gray-400 mb-8">السلة فارغة حالياً</p>
                                            <motion.button
                                                whileHover={{ scale: 1.05, y: -4 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate('/marketplace')}
                                                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all"
                                            >
                                                تصفح الكتب المتاحة
                                            </motion.button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>


                        {/* Summary Section - Only show when cart has items */}
                        {cartItems.length > 0 && (
                            <motion.div variants={fadeInUp} className="w-full lg:w-[400px]">
                                <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-24 border border-brand-border">
                                    <h2 className="font-black text-2xl text-brand-secondary mb-8 pb-4 border-b-2 border-brand-background">ملخص الطلب</h2>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex justify-between items-center text-gray-500 font-bold text-lg">
                                            <span>عدد الكتب</span>
                                            <span className="text-gray-900">{cartItems.length}</span>
                                        </div>
                                        <div className="h-0.5 bg-gray-50 w-full" />
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-black text-xl text-brand-secondary">الإجمالي النهائي</span>
                                            <div className="text-right">
                                                <div className="text-4xl font-black text-brand-primary">{calculateTotal()} <span className="text-lg">ر.س</span></div>
                                                <p className="text-xs text-brand-muted font-bold mt-1">شامل كافة الرسوم</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="space-y-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={async () => {
                                                // Run a final check before proceeding
                                                await validateCart();

                                                // Ideally we should check if items were removed, but for now 
                                                // we navigate. The Checkout page re-validates or accepts the passed state.
                                                // If items were removed by validateCart, they will disappear from UI 
                                                // on next render.
                                                navigate('/checkout', {
                                                    state: {
                                                        cartItems: cartItems,
                                                        total: calculateTotal()
                                                    }
                                                });
                                            }}
                                            className="w-full bg-brand-primary hover:bg-brand-accent text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-brand-primary/20 transition-all flex items-center justify-center gap-3 text-xl"
                                        >
                                            <span>إتمام عملية الشراء</span>
                                            <ArrowRight size={24} className="rotate-180" />
                                        </motion.button>
                                        <button
                                            onClick={() => navigate('/marketplace')}
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-5 rounded-2xl transition-all border-none"
                                        >
                                            متابعة التسوق
                                        </button>
                                    </div>

                                    <div className="mt-8 p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                        <div className="flex gap-4 items-start text-brand-primary text-sm">
                                            <div className="shrink-0 p-1 bg-white rounded-lg shadow-sm">
                                                <ArrowRight size={16} className="text-brand-primary" />
                                            </div>
                                            <p className="font-bold leading-relaxed">بإتمامك للطلب، أنت توافق على شروط وأحكام منصة بوك باس.</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default Cart;
