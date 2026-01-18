import React from 'react';

const WhiteBookmark = () => {
    return (
        <img
            src={new URL('../assets/white-bookmark.svg', import.meta.url).href}
            alt="white-bookmark"
            className="w-full h-full object-contain"
        />
    );
};

export default WhiteBookmark;
