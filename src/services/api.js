// API Base URL - Update this to your Go backend URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * API Service for TreeStore Backend
 * Handles all HTTP requests to Go backend
 */

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    // Store token if returned
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Authentication APIs
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const result = await apiCall('/auth/registation', {
      method: 'POST',
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      }),
    });
    if (result.success && result.data.token) {
      localStorage.setItem('authToken', result.data.token);
    }
    return result;
  },

  // Login user
  login: async (credentials) => {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    if (result.success && result.data.token) {
      localStorage.setItem('authToken', result.data.token);
    }
    return result;
  },

  // Logout user
  logout: async () => {
    try {
      await apiCall('/auth/logout', {
        method: 'POST',
      });
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },
};

export default {
  authAPI,
};
