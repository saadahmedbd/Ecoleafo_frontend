// ==========================================
// SELLER PROFILE SERVICE
// ==========================================
// Purpose: Manage seller profile, store settings, and account operations
// Used in: Account.jsx, Settings.jsx, Profile.jsx
// ==========================================

import { store } from '../app/store';
import { setAuthError } from '../features/auth/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Seller Profile Service
 * Handles all seller profile and account management operations
 */
class SellerProfileService {
  /**
   * Get authentication headers
   * @private
   */
  getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Get full seller profile with store details
   * @returns {Promise<Object>} Profile response
   * 
   * Usage: In SellerAccount.jsx, SellerProfile.jsx
   * const response = await SellerProfileService.getFullProfile();
   * console.log(response.data.store_name, response.data.business_type);
   */
  async getFullProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/profile`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to load profile');
    }
  }

  /**
   * Update seller account information (name, email, phone)
   * @param {Object} accountData - Account data to update
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx
   * const response = await SellerProfileService.updateAccount({
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   phone: '+8801712345678'
   * });
   */
  async updateAccount(accountData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/account`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(accountData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update account');
      }

      const data = await response.json();

      // Update localStorage with new user data
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const updatedUser = { ...userData, ...data.user };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      return {
        success: true,
        data,
        message: 'Account updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update account');
    }
  }

  /**
   * Update store information
   * @param {Object} storeData - Store data to update
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx (Store Info Tab)
   * const response = await SellerProfileService.updateStore({
   *   store_name: 'New Store Name',
   *   store_description: 'Updated description',
   *   website: 'https://mystore.com',
   *   address: 'New Address'
   * });
   */
  async updateStore(storeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/store`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(storeData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update store');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Store information updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update store information');
    }
  }

  /**
   * Update store branding (logo, banner)
   * @param {FormData} formData - Form data with images
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx
   * const formData = new FormData();
   * formData.append('logo', logoFile);
   * formData.append('banner', bannerFile);
   * const response = await SellerProfileService.updateBranding(formData);
   */
  async updateBranding(formData) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/seller/store/branding`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update branding');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Store branding updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update branding');
    }
  }

  /**
   * Change seller password
   * @param {Object} passwordData - Current and new passwords
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx
   * const response = await SellerProfileService.changePassword({
   *   current_password: 'oldpass123',
   *   new_password: 'newpass123',
   *   confirm_password: 'newpass123'
   * });
   */
  async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/password/change`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(passwordData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Password changed successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to change password');
    }
  }

  /**
   * Update store policies (return, shipping, FAQ)
   * @param {Object} policiesData - Store policies
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx (Policies Tab)
   * const response = await SellerProfileService.updatePolicies({
   *   return_policy: 'Returns within 30 days',
   *   shipping_policy: 'Ships in 5-7 days',
   *   faq: 'Q: How to care? A: Water daily'
   * });
   */
  async updatePolicies(policiesData) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/store/policies`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(policiesData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update policies');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Store policies updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update policies');
    }
  }

  /**
   * Get notification preferences
   * @returns {Promise<Object>} Response with preferences
   * 
   * Usage: In SellerSettings.jsx (Notifications Tab)
   * const response = await SellerProfileService.getNotificationPreferences();
   */
  async getNotificationPreferences() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/notifications/preferences`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Preferences retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to load preferences');
    }
  }

  /**
   * Update notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx (Notifications Tab)
   * const response = await SellerProfileService.updateNotificationPreferences({
   *   order_email: true,
   *   order_sms: false,
   *   message_push: true
   * });
   */
  async updateNotificationPreferences(preferences) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/notifications/preferences`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update preferences');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Notification preferences updated'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update preferences');
    }
  }

  /**
   * Get verification status (identity, tax, bank)
   * @returns {Promise<Object>} Verification status
   * 
   * Usage: In SellerSettings.jsx (Verification Tab)
   * const response = await SellerProfileService.getVerificationStatus();
   */
  async getVerificationStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/verification/status`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch verification status');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Verification status retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to load verification status');
    }
  }

  /**
   * Upload verification documents
   * @param {FormData} formData - Document files
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx (Verification Tab)
   * const formData = new FormData();
   * formData.append('document_type', 'identity');
   * formData.append('document', file);
   * const response = await SellerProfileService.uploadVerificationDocument(formData);
   */
  async uploadVerificationDocument(formData) {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/seller/verification/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload document');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Document uploaded successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to upload document');
    }
  }

  /**
   * Enable/disable two-factor authentication
   * @param {boolean} enabled - Enable or disable 2FA
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx
   * const response = await SellerProfileService.toggle2FA(true);
   */
  async toggle2FA(enabled) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/security/2fa`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ enabled })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle 2FA');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: enabled ? '2FA enabled successfully' : '2FA disabled successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update 2FA settings');
    }
  }

  /**
   * Get login activity history
   * @returns {Promise<Object>} Login activity
   * 
   * Usage: In SellerAccount.jsx
   * const response = await SellerProfileService.getLoginActivity();
   */
  async getLoginActivity() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/security/activity`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Activity retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to load login activity');
    }
  }

  /**
   * Deactivate seller account
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx (Danger Zone)
   * const response = await SellerProfileService.deactivateAccount();
   */
  async deactivateAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/account/deactivate`, {
        method: 'POST',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to deactivate account');
      }

      const data = await response.json();

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');

      return {
        success: true,
        data,
        message: 'Account deactivated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to deactivate account');
    }
  }

  /**
   * Delete seller account permanently
   * @param {string} password - Current password for confirmation
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx (Danger Zone)
   * const response = await SellerProfileService.deleteAccount('password123');
   */
  async deleteAccount(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/account/delete`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete account');
      }

      const data = await response.json();

      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');

      return {
        success: true,
        data,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to delete account');
    }
  }

  /**
   * Upload profile photo
   * @param {File} file - Profile photo file
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerAccount.jsx
   * const response = await SellerProfileService.uploadProfilePhoto(photoFile);
   */
  async uploadProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_BASE_URL}/seller/account/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload photo');
      }

      const data = await response.json();

      // Update user data with new photo URL
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      userData.profile_photo = data.photo_url;
      localStorage.setItem('user_data', JSON.stringify(userData));

      return {
        success: true,
        data,
        message: 'Profile photo updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to upload photo');
    }
  }

  /**
   * Get seller statistics (for profile page)
   * @returns {Promise<Object>} Statistics
   * 
   * Usage: In SellerProfile.jsx
   * const response = await SellerProfileService.getStatistics();
   */
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/seller/statistics`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();

      return {
        success: true,
        data,
        message: 'Statistics retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to load statistics');
    }
  }

  // ==========================================
  // HELPER METHODS (Private)
  // ==========================================

  /**
   * Handle and format errors
   * @private
   */
  handleError(error, defaultMessage) {
    const errorMessage = 
      error?.message || 
      defaultMessage;

    // Dispatch error to Redux if needed
    store.dispatch(setAuthError(errorMessage));

    return {
      success: false,
      error: errorMessage,
      message: errorMessage
    };
  }
}

// Export singleton instance
export default new SellerProfileService();