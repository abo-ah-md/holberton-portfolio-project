/**
 * Cart Service
 * Handles all HTTP requests for server-side cart management
 */

import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

/**
 * Get current user's cart
 * GET /api/cart
 */
export const getCart = async () => {
    try {
        const token = getToken();
        if (!token) {
            return { data: [], error: null }; // Guest or not logged in - handle logic in context
        }

        const response = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { data: [], error: errorData.message || 'Failed to fetch cart' };
        }

        const data = await response.json();
        return { data: data || [], error: null };
    } catch (error) {
        console.error('Get Cart Error:', error);
        return { data: [], error: error.message };
    }
};

/**
 * Add book to cart
 * POST /api/cart
 */
export const addToCart = async (bookId) => {
    try {
        const token = getToken();
        if (!token) throw new Error("User must be logged in");

        const response = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.message || 'Failed to add to cart' };
        }

        // Server returns empty body on success
        return { success: true };
    } catch (error) {
        console.error('Add to Cart Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Remove item from cart
 * DELETE /api/cart/{itemId}
 */
export const removeFromCart = async (itemId) => {
    try {
        const token = getToken();
        if (!token) throw new Error("User must be logged in");

        const response = await fetch(`${API_BASE_URL}/api/cart/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, error: errorData.message || 'Failed to remove from cart' };
        }

        return { success: true };
    } catch (error) {
        console.error('Remove from Cart Error:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Clear request - (Optional/If implemented)
 * DELETE /api/cart
 */
export const clearCartAPI = async () => {
    try {
        const token = getToken();
        if (!token) return { success: false };

        const response = await fetch(`${API_BASE_URL}/api/cart`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) return { success: false };

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
