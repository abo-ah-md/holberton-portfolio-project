import React, { useEffect, useRef } from 'react';
import BookCard from './BookCard';

/**
 * Wrapper component that renders a BookCard and automatically opens its modal
 * Used for search results in Navbar
 */
const SearchBookModal = ({ book, onClose }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        if (book && cardRef.current) {
            // Find the clickable image element in the BookCard and click it to open modal
            const clickableElement = cardRef.current.querySelector('[class*="cursor-pointer"]');
            if (clickableElement) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    clickableElement.click();
                }, 50);
            }
        }
    }, [book]);

    if (!book) return null;

    return (
        <div
            ref={cardRef}
            style={{
                position: 'fixed',
                left: '-9999px',
                top: '-9999px',
                pointerEvents: 'none'
            }}
        >
            <BookCard book={book} />
        </div>
    );
};

export default SearchBookModal;
