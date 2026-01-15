/**
 * Admin Service
 * Handles data fetching for the Admin Dashboard
 */

import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard-stats
 */
export const getDashboardStats = async () => {
    try {
        const token = getToken();
        if (!token) {
            throw new Error('Not authenticated');
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard-stats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        // Data Transformation & Defaults
        // Ensure all metrics exist to prevent UI 'undefined' errors
        const safeData = {
            ...data,
            metrics: {
                ...data.metrics,
                // Default 'pendingBooks' if missing (try camelCase or other variants too if backend structure differs)
                pendingBooks: data.metrics?.pendingBooks ?? data.metrics?.pending_books ?? 0,

                // Calculate 'universitiesCovered' from list if missing
                universitiesCovered: data.metrics?.universitiesCovered ?? data.universityStats?.length ?? 0,

                // New renamed metric
                universities: data.metrics?.universities ?? data.metrics?.reviewers ?? 0,

                // Ensure other critical metrics have defaults
                activeUsers: data.metrics?.activeUsers ?? data.metrics?.active_users ?? 0,
                soldBooks: data.metrics?.soldBooks ?? data.metrics?.sold_books ?? 0,
            }
        };

        return { data: safeData, error: null };

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Fallback to empty structure or error to handle graceful degradation UI if needed
        return { data: null, error: error.message };
    }
};
