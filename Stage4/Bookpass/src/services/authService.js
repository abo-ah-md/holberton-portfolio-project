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
/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async (email, password, firstName, lastName, phoneNumber = '') => {
  console.log("Mock Registering:", { email, password, firstName, lastName });

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock successful response
  const mockUser = {
    id: Math.floor(Math.random() * 1000),
    email,
    firstName,
    lastName,
    role: 'user',
    token: 'mock-jwt-token-' + Date.now()
  };

  setToken(mockUser.token);
  setStoredUser(mockUser);

  return { data: mockUser, error: null };
};

/**
 * Login user
 * POST /api/auth/login
 */
export const loginUser = async (email, password) => {
  console.log("Mock Logging in:", email);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (password === 'wrong-password') {
    return { data: null, error: 'Invalid credentials' };
  }

  const mockUser = {
    id: 1,
    email,
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    token: 'mock-jwt-token-' + Date.now()
  };

  setToken(mockUser.token);
  setStoredUser(mockUser);

  return { data: mockUser, error: null };
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
/**
 * Get current user profile
 * GET /api/users/me
 */
export const getCurrentUser = async () => {
  // Mock implementation: Return stored user
  try {
    const token = getToken();
    if (!token) {
      return { data: getStoredUser(), error: null };
    }

    // Return stored user directly without API call
    const storedUser = getStoredUser();
    return { data: storedUser, error: null };
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
    console.log("Mock Updating Profile:", updates);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentUser = getStoredUser();
    if (!currentUser) {
      throw new Error("No user logged in");
    }

    const updatedUser = { ...currentUser, ...updates };
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
