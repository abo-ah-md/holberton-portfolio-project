import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';

const RestrictedAccessPage = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans rtl text-white">
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
                <div className="mb-8 p-6 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
                    <ShieldAlert size={80} className="text-white drop-shadow-lg" />
                </div>

                <div className="w-full max-w-2xl border-t-2 border-white/30 pt-8 flex flex-col items-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-6 drop-shadow-md leading-relaxed">
                        لا تستطيع الدخول على هذه الصفحة
                        <br />
                        <span className="text-2xl md:text-3xl font-bold opacity-90 mt-2 block">
                            يرجى الدخول من حساب مستخدم
                        </span>
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 mt-4 w-full justify-center">
                        <button
                            onClick={() => navigate('/admin/review')}
                            className="flex items-center justify-center gap-3 bg-white text-[#C17554] px-8 py-4 rounded-xl font-black text-lg hover:bg-opacity-90 transition-all shadow-xl hover:scale-105 min-w-[200px]"
                        >
                            <span>لوحة المراجعة</span>
                        </button>

                        <button
                            onClick={() => navigate('/logout')}
                            className="flex items-center justify-center gap-3 bg-[#2c3e50] text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-[#3a4f63] transition-all shadow-xl hover:scale-105 min-w-[200px] border border-white/20"
                        >
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestrictedAccessPage;
