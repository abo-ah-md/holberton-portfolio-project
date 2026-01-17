import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HowTo from './HowTo';

const RegistrationWizard = ({ onComplete, children }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { id: 'buying', title: 'كيفية الشراء', component: 'buying' },
        { id: 'selling', title: 'كيفية البيع', component: 'selling' },
        { id: 'signup', title: 'التسجيل', component: 'form' },
        { id: 'complete', title: 'اكتمال', component: 'completion' }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkipToSignup = () => {
        setCurrentStep(2); // Jump to signup step
    };

    const navigate = useNavigate();

    // Auto-redirect on completion
    useEffect(() => {
        if (currentStep === 3) {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [currentStep, navigate]);

    return (
        <div className="min-h-screen w-full bg-white flex flex-col" dir="rtl">
            <style>{`
                @keyframes gradient-xy {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .success-bg-animated {
                        background: linear-gradient(135deg, #C17554, #3A4958, #C17554);
                        background-size: 200% 200%;
                        animation: gradient-xy 10s ease infinite;
                }
            `}</style>

            {/* Progress Steps - Top (Hidden on Success Step) */}
            {currentStep !== 3 && (
                <div className="w-full bg-brand-secondary py-6 px-4 md:px-8">
                    <div className="max-w-4xl mx-auto" dir="ltr">
                        <div className="flex items-start justify-between relative">
                            {/* Progress Line - Centered exactly on circles (Mobile: top-5=20px, Desktop: top-6=24px) */}
                            <div className="absolute top-5 md:top-6 left-0 right-0 h-1 bg-white/20 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-5 md:top-6 left-0 h-1 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                            />

                            {/* Step Indicators - LTR Order */}
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex flex-col items-center relative z-10">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            scale: currentStep === index ? 1.1 : 1,
                                            backgroundColor: currentStep >= index ? '#C17554' : 'rgba(255,255,255,0.2)'
                                        }}
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 border-brand-secondary shadow-lg"
                                    >
                                        {currentStep > index ? (
                                            <Check className="text-white" size={20} />
                                        ) : (
                                            <span className="text-white font-bold text-sm md:text-base">{index + 1}</span>
                                        )}
                                    </motion.div>
                                    <span className={`mt-2 text-xs md:text-sm font-bold transition-colors hidden md:block ${currentStep >= index ? 'text-brand-primary' : 'text-white/50'
                                        }`}>
                                        {step.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={`flex-1 relative ${currentStep === 3 ? 'overflow-hidden' : 'overflow-hidden'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        {/* Step 0: Buying Guide */}
                        {currentStep === 0 && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 relative">
                                    <HowTo activeTab="buying" showTabSwitcher={false} />
                                </div>
                                <div className="absolute bottom-0 w-full z-10 p-4 bg-white/10 border-t border-white/20 backdrop-blur-xl shadow-2xl flex justify-between items-center">
                                    <button
                                        onClick={handleNext}
                                        className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                                    >
                                        <span>التالي</span>
                                        <ChevronRight size={20} />
                                    </button>
                                    <button
                                        onClick={handleSkipToSignup}
                                        className="text-white hover:text-brand-primary font-bold text-sm transition-colors"
                                    >
                                        تخطي إلى التسجيل
                                    </button>
                                    <div></div>
                                </div>
                            </div>
                        )}

                        {/* Step 1: Selling Guide */}
                        {currentStep === 1 && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 relative">
                                    <HowTo activeTab="selling" showTabSwitcher={false} />
                                </div>
                                <div className="absolute bottom-0 w-full z-10 p-4 bg-white/10 border-t border-white/20 backdrop-blur-xl shadow-2xl flex justify-between items-center">
                                    <button
                                        onClick={handleNext}
                                        className="bg-brand-primary hover:bg-brand-accent text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                                    >
                                        <span>التالي</span>
                                        <ChevronRight size={20} />
                                    </button>
                                    <button
                                        onClick={handleSkipToSignup}
                                        className="text-white hover:text-brand-primary font-bold text-sm transition-colors"
                                    >
                                        تخطي إلى التسجيل
                                    </button>
                                    <button
                                        onClick={handlePrev}
                                        className="text-white hover:text-brand-primary font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                        <span>السابق</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Sign Up Form */}
                        {currentStep === 2 && (
                            <div className="h-full overflow-hidden">
                                {React.cloneElement(children, {
                                    onSuccess: () => setCurrentStep(3),
                                    showBackButton: true,
                                    onBack: handlePrev
                                })}
                            </div>
                        )}

                        {/* Step 3: Completion - PaymentSuccess Style */}
                        {currentStep === 3 && (
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center font-sans rtl text-white">
                                {/* Background with blur and gradient */}
                                <div className="absolute inset-0 success-bg-animated opacity-100"></div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative z-10 w-full max-w-2xl px-4 flex flex-col items-center justify-center text-center"
                                >
                                    {/* Main Glass Card */}
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 w-full shadow-2xl">

                                        {/* Icon & Title */}
                                        <div className="mb-6">
                                            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl bg-[#61BF8D] text-white animate-bounce-slow">
                                                <Check className="text-white" size={48} strokeWidth={3} />
                                            </div>
                                            <h1 className="text-4xl md:text-5xl font-black mb-4 drop-shadow-lg text-white">
                                                تم التسجيل بنجاح!
                                            </h1>
                                        </div>

                                        <p className="text-white/80 text-lg mb-8 font-medium">
                                            مرحباً بك في بوك باس. جاري تحويلك إلى صفحة تسجيل الدخول...
                                        </p>

                                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default RegistrationWizard;
