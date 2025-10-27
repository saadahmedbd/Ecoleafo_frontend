// ==========================================
// SELLER AUTHENTICATION SERVICE
// ==========================================
// Purpose: Centralized API service for seller authentication
// Features: Login, Register, Token management, Error handling
// Best Practices: Singleton pattern, axios interceptors, error handling
// ==========================================

import axios from 'axios';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * API Base URL - Change this based on environment
 * Production: Use environment variables
 */
const API_BASE_URL ='http://localhost:3000/api';

/**
 * API Endpoints
 */
const ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/seller/register',
  PROFILE_COMPLETE: '/seller/profile/complete',
  PAYMENT_METHODS: '/seller/payment-methods',
  PROFILE_STATUS: '/seller/profile/status',
  LOGOUT: '/seller/logout',
  REFRESH_TOKEN: '/seller/refresh-token',
};

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
  TOKEN: 'seller_token',
  REFRESH_TOKEN: 'seller_refresh_token',
  USER_ID: 'seller_id',
  USER_DATA: 'seller_data',
};

// ==========================================
// AXIOS INSTANCE CONFIGURATION
// ==========================================

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Automatically adds authentication token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh and global error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}${ENDPOINTS.REFRESH_TOKEN}`,
            { refresh_token: refreshToken }
          );
          
          const { token } = response.data;
          
          // Save new token
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        SellerAuthService.logout();
        window.location.href = '/seller/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
      });
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// AUTHENTICATION SERVICE
// ==========================================

/**
 * Seller Authentication Service
 * Handles all authentication-related API calls
 */
class SellerAuthService {
  /**
   * Login seller
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Seller email
   * @param {string} credentials.password - Seller password
   * @returns {Promise<Object>} Login response with token and user data
   */
  static async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.LOGIN, credentials);
      
      const { token, refresh_token, seller_id, user_id, store_name, profile_status } = response.data;
      
      // Store authentication data
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      }
      localStorage.setItem(STORAGE_KEYS.USER_ID, seller_id);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        seller_id,
        user_id,
        store_name,
        profile_status,
      }));
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Register new seller
   * @param {Object} registrationData - Registration form data
   * @returns {Promise<Object>} Registration response
   */
  static async register(registrationData) {
    try {
      // Step 1: Register seller account
      const registerResponse = await apiClient.post(ENDPOINTS.REGISTER, {
        email: registrationData.email,
        password: registrationData.password,
        confirm_password: registrationData.confirm_password,
        first_name: registrationData.first_name,
        last_name: registrationData.last_name,
        store_name: registrationData.store_name,
        phone: registrationData.phone,
        agree_to_terms: registrationData.agree_to_terms,
      });
      
      const { token, seller_id, user_id } = registerResponse.data;
      
      // Temporarily store token for profile completion
      const tempToken = token;
      
      // Step 2: Complete business profile
      const profileResponse = await apiClient.post(
        ENDPOINTS.PROFILE_COMPLETE,
        {
          business_email: registrationData.business_email,
          phone: registrationData.phone,
          store_description: registrationData.store_description,
          business_type: registrationData.business_type,
          tax_number: registrationData.tax_number,
          business_license: registrationData.business_license,
          address: registrationData.address,
          city: registrationData.city,
          state: registrationData.state,
          country: registrationData.country,
          postal_code: registrationData.postal_code,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      
      // Step 3: Add payment method
      const paymentResponse = await apiClient.post(
        ENDPOINTS.PAYMENT_METHODS,
        {
          type: registrationData.payment_type,
          account_name: registrationData.account_name,
          account_number: registrationData.account_number,
          ...(registrationData.payment_type === 'bank_transfer' && {
            bank_name: registrationData.bank_name,
            bank_code: registrationData.bank_code,
            routing_number: registrationData.routing_number,
          }),
          is_default: true,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      
      return {
        success: true,
        data: {
          ...registerResponse.data,
          profile_completed: true,
          payment_method_added: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Logout seller
   * Clears all stored authentication data
   */
  static logout() {
    // Clear all stored data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Optional: Call logout endpoint to invalidate token on server
    try {
      apiClient.post(ENDPOINTS.LOGOUT);
    } catch (error) {
      // Ignore logout errors
      console.error('Logout error:', error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  static getUserData() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get authentication token
   * @returns {string|null} Token or null
   */
  static getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Get profile completion status
   * @returns {Promise<Object>} Profile status
   */
  static async getProfileStatus() {
    try {
      const response = await apiClient.get(ENDPOINTS.PROFILE_STATUS);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - Axios error object
   * @returns {Object} Formatted error
   */
  static _handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
      };
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  }
}

// ==========================================
// EXPORTS
// ==========================================

export default SellerAuthService;
export { apiClient, ENDPOINTS, STORAGE_KEYS };

// ==========================================
// USAGE EXAMPLE
// ==========================================

/**
 * Example usage in components:
 * 
 * import SellerAuthService from '@/services/SellerAuthService';
 * 
 * // Login
 * const result = await SellerAuthService.login({
 *   email: 'seller@example.com',
 *   password: 'password123'
 * });
 * 
 * if (result.success) {
 *   console.log('Login successful:', result.data);
 *   navigate('/seller/dashboard');
 * } else {
 *   console.error('Login failed:', result.error.message);
 * }
 * 
 * // Register
 * const result = await SellerAuthService.register(formData);
 * 
 * // Check authentication
 * if (SellerAuthService.isAuthenticated()) {
 *   // User is logged in
 * }
 * 
 * // Logout
 * SellerAuthService.logout();
 */