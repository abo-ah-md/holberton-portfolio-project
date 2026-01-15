import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, BookOpen, DollarSign } from 'lucide-react';

const HowTo = () => {
    const [activeTab, setActiveTab] = useState('buying');
    const [currentStep, setCurrentStep] = useState(0);

    // Auto-loop animation
    useEffect(() => {
        const stepCount = activeTab === 'buying' ? 3 : 5;
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % stepCount);
        }, 2500); // Slower loop for better readability

        return () => clearInterval(interval);
    }, [activeTab]);

    // Reset animation when switching tabs
    useEffect(() => {
        setCurrentStep(0);
    }, [activeTab]);

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
        <div className="relative overflow-hidden min-h-[600px] bg-[#475a67]">
            <section
                className="relative py-24 md:py-32"
                aria-label="كيفية استخدام بوك باس"
            >
                {/* Main Content Container */}
                <div className="relative w-full px-6 md:px-12 flex flex-col items-center justify-center">

                    {/* Header Label - Renamed/Enhanced */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-white text-4xl md:text-7xl font-black mb-4 drop-shadow-xl">
                            كيف تـبـدأ؟
                        </h2>
                        <div className="h-1.5 w-24 bg-[#c8876f] mx-auto rounded-full" />
                    </motion.div>

                    {/* Tab Navigation - Switch Design */}
                    <div className="flex bg-white/5 backdrop-blur-md p-2 rounded-3xl border border-white/10 mb-24 relative z-20">
                        <div className="relative flex gap-2">
                            <button
                                onClick={() => setActiveTab('buying')}
                                className={`relative px-12 py-4 rounded-2xl text-xl md:text-3xl font-black transition-all duration-300 z-10 min-w-[160px] ${activeTab === 'buying'
                                    ? 'bg-[#c8876f] text-white shadow-xl'
                                    : 'bg-transparent text-white/60 hover:text-white'
                                    }`}
                            >
                                الشراء
                            </button>
                            <button
                                onClick={() => setActiveTab('selling')}
                                className={`relative px-12 py-4 rounded-2xl text-xl md:text-3xl font-black transition-all duration-300 z-10 min-w-[160px] ${activeTab === 'selling'
                                    ? 'bg-[#c8876f] text-white shadow-xl'
                                    : 'bg-transparent text-white/60 hover:text-white'
                                    }`}
                            >
                                البيع
                            </button>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="w-full max-w-7xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-4 lg:gap-10"
                                dir="rtl"
                            >
                                {steps.map((step, index) => (
                                    <React.Fragment key={index}>
                                        <div className="relative flex flex-col items-center group">
                                            {/* Number Badge */}
                                            <motion.div
                                                animate={{
                                                    y: currentStep === index ? -15 : 0,
                                                    opacity: currentStep === index ? 1 : 0.3,
                                                    scale: currentStep === index ? 1.2 : 1
                                                }}
                                                className="mb-4 bg-white text-[#c8876f] w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg"
                                            >
                                                {step.number}
                                            </motion.div>

                                            {/* Step Circle with Pulse Effect */}
                                            <div className="relative">
                                                <AnimatePresence>
                                                    {currentStep === index && (
                                                        <motion.div
                                                            initial={{ scale: 0.8, opacity: 0 }}
                                                            animate={{ scale: 1.5, opacity: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 1.5, repeat: Infinity }}
                                                            className="absolute inset-0 bg-white/20 rounded-full z-0"
                                                        />
                                                    )}
                                                </AnimatePresence>

                                                <motion.div
                                                    animate={{
                                                        scale: currentStep === index ? 1.1 : 1,
                                                        borderColor: currentStep === index ? '#ffffff' : 'rgba(255,255,255,0.3)'
                                                    }}
                                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#c8876f] border-4 flex items-center justify-center shadow-2xl relative z-10 transition-all duration-500"
                                                >
                                                    {step.icon ? (
                                                        <step.icon className="w-10 h-10 md:w-14 md:h-14 text-white" strokeWidth={2.5} />
                                                    ) : (
                                                        <div className="text-white">
                                                            {step.customIcon === 'book-add' && (
                                                                <svg className="w-10 h-10 md:w-14 md:h-14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M12 8v8M8 12h8" />
                                                                </svg>
                                                            )}
                                                            {step.customIcon === 'badge' && (
                                                                <svg className="w-10 h-10 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /><circle cx="12" cy="12" r="4" fill="#c8876f" stroke="currentColor" strokeWidth="1.5" />
                                                                </svg>
                                                            )}
                                                            {step.customIcon === true && (
                                                                <svg className="w-10 h-10 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /><circle cx="12" cy="12" r="4" fill="#c8876f" stroke="currentColor" strokeWidth="1.5" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>

                                            {/* Label */}
                                            <motion.p
                                                animate={{
                                                    opacity: currentStep === index ? 1 : 0.6,
                                                    y: currentStep === index ? 5 : 0
                                                }}
                                                className="mt-6 text-white text-lg md:text-xl font-black text-center whitespace-pre-line leading-tight"
                                            >
                                                {step.label}
                                            </motion.p>
                                        </div>

                                        {/* Animated Path Connector */}
                                        {index < steps.length - 1 && (
                                            <div className="flex items-center justify-center py-4 md:py-0 md:pt-14">
                                                {/* Desktop Path */}
                                                <svg className="hidden md:block w-16 lg:w-28 h-10" viewBox="0 0 100 20">
                                                    <motion.path
                                                        d="M0 10 L100 10"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeDasharray="100"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: currentStep === index ? 1 : 0 }}
                                                        transition={{ duration: 0.8 }}
                                                        className="opacity-30"
                                                    />
                                                </svg>
                                                {/* Mobile Path */}
                                                <svg className="md:hidden w-10 h-12" viewBox="0 0 20 50">
                                                    <motion.path
                                                        d="M10 0 L10 50"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeDasharray="50"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: currentStep === index ? 1 : 0 }}
                                                        transition={{ duration: 0.8 }}
                                                        className="opacity-30"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowTo;
