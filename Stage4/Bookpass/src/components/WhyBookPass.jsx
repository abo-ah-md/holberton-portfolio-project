import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import whiteLogo from '../assets/white-logo.svg';

const WhyBookPass = () => {
    const sectionRef = useRef(null);

    // Scroll progress for parallax
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms for icons
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 30]);

    // Spring physics for 3D tilt
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

    // Feature Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const featureVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    };

    const features = [
        {
            title: "سهولة العثور\nعلى كتابك",
            icon: (
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <path d="M32 10L36 24L50 24L38 32L42 46L32 38L22 46L26 32L14 24L28 24L32 10Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M12 12L18 18M52 12L46 18M12 52L18 46M52 52L46 46" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            )
        },
        {
            title: "تمكين نقل\nالمعرفة",
            icon: (
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <circle cx="22" cy="28" r="6" stroke="white" strokeWidth="2.5" />
                    <circle cx="42" cy="28" r="6" stroke="white" strokeWidth="2.5" />
                    <path d="M12 48C12 40 18 38 22 38C26 38 32 40 32 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 48C32 40 38 38 42 38C46 38 52 40 52 48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M32 18C36 12 44 12 48 18" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>
            )
        },
        {
            title: "المساهمة في\nالحفاظ على البيئة",
            icon: (
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <path d="M32 10L42 28H22L32 10Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M44 32L54 50H34L44 32Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M20 32L30 50H10L20 32Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
            )
        },
        {
            title: "أسعار في\nمتناول اليد",
            icon: (
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="20" width="48" height="28" rx="4" stroke="white" strokeWidth="2.5" />
                    <circle cx="32" cy="34" r="7" stroke="white" strokeWidth="2.5" />
                    <path d="M14 26H20M44 42H50" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 20L8 16M52 20L56 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            )
        },
        {
            title: "فحص دقيق\nلحالة الكتب",
            icon: (
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                    <path d="M16 12H44V52H16V12Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                    <path d="M22 12V52" stroke="white" strokeWidth="1.5" />
                    <path d="M48 16H54V48H48" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="48" cy="48" r="8" fill="white" />
                    <path d="M44 48L47 51L52 45" stroke="#c8876f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    ];

    return (
        <div
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative w-full overflow-hidden bg-[#475a67] py-20 md:py-32"
        >
            {/* Background Decorative Icons Layer */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <motion.div style={{ y: y1, rotate }} className="absolute top-[20%] left-[5%] text-white">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                </motion.div>
                <motion.div style={{ y: y2, rotate: -rotate.get() }} className="absolute bottom-[10%] right-[10%] text-white">
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                </motion.div>
            </div>


            {/* Content Container - 3D Tilt Effect */}
            <motion.section
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    zIndex: 10
                }}
                className="relative flex flex-col items-center justify-center pt-20 px-4"
            >
                <div className="relative z-30 w-full max-w-7xl mx-auto">

                    {/* Header Group */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ transform: "translateZ(60px)" }}
                        className="flex flex-col items-center gap-6 mb-20"
                    >
                        <div className="flex flex-row-reverse items-center justify-center gap-6">
                            <motion.img
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                src={whiteLogo}
                                alt="Book Pass Logo"
                                className="w-12 h-12 md:w-20 md:h-20 drop-shadow-2xl"
                            />
                            <h2 className="text-white text-4xl md:text-7xl font-black tracking-tight drop-shadow-xl">
                                لماذا بوك باس ؟
                            </h2>
                        </div>
                        <div className="h-1.5 w-32 bg-white/20 rounded-full" />
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        style={{ transform: "translateZ(30px)" }}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 lg:gap-12"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={featureVariants}
                                whileHover={{ y: -10, scale: 1.05 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 flex items-center justify-center mb-6 bg-white/10 rounded-3xl p-4 backdrop-blur-sm border border-white/5 group-hover:bg-white/20 group-hover:border-white/20 transition-all shadow-xl">
                                    {feature.icon}
                                </div>
                                <p className="text-white text-sm sm:text-base lg:text-[22px] font-black leading-tight whitespace-pre-line drop-shadow-md">
                                    {feature.title}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default WhyBookPass;
