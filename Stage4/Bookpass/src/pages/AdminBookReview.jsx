import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewBookCard from '../components/ReviewBookCard';
import SoldBookCard from '../components/SoldBookCard';
import { usePageLoading } from '../components/PageTransition';
import { getStorePendingBooks, getStoreSoldBooks, reviewBook, markBookAsPicked } from '../services/bookService';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

const AdminBookReview = () => {
    const [booksToReview, setBooksToReview] = React.useState([]);
    const [soldBooks, setSoldBooks] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('pending');
    usePageTitle('مراجعة الكتب');
    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();

    const [error, setError] = React.useState(null);

    React.useLayoutEffect(() => {
        const fetchData = async () => {
            setLoadingMessage("جاري تحميل الكتب...");
            setIsLoading(true);
            try {
                const [pendingRes, soldRes] = await Promise.all([
                    getStorePendingBooks(),
                    getStoreSoldBooks()
                ]);

                if (pendingRes.error || soldRes.error) {
                    const errorMsg = pendingRes.error || soldRes.error;
                    if (errorMsg.includes('403') || errorMsg.includes('Not authenticated')) {
                        setError('ACCESS_DENIED');
                        return;
                    }
                }

                if (pendingRes.data) {
                    setBooksToReview(pendingRes.data);
                }
                if (soldRes.data) {
                    // Only show books that are SOLD but not yet PICKED
                    const pendingDelivery = soldRes.data.filter(book => book.listingStatus === 'SOLD');
                    setSoldBooks(pendingDelivery);
                }
            } catch (err) {
                console.error("Failed to fetch books", err);
                setError('ERROR');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // Run once on mount

    const handleAccept = async (updatedBook) => {
        try {
            const { error } = await reviewBook(updatedBook.id, updatedBook.status);
            if (error) {
                alert("فشل في قبول الكتاب: " + error);
                return;
            }
            setBooksToReview(prev => prev.filter(b => b.id !== updatedBook.id));
        } catch (err) {
            console.error("Error in handleAccept:", err);
            alert("حدث خطأ غير متوقع");
        }
    };

    const handlePicked = async (bookId) => {
        try {
            if (!bookId) return;
            const { error } = await markBookAsPicked(bookId);
            if (error) {
                alert("فشل في تحديث حالة الكتاب: " + error);
                return;
            }
            setSoldBooks(prev => prev.filter(b => b.id !== bookId));
        } catch (err) {
            console.error("Error in handlePicked:", err);
            alert("حدث خطأ غير متوقع");
        }
    };

    if (error === 'ACCESS_DENIED') {
        return (
            <div className="min-h-screen bg-brand-secondary pt-20 flex items-center justify-center text-center px-4" dir="rtl">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                    <div className="mx-auto text-brand-error mb-4 flex justify-center">
                        <ShoppingBag size={64} className="text-brand-error" />
                    </div>
                    {/* Using ShoppingBag as placeholder or maybe ShieldCheck like Dashboard */}

                    <h1 className="text-2xl font-bold text-brand-secondary mb-2">تم رفض الوصول</h1>
                    <p className="text-brand-muted mb-6">ليس لديك الصلاحيات الكافية لعرض هذه الصفحة أو انتهت جلسة تسجيل الدخول.</p>
                    <a href="/login" className="block w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-primary/90 transition">
                        تسجيل الدخول مجدداً
                    </a>
                    <a href="/" className="block mt-4 text-brand-muted hover:text-brand-secondary text-sm font-bold">
                        العودة للرئيسية
                    </a>
                </div>
            </div>
        );
    }

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
                            className="bg-brand-primary rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                            style={{
                                clipPath: 'polygon(0 0, 98% 0, 100% 50%, 98% 100%, 0 100%)'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div className="text-right">
                                    <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
                                        لوحة التحكم والمراجعة
                                    </h1>
                                    <p className="text-white/80 text-lg font-medium">
                                        إدارة الكتب المرفوعة والطلبات التي تنتظر التسليم
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center border border-white/30 shadow-xl min-w-[120px]">
                                        <div className="text-3xl font-black text-white">{booksToReview.length}</div>
                                        <div className="text-xs font-bold text-white/70 uppercase">بانتظار المراجعة</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center border border-white/30 shadow-xl min-w-[120px]">
                                        <div className="text-3xl font-black text-white">{soldBooks.length}</div>
                                        <div className="text-xs font-bold text-white/70 uppercase">بانتظار التسليم</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                    {/* Tabs Section */}
                    <div className="flex justify-center mb-12 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl w-fit mx-auto shadow-2xl overflow-hidden">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all relative z-10 flex items-center gap-3 ${activeTab === 'pending'
                                ? 'bg-brand-primary text-white shadow-xl scale-105'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>مراجعة الكتب</span>
                            <div className={`w-2 h-2 rounded-full ${activeTab === 'pending' ? 'bg-white animate-pulse' : 'bg-white/20'}`}></div>
                        </button>
                        <button
                            onClick={() => setActiveTab('sold')}
                            className={`px-10 py-4 rounded-2xl font-black text-lg transition-all relative z-10 flex items-center gap-3 ${activeTab === 'sold'
                                ? 'bg-brand-primary text-white shadow-xl scale-105'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span>تسليم الكتب</span>
                            <div className={`w-2 h-2 rounded-full ${activeTab === 'sold' ? 'bg-white animate-pulse' : 'bg-white/20'}`}></div>
                        </button>
                    </div>

                    {/* Content Container */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-96">
                                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <h3 className="text-xl font-black text-white/50">جاري جلب القائمة...</h3>
                                </div>
                            ) : activeTab === 'pending' ? (
                                booksToReview.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {booksToReview.map((book, index) => (
                                            <motion.div
                                                key={book.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <ReviewBookCard
                                                    book={book}
                                                    onAccept={handleAccept}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-96 text-white/30 bg-white/5 rounded-3xl border border-white/5 text-center px-4">
                                        <ShoppingBag size={64} className="mb-6 opacity-20" />
                                        <span className="text-2xl font-black mb-2 text-white/50">لا توجد كتب للمراجعة</span>
                                        <p className="font-bold">جميع الكتب تمت مراجعتها وإدراجها في المتجر.</p>
                                    </div>
                                )
                            ) : (
                                activeTab === 'sold' && (
                                    soldBooks.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {soldBooks.map((book, index) => (
                                                <motion.div
                                                    key={book.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <SoldBookCard
                                                        book={book}
                                                        onPicked={handlePicked}
                                                    />
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-96 text-white/30 bg-white/5 rounded-3xl border border-white/5 text-center px-4">
                                            <ShoppingBag size={64} className="mb-6 opacity-20" />
                                            <span className="text-2xl font-black mb-2 text-white/50">لا توجد كتب بانتظار التسليم</span>
                                            <p className="font-bold">سيتم ظهور الكتب هنا بمجرد إتمام عملية البيع.</p>
                                        </div>
                                    )
                                )
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default AdminBookReview;
