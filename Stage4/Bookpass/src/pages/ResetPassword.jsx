import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Logo from '../components/layout/Logo';
import { resetPassword } from '../services/authService';
import { usePageLoading } from '../components/ui/PageTransition';
import { CheckCircle } from 'lucide-react';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { isLoading, setIsLoading, setLoadingMessage } = usePageLoading();

    useEffect(() => {
        if (!token) {
            setError('رابط إعادة تعيين كلمة المرور غير صالح أو مفقود.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين');
            return;
        }

        if (password.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            return;
        }

        setLoadingMessage("جاري تعيين كلمة المرور الجديدة...");
        setIsLoading(true);

        const { success: apiSuccess, error: apiError } = await resetPassword(token, password);

        setIsLoading(false);

        if (apiError) {
            setError(apiError);
        } else {
            setSuccess(true);
            setMessage('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.');
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
                {/* Left Side - Image */}
                <div
                    className="hidden md:block md:w-[45%] bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${new URL('../assets/books-bg.png', import.meta.url).href})` }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 bg-white flex flex-col items-center justify-center p-6 md:p-20 relative overflow-hidden" dir="rtl">
                    <div className="absolute -bottom-1/2 -left-[20%] -right-[20%] h-[70%] bg-brand-secondary rounded-[50%_50%_0_0] z-0 pointer-events-none opacity-90"></div>

                    <div className="absolute top-8 right-8 z-10">
                        <Logo />
                    </div>

                    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center overflow-y-auto font-sans rtl text-white py-10">
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

                            <h2 className="text-4xl md:text-5xl font-black mb-8 drop-shadow-lg">تم بنجاح!</h2>

                            <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8 text-center shadow-2xl transform transition-all hover:scale-[1.02]">
                                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 justify-center">
                                    <h3 className="text-2xl font-black text-white">تم تغيير كلمة المرور</h3>
                                </div>

                                <p className="text-xl font-bold text-white/90 leading-relaxed mb-6">
                                    لقد قمت بتعيين كلمة مرور جديدة لحسابك بنجاح.
                                </p>

                                <p className="text-white/70 text-sm font-medium">
                                    يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="w-full max-w-md bg-white text-brand-secondary font-black py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-xl"
                            >
                                <span>تسجيل الدخول</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row font-sans">
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
                <div className="absolute -bottom-1/2 -left-[20%] -right-[20%] h-[70%] bg-brand-secondary rounded-[50%_50%_0_0] z-0 pointer-events-none opacity-90"></div>

                {/* Logo */}
                <div className="absolute top-8 right-8 z-10">
                    <Logo />
                </div>

                <div className="w-full max-w-[400px] text-center relative z-10">
                    <h1 className="text-3xl font-bold text-brand-secondary mb-6 leading-tight">تعيين كلمة المرور الجديدة</h1>
                    <p className="text-brand-muted mb-8 text-center text-sm font-medium">
                        أدخل كلمة المرور الجديدة الخاصة بك
                    </p>

                    {error && (
                        <div className="bg-red-50 text-brand-error border border-red-100 p-3 rounded-lg mb-6 text-sm text-right">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="text-right">
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-bold text-brand-secondary">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور الجديدة"
                                disabled={isLoading || !token}
                                required
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-brand-surface focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <div className="mb-8">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-bold text-brand-secondary">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="أعد إدخال كلمة المرور"
                                disabled={isLoading || !token}
                                required
                                className="w-full p-3.5 border border-brand-border rounded-lg text-sm bg-brand-surface focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all text-right placeholder-brand-muted text-brand-text"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3.5 bg-brand-primary hover:bg-brand-accent text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-brand-primary/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading || !token}
                        >
                            {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-brand-muted font-medium">
                        <Link to="/login" className="text-brand-primary font-bold hover:underline">العودة لتسجيل الدخول</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
