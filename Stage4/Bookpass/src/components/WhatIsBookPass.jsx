import React from 'react';
import whiteLogo from '../assets/white-logo.svg';

const WhatIsBookPass = () => {
    return (
        <div id="about-us" className=" relative overflow-hidden min-h-[550px]" style={{ backgroundColor: '#475a67' }}>
            {/* SVG Background with Organic Curve */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1536 688"
                preserveAspectRatio="none"
                style={{ zIndex: 20 }}
            >
                <path
                    d="M0 0H1536V436.713C1536 436.713 777.756 421.007 208.573 454.951C98.5678 461.512 0 688 0 688L0 0Z"
                    fill="#c8876f"
                />
            </svg>

            <section
                className="relative min-h-[550px]"
                style={{ background: 'transparent' }}
            >
                {/* Main Content Container */}
                <div className="top-10 relative z-30 max-w-6xl mx-auto px-10 md:px-16 py-18 md:py-22 lg:py-26">
                    {/* Header with Logo */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 mt-32 mb-12 md:mb-14">
                        <h2 className="text-white text-3xl md:text-4xl lg:text-[44px] font-bold text-center">
                            ماهي بوك باس ؟
                        </h2>
                        <img
                            src={whiteLogo}
                            alt="Book Pass Logo"
                            className="w-12 h-12 md:w-16 md:h-16 lg:w-16 lg:h-16"
                        />
                    </div>

                    {/* Body Content */}
                    <div className="  max-w-4xl mx-auto space-y-6 md:space-y-7">
                        <p className="text-white text-lg md:text-xl lg:text-[22px] text-center leading-relaxed" style={{ lineHeight: '1.85' }}>
                            بوك باس هي منصة ضُمّمت من الطلاب، من أجل الطلاب لتربط بين الطلاب الراغبين في شراء و بيع الكتب الجامعية المستعملة بطريقة آمنة وسهلة و صفقات عادلة بين الطلاب.
                        </p>

                        <p className="text-white text-lg md:text-xl lg:text-[22px] text-center leading-relaxed" style={{ lineHeight: '1.85' }}>
                            سواء كنت تهدف لتوفير المال أو كسب بعضه ، نساعد الكتب على الاستمرار في التداول بدلاً من أن تتراكم على الرفوف.
                        </p>
                    </div>
                </div>

                {/* Decorative Bookmark SVG from Design */}
                <svg
                    className="absolute left-[147px]  top-40"
                    width="130"
                    height="467"
                    viewBox="0 0 200 467"
                    fill="none"
                    style={{ zIndex: 5 }}
                >
                    <defs>
                        <filter id="bookmarkShadow" x="-90%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                            <feOffset dx="9" dy="1" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path
                        d="M212.74 349.36L276.189 448.367L256.933 215.241C256.645 211.753 256.657 208.248 256.97 204.763L275.36 0L147 0.237L147.829 448.604L212.74 349.36Z"
                        fill="#c8876f"
                        transform="translate(-147, 0)"
                        filter="url(#bookmarkShadow)"
                    />
                </svg>
            </section>
        </div>
    );
};

export default WhatIsBookPass;
