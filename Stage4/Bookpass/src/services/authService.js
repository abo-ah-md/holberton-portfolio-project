/**
 * Authentication Service
 * Handles all HTTP requests for login, registration, and user management
 */

import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

// Get token from Cookies
export const getToken = () => {
  const token = Cookies.get('accessToken');
  console.log('🔍 DEBUG - Token from cookie:', token ? `${token.substring(0, 20)}...` : 'NULL/UNDEFINED');
  console.log('🔍 DEBUG - Token length:', token?.length || 0);
  console.log('🔍 DEBUG - Token periods:', (token?.match(/\./g) || []).length);
  return token;
};

// Store token in Cookies
const setToken = (token) => {
  // Set cookie with 7 days expiry, secure in production, and strict sameSite
  Cookies.set('accessToken', token, {
    expires: 7,
    secure: window.location.protocol === 'https:',
    sameSite: 'Strict'
  });
};

// Remove token from Cookies
const removeToken = () => {
  Cookies.remove('accessToken');
};

// Get user from localStorage
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Store user in localStorage (Profile data only, NO TOKENS)
const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove user from localStorage
const removeStoredUser = () => {
  localStorage.removeItem('user');
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (email, password, firstName, lastName, phoneNumber = '', profilePicture = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        profilePicture,
        role: 'CUSTOMER'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || 'Registration failed' };
    }

    // Store token in Cookie
    setToken(data.token);

    // Store user data in LocalStorage (without token)
    const user = {
      id: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phoneNumber: data.phoneNumber,
      profilePicture: data.profilePicture,
      iban: data.iban
    };
    setStoredUser(user);

    return { data: user, error: null };
  } catch (error) {
    console.error('Registration error:', error);
    return { data: null, error: error.message || 'Network error' };
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await response.json();

    console.log('🔍 DEBUG - Login response:', data);
    console.log('🔍 DEBUG - Token in response:', data.token);

    if (!response.ok) {
      return { data: null, error: data.message || 'Invalid credentials' };
    }

    // Store token in Cookie
    console.log('🔍 DEBUG - About to store token:', data.token);
    setToken(data.token);

    // Store user data in LocalStorage (without token)
    const user = {
      id: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phoneNumber: data.phoneNumber,
      profilePicture: data.profilePicture,
      iban: data.iban
    };
    setStoredUser(user);

    return { data: user, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error: error.message || 'Network error' };
  }
};

/**
 * Logout user
 * Removes token and user data from storage
 */
export const logoutUser = async () => {
  try {
    removeToken();
    removeStoredUser();
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Get current user profile
 * GET /api/user/profile
 */
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    if (!token) {
      return { data: null, error: null };
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If token is invalid, clear storage
      if (response.status === 401) {
        removeToken();
        removeStoredUser();
      }
      return { data: getStoredUser(), error: null };
    }

    const data = await response.json();
    const user = {
      id: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phoneNumber: data.phoneNumber,
      profilePicture: data.profilePicture,
      iban: data.iban
    };

    setStoredUser(user);
    return { data: user, error: null };
  } catch (error) {
    // Return stored user on network error
    return { data: getStoredUser(), error: null };
  }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
export const updateUserProfile = async (updates) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No user logged in");
    }

    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {}; // Handle empty body
      } catch (e) {
        data = { message: text || response.statusText };
      }
    }

    if (!response.ok) {
      return { data: null, error: data.message || 'Update failed' };
    }

    // Use data if available, otherwise just use updates (optimistic)
    const updatedUser = {
      ...getStoredUser(),
      ...data,
      ...updates // Ensure locally updated fields are merged if server returns empty
    };
    setStoredUser(updatedUser);

    return { data: updatedUser, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return { success: false, error: (typeof data === 'string' ? data : data.message) || 'Failed to send reset email' };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
};

/**
 * Reset password
 * POST /api/auth/reset-password
 */
export const resetPassword = async (token, newPassword) => {
  try {
    // Send token and newPassword in the body, as per updated backend contract
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return { success: false, error: (typeof data === 'string' ? data : data.message) || 'Failed to reset password' };
    }

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};
