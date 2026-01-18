import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorPage from '../../pages/ErrorPage';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen={true} />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role Check
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <ErrorPage type="403" />;
    }

    return children;
};

export default ProtectedRoute;