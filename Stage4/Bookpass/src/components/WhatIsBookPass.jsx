import React from 'react';
import whiteLogo from '../assets/white-logo.svg';

const WhatIsBookPass = () => {
    return (
        <div id="about-us" className=" relative overflow-hidden min-h-[550px]" style={{ backgroundColor: '#475a67', marginTop: '-1px' }}>
            {/* SVG Background with Organic Curve */}
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 1536 488"
                preserveAspectRatio="none"
                style={{ zIndex: 20 }}
            >
                <path
                    d="M0 0H1536V436.713C1536 436.713 777.756 421.007 208.573 454.951C98.5678 461.512 0 688 0 688L0 0Z"
                    fill="#c8876f"
                />
            </svg>

            <section
                className="relative "
                style={{ background: 'transparent' }}
            >
                {/* Main Content Container - Absolute Centering */}
                <div className="relative z-30 w-full px-6 py-24 md:py-40 flex flex-col items-center justify-center text-center">
                    {/* Header with Logo */}
                    <div className="flex flex-row items-center justify-center gap-4 mb-10 md:mb-16">
                        <h2 className="text-white text-3xl md:text-6xl font-black">
                            ماهي بوك باس ؟
                        </h2>
                        <img
                            src={whiteLogo}
                            alt="Book Pass Logo"
                            className="w-10 h-10 md:w-16 md:h-16"
                        />
                    </div>

                    {/* Body Content */}
                    <div className="max-w-4xl space-y-8">
                        <p className="text-white text-lg md:text-3xl font-bold leading-relaxed">
                            بوك باس هي منصة صُمّمت من الطلاب، من أجل الطلاب لتربط بين الطلاب الراغبين في شراء و بيع الكتب الجامعية المستعملة بطريقة آمنة وسهلة و صفقات عادلة بين الطلاب.
                        </p>

                        <p className="text-white text-lg md:text-3xl font-bold leading-relaxed">
                            سواء كنت تهدف لتوفير المال أو كسب بعضه، نساعد الكتب على الاستمرار في التداول بدلاً من أن تتراكم على الرفوف.
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
