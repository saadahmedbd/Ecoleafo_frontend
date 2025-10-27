// ==========================================
// SELLER PROFILE SERVICE
// ==========================================
// Purpose: API service for seller profile management
// Features: Get profile, update profile, change password, upload images
// Backend Port: 3000
// ==========================================

import axios from 'axios';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * API Base URL - Backend runs on port 3000
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Profile API Endpoints
 */
const ENDPOINTS = {
  GET_PROFILE: '/seller/profile',
  UPDATE_PROFILE: '/seller/profile',
  UPDATE_IMAGE: '/seller/profile/image',
  CHANGE_PASSWORD: '/seller/profile/password',
};

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
  TOKEN: 'seller_token',
  PROFILE_DATA: 'seller_profile',
};

// ==========================================
// AXIOS INSTANCE
// ==========================================

/**
 * Create axios instance with authentication
 */
const profileClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Add token to all requests
 */
profileClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Profile API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle responses and errors
 */
profileClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Profile API Response:', response.data);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Profile API Error:', error.response?.data || error.message);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// SELLER PROFILE SERVICE
// ==========================================

class SellerProfileService {
  /**
   * Get seller profile
   * @returns {Promise<Object>} Profile data
   */
  static async getProfile() {
    try {
      const response = await profileClient.get(ENDPOINTS.GET_PROFILE);
      
      // Cache profile data
      localStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(response.data));
      
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
   * Update seller profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Update result
   */
  static async updateProfile(profileData) {
    try {
      const response = await profileClient.put(ENDPOINTS.UPDATE_PROFILE, {
        phone: profileData.phone,
        store_name: profileData.store_name,
        store_description: profileData.store_description,
        business_email: profileData.business_email,
        business_type: profileData.business_type,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        country: profileData.country,
        postal_code: profileData.postal_code,
      });
      
      // Update cached profile
      localStorage.setItem(STORAGE_KEYS.PROFILE_DATA, JSON.stringify(response.data));
      
      return {
        success: true,
        data: response.data,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Update store images (logo and banner)
   * @param {Object} images - Image URLs
   * @param {string} images.storeLogo - Store logo URL
   * @param {string} images.storeBanner - Store banner URL
   * @returns {Promise<Object>} Update result
   */
  static async updateStoreImages(images) {
    try {
      const response = await profileClient.put(ENDPOINTS.UPDATE_IMAGE, {
        storeLogo: images.storeLogo || '',
        storeBanner: images.storeBanner || '',
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Store images updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Change seller password
   * @param {Object} passwords - Password data
   * @param {string} passwords.currentPassword - Current password
   * @param {string} passwords.newPassword - New password
   * @param {string} passwords.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Change result
   */
  static async changePassword(passwords) {
    try {
      // Validate passwords match
      if (passwords.newPassword !== passwords.confirmPassword) {
        return {
          success: false,
          error: {
            message: 'New password and confirmation do not match',
          },
        };
      }
      
      const response = await profileClient.put(ENDPOINTS.CHANGE_PASSWORD, {
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword,
        confirm_password: passwords.confirmPassword,
      });
      
      return {
        success: true,
        data: response.data,
        message: 'Password changed successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Get cached profile data
   * @returns {Object|null} Cached profile or null
   */
  static getCachedProfile() {
    const cached = localStorage.getItem(STORAGE_KEYS.PROFILE_DATA);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Clear cached profile data
   */
  static clearCache() {
    localStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - Axios error
   * @returns {Object} Formatted error
   */
  static _handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || error.response.data?.detail || 'An error occurred',
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // No response from server
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

export default SellerProfileService;
export { profileClient, ENDPOINTS, STORAGE_KEYS };

// ==========================================
// USAGE EXAMPLE
// ==========================================

/**
 * Example usage in components:
 * 
 * import SellerProfileService from '@/services/SellerProfileService';
 * 
 * // Get profile
 * const result = await SellerProfileService.getProfile();
 * if (result.success) {
 *   setProfile(result.data);
 * }
 * 
 * // Update profile
 * const result = await SellerProfileService.updateProfile({
 *   phone: '+880123456789',
 *   store_name: 'My Store',
 *   business_email: 'business@store.com',
 *   // ... other fields
 * });
 * 
 * // Change password
 * const result = await SellerProfileService.changePassword({
 *   currentPassword: 'old123',
 *   newPassword: 'new123',
 *   confirmPassword: 'new123'
 * });
 * 
 * // Update images
 * const result = await SellerProfileService.updateStoreImages({
 *   storeLogo: 'https://example.com/logo.png',
 *   storeBanner: 'https://example.com/banner.png'
 * });
 */