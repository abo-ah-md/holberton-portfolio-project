import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getAllBooks } from '../services/bookService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Helper to get storage key for a specific user
const getStorageKey = (userId) => `bookpass_cart_${userId || 'guest'}`;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Load cart from localStorage when user changes
    useEffect(() => {
        const loadCart = () => {
            const storageKey = getStorageKey(user?.uid);
            const savedCart = localStorage.getItem(storageKey);
            if (savedCart) {
                try {
                    const parsed = JSON.parse(savedCart);
                    setCartItems(Array.isArray(parsed) ? parsed : []);
                } catch (e) {
                    console.error('Failed to parse cart from localStorage:', e);
                    setCartItems([]);
                }
            } else {
                setCartItems([]);
            }
            setIsInitialized(true);
        };

        loadCart();
    }, [user?.uid]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (!isInitialized) return; // Don't save until we've loaded

        const storageKey = getStorageKey(user?.uid);
        localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }, [cartItems, user?.uid, isInitialized]);

    // Validate cart items against current book availability
    const validateCart = useCallback(async () => {
        if (cartItems.length === 0) return;

        try {
            // Get current book data
            const { books } = await getAllBooks();
            if (!books || books.length === 0) return;

            // Create a map of book IDs to their current status
            const bookStatusMap = new Map();
            books.forEach(book => {
                bookStatusMap.set(book.id, {
                    isSold: book.isSold || book.listingStatus === 'SOLD',
                    isAvailable: book.listingStatus === 'AVAILABLE'
                });
            });

            // Filter out sold books from cart
            const validItems = cartItems.filter(item => {
                const bookInfo = bookStatusMap.get(item.id);
                // Keep item if: book not found in DB (might be deleted) OR book is still available
                if (!bookInfo) return true; // Keep if we can't verify
                return !bookInfo.isSold && bookInfo.isAvailable;
            });

            // Update cart if items were removed
            if (validItems.length !== cartItems.length) {
                setCartItems(validItems);
            }
        } catch (error) {
            console.error('Failed to validate cart:', error);
        }
    }, [cartItems]);

    // Validate cart on mount and periodically
    useEffect(() => {
        if (!isInitialized || cartItems.length === 0) return;

        // Validate immediately
        validateCart();

        // Also validate every 2 minutes while user is on the page
        const interval = setInterval(validateCart, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [isInitialized, validateCart]);

    const addToCart = (item) => {
        // Prevent adding duplicates by book ID
        if (cartItems.some(existing => existing.id === item.id)) {
            return { success: false, message: 'الكتاب موجود بالفعل في السلة' };
        }

        setCartItems(prev => [...prev, {
            ...item,
            cartId: Date.now() + Math.random(),
            addedAt: new Date().toISOString()
        }]);

        return { success: true };
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    // Check if a specific book is already in cart
    const isInCart = (bookId) => {
        return cartItems.some(item => item.id === bookId);
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            isInCart,
            cartCount,
            validateCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
