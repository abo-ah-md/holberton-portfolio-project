/**
 * Authentication Service
 * Handles all HTTP requests for login, registration, and user management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.book-pass.com';

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Store token in localStorage
const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// Get user from localStorage
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Store user in localStorage
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

    // Store token and user data
    const user = {
      id: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      token: data.token,
      profilePicture: data.profilePicture
    };

    setToken(data.token);
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

    if (!response.ok) {
      return { data: null, error: data.message || 'Invalid credentials' };
    }

    // Store token and user data
    const user = {
      id: data.email,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      token: data.token,
      profilePicture: data.profilePicture
    };

    setToken(data.token);
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
      profilePicture: data.profilePicture
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

    if (!response.ok) {
      const data = await response.json();
      return { data: null, error: data.message || 'Update failed' };
    }

    const data = await response.json();
    const updatedUser = {
      ...getStoredUser(),
      ...data
    };
    setStoredUser(updatedUser);

    return { data: updatedUser, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};
