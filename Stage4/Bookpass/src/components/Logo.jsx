import React from 'react';

const Logo = () => {
    return (
        <img
            src={new URL('../assets/logo.png', import.meta.url).href}
            alt="Book Pass Logo"
            className="w-full h-full object-contain"
        />
    );
};

export default Logo;
