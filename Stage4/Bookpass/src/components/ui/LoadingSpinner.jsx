import React from 'react';
import WhiteLogo from '../layout/WhiteLogo';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = true, message = "جاري التحميل..." }) => {
    const content = (
        <div className="relative flex flex-col items-center gap-10 px-4 text-center -translate-y-16">
            {/* Logo Container */}
            <motion.div
                className="relative z-10 w-12 h-16 md:w-14 md:h-20 drop-shadow-2xl"
                animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.02, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <WhiteLogo />
            </motion.div>

            {/* Loading Text and Dots */}
            {message && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                >
                    <p className="text-white text-lg md:text-xl font-bold drop-shadow-md">
                        {message}
                    </p>
                    <div className="flex justify-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-white rounded-full"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[var(--z-max)] flex items-center justify-center overflow-hidden">
                <style>{`
                    @keyframes gradient-xy {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .loading-screen-bg {
                         background: linear-gradient(135deg, #1e293b, #334155, #C17554, #2c3e50);
                         background-size: 400% 400%;
                         animation: gradient-xy 8s ease infinite;
                    }
                `}</style>
                <div className="absolute inset-0 loading-screen-bg"></div>
                {content}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
            <div className="relative w-16 h-16 mb-4">
                <motion.div
                    animate={{ scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <WhiteLogo color="#C17554" />
                </motion.div>
            </div>
            <p className="text-brand-slate font-bold">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
