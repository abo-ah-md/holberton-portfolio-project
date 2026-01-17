import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { createPortal } from 'react-dom';

const ImageViewer = ({ isOpen, onClose, imageSrc, altText }) => {
    if (!isOpen) return null;

    // Use portal to render at root level (zIndex handling)
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out"
                    />

                    {/* Image Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative z-10 max-w-[90vw] max-h-[90vh] p-2"
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-white hover:text-brand-primary transition-colors p-2 bg-white/10 rounded-full backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        <img
                            src={imageSrc}
                            alt={altText || 'Full screen view'}
                            className="w-full h-full object-contain max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ImageViewer;
