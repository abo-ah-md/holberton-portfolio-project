import RibbonLogoCombined from './RibbonLogoCombined';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t-[20px] border-[#c8876f] bg-[#3A4958] text-white font-sans" dir="rtl">
            <div className="flex flex-wrap justify-between items-start max-w-[1400px] mx-auto px-6 md:px-[60px] py-6 gap-8">

                {/* Brand Section - Right side (first in RTL) */}
                <div className="flex-[1.2] min-w-[200px] flex flex-col items-start">
                    <div className="mb-4">
                        <RibbonLogoCombined className="w-[200px] h-auto" />
                        <p className="text-sm text-[#b0bcc5] mt-4 leading-relaxed max-w-[250px] font-medium">
                            جميع الحقوق محفوظة لمطورين منصة بوك باس
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a href="#" className="w-8 h-8 flex items-center justify-center text-white hover:opacity-70 hover:-translate-y-0.5 transition-all" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center text-white hover:opacity-70 hover:-translate-y-0.5 transition-all" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="w-8 h-8 flex items-center justify-center text-white hover:opacity-70 hover:-translate-y-0.5 transition-all" aria-label="YouTube">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Platform Section */}
                <div className="flex-[1.3] min-w-[150px]">
                    <h3 className="text-base font-semibold mb-4 text-white">المنصة</h3>
                    <nav className="flex flex-col gap-2">
                        <Link to="/" className="text-[#b0bcc5] hover:text-white transition-colors text-sm no-underline">من نحن</Link>
                        <Link to="/terms" className="text-[#b0bcc5] hover:text-white transition-colors text-sm no-underline">الشروط والأحكام وسياسة الإستخدام</Link>
                    </nav>
                </div>

                {/* Support Section */}
                <div className="flex-[0.8] min-w-[150px]">
                    <h3 className="text-base font-semibold mb-4 text-white">الدعم</h3>
                    <p className="text-[#b0bcc5] mb-1 text-xs">رقم الهاتف</p>
                    <p className="text-white text-sm text-right font-medium" dir="ltr">+966590234209</p>
                </div>

                {/* Newsletter Section - Left side (last in RTL) */}
                <div className="flex-[1.5] min-w-[200px]">
                    <h3 className="text-base font-semibold mb-4 text-white">كن على اطلاع بمستجداتنا</h3>
                    <div className="flex items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden" dir="ltr">
                        <button type="submit" className="flex items-center justify-center bg-transparent border-none px-4 py-3 cursor-pointer text-[#b0bcc5] hover:text-white transition-colors" aria-label="Subscribe">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 bg-transparent border-none px-4 py-3 text-sm text-white outline-none text-right placeholder-[#b0bcc5]"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
