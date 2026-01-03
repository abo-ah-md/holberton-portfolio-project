import React from 'react';
import { RibbonBrown } from './BookPassUI';
import WhiteLogo from './WhiteLogo';

const Hero = ({ title, subtitle, description, primaryButtonText, secondaryButtonText, backgroundImage }) => {
    return (
        <section className="relative flex-1 flex items-center min-h-[600px] w-full bg-slate-900 overflow-hidden font-sans">
            {/* Ribbon Logo */}
            <div className="absolute  left-0 bottom-1/2 z-40 drop-shadow-2xl transform origin-left scale-80">
                <div className="flex items-center relative">
                    <div className="relative z-10">
                        <RibbonBrown />
                    </div>
                    <div className="relative inset-0 flex items-center gap-4 z-20 pl-20">
                        <div className='text-4xl'>
                            <h3 className="text-white font-bold  whitespace-nowrap">Book Pass</h3>
                        </div>
                        <div className="scale-110">
                            <WhiteLogo />
                        </div>


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
            <div className="relative z-20 max-w-6xl mx-auto px-4 md:px-6 py-16 flex flex-col items-center text-center text-white w-full">

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-snug tracking-wide mb-6">
                    {title || 'كتب جامعية مستعملة'} <br className="hidden md:block" />
                    <span className="text-[#F97316]">{subtitle || 'بأسعار تناسب الطلاب'}</span>
                </h1>

                {/* Description */}
                <p className="mt-4 max-w-2xl text-base md:text-xl text-gray-200 leading-relaxed font-light mb-10">
                    {description || 'وفر حتى 70% من تكلفة كتبك الجامعية من طلاب جامعتك... بيع واشتري بكل سهولة وفي دقائق'}
                </p>
            </div>

            {/* Call To Action Buttons */}
            <button className="absolute bottom-8 right-8 z-30 bg-[#3A4958] hover:bg-[#2c3844] text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                {primaryButtonText || 'ابحث عن كتابك الآن'}
            </button>

            <button className="absolute bottom-8 left-8 z-30 bg-[#C17554] hover:bg-[#a66346] text-white font-bold py-4 px-10 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg">
                {secondaryButtonText || 'اعرض كتابك للبيع'}
            </button>
        </section>
    );
};

export default Hero;
