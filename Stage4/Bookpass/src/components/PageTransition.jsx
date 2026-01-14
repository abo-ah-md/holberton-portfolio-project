import React, { useState, useLayoutEffect, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// Create Context to share loading state
const PageLoadingContext = createContext({
    isLoading: false,
    setIsLoading: () => { },
    setLoadingMessage: () => { }
});

// Custom hook to use the loading context
export const usePageLoading = () => useContext(PageLoadingContext);

const PageTransition = ({ children }) => {
    const location = useLocation();
    const [navLoading, setNavLoading] = useState(true); // Start true for initial mount
    const [manualLoadingCount, setManualLoadingCount] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState("جاري التحميل...");
    const timeoutRef = useRef(null);
    const prevLocation = useRef(location.pathname + location.search);

    // Synchronously update navLoading when location changes during render phase
    // to prevent content flash before useLayoutEffect runs.
    if (prevLocation.current !== (location.pathname + location.search)) {
        prevLocation.current = location.pathname + location.search;
        if (!navLoading) setNavLoading(true);
    }

    // Function to handle manual loading
    const setIsLoading = useCallback((val) => {
        setManualLoadingCount(prev => val ? prev + 1 : Math.max(0, prev - 1));
    }, []);

    // Handle timers and splash duration
    useLayoutEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // Ensure the screen stays up even if navLoading transition was fast
        timeoutRef.current = setTimeout(() => {
            setNavLoading(false);
        }, 1000); // 1s minimum splash for premium feel

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [location.pathname, location.search]);

    const isLoading = navLoading || (manualLoadingCount > 0);

    return (
        <PageLoadingContext.Provider value={{
            isLoading,
            setIsLoading,
            setLoadingMessage
        }}>
            {/* Loading Overlay */}
            {isLoading && (
                <LoadingSpinner fullScreen={true} message={loadingMessage} />
            )}

            {/* Content Area - Hidden when loading */}
            <div
                className={`transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-0 invisible pointer-events-none' : 'opacity-100 visible'}`}
            >
                {children}
            </div>
        </PageLoadingContext.Provider>
    );
};

export default PageTransition;
