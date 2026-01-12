import { createContext, useContext, useEffect, useState } from 'react';
import { registerUser, loginUser, logoutUser, getCurrentUser, isAuthenticated } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get initial user session
        const initializeAuth = async () => {
            try {
                if (isAuthenticated()) {
                    const { data, error: fetchError } = await getCurrentUser();
                    if (fetchError) {
                        setError(fetchError);
                        setUser(null);
                    } else {
                        setUser(data);
                        setError(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Register
    const signUp = async (email, password, fullName, phoneNumber = '', profilePicture = '') => {
        const [firstName = '', lastName = ''] = fullName.split(' ').length > 1
            ? fullName.split(' ')
            : [fullName, ''];

        const { data, error } = await registerUser(email, password, firstName, lastName, phoneNumber, profilePicture);

        if (!error && data) {
            setUser(data);
            setError(null);
        } else {
            setError(error);
        }

        return { data, error };
    };

    // Login
    const signIn = async (email, password) => {
        const { data, error } = await loginUser(email, password);

        if (!error && data) {
            setUser(data);
            setError(null);
        } else {
            setError(error);
        }

        return { data, error };
    };

    // Logout
    const signOut = async () => {
        const { error } = await logoutUser();

        if (!error) {
            setUser(null);
            setError(null);
        } else {
            setError(error);
        }

        return { error };
    };

    const updateUserState = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    const value = {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        updateUserState,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};