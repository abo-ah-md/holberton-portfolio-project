import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthRequiredModal = ({ isOpen, onClose, message = "يجب عليك تسجيل الدخول للمتابعة" }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ margin: 0 }}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-background">
                    <h3 className="text-lg font-bold text-brand-secondary">تسجيل الدخول مطلوب</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-brand-muted hover:text-brand-secondary hover:bg-brand-border/50 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-brand-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h4 className="text-xl font-bold text-brand-text mb-2">مرحباً بك</h4>
                    <p className="text-brand-muted mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate('/login'); }}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                        >
                            تسجيل الدخول
                        </button>
                        <button
                            onClick={() => { onClose(); navigate('/register'); }}
                            className="w-full bg-brand-surface hover:bg-brand-background text-brand-secondary font-bold py-3 px-6 rounded-xl border-2 border-brand-border transition-all"
                        >
                            إنشاء حساب جديد
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AuthRequiredModal;
