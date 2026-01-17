import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { uploadFile } from '../services/fileService';
import { updateUserProfile } from '../services/authService';
import { usePageLoading } from '../components/PageTransition';
import { Camera, ChevronRight, ChevronLeft } from 'lucide-react';
import ErrorPopup from '../components/ErrorPopup';

const RegisterForm = ({ onSuccess, showBackButton = false, onBack }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        iban: '',
        phoneNumber: '',
        profilePicture: '',
        agreeTerms: false,
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();
    const { signUp, updateUserState } = useAuth();

    const validatePassword = (password) => {
        if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        if (!/[A-Z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف كبير';
        if (!/[a-z]/.test(password)) return 'كلمة المرور يجب أن تحتوي على حرف صغير';
        if (!/[0-9]/.test(password)) return 'كلمة المرور يجب أن تحتوي على رقم';
        return null;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setSelectedFile(file);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.fullName || !formData.email || !formData.password) {
            setError('جميع الحقول المطلوبة يجب تعبئتها');
            return;
        }

        if (!formData.agreeTerms) {
            setError('يجب الموافقة على سياسة الخصوصية والشروط');
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        setLoadingMessage("جاري إنشاء حسابك...");
        setIsLoading(true);

        try {
            const { data: userData, error: signUpError } = await signUp(
                formData.email,
                formData.password,
                formData.fullName,
                formData.phoneNumber,
                ''
            );

            if (signUpError) {
                setIsLoading(false);
                setError(signUpError || 'فشل التسجيل');
                return;
            }

            if (userData && (selectedFile || formData.iban)) {
                setLoadingMessage("جاري إكمال ملفك الشخصي...");
                let profilePicture = '';
                if (selectedFile) {
                    const { url: imageUrl, error: uploadError } = await uploadFile(selectedFile);
                    if (!uploadError && imageUrl) {
                        profilePicture = imageUrl;
                    }
                }

                const { data: updatedData, error: updateError } = await updateUserProfile({
                    iban: formData.iban,
                    profilePicture: profilePicture || undefined
                });

                if (!updateError && updatedData) {
                    updateUserState(updatedData);
                }
            }

            setIsLoading(false);

            if (onSuccess) {
                onSuccess();
            } else {
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
        } catch (err) {
            setIsLoading(false);
            setError('حدث خطأ غير متوقع');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative" dir="rtl">
            <div className="absolute top-8 right-8 z-20">
                <Logo />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 w-full overflow-y-auto flex flex-col items-center p-4 md:p-8 pt-20">
                <div className="w-full max-w-[400px] text-center relative z-10 mb-8">
                    <h1 className="text-3xl font-bold text-brand-secondary mb-8 leading-tight">انضم إلينا الآن وابدأ تسوقك</h1>

                    <ErrorPopup message={error} onClose={() => setError('')} />

                    <form onSubmit={handleSubmit} className="text-right">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center mb-8">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className="w-24 h-24 rounded-full border-2 border-dashed border-brand-border flex items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-orange-50 transition-colors overflow-hidden relative group bg-white"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-brand-muted group-hover:text-brand-primary">
                                        <Camera size={24} />
                                        <span className="text-xs mt-1 text-center font-medium">صورة شخصية <br />(إختياري)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="fullName" className="block mb-2 text-sm font-bold text-brand-secondary">
                                اسم المستخدم <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="أدخل اسمك"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-bold text-brand-secondary">
                                البريد الإلكتروني <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="أدخل بريدك الإلكتروني"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-bold text-brand-secondary">
                                كلمة المرور <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-bold text-brand-secondary">رقم الجوال (إختياري)</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="05xxxxxxxx"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="iban" className="block mb-2 text-sm font-bold text-brand-secondary">رقم حساب البنكي للبائع IBAN (إختياري)</label>
                            <input
                                type="text"
                                id="iban"
                                name="iban"
                                value={formData.iban}
                                onChange={handleChange}
                                placeholder="SA00 0000 0000 0000 0000 0000"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="flex items-center gap-2 text-sm text-brand-text cursor-pointer hover:text-gray-800 transition-colors">
                                <input
                                    type="checkbox"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 accent-brand-primary cursor-pointer"
                                />
                                <span>
                                    أقبل <Link to="/terms" className="text-brand-primary hover:underline font-bold">سياسة الخصوصية والشروط</Link> <span className="text-red-500">*</span>
                                </span>
                            </label>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center w-full">
                            <button
                                type="submit"
                                className="w-full md:w-auto flex-1 bg-brand-primary hover:bg-brand-accent text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-primary/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={isLoading}
                            >
                                <span>{isLoading ? 'جاري التسجيل...' : 'التسجيل'}</span>
                                <ChevronRight size={20} />
                            </button>
                            {showBackButton && onBack && (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="w-full md:w-auto text-brand-muted hover:text-brand-primary font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-2 border-transparent hover:bg-gray-50"
                                >
                                    <ChevronLeft size={20} />
                                    <span>السابق</span>
                                </button>
                            )}
                        </div>
                    </form>

                    <p className="mt-8 text-sm text-brand-muted font-medium">
                        لديك حساب مسجل ؟ <Link to="/login" className="text-brand-primary font-bold hover:underline">سجل الدخول</Link>
                    </p>
                </div>
            </div>
        </div >
    );
};

export default RegisterForm;
