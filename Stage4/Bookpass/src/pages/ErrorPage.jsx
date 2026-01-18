import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const ErrorPage = ({ type = '404' }) => {
    const navigate = useNavigate();

    const config = {
        '404': {
            code: '404',
            message: 'لم تكتب هذه الصفحة',
        },
        '403': {
            code: '403',
            message: 'ليس لديك الصلاحية للدخول على هذه الصفحة',
        }
    };

    const { code, message } = config[type] || config['404'];

    return (
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center overflow-hidden font-sans rtl text-white">
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

            <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
                <h1 className="text-[120px] font-black leading-none opacity-90 drop-shadow-lg mb-8">
                    {code}
                </h1>

                <div className="w-full max-w-lg border-t-2 border-white/30 pt-8 flex flex-col items-center">
                    <p className="text-2xl md:text-3xl font-bold mb-8 opacity-90 drop-shadow-md">
                        {message}
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 bg-white text-[#C17554] px-8 py-4 rounded-xl font-black text-lg hover:bg-opacity-90 transition-all shadow-xl hover:scale-105"
                    >
                        <Home size={24} />
                        <span>الرجوع للقائمة الرئيسية</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
