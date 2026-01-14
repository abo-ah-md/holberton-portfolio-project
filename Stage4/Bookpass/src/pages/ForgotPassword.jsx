import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { requestPasswordReset } from '../services/authService';
import { usePageLoading } from '../components/PageTransition';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
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
            setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">نسيت كلمة المرور؟</h1>
                    <p className="text-gray-500 mb-8 text-center text-sm font-medium leading-relaxed">
                        أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة كلمة المرور الخاصة بك.
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg mb-6 text-sm text-right">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-50 text-green-700 border border-green-200 p-3 rounded-lg mb-6 text-sm text-right">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="text-right">
                        <div className="mb-6">
                            <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="أدخل بريدك الإلكتروني"
                                disabled={isLoading}
                                className="w-full p-3.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#2D3D4D] focus:bg-white focus:ring-4 focus:ring-[#2D3D4D]/10 transition-all text-right placeholder-gray-400"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full p-3.5 bg-[#2D3D4D] hover:bg-[#3a4f63] text-white rounded-lg font-bold text-base transition-all shadow-lg shadow-[#2D3D4D]/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-gray-500 font-medium">
                        تذكرت كلمة المرور؟ <Link to="/login" className="text-[#2D3D4D] font-bold hover:underline">تسجيل الدخول</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
