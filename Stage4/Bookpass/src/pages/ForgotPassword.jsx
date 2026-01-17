import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { requestPasswordReset } from '../services/authService';
import { usePageLoading } from '../components/PageTransition';
import { CheckCircle } from 'lucide-react';

import ErrorPopup from '../components/ErrorPopup';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        setLoadingMessage("جاري إرسال رابط الاستعادة...");
        setIsLoading(true);

        const { success, error: apiError } = await requestPasswordReset(email);

        setIsLoading(false);

        if (apiError) {
            setError(apiError);
        } else {
            setIsSuccess(true);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row-reverse font-sans">
            <ErrorPopup message={error} onClose={() => setError('')} />

            {/* Left Side - Image */}
            <div
                className="hidden md:block md:w-[45%] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${new URL('../assets/books-bg.png', import.meta.url).href})` }}
            >
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 md:p-20 relative overflow-hidden" dir="rtl">

                {/* Decorative Bottom Curve */}


                {/* Logo */}
                <div className="absolute top-8 right-8 z-10">
                    <Logo />
                </div>

                <div className="w-full max-w-[400px] text-center relative z-10">
                    {!isSuccess ? (
                        <>
                            <h1 className="text-3xl font-bold text-brand-secondary mb-4 leading-tight">نسيت كلمة المرور؟</h1>
                            <p className="text-brand-muted mb-8 text-center text-sm font-medium leading-relaxed">
                                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور الخاصة بك.
                            </p>

                            <form onSubmit={handleSubmit} className="text-right">
                                <div className="mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-brand-secondary">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="أدخل بريدك الإلكتروني"
                                        disabled={isLoading}
                                        className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-brand-surface focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full p-3.5 bg-brand-primary hover:bg-brand-accent text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-brand-primary/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                                </button>
                            </form>

                            <p className="mt-8 text-sm text-brand-muted font-medium">
                                تذكرت كلمة المرور؟ <Link to="/login" className="text-brand-primary font-bold hover:underline">تسجيل الدخول</Link>
                            </p>
                        </>
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

                            <div className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center justify-center text-center">
                                <div className="mb-8 p-6 bg-[#61BF8D] rounded-full border-4 border-white/30 shadow-2xl animate-bounce">
                                    <CheckCircle size={64} className="text-white drop-shadow-lg" />
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-lg">تم إرسال الرابط!</h2>

                                <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 text-center shadow-2xl transform transition-all hover:scale-[1.02]">
                                    <p className="text-xl font-bold text-white/90 leading-relaxed mb-6">
                                        تم إرسال رابط استعادة كلمة المرور بنجاح إلى
                                    </p>

                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/10 mb-6 inline-block w-full">
                                        <p className="font-mono text-xl text-brand-primary font-bold break-all">{email}</p>
                                    </div>

                                    <p className="text-white/70 text-sm font-medium">
                                        يرجى التحقق من صندوق الوارد (وأيضاً البريد المهمل) لاستكمال العملية.
                                    </p>
                                </div>

                                <Link
                                    to="/login"
                                    className="w-full max-w-md bg-white text-brand-secondary font-black py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                                >
                                    <span>العودة لتسجيل الدخول</span>
                                </Link>

                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="mt-6 text-white/60 hover:text-white font-bold transition-colors text-sm"
                                >
                                    لم يصلك الرابط؟ حاول مرة أخرى
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
