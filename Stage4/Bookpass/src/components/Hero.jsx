import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RibbonLogo from './ribbon-logo';
import { useAuth } from '../context/AuthContext';
import AuthRequiredModal from './AuthRequiredModal';

const Hero = ({ title, subtitle, description, primaryButtonText, secondaryButtonText, backgroundImage }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSellClick = () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            navigate('/sell');
        }
    };

    return (
        <section className="relative flex items-center h-[calc(100vh-80px)] min-h-[600px] w-full bg-slate-900 overflow-hidden font-sans">
            <style>{`
                .hero-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                @media (min-width: 768px) {
                    .hero-buttons {
                        flex-direction: row;
                        gap: 2.5rem;
                    }
                }
            `}</style>

            {/* Ribbon Logo Group - Left Side */}

            <RibbonLogo />


            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${new URL('../assets/library-bg.jpg', import.meta.url).href})`,
                    backgroundPosition: 'center'
                }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 z-10" />

            {/* Content Wrapper */}
            <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col items-center text-center text-white w-full">

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-snug tracking-wide mb-6">
                    {title || 'كتب جامعية مستعملة'} <br className="hidden md:block" />
                    <span className="text-[#F97316]">{subtitle || 'بأسعار تناسب الطلاب'}</span>
                </h1>

                {/* Description */}
                <p className="max-w-2xl text-base md:text-xl text-gray-200 leading-relaxed font-light mb-10">
                    {description || 'وفر حتى 70% من تكلفة كتبك الجامعية من طلاب جامعتك... بيع واشتري بكل سهولة وفي دقائق'}
                </p>

                {/* Call To Action Buttons - Centered & Flexible */}
                <div className="hero-buttons items-center justify-center w-full max-w-4xl mt-24">
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="w-full sm:w-auto min-w-[240px] bg-[#3A4958] hover:bg-[#2c3844] text-white font-black py-6 px-12 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl text-2xl tracking-wide border-2 border-[#3A4958]"
                    >
                        {primaryButtonText || 'ابحث عن كتابك الآن'}
                    </button>

                    <button
                        onClick={handleSellClick}
                        className="w-full sm:w-auto min-w-[240px] bg-[#C17554] hover:bg-[#a66346] text-white font-black py-6 px-12 rounded-2xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl text-2xl tracking-wide border-2 border-[#C17554]"
                    >
                        {secondaryButtonText || 'اعرض كتابك للبيع'}
                    </button>
                </div>
            </div>

            <AuthRequiredModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="لعرض كتابك للبيع، يرجى تسجيل الدخول أو إنشاء حساب."
            />
        </section>
    );
};

export default Hero;
