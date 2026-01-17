import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, BookOpen, AlertCircle, X, Loader2, Plus, Camera, FileText, Store, Info } from 'lucide-react';
import { addBook, uploadImage } from '../services/bookService';
import { UNIVERSITIES } from '../constants/universities';
import { useAuth } from '../context/AuthContext';
import { usePageLoading } from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';
import IbanRequiredModal from '../components/IbanRequiredModal';
import usePageTitle from '../hooks/usePageTitle';

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

const SellBook = () => {
    usePageTitle('بيع كتابك');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [showIbanModal, setShowIbanModal] = useState(false);
    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        university: '',
        price: '',
        description: '',
        isbn: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };



    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('يرجى اختيار ملف صورة');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload image
        setUploading(true);
        setLoadingMessage("جاري رفع صورة الكتاب...");
        setIsLoading(true);
        try {
            const { url, error: uploadError } = await uploadImage(file);
            if (uploadError) {
                setError(uploadError);
            } else {
                setImageUrl(url);
            }
        } catch (err) {
            setError('فشل في رفع الصورة');
        } finally {
            setUploading(false);
            setIsLoading(false);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setImageUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if user is logged in
        if (!user) {
            setError('يجب تسجيل الدخول لإضافة كتاب');
            return;
        }

        // Validate required fields
        if (!formData.title) {
            setError('يرجى إدخال عنوان الكتاب');
            return;
        }
        if (!formData.author) {
            setError('يرجى إدخال اسم المؤلف');
            return;
        }
        if (!formData.price) {
            setError('يرجى إدخال السعر');
            return;
        }
        if (!formData.university) {
            setError('يرجى اختيار الجامعة');
            return;
        }
        if (!imageUrl) {
            setError('يرجى رفع صورة الكتاب');
            return;
        }

        // Check if user has IBAN
        if (!user.iban) {
            setShowIbanModal(true);
            return;
        }

        // setLoadingMessage("جاري نشر إعلانك...");
        // setIsLoading(true);
        try {
            const bookData = {
                title: formData.title,
                author: formData.author,
                university: formData.university || 'غير محدد',
                price: parseFloat(formData.price),
                description: formData.description,
                isbn: formData.isbn,
                bookImages: imageUrl || null
            };

            // Start upload animation
            setStep('uploading');

            // Artificial delay to let the animation play (min 2.5s)
            await new Promise(resolve => setTimeout(resolve, 2500));

            const { data, error: apiError } = await addBook(bookData);

            if (apiError) {
                setError(apiError);
                setStep(1); // Go back to form on error
                return;
            }

            // Success - show success screen
            setStep(2);
        } catch (err) {
            setError('حدث خطأ أثناء إضافة الكتاب. يرجى المحاولة مرة أخرى.');
        } finally {
            // setIsLoading(false);
        }
    };

    const handleAddAnother = () => {
        setStep(1);
        setFormData({
            title: '',
            author: '',
            university: '',
            price: '',
            description: '',
            isbn: ''
        });
        setError('');
        setImagePreview(null);
        setImageUrl(null);
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
                                        <BookOpen size={48} />
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
                                            اعرض كتابك للبيع
                                        </h1>
                                        <p className="text-white/80 text-lg font-medium">
                                            ساعد زملاءك وساهم في تدوير المعرفة
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <div className="flex -space-x-4 space-x-reverse opacity-50">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-white/20 backdrop-blur-sm shadow-inner" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-20">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="sell-form"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-brand-border relative"
                            >
                                {/* Form content starts here */}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-8 p-4 bg-red-50 border-r-4 border-red-500 rounded-xl flex items-center gap-3 text-red-700 shadow-sm"
                                    >
                                        <AlertCircle size={20} className="shrink-0" />
                                        <span className="font-bold">{error}</span>
                                    </motion.div>
                                )}

                                {!user && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="mb-8 p-4 bg-amber-50 border-r-4 border-amber-500 rounded-xl flex items-center gap-3 text-amber-700 shadow-sm"
                                    >
                                        <AlertCircle size={20} className="shrink-0" />
                                        <p className="font-bold">
                                            يجب <button onClick={() => navigate('/login')} className="text-brand-primary underline decoration-2 underline-offset-4 hover:text-brand-accent transition-colors">تسجيل الدخول</button> أولاً لتتمكن من إضافة كتاب للبيع.
                                        </p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-brand-muted uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <FileText size={16} className="text-brand-primary" />
                                                عنوان الكتاب *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="مثال: مقدمة في الفيزياء"
                                                className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary border-transition text-brand-secondary font-bold placeholder:text-brand-muted/70 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-brand-muted uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <Plus size={16} className="text-brand-primary" />
                                                اسم المؤلف *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                placeholder="مثال: د. أحمد محمد"
                                                className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary border-transition text-brand-secondary font-bold placeholder:text-brand-muted/70 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-brand-muted uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <BookOpen size={16} className="text-brand-primary" />
                                                مكان التسليم *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    name="university"
                                                    value={formData.university}
                                                    onChange={handleChange}
                                                    className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary border-transition text-brand-secondary font-bold appearance-none cursor-pointer transition-all"
                                                    disabled={isLoading}
                                                >
                                                    <option value="">اختر الجامعة</option>
                                                    {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                                        <option key={key} value={key}>{nameAr}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-muted/50">
                                                    <X size={20} className="rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-brand-muted uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <Plus size={16} className="text-brand-primary" />
                                                السعر المطلوب (ر.س) *
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="00"
                                                min="1"
                                                className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary border-transition text-brand-secondary font-bold placeholder:text-brand-muted/70 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-black text-brand-muted uppercase tracking-wider block flex items-center gap-2">
                                                <FileText size={16} className="text-brand-primary" />
                                                رقم ISBN (اختياري)
                                            </label>
                                            <div className="relative group cursor-help">
                                                <Info size={16} className="text-brand-muted/60 hover:text-brand-primary transition-colors" />

                                                {/* Tooltip */}
                                                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-3 w-64 bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center leading-relaxed">
                                                    <div className="absolute -bottom-1 right-1/2 translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45"></div>
                                                    <p className="font-bold mb-1 text-brand-primary">أين أجده؟</p>
                                                    هو المعرف الفريد للكتاب (13 رقم)، ستجده عادةً على الغلاف الخلفي فوق الباركود.
                                                </div>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            placeholder="مثال: 978-3-16-148410-0"
                                            className="w-full bg-brand-surface border-2 border-brand-border rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary border-transition text-brand-secondary font-bold placeholder:text-brand-muted/70 transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>




                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-brand-muted uppercase tracking-wider block mr-1 flex items-center gap-2">
                                            <Camera size={16} className="text-brand-primary" />
                                            صورة الكتاب *
                                        </label>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="hidden"
                                            disabled={isLoading || uploading}
                                        />
                                        {imagePreview ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative w-full h-80 rounded-3xl overflow-hidden shadow-2xl group"
                                            >
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <Loader2 className="animate-spin text-white" size={48} />
                                                            <span className="text-white font-bold">جاري الرفع...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {!uploading && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-4 left-4 bg-red-500/80 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-red-600 transition shadow-xl"
                                                    >
                                                        <X size={20} />
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                whileHover={{ scale: 1.01, borderColor: '#C17554' }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-3 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-brand-muted hover:bg-brand-primary/5 hover:shadow-inner transition-all cursor-pointer group bg-gray-50"
                                            >
                                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                    <Upload size={40} className="text-brand-primary" />
                                                </div>
                                                <span className="font-black text-brand-secondary text-lg mb-2">اضغط هنا لرفع صورة الكتاب</span>
                                                <span className="text-sm font-medium text-brand-muted">PNG, JPG حتى 5MB</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading || !user}
                                            className="w-full bg-brand-primary hover:bg-brand-accent text-white font-black text-xl py-5 rounded-2xl shadow-xl hover:shadow-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={24} className="animate-spin" />
                                                    <span>جاري الحفظ...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus size={24} />
                                                    <span>نشر إعلان الكتاب</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : step === 'uploading' ? (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans rtl text-white">
                                {/* Simple dark overlay */}
                                <div className="absolute inset-0 bg-brand-secondary/95 backdrop-blur-xl"></div>

                                <div className="relative z-10 flex flex-col items-center">
                                    {/* Animation Container */}
                                    <div className="relative w-64 h-64 mb-8">
                                        {/* Store Icon (Destination) */}
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md"
                                        >
                                            <Store size={48} className="text-white" />
                                        </motion.div>

                                        {/* Book Image (Moving) */}
                                        <motion.div
                                            initial={{ y: 150, scale: 1.5, opacity: 0 }}
                                            animate={{ y: 20, scale: 0.8, opacity: 1 }}
                                            transition={{
                                                duration: 1.5,
                                                ease: "easeInOut",
                                                times: [0, 1],
                                                delay: 0.2
                                            }}
                                            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20"
                                        >
                                            <div className="relative w-24 h-32 bg-white rounded-md shadow-2xl overflow-hidden skew-y-6 border border-white/20 transform rotate-[-5deg]">
                                                {imagePreview ? (
                                                    <img src={imagePreview} alt="Book Cover" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-brand-primary flex items-center justify-center">
                                                        <BookOpen size={40} className="text-white" />
                                                    </div>
                                                )}
                                                {/* Glossy overlay effect */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/20 pointer-events-none"></div>
                                            </div>
                                        </motion.div>

                                        {/* Particle/Wind Effects */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            {[...Array(3)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ y: 100, opacity: 0 }}
                                                    animate={{ y: -50, opacity: [0, 0.5, 0] }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        delay: i * 0.3,
                                                        ease: "linear"
                                                    }}
                                                    className="w-1 h-8 bg-white/30 rounded-full absolute"
                                                    style={{ left: `${40 + i * 10}%` }}
                                                />
                                            ))}
                                        </motion.div>
                                    </div>

                                    <h2 className="text-3xl font-black mb-2 animate-pulse">جاري إضافة الكتاب...</h2>
                                    <p className="text-white/60 font-medium">يرجى الانتظار، نقوم بتجهيز الإعلان في المتجر</p>
                                </div>
                            </div>
                        ) : (
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
                                    className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center justify-center text-center"
                                >
                                    <div className="mb-8 p-6 bg-[#61BF8D] rounded-full border-4 border-white/30 shadow-2xl animate-bounce">
                                        <CheckCircle size={64} className="text-white drop-shadow-lg" />
                                    </div>

                                    <h2 className="text-4xl md:text-6xl font-black mb-8 drop-shadow-lg">تم استلام طلبك!</h2>

                                    <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 text-right shadow-2xl transform transition-all hover:scale-[1.02]">
                                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                                            <AlertCircle className="text-brand-primary shrink-0" size={32} />
                                            <h3 className="text-2xl font-black text-white">تذكير مهم جداً</h3>
                                        </div>

                                        <p className="text-xl font-bold text-white/90 leading-relaxed mb-6">
                                            يرجى إحضار الكتاب إلى مكتبة <span className="text-brand-primary bg-white/10 px-2 py-1 rounded-lg underline decoration-2 underline-offset-4">{UNIVERSITIES[formData.university]?.nameAr || 'الجامعة'}</span>
                                        </p>

                                        <div className="bg-black/20 rounded-2xl p-6 border border-white/10">
                                            <p className="font-bold text-brand-primary text-sm mb-2 opacity-80 uppercase tracking-widest">📍 موقع التسليم</p>
                                            <p className="text-white font-black text-2xl">
                                                مكتبة {UNIVERSITIES[formData.university]?.nameAr || 'الجامعة'}
                                            </p>
                                        </div>

                                        <p className="mt-6 text-white/70 text-sm font-medium italic">
                                            "سيتم عرض الكتاب في المتجر بمجرد التحقق منه. شكراً لثقتك بنا."
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleAddAnother}
                                            className="flex-1 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black py-4 rounded-xl hover:bg-white/30 transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <Plus size={20} />
                                            <span>إضافة كتاب آخر</span>
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate('/marketplace')}
                                            className="flex-1 bg-white text-brand-secondary font-black py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                                        >
                                            <Store size={20} />
                                            <span>الذهاب للمتجر</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.main>

            <Footer />
            <IbanRequiredModal
                isOpen={showIbanModal}
                onClose={() => setShowIbanModal(false)}
                userName={user?.firstName || 'عزيزي المستخدم'}
            />
        </div>
    );
};

export default SellBook;
