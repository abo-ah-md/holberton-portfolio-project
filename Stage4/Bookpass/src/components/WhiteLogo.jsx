    import React from 'react';

    const WhiteLogo = () => {
        return (
            <img
                src={new URL('../assets/white-logo.svg', import.meta.url).href}
                alt="Book Pass Logo"
                className="w-full h-full object-contain"
            />
        );
    };

    export default WhiteLogo;
