import React from 'react';
import { Zap } from 'lucide-react';
import { LogoMain } from './BookPassUI';

const Footer = () => {
    return (
        <footer className="bg-brand-slate py-24 text-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
                {/* Brand Column */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <LogoMain />
                        <span className="font-poppins font-black text-2xl">BookPass</span>
                    </div>
                    <p className="opacity-50 text-sm leading-relaxed">
                        أكبر تجمع للطلاب الجامعيين لتبادل الكتب الدراسية بذكاء وأمان.
                    </p>
                </div>

                {/* About Column */}
                <div>
                    <FooterTitle>عن المنصة</FooterTitle>
                    <FooterLink>من نحن</FooterLink>
                    <FooterLink>كيف نضمن جودتك؟</FooterLink>
                    <FooterLink>الأسئلة الشائعة</FooterLink>
                </div>

                {/* Legal Column */}
                <div>
                    <FooterTitle>قانوني</FooterTitle>
                    <FooterLink>سياسة الخصوصية</FooterLink>
                    <FooterLink>شروط الاستخدام</FooterLink>
                    <FooterLink>حقوق الطالب</FooterLink>
                </div>

                {/* Newsletter Column */}
                <div>
                    <FooterTitle>ابقَ على اطلاع</FooterTitle>
                    <div className="flex gap-2 mt-4">
                        <input
                            type="text"
                            className="bg-white/5 border border-white/10 p-3 rounded-lg flex-1 text-sm outline-none"
                            placeholder="ايميلك هنا"
                        />
                        <button className="bg-brand-orange p-3 rounded-lg hover:bg-opacity-90 transition">
                            <Zap size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Helper Components
const FooterTitle = ({ children }) => (
    <h4 className="font-black text-lg mb-8 text-brand-orange">{children}</h4>
);

const FooterLink = ({ children }) => (
    <p className="opacity-50 text-sm mb-4 cursor-pointer hover:opacity-100 transition-opacity">
        {children}
    </p>
);

export default Footer;
