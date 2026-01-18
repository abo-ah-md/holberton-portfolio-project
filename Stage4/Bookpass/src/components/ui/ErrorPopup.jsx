import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const ErrorPopup = ({ message, onClose }) => {
    return (
        <AnimatePresence>
            {message && (
                <div className="fixed inset-0 z-[var(--z-toast)] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative"
                    >
                        {/* Header with red accent */}
                        <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-inner">
                                <AlertCircle size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-black text-brand-secondary text-center">تنبيه</h3>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <p className="text-red-500 font-bold leading-relaxed text-lg mb-8">
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-brand-primary hover:bg-brand-accent text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-primary/20 hover:-translate-y-0.5"
                            >
                                حسناً
                            </button>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ErrorPopup;
