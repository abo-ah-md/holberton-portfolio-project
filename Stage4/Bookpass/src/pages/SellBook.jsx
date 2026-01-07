import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, CheckCircle, BookOpen, AlertCircle, Loader2, X } from 'lucide-react';
import { addBook, uploadImage } from '../services/bookService';
import { UNIVERSITIES } from '../constants/universities';
import { useAuth } from '../context/AuthContext';

const SellBook = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
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

        // Validate form
        if (!formData.title || !formData.author || !formData.price) {
            setError('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

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
                setLoading(false);
                return;
            }

            // Success - show success screen
            setStep(2);
        } catch (err) {
            setError('حدث خطأ أثناء إضافة الكتاب. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
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
        <div className="min-h-screen flex flex-col bg-[#f5f5f5] font-sans rtl">
            <Navbar />

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <main className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden">

                    {step === 1 ? (
                        <>
                            <div className="text-center mb-10">
                                <div className="inline-flex p-4 bg-brand-orange/10 rounded-full mb-4 text-brand-orange">
                                    <BookOpen size={48} />
                                </div>
                                <h1 className="text-3xl font-black text-brand-slate mb-3">اعرض كتابك للبيع</h1>
                                <p className="text-gray-500 max-w-md mx-auto">قم بتعبئة بيانات الكتاب بدقة لزيادة فرص بيعه بسرعة. نحن نساعدك في الوصول لآلاف الطلاب.</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
                                    <AlertCircle size={20} />
                                    <span className="font-bold">{error}</span>
                                </div>
                            )}

                            {!user && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3 text-yellow-700">
                                    <AlertCircle size={20} />
                                    <span className="font-bold">يجب <button onClick={() => navigate('/login')} className="underline">تسجيل الدخول</button> لإضافة كتاب للبيع</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">عنوان الكتاب *</label>
                                        <input
                                            required
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="مثال: مقدمة في الفيزياء"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">اسم المؤلف *</label>
                                        <input
                                            required
                                            type="text"
                                            name="author"
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="مثال: د. أحمد محمد"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">الجامعة / الكلية</label>
                                        <select
                                            name="university"
                                            value={formData.university}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition cursor-pointer"
                                            disabled={loading}
                                        >
                                            <option value="">اختر الجامعة</option>
                                            {Object.entries(UNIVERSITIES).map(([key, { nameAr }]) => (
                                                <option key={key} value={key}>{nameAr}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="font-bold text-gray-700">السعر المطلوب (ر.س) *</label>
                                        <input
                                            required
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="00"
                                            min="1"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>



                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700">وصف الكتاب (اختياري)</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="أضف وصفاً للكتاب..."
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition resize-none"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="font-bold text-gray-700">صورة الكتاب</label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={loading || uploading}
                                    />
                                    {imagePreview ? (
                                        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-brand-orange">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            {uploading && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-white" size={32} />
                                                </div>
                                            )}
                                            {!uploading && (
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50/50 hover:border-brand-orange/50 transition cursor-pointer group"
                                        >
                                            <Upload size={32} className="mb-2 group-hover:text-brand-orange transition-colors" />
                                            <span className="font-bold text-sm">اضغط هنا لرفع صورة الكتاب</span>
                                            <span className="text-xs mt-1">PNG, JPG حتى 5MB</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !user}
                                        className="w-full bg-[#C17554] hover:bg-[#a95234] text-white font-black text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                <span>جاري النشر...</span>
                                            </>
                                        ) : (
                                            <span>نشر الإعلان الآن</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-12 animate-in zoom-in duration-300">
                            <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-full mb-6">
                                <CheckCircle size={64} />
                            </div>
                            <h2 className="text-3xl font-black text-brand-slate mb-4">تم قبول طلبك!</h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                يرجى تسليم الكتاب إلى مكتبة <strong>"{UNIVERSITIES[formData.university]?.nameAr || 'الجامعة'}"</strong> لتتم مراجعته وعرضه للبيع.
                                <br />شكراً لاستخدامك بوك باس.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={handleAddAnother} className="text-brand-orange font-bold hover:underline">
                                    إضافة كتاب آخر
                                </button>
                                <button onClick={() => navigate('/marketplace')} className="bg-brand-slate text-white font-bold px-6 py-2 rounded-lg hover:bg-brand-slate/90 transition">
                                    عرض المتجر
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default SellBook;
