import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RestrictedAccessPage from '../../pages/RestrictedAccessPage';

const ReviewerGuard = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // If loading, let the page load or show a spinner (usually App handles global loading, 
    // but here we just pass children or wait. Passing children might flash content, 
    // but AuthContext usually has initial loading state. 
    // If 'loading' is true from useAuth, we should probably wait, but ReviewerGuard 
    // wraps Routes, so it might block everything. 
    // However, AuthContext provides a 'loading' state.
    if (loading) {
        return children; // Or return generic loader. Let's return children, PageTransition handles visual loading.
    }

    // Check if user is a reviewer
    const isReviewer = user?.role === 'BOOKSTORE';

    // List of allowed paths for reviewers
    const allowedPaths = ['/admin/review', '/logout', '/login', '/terms'];

    if (isReviewer) {
        // Check if current path is allowed
        const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));

        // Special case: If they are at root '/' and are reviewer, redirect to admin/review? 
        // Or just show restricted? Request said "any other page will show (404 like design)".
        // So strict check.

        if (!isAllowed) {
            return <RestrictedAccessPage />;
        }
    }

    return children;
};

export default ReviewerGuard;
