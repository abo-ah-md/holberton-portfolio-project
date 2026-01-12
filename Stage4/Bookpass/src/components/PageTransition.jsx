import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    // Use useLayoutEffect to trigger before browser paint
    useLayoutEffect(() => {
        setIsLoading(true);
        window.scrollTo(0, 0); // Optional: scroll to top on nav
    }, [location.pathname, location.search]);

    useEffect(() => {
        // Wait for the minimal loading time, then fade out
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    return (
        <>
            {/* Loading Overlay - Instant appearance (no transition on enter), fade out on exit */}
            {isLoading && (
                <div className="fixed inset-0 z-[9999]">
                    <LoadingSpinner fullScreen={true} />
                </div>
            )}

            {/* Page Content - Hidden instantly when loading starts, fades in when finished */}
            <div
                className={`transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-0 duration-0' : 'opacity-100'}`}
            >
                {children}
            </div>
        </>
    );
};

export default PageTransition;
