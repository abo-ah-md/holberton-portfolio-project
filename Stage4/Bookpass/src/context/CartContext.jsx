import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {
        setCartItems(prev => [...prev, { ...item, cartId: Date.now() + Math.random() }]);
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
