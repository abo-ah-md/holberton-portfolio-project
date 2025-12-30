/**
 * Authentication Service
 * Handles all HTTP requests for login, registration, and user management
 * 
 * REQUIRED: Replace API_BASE_URL with your backend endpoint
 * Example: http://localhost:8080 or https://api.yourdomain.com
 */

// TODO: PROVIDE YOUR BACKEND API ENDPOINT HERE
const API_BASE_URL = 'http://localhost:8080'; // e.g., http://localhost:8080

// Get token from localStorage
const getToken = () => {
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
export const registerUser = async (email, password, firstName, lastName, phoneNumber = '') => {
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
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    
    // If token is returned, store it
    if (data.accessToken || data.token) {
      const token = data.accessToken || data.token;
      setToken(token);
      setStoredUser(data);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
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
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store token and user data
    const token = data.accessToken || data.token || data.idToken || data.jwt;
    if (token) {
      setToken(token);
      setStoredUser(data);
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
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
 * GET /api/users/me
 */
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    
    // If no token, return stored user or null
    if (!token) {
      return { data: getStoredUser(), error: null };
    }

    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeToken();
        removeStoredUser();
        throw new Error('Token expired. Please login again.');
      }
      throw new Error('Failed to fetch user');
    }

    const data = await response.json();
    setStoredUser(data);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

/**
 * Update user profile
 * PUT /api/users/me
 */
export const updateUserProfile = async (updates) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Update failed');
    }

    const data = await response.json();
    setStoredUser(data);
    return { data, error: null };
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
