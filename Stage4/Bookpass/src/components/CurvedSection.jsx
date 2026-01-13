import React from 'react';
import whiteLogo from '../assets/white-logo.svg';

const CurvedSection = () => {
    return (
        <div className="relative w-full overflow-hidden mb-20 md:mb-32" style={{ marginTop: '-1px', backgroundColor: '#475a67' }}>
            {/* SVG with exact shape from provided design */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1536 804"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
                style={{ display: 'block', zIndex: 10 }}
            >
                <defs>
                    <filter
                        id="filter0_d_127_2515"
                        x="-4"
                        y="0"
                        width="1561"
                        height="804"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                        />
                        <feOffset dy="23" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_127_2515"
                        />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_127_2515"
                            result="shape"
                        />
                    </filter>
                </defs>
                <g filter="url(#filter0_d_127_2515)">
                    <path
                        d="M1538.5 777H0V283.794C0 283.794 758.244 301.531 1327.43 263.196C1437.43 255.787 1553 0 1553 0L1538.5 777Z"
                        fill="#c8876f"
                    />
                </g>
            </svg>

            {/* Content Section - Centered within the brown area */}
            <section className="relative z-30 min-h-[500px] md:min-h-[450px] flex flex-col items-center justify-center pt-32 md:pt-48 pb-16 md:pb-24" style={{ background: 'transparent' }}>
                <div className="relative z-30 w-full max-w-7xl mx-auto px-4 md:px-12">

                    {/* Header with Logo */}
                    <div className="relative mb-12 md:mb-16">
                        <div className="flex flex-row-reverse items-center justify-center gap-4 md:gap-5">
                            <img
                                src={whiteLogo}
                                alt="Book Pass Logo"
                                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
                            />
                            <h2 className="text-white text-3xl md:text-5xl lg:text-[48px] font-bold text-center tracking-tight">
                                لماذا بوك باس ؟
                            </h2>
                        </div>
                    </div>

                    {/* Features Grid - Horizontal row on ALL devices */}
                    <div className="relative flex flex-row flex-nowrap justify-center items-start gap-1 md:gap-4 lg:gap-8">

                        {/* Feature 5 */}
                        <div className="flex flex-col items-center text-center gap-2 md:gap-5 w-1/5 max-w-[200px]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18 lg:w-22 lg:h-22 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                    <path d="M16 12H44V52H16V12Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                    <path d="M22 12V52" stroke="white" strokeWidth="1.5" />
                                    <path d="M48 16H54V48H48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <circle cx="48" cy="48" r="8" fill="white" />
                                    <path d="M44 48L47 51L52 45" stroke="#c8876f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-white text-[11px] sm:text-xs md:text-base lg:text-[20px] font-bold leading-tight">
                                فحص دقيق<br />لحالة الكتب
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="flex flex-col items-center text-center gap-2 md:gap-5 w-1/5 max-w-[200px]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18 lg:w-22 lg:h-22 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                    <rect x="8" y="20" width="48" height="28" rx="4" stroke="white" strokeWidth="2.5" />
                                    <circle cx="32" cy="34" r="7" stroke="white" strokeWidth="2.5" />
                                    <path d="M14 26H20M44 42H50" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 20L8 16M52 20L56 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="text-white text-[11px] sm:text-xs md:text-base lg:text-[20px] font-bold leading-tight">
                                أسعار في<br />متناول اليد
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center text-center gap-2 md:gap-5 w-1/5 max-w-[200px]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18 lg:w-22 lg:h-22 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                    <path d="M32 10L42 28H22L32 10Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                    <path d="M44 32L54 50H34L44 32Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                    <path d="M20 32L30 50H10L20 32Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-white text-[11px] sm:text-xs md:text-base lg:text-[20px] font-bold leading-tight">
                                المساهمة في<br />الحفاظ على البيئة
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center text-center gap-2 md:gap-5 w-1/5 max-w-[200px]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18 lg:w-22 lg:h-22 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                    <circle cx="22" cy="28" r="6" stroke="white" strokeWidth="2.5" />
                                    <circle cx="42" cy="28" r="6" stroke="white" strokeWidth="2.5" />
                                    <path d="M12 48C12 40 18 38 22 38C26 38 32 40 32 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M32 48C32 40 38 38 42 38C46 38 52 40 52 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                    <path d="M32 18C36 12 44 12 48 18" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
                                </svg>
                            </div>
                            <p className="text-white text-[11px] sm:text-xs md:text-base lg:text-[20px] font-bold leading-tight">
                                تمكين نقل<br />المعرفة
                            </p>
                        </div>

                        {/* Feature 1 */}
                        <div className="flex flex-col items-center text-center gap-2 md:gap-5 w-1/5 max-w-[200px]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18 lg:w-22 lg:h-22 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                                    <path d="M32 10L36 24L50 24L38 32L42 46L32 38L22 46L26 32L14 24L28 24L32 10Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                                    <path d="M12 12L18 18M52 12L46 18M12 52L18 46M52 52L46 46" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <p className="text-white text-[9px] sm:text-xs md:text-base lg:text-[20px] font-bold leading-tight">
                                سهولة العثور<br />على كتابك
                            </p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default CurvedSection;
