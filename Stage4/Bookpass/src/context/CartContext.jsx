import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import * as cartService from '../services/cartService';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth(); // Monitor user state

    // Load cart from Server when user changes
    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            return;
        }

        setLoading(true);
        const { data, error } = await cartService.getCart();
        if (!error && Array.isArray(data)) {
            // Normailze data: 
            // 1. If server returns flat DTO with bookId (User's case), map bookId -> id, cartId
            // 2. If server returns nested { id: 1, book: {...} }, flatten it.
            const normalized = data.map(item => {
                // Case 1: Flat DTO
                if (item.bookId && !item.book) {
                    return {
                        ...item,
                        id: item.bookId, // Map bookId to id for UI
                        cartId: item.bookId // Use bookId as unique identifier for removal
                    };
                }
                // Case 2: Nested DTO (Previous assumption)
                if (item.book) {
                    return {
                        ...item.book,
                        cartId: item.id,
                        bookId: item.book.id
                    };
                }
                return { ...item, cartId: item.id || item.cartId };
            });
            setCartItems(normalized);
        } else {
            console.error("Failed to load cart:", error);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // "Validate" is now just fetching the latest state from server, 
    // because the server automatically filters out SOLD items.
    const validateCart = useCallback(async () => {
        if (!user) return [];

        // We fetch the fresh list. If items were sold, they won't be in the response.
        const { data, error } = await cartService.getCart();

        if (!error && Array.isArray(data)) {
            const normalized = data.map(item => {
                // Case 1: Flat DTO
                if (item.bookId && !item.book) {
                    return {
                        ...item,
                        id: item.bookId,
                        cartId: item.bookId
                    };
                }
                // Case 2: Nested DTO
                if (item.book) {
                    return {
                        ...item.book,
                        cartId: item.id,
                        bookId: item.book.id
                    };
                }
                return { ...item, cartId: item.id || item.cartId };
            });
            setCartItems(normalized);
            return normalized;
        }
        return cartItems; // Fallback
    }, [user, cartItems]);

    // Periodic check (still good to keep UI overlapping with server reality)
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(validateCart, 2 * 60 * 1000); // Every 2 mins
        return () => clearInterval(interval);
    }, [user, validateCart]);

    const addToCart = async (book) => {
        if (!user) {
            return { success: false, message: 'يجب تسجيل الدخول لإضافة كتب للسلة' };
        }

        // Optimistic check (frontend side)
        // Check both simple id and nested book.id to handle various backend response shapes
        if (cartItems.some(item => item.id === book.id || (item.book && item.book.id === book.id))) {
            return { success: false, message: 'الكتاب موجود بالفعل في السلة' };
        }

        const { success, error } = await cartService.addToCart(book.id);

        if (success) {
            fetchCart();
            return { success: true };
        } else {
            return { success: false, message: error || 'فشل في إضافة الكتاب' };
        }
    };

    const removeFromCart = async (cartItemId) => {
        if (!user) return;

        // Optimistic update
        const previousItems = [...cartItems];
        setCartItems(prev => prev.filter(item => item.cartId !== cartItemId && item.id !== cartItemId));

        const { success } = await cartService.removeFromCart(cartItemId);
        if (!success) {
            // Revert on failure
            setCartItems(previousItems);
            console.error("Failed to remove item");
        } else {
            fetchCart();
        }
    };

    const clearCart = async () => {
        if (!user) return;

        setCartItems([]); // Optimistic
        await cartService.clearCartAPI();
        fetchCart();
    };

    // Check if a specific book is already in cart
    const isInCart = (bookId) => {
        return cartItems.some(item => item.id === bookId || item.bookId === bookId || (item.book && item.book.id === bookId));
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
            validateCart,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};
