import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { resetPassword } from '../services/authService';
import { usePageLoading } from '../components/PageTransition';

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
                    <div className="absolute -bottom-1/2 -left-[20%] -right-[20%] h-[70%] bg-[#1a2634] rounded-[50%_50%_0_0] z-0 pointer-events-none opacity-90"></div>

                    <div className="absolute top-8 right-8 z-10">
                        <Logo />
                    </div>

                    <div className="w-full max-w-[400px] text-center relative z-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">تم بنجاح!</h1>
                        <div className="bg-green-50 text-green-700 border border-green-200 p-4 rounded-lg mb-8 text-center text-sm font-medium shadow-sm">
                            {message}
                        </div>
                        <Link to="/login" className="w-full block p-3.5 bg-[#2D3D4D] hover:bg-[#3a4f63] text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-[#2D3D4D]/20 text-center no-underline hover:-translate-y-0.5">
                            تسجيل الدخول
                        </Link>
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
                <div className="absolute -bottom-1/2 -left-[20%] -right-[20%] h-[70%] bg-[#1a2634] rounded-[50%_50%_0_0] z-0 pointer-events-none opacity-90"></div>

                {/* Logo */}
                <div className="absolute top-8 right-8 z-10">
                    <Logo />
                </div>

                <div className="w-full max-w-[400px] text-center relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">تعيين كلمة المرور الجديدة</h1>
                    <p className="text-gray-500 mb-8 text-center text-sm font-medium">
                        أدخل كلمة المرور الجديدة الخاصة بك
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-6 text-sm text-right">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="text-right">
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور الجديدة"
                                disabled={isLoading || !token}
                                required
                                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
                            />
                        </div>

                        <div className="mb-8">
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-bold text-gray-700">تأكيد كلمة المرور</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="أعد إدخال كلمة المرور"
                                disabled={isLoading || !token}
                                required
                                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3.5 bg-[#2D3D4D] hover:bg-[#3a4f63] text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-[#2D3D4D]/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading || !token}
                        >
                            {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-500 font-medium">
                        <Link to="/login" className="text-[#2D3D4D] font-bold hover:underline">العودة لتسجيل الدخول</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
