import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RibbonLogoCombined from '../layout/RibbonLogoCombined';
import { useAuth } from "../../context/AuthContext";
import AuthRequiredModal from './AuthRequiredModal';
import HeroBookCarousel from './HeroBookCarousel';
import { usePageLoading } from '../ui/PageTransition'; // Import hook
import ImageWithLoader from '../ui/ImageWithLoader';

const Hero = ({ title, subtitle, description, primaryButtonText, secondaryButtonText }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isLoading } = usePageLoading(); // Consume loading state
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleSellClick = () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            navigate('/sell');
        }
    };

    // --- Animation Variants ---

    // Premium "Soft Spring" Easing
    const transition = {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
    };

    // Container for Text Elements (Staggered)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                // Wait for the loading screen (approx 800ms) + small buffer (300ms) = 1.1s total delay
                delayChildren: 0.3
            }
        }
    };

    // Individual Text Item (Slide Up + Fade)
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: transition
        }
    };

    // Background Image (Subtle Zoom Out Reveal)
    // Background Image (Subtle Zoom Out Reveal)
    // Disabled on Mobile to prevent perceived movement during scroll
    const isMobile = window.innerWidth < 768; // Simple check, or could use hook
    const bgVariants = {
        hidden: {
            scale: isMobile ? 1 : 1.1,
            opacity: 0
        },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 1.8,
                ease: "easeOut",
                delay: 0.1
            }
        }
    };

    // Carousel (Smooth Fade In from Left)
    const carouselVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 1.2,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-slate-900 font-sans rtl">

            {/* Global Background Image (Animated) */}
            {/* Global Background Image (Animated) */}
            <motion.div
                variants={bgVariants}
                initial="hidden"
                animate={!isLoading ? "visible" : "hidden"} // sync with loading state
                className="absolute inset-0 z-0"
            >
                <ImageWithLoader
                    src={new URL('../../assets/library-bg.jpg', import.meta.url).href}
                    alt="Library Background"
                    className="w-full h-full"
                    priority={true}
                />
            </motion.div>

            {/* Global Dark Overlay: Stronger contrast for text readability */}
            <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

            {/* Bottom Shine/Fade - Condensed & Animated "Breathing" Glow */}
            {/* Bottom Shine/Fade - Condensed & Animated "Breathing" Glow */}
            {/* Optimized: Animates scaleY instead of height to prevent layout thrashing */}
            <motion.div
                animate={{
                    opacity: [0.7, 1, 0.7],
                    scaleY: [1, 1.2, 1] // Scaling vertically is GPU optimized
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{ originY: 1 }} // Anchor to bottom
                className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-primary via-brand-primary/30 to-transparent z-20 pointer-events-none"
            />

            {/* Main Grid Container */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-full w-full">

                {/* RIGHT COLUMN - Content (Staggered Animation) */}
                <div className="relative h-full flex flex-col justify-center items-start lg:items-center px-6 md:px-12 py-10 order-2 lg:order-1">

                    {/* Content Wrapper */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate={!isLoading ? "visible" : "hidden"} // sync with loading state
                        className="relative z-10 w-full max-w-2xl mx-auto text-center lg:text-right flex flex-col items-center lg:items-start text-white pt-10 lg:pt-0"
                    >

                        {/* Logo Animation - Scaled Down & Spaced Out */}
                        <motion.div variants={itemVariants} className="mb-10 lg:mb-12">
                            <RibbonLogoCombined className="w-[280px] md:w-[350px] h-auto mx-auto lg:mx-0 drop-shadow-2xl" />
                        </motion.div>

                        {/* Heading Animation - Larger & Clearer */}
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8 text-center lg:text-right w-full drop-shadow-lg">
                            كتب جامعية مستعملة <br />
                            <span className="text-brand-primary block mt-3 text-2xl md:text-4xl font-bold">بأسعار تناسب الطلاب</span>
                        </motion.h1>

                        {/* Description Animation - Increased Leading */}
                        <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-200 leading-loose font-light mb-12 max-w-lg text-center lg:text-right mix-blend-plus-lighter">
                            وفر حتى 70% من تكلفة كتبك الجامعية من طلاب جامعتك... بيع واشتري بكل سهولة وفي دقائق.
                        </motion.p>

                        {/* Buttons Animation - Clear Hierarchy */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                            {/* Primary Action - "Search/Marketplace" - Solid Orange */}
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg w-full sm:w-auto min-w-[200px] border border-brand-primary"
                            >
                                {primaryButtonText || 'ابحث عن كتابك'}
                            </button>

                            {/* Secondary Action - "Sell" - Outline/Glass */}
                            <button
                                onClick={handleSellClick}
                                className="bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-10 rounded-xl border-2 border-white/30 hover:border-white transition-all duration-300 text-lg backdrop-blur-sm w-full sm:w-auto min-w-[200px]"
                            >
                                {secondaryButtonText || 'اعرض كتابك للبيع'}
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* LEFT COLUMN - Book Carousel (Smooth Entrance) */}
                <motion.div
                    variants={carouselVariants}
                    initial="hidden"
                    animate={!isLoading ? "visible" : "hidden"} // sync with loading state
                    className="relative h-full hidden lg:block order-1 lg:order-2 overflow-hidden"
                >
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>

                    {/* Book Carousel */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <HeroBookCarousel />
                    </div>
                </motion.div>

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
