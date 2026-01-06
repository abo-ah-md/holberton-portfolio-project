import React from 'react';
import WhiteLogo from './WhiteLogo';

const LoadingSpinner = ({ fullScreen = true }) => {
    // animated gradient background
    // enlarge logo
    // remove ring

    const content = (
        <div className="relative z-10 w-48 h-48 drop-shadow-2xl animate-pulse">
            <WhiteLogo />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
                <style>{`
                    @keyframes gradient-xy {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .loading-bg-animated {
                         background: linear-gradient(135deg, #C17554, #3A4958, #C17554);
                         background-size: 200% 200%;
                         animation: gradient-xy 3s ease infinite;
                    }
                `}</style>
                {/* Background with blur and gradient */}
                <div className="absolute inset-0 loading-bg-animated backdrop-blur-md opacity-95"></div>

                {content}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-24 h-24">
                <WhiteLogo />
            </div>
        </div>
    );
};

export default LoadingSpinner;
