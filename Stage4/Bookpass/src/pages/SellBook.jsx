import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, BookOpen, AlertCircle, X, Loader2, Plus, Camera, FileText } from 'lucide-react';
import { addBook, uploadImage } from '../services/bookService';
import { UNIVERSITIES } from '../constants/universities';
import { useAuth } from '../context/AuthContext';
import { usePageLoading } from '../components/PageTransition';
import LoadingSpinner from '../components/LoadingSpinner';

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
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
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

        setLoadingMessage("جاري نشر إعلانك...");
        setIsLoading(true);
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

            const { data, error: apiError } = await addBook(bookData);

            if (apiError) {
                setError(apiError);
                return;
            }

            // Success - show success screen
            setStep(2);
        } catch (err) {
            setError('حدث خطأ أثناء إضافة الكتاب. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoading(false);
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
                variants={container}
                initial="hidden"
                animate="show"
                className="flex-1 w-full relative z-10"
            >
                {/* Dark Navy Hero Section */}
                <motion.section
                    variants={fadeInUp}
                    className="bg-[#2c3e50] py-12 px-4 md:px-8 relative"
                >
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Orange Pill Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="bg-brand-orange rounded-3xl p-8 shadow-2xl relative overflow-hidden"
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
                                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 relative"
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
                                            يجب <button onClick={() => navigate('/login')} className="text-brand-orange underline decoration-2 underline-offset-4 hover:text-orange-700 transition-colors">تسجيل الدخول</button> أولاً لتتمكن من إضافة كتاب للبيع.
                                        </p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <FileText size={16} className="text-brand-orange" />
                                                عنوان الكتاب *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="مثال: مقدمة في الفيزياء"
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange border-transition text-gray-700 font-bold placeholder:text-gray-300 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <Plus size={16} className="text-brand-orange" />
                                                اسم المؤلف *
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                name="author"
                                                value={formData.author}
                                                onChange={handleChange}
                                                placeholder="مثال: د. أحمد محمد"
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange border-transition text-gray-700 font-bold placeholder:text-gray-300 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <BookOpen size={16} className="text-brand-orange" />
                                                الجامعة / الكلية *
                                            </label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    name="university"
                                                    value={formData.university}
                                                    onChange={handleChange}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange border-transition text-gray-700 font-bold appearance-none cursor-pointer transition-all"
                                                    disabled={isLoading}
                                                >
                                                    <option value="">اختر الجامعة</option>
                                                    {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                                        <option key={key} value={key}>{nameAr}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <X size={20} className="rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                                <Plus size={16} className="text-brand-orange" />
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
                                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange border-transition text-gray-700 font-bold placeholder:text-gray-300 transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                            <FileText size={16} className="text-brand-orange" />
                                            رقم ISBN (اختياري)
                                        </label>
                                        <input
                                            type="text"
                                            name="isbn"
                                            value={formData.isbn}
                                            onChange={handleChange}
                                            placeholder="مثال: 978-3-16-148410-0"
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange border-transition text-gray-700 font-bold placeholder:text-gray-300 transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>




                                    <div className="space-y-4">
                                        <label className="text-sm font-black text-gray-500 uppercase tracking-wider block mr-1 flex items-center gap-2">
                                            <Camera size={16} className="text-brand-orange" />
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
                                                className="border-3 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center text-gray-400 hover:bg-orange-50/30 hover:shadow-inner transition-all cursor-pointer group bg-gray-50/50"
                                            >
                                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                                    <Upload size={40} className="text-brand-orange" />
                                                </div>
                                                <span className="font-black text-gray-700 text-lg mb-2">اضغط هنا لرفع صورة الكتاب</span>
                                                <span className="text-sm font-medium text-gray-400">PNG, JPG حتى 5MB</span>
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isLoading || !user}
                                            className="w-full bg-gradient-to-r from-brand-orange to-orange-600 text-white font-black text-xl py-5 rounded-2xl shadow-xl hover:shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                        ) : (
                            <motion.div
                                key="success-step"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl shadow-2xl p-12 text-center"
                            >
                                <div className="inline-flex p-6 bg-emerald-50 text-emerald-600 rounded-3xl shadow-inner mb-8">
                                    <CheckCircle size={80} />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-6">تم قبول طلبك بنجاح!</h2>

                                <div className="max-w-md mx-auto mb-10 space-y-6">
                                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -mr-16 -mt-16" />
                                        <h3 className="text-xl font-black text-amber-900 mb-4 flex items-center gap-2 justify-center">
                                            <AlertCircle size={24} />
                                            <span>تذكير مهم جداً 📚</span>
                                        </h3>
                                        <p className="text-amber-800 font-bold leading-relaxed mb-6 text-right">
                                            يرجى إحضار الكتاب إلى مكتبة <span className="text-brand-orange font-black underline">{UNIVERSITIES[formData.university]?.nameAr || 'الجامعة'}</span> كما هو موضح أدناه:
                                        </p>
                                        <div className="bg-white rounded-2xl p-5 shadow-sm text-right border border-amber-100">
                                            <p className="font-black text-amber-900 text-sm mb-2">📍 موقع التسليم:</p>
                                            <p className="text-amber-700 font-bold text-lg">
                                                مكتبة {UNIVERSITIES[formData.university]?.nameAr || 'الجامعة'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-500 font-medium leading-relaxed italic">
                                        "بعد المراجعة، سيتم عرض الكتاب في المتجر ليراه آلاف الطلاب! شكراً لاختيارك منصتنا."
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleAddAnother}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-black px-10 py-4 rounded-2xl transition-colors"
                                    >
                                        إضافة كتاب آخر
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -4 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/marketplace')}
                                        className="bg-[#2c3e50] hover:bg-slate-800 text-white font-black px-10 py-4 rounded-2xl shadow-xl transition-all"
                                    >
                                        عرض المتجر
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
};

export default SellBook;
