import React from 'react';
import { createPortal } from 'react-dom';
import { X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IbanRequiredModal = ({ isOpen, onClose, userName }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" style={{ margin: 0 }}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100"
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-background">
                    <h3 className="text-lg font-bold text-brand-secondary">مطلوب معلومات بنكية</h3>
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
                        <CreditCard size={32} className="text-brand-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-brand-text mb-2">عفواً {userName}</h4>
                    <p className="text-brand-muted mb-8 leading-relaxed">
                        تحتاج إلى إكمال معلومات الايبان (IBAN) الخاصة بك لتتمكن من إضافة كتاب للبيع.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => { onClose(); navigate('/profile'); }}
                            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-brand-primary/20"
                        >
                            الذهاب للملف الشخصي
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-brand-surface hover:bg-brand-background text-brand-secondary font-bold py-3 px-6 rounded-xl border-2 border-brand-border transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default IbanRequiredModal;
