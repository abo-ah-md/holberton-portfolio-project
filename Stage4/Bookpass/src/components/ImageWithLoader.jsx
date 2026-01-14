import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const ImageWithLoader = ({
    src,
    alt,
    className = "",
    priority = false, // If true, sets loading="eager"
    fillColor = "#C17554", // Brand Orange
    placeholderColor = "#E5E7EB" // Gray-200
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        // If src changes, reset state
        setIsLoaded(false);
        setError(false);

        // Handle cached images immediately
        const img = new Image();
        img.src = src;
        if (img.complete) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Loading Placeholder with Fill Animation */}
            {!isLoaded && !error && (
                <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
                    <div className="relative w-12 h-20">
                        {/* Background Grey Logo */}
                        <div className="absolute inset-0">
                            <Logo className="w-full h-full text-gray-300" style={{ fill: placeholderColor, stroke: 'none' }} />
                        </div>

                        {/* Foreground Colored Logo - Filling Animation */}
                        <div className="absolute inset-0 overflow-hidden animate-[fillUp_1.5s_ease-in-out_infinite]">
                            <Logo className="w-full h-full" style={{ fill: fillColor, stroke: 'none' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                onLoad={() => setIsLoaded(true)}
                onError={() => setError(true)}
            />

            {/* Error Fallback */}
            {error && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-xs">No Image</span>
                </div>
            )}

            <style>{`
                @keyframes fillUp {
                    0% { clip-path: inset(100% 0 0 0); }
                    100% { clip-path: inset(0% 0 0 0); }
                }
            `}</style>
        </div>
    );
};

export default ImageWithLoader;
