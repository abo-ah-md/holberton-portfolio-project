import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, BookOpen, DollarSign } from 'lucide-react';

const HowTo = () => {
    const [activeTab, setActiveTab] = useState('buying');
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-loop animation
    useEffect(() => {
        const stepCount = activeTab === 'buying' ? 3 : 5;
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % stepCount);
        }, 2000); // Change step every 2 seconds

        return () => clearInterval(interval);
    }, [activeTab]);

    // Reset animation when switching tabs
    useEffect(() => {
        setCurrentStep(0);
    }, [activeTab]);

    // Handle keyboard navigation
    const handleKeyDown = (e, tab) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveTab(tab);
        }
    };

    const buyingSteps = [
        { icon: Search, label: 'البحث عن الكتاب', number: 1 },
        { icon: ShoppingCart, label: 'السداد', number: 2 },
        { icon: null, label: 'استلام الكتاب من\nسفير بوك باس', number: 3, customIcon: true }
    ];

    const sellingSteps = [
        { label: 'إضافة طلب\nإدراج الكتاب', number: 1, customIcon: 'book-add' },
        { label: 'تسليم الكتاب إلى سفير\nبوك باس', number: 2, customIcon: 'badge' },
        { icon: BookOpen, label: 'تصنيف الكتاب', number: 3 },
        { icon: BookOpen, label: 'عرض الكتاب\nفي المنصة', number: 4 },
        { icon: DollarSign, label: 'شراء الكتاب\nوالتحويل', number: 5 }
    ];

    const steps = activeTab === 'buying' ? buyingSteps : sellingSteps;

    return (
        <div className="relative overflow-hidden min-h-[550px]" style={{ backgroundColor: '#475a67' }}>
            <section
                className="relative bg-[#475a67] pt-16 md:pt-20 lg:pt-24 pb-48 md:pb-60 lg:pb-72"
                aria-label="كيفية استخدام بوك باس"
            >
                {/* Main Content Container */}
                <div className="relative max-w-6xl mx-auto px-6 md:px-10 lg:px-16">
                    {/* Tab Navigation - RTL Layout */}
                    <div
                        className="flex  top-0 flex-row-reverse justify-center items-center gap-11 md:gap-7 mb-0"
                        role="tablist"
                        aria-label="اختر نوع العملية"
                    >
                        {/* Buying Tab */}
                        <button
                            role="tab"
                            id="buying-tab"
                            aria-selected={activeTab === 'buying'}
                            aria-controls="buying-panel"
                            onClick={() => setActiveTab('buying')}
                            onKeyDown={(e) => handleKeyDown(e, 'buying')}
                            className={`px-8 md:px-12 lg:px-14 py-4 md:py-5 lg:py-6 rounded-xl text-lg md:text-xl lg:text-4xl font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#475a67] ${activeTab === 'buying'
                                ? 'bg-[#c8876f] text-white shadow-lg'
                                : 'bg-[#9ca3ab] text-white hover:opacity-90'
                                }`}
                        >
                            <span aria-label="عملية الشراء">الشراء</span>
                        </button>

                        {/* Selling Tab */}
                        <button
                            role="tab"
                            id="selling-tab"
                            aria-selected={activeTab === 'selling'}
                            aria-controls="selling-panel"
                            onClick={() => setActiveTab('selling')}
                            onKeyDown={(e) => handleKeyDown(e, 'selling')}
                            className={`px-8 md:px-12 lg:px-14 py-4 md:py-5 lg:py-6 rounded-xl text-lg md:text-5xl lg:text-4xl font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#475a67] ${activeTab === 'selling'
                                ? 'bg-white text-[#c8876f] shadow-lg'
                                : 'bg-[#9ca3ab] text-white hover:opacity-90'
                                }`}
                        >
                            <span aria-label="عملية البيع">البيع</span>
                        </button>

                        {/* Label Tab */}
                        <div
                            className="px-4 md:px-5 py-2 md:py-3 lg:text-5xl text-white text-lg md:text-xl font-bold"
                            aria-hidden="true"
                        >
                            كيفية
                        </div>
                    </div>

                    {/* SPACER DIV - Creates guaranteed space between tabs and steps */}
                    <div className="h-32 md:h-40 lg:h-48"></div>

                    {/* Process Diagrams Container */}
                    <div className="mb-32 max-w-5xl mx-auto">
                        <div
                            id={`${activeTab}-panel`}
                            role="tabpanel"
                            aria-labelledby={`${activeTab}-tab`}
                            className="animate-fadeIn"
                        >
                            {/* Vertical on Mobile, Horizontal on Desktop */}
                            <div className="flex flex-col md:!flex-row items-center justify-center gap-4 md:gap-6 pb-16" dir="rtl">
                                {steps.map((step, index) => (
                                    <React.Fragment key={index}>
                                        {/* Step Container */}
                                        <div className="relative flex flex-col items-center gap-3">
                                            {/* Animated Number Badge */}
                                            <div
                                                className={`absolute -top-8 md:-top-10 bg-white rounded-md px-3 py-1 shadow-lg transition-all duration-500 ${currentStep === index
                                                    ? 'opacity-100 -translate-y-2 scale-110'
                                                    : 'opacity-0 translate-y-0 scale-100'
                                                    }`}
                                                style={{
                                                    animationDelay: `${index * 0.2}s`
                                                }}
                                            >
                                                <span className="text-[#c8876f] font-bold text-xl md:text-2xl">
                                                    {step.number}
                                                </span>
                                            </div>

                                            {/* Circle Icon */}
                                            <div
                                                className={`w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-[#c8876f] border-4 md:border-[5px] border-white flex items-center justify-center shadow-lg transition-all duration-500 ${currentStep === index
                                                    ? 'scale-110 shadow-2xl ring-4 ring-white/50'
                                                    : 'scale-100'
                                                    }`}
                                            >
                                                {step.icon && (
                                                    <step.icon
                                                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"
                                                        strokeWidth={2.5}
                                                    />
                                                )}
                                                {step.customIcon === 'book-add' && (
                                                    <svg
                                                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                                        <path d="M12 8v8M8 12h8" />
                                                    </svg>
                                                )}
                                                {step.customIcon === 'badge' && (
                                                    <svg
                                                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                        <circle cx="12" cy="12" r="4" fill="#c8876f" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                                {step.customIcon === true && (
                                                    <svg
                                                        className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                        <circle cx="12" cy="12" r="4" fill="#c8876f" stroke="currentColor" strokeWidth="1.5" />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <p className="text-white text-base md:text-lg lg:text-xl xl:text-[22px] font-bold text-center whitespace-pre-line">
                                                {step.label}
                                            </p>
                                        </div>

                                        {/* Animated Arrow Connector */}
                                        {index < steps.length - 1 && (
                                            <div className="flex items-center justify-center">
                                                {/* Vertical Arrow on Mobile */}
                                                <svg
                                                    className="  md:block md:hidden w-8 h-16"
                                                    viewBox="0 0 24 50"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M12 5 L12 40 M12 40 L8 36 M12 40 L16 36"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        className={`transition-all duration-500 ${currentStep === index
                                                            ? 'opacity-100 stroke-[3]'
                                                            : 'opacity-60'
                                                            }`}
                                                        style={{
                                                            strokeDasharray: currentStep === index ? '50' : '0',
                                                            strokeDashoffset: currentStep === index ? '0' : '50',
                                                            transition: 'stroke-dashoffset 0.5s ease-in-out'
                                                        }}
                                                    />
                                                </svg>

                                                {/* Horizontal Arrow on Desktop */}
                                                <svg
                                                    className=" hidden md:block w-16 md:w-20 lg:w-24 h-8"
                                                    viewBox="0 0 50 24"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M45 12 L5 12 M5 12 L9 8 M5 12 L9 16"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        className={`transition-all duration-500 ${currentStep === index
                                                            ? 'opacity-100 stroke-[3]'
                                                            : 'opacity-60'
                                                            }`}
                                                        style={{
                                                            strokeDasharray: currentStep === index ? '50' : '0',
                                                            strokeDashoffset: currentStep === index ? '0' : '50',
                                                            transition: 'stroke-dashoffset 0.5s ease-in-out'
                                                        }}
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in-out;
                }
                
                @keyframes arrowFlow {
                    0%, 100% {
                        stroke-dashoffset: 50;
                    }
                    50% {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default HowTo;
