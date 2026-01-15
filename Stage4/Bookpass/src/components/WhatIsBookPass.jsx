import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Book, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import whiteLogo from '../assets/white-logo.svg';

const WhatIsBookPass = () => {
    const sectionRef = useRef(null);

    // Scroll progress for parallax
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax transforms
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Spring physics for smoother 3D tilt
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

    // Text Animation Variants
    const titleText = "  باس بوك ماهي"; //don't change this
    const words = titleText.split(" ");

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
            }
        }
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            id="about-us"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative overflow-hidden min-h-[700px] md:min-h-[850px] flex items-center justify-center py-20 px-6"
            style={{ backgroundColor: '#475a67' }}
        >
            {/* Drifting Atmospheric Particles */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/10 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Floating Branded Icons - Background Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <motion.div style={{ y: y1, rotate }} className="absolute top-[10%] left-[10%] text-white">
                    <Book size={120} />
                </motion.div>
                <motion.div style={{ y: y2, rotate: -rotate.get() }} className="absolute bottom-[20%] right-[5%] text-white">
                    <GraduationCap size={150} />
                </motion.div>
                <motion.div style={{ y: y1, x: 50 }} className="absolute top-[40%] right-[15%] text-white">
                    <BookOpen size={80} />
                </motion.div>
                <motion.div style={{ y: y2 }} className="absolute top-[60%] left-[20%] text-white">
                    <Sparkles size={60} />
                </motion.div>
            </div>


            {/* Interactive 3D Content Card */}
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    zIndex: 30
                }}
                whileHover={{ scale: 1.02 }}
                className="relative max-w-5xl w-full bg-white/5 backdrop-blur-sm border border-white/10 p-10 md:p-20 rounded-[4rem] shadow-2xl overflow-hidden group"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                {/* Header with Word Reveal Logo */}
                <div className="flex flex-col items-center justify-center gap-8 mb-16" style={{ transform: "translateZ(50px)" }}>
                    <div className="flex items-center gap-6">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex flex-row-reverse gap-3 md:gap-5"
                        >
                            {words.map((word, i) => (
                                <motion.span
                                    key={i}
                                    variants={wordVariants}
                                    className="text-white text-4xl md:text-8xl font-black drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </motion.div>
                        <motion.img
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 100, delay: 1 }}
                            viewport={{ once: true }}
                            src={whiteLogo}
                            alt="Book Pass Logo"
                            className="w-16 h-16 md:w-28 md:h-28 drop-shadow-2xl"
                        />
                    </div>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100px" }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="h-1.5 bg-white/30 rounded-full"
                    />
                </div>

                {/* Body Content with Floating Effect */}
                <div className="space-y-12 text-center" style={{ transform: "translateZ(30px)" }}>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6 }}
                        className="text-white text-xl md:text-4xl font-black leading-relaxed"
                    >
                        بوك باس هي منصة صُمّمت من الطلاب، من أجل الطلاب لتربط بين الطلاب الراغبين في شراء و بيع الكتب الجامعية المستعملة بطريقة آمنة وسهلة و صفقات عادلة بين الطلاب.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                        className="text-white/80 text-lg md:text-3xl font-bold leading-relaxed italic"
                    >
                        سواء كنت تهدف لتوفير المال أو كسب بعضه، نساعد الكتب على الاستمرار في التداول بدلاً من أن تتراكم على الرفوف.
                    </motion.p>
                </div>

                {/* Interactive Icons that react to mouse */}
                <motion.div
                    animate="animate"
                    variants={floatingVariants}
                    className="absolute -top-10 -right-10 opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ transform: "translateZ(100px)" }}
                >
                    <BookOpen size={200} className="text-white" />
                </motion.div>
            </motion.div>

        </motion.div>
    );
};

export default WhatIsBookPass;
