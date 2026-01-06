import React from 'react';
import WhiteLogo from './WhiteLogo';

const Hero = ({ title, subtitle, description, primaryButtonText, secondaryButtonText, backgroundImage }) => {
    return (
        <section className="relative flex items-center h-[calc(100vh-64px)] w-full bg-slate-900 overflow-hidden font-sans">
            {/* Ribbon Logo Group - Left Side */}
            <div className="absolute left-0 top-8 z-40 drop-shadow-2xl">
                <div className="relative flex items-center h-20">
                    {/* Polygon ribbon background - Right to Left with arrow notch */}
                    <svg className="absolute left-0  h-full w-auto" viewBox="0 0 537 188" fill="none">
                        <path d="M536.954 9.49459L0.14782 7.62939e-06L-3 177.972L533.807 187.467L416.727 95.1142L536.954 9.49459Z" fill="#C17554" />
                    </svg>
                    {/* Text and logo content - LTR to ensure correct visual order */}
                    <div className="relative left-4 z-10 flex items-center gap-3 px-6" dir="ltr">
                        <WhiteLogo />
                        <h3 className="text-white font-bold text-7xl whitespace-nowrap z-10">Book Pass</h3>
                    </div>
                </div>
            </div>

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
                <p className="mt-4 max-w-2xl text-base md:text-xl text-gray-200 leading-relaxed font-light mb-6">
                    {description || 'وفر حتى 70% من تكلفة كتبك الجامعية من طلاب جامعتك... بيع واشتري بكل سهولة وفي دقائق'}
                </p>
            </div>

            {/* Call To Action Buttons */}
            <button className="absolute bottom-50 right-8 z-30 bg-[#3A4958] hover:bg-[#2c3844] text-white font-bold text-center py-5 px-14 rounded-md shadow-lg transition-transform transform hover:scale-105 text-xl min-w-fit">
                {primaryButtonText || 'ابحث عن كتابك الآن'}
            </button>

            <button className="absolute bottom-8 left-8 z-30 bg-[#C17554] hover:bg-[#a66346] text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                {secondaryButtonText || 'اعرض كتابك للبيع'}
            </button>
        </section>
    );
};

export default Hero;
