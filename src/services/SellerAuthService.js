// ==========================================
// SELLER AUTHENTICATION SERVICE
// ==========================================
// Purpose: Centralized service for all seller authentication operations
// Used in: Seller registration, login, profile completion, payment management
// Benefits: Encapsulates complex seller logic, reusable, testable
// ==========================================

import { store } from '../app/store';
import { setCredentials, clearAuth, setAuthError, setProfileStatus } from '../features/auth/authSlice';
import { sellerAuthApi } from '../features/auth/sellerAuthApi';
import { initTokenRefresh, stopTokenRefresh } from '../utils/tokenRefresh';

/**
 * Seller Authentication Service
 * Provides high-level authentication methods for seller operations
 */
class SellerAuthService {
  /**
   * Register a new seller account (Step 1 of registration)
   * @param {Object} credentials - Registration data
   * @returns {Promise<Object>} Registration response with token
   * 
   * Usage: In SellerRegister.jsx (Step 1)
   * const response = await SellerAuthService.register({
   *   email: 'seller@example.com',
   *   password: 'password123',
   *   confirm_password: 'password123',
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   store_name: 'John\'s Store',
   *   phone: '+8801712345678',
   *   agree_to_terms: true
   * });
   */
   async register(credentials) {
      try {
        const result = await store.dispatch(
          sellerAuthApi.endpoints.registerSeller.initiate(credentials)
        ).unwrap();
  
        // Store with refresh token
        this.storeAuthentication(
          result.token, 
          result.refresh_token, // ADD THIS
          result.user, 
          false
        );
  
        initTokenRefresh();

        return {
          success: true,
          data: result,
          message: 'Registration successful'
        };
      } catch (error) {
        return this.handleError(error, 'Registration failed');
      }
    }
  

  /**
   * Login existing seller with profile checks
   * @param {Object} credentials - Login data
   * @returns {Promise<Object>} Login response with redirect info
   * 
   * Usage: In SellerLogin.jsx
   * const response = await SellerAuthService.login({
   *   email: 'seller@example.com',
   *   password: 'password123',
   *   remember_me: true
   * });
   * 
   * // Handle redirect based on profile status
   * if (response.redirectTo) {
   *   navigate(response.redirectTo);
   * }
   */
  async login(credentials) {
      try {
        const result = await store.dispatch(
          sellerAuthApi.endpoints.loginSeller.initiate(credentials)
        ).unwrap();
  
        // Store with refresh token
        this.storeAuthentication(
          result.token,
          result.refresh_token, // ADD THIS
          result.user,
          credentials.remember_me || false
        );
  
        initTokenRefresh();

        return {
          success: true,
          data: result,
          message: 'Login successful'
        };
      } catch (error) {
        return this.handleError(error, 'Login failed');
      }
    }

  /**
   * Logout current seller
   * @returns {Promise<Object>} Logout response
   * 
   * Usage: In SellerDashboard.jsx, Header.jsx, PendingApproval.jsx
   * await SellerAuthService.logout();
   */
  async logout() {
    try {
      await store.dispatch(
        sellerAuthApi.endpoints.logoutSeller.initiate()
      ).unwrap();

      this.clearAuthentication();
      stopTokenRefresh();

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Even if API fails, clear local data
      this.clearAuthentication();
      stopTokenRefresh();
      return {
        success: true,
        message: 'Logged out'
      };
    }
  }

  /**
   * Get seller profile completion status
   * @returns {Promise<Object>} Profile status
   * 
   * Usage: In SellerLogin.jsx, SellerGuard.jsx, PendingApproval.jsx
   * const response = await SellerAuthService.getProfileStatus();
   * console.log(response.data.is_approved, response.data.next_step);
   */
    /**
 * Get seller profile completion status
 * @returns {Promise<Object>} Profile status
 */
async getProfileStatus() {
  try {
    const result = await store.dispatch(
      sellerAuthApi.endpoints.getProfileStatus.initiate()
    ).unwrap();

    // Update Redux with latest status
    store.dispatch(setProfileStatus(result));

    return {
      success: true,
      data: result,
      message: 'Profile status retrieved'
    };
  } catch (error) {
    return this.handleError(error, 'Failed to get profile status');
  }
}


  /**
   * Complete seller business profile
   * @param {Object} profileData - Business profile data
   * @returns {Promise<Object>} Response
   * 
   * Usage: In CompleteProfile.jsx
   * const response = await SellerAuthService.completeProfile({
   *   business_email: 'business@store.com',
   *   phone: '+8801712345678',
   *   store_description: 'We sell quality products',
   *   business_type: 'nursery',
   *   tax_number: 'TAX123',
   *   business_license: 'LIC456',
   *   address: '123 Main St',
   *   city: 'Dhaka',
   *   state: 'Dhaka Division',
   *   country: 'Bangladesh',
   *   postal_code: '1200'
   * });
   */
  async completeProfile(profileData) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.completeProfile.initiate(profileData)
      ).unwrap();

      // Update profile status if returned
      if (result.profile_status) {
        store.dispatch(setProfileStatus(result.profile_status));
      }

      return {
        success: true,
        data: result,
        message: 'Profile completed successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to complete profile');
    }
  }

  /**
   * Get full seller profile
   * @returns {Promise<Object>} Full profile data
   * 
   * Usage: In SellerProfile.jsx, SellerSettings.jsx
   * const response = await SellerAuthService.getProfile();
   * console.log(response.data.store_name, response.data.business_type);
   */
  async getProfile() {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.getProfile.initiate()
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Profile retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to get profile');
    }
  }

  /**
   * Update store information
   * @param {Object} storeData - Store data to update
   * @returns {Promise<Object>} Response
   * 
   * Usage: In SellerSettings.jsx, SellerProfile.jsx
   * const response = await SellerAuthService.updateStore({
   *   store_name: 'New Store Name',
   *   store_description: 'Updated description'
   * });
   */
  async updateStore(storeData) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.updateStore.initiate(storeData)
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Store updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update store');
    }
  }

  /**
   * Get all payment methods
   * @returns {Promise<Object>} List of payment methods
   * 
   * Usage: In SellerSettings.jsx, PaymentMethods.jsx
   * const response = await SellerAuthService.getPaymentMethods();
   * response.data.forEach(method => console.log(method.type, method.account_name));
   */
  async getPaymentMethods() {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.getPaymentMethods.initiate()
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Payment methods retrieved'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to get payment methods');
    }
  }

  /**
   * Add new payment method
   * @param {Object} paymentData - Payment method data
   * @returns {Promise<Object>} Response
   * 
   * Usage: In AddPayment.jsx, SellerSettings.jsx
   * const response = await SellerAuthService.addPaymentMethod({
   *   type: 'bkash',
   *   account_name: 'John Doe',
   *   account_number: '+8801712345678',
   *   is_default: true
   * });
   */
  async addPaymentMethod(paymentData) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.addPaymentMethod.initiate(paymentData)
      ).unwrap();

      // Update profile status (payment method added)
      const status = store.getState().auth.profileStatus;
      if (status) {
        store.dispatch(setProfileStatus({
          ...status,
          has_payment_method: true
        }));
      }

      return {
        success: true,
        data: result,
        message: 'Payment method added successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to add payment method');
    }
  }

  /**
   * Update existing payment method
   * @param {string} id - Payment method ID
   * @param {Object} paymentData - Updated payment data
   * @returns {Promise<Object>} Response
   * 
   * Usage: In PaymentMethods.jsx (edit modal)
   * const response = await SellerAuthService.updatePaymentMethod('123', {
   *   account_name: 'Updated Name',
   *   account_number: 'Updated Number'
   * });
   */
  async updatePaymentMethod(id, paymentData) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.updatePaymentMethod.initiate({ id, ...paymentData })
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Payment method updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to update payment method');
    }
  }

  /**
   * Delete payment method
   * @param {string} id - Payment method ID
   * @returns {Promise<Object>} Response
   * 
   * Usage: In PaymentMethods.jsx (delete confirmation)
   * const response = await SellerAuthService.deletePaymentMethod('123');
   */
  async deletePaymentMethod(id) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.deletePaymentMethod.initiate(id)
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Payment method deleted successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to delete payment method');
    }
  }

  /**
   * Set default payment method
   * @param {string} id - Payment method ID
   * @returns {Promise<Object>} Response
   * 
   * Usage: In PaymentMethods.jsx
   * const response = await SellerAuthService.setDefaultPaymentMethod('123');
   */
  async setDefaultPaymentMethod(id) {
    try {
      const result = await store.dispatch(
        sellerAuthApi.endpoints.setDefaultPaymentMethod.initiate(id)
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Default payment method updated'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to set default payment method');
    }
  }

  /**
   * Check if user is authenticated as seller
   * @returns {boolean} Authentication status
   * 
   * Usage: In any component, guard
   * if (SellerAuthService.isAuthenticated()) {
   *   // User is logged in as seller
   * }
   */
  isAuthenticated() {
    const state = store.getState().auth;
    return state.isAuthenticated && state.role === 'seller';
  }

  /**
   * Get current seller user data
   * @returns {Object|null} User data or null
   * 
   * Usage: In any component
   * const seller = SellerAuthService.getCurrentUser();
   * console.log(seller.seller_id, seller.email);
   */
  getCurrentUser() {
    const state = store.getState().auth;
    return state.role === 'seller' ? state.user : null;
  }

  /**
   * Get current authentication token
   * @returns {string|null} Token or null
   * 
   * Usage: In API calls, guards
   * const token = SellerAuthService.getToken();
   */
  getToken() {
    const state = store.getState().auth;
    return state.role === 'seller' ? state.token : null;
  }

  /**
   * Get current profile status from Redux
   * @returns {Object|null} Profile status or null
   * 
   * Usage: In components, guards
   * const status = SellerAuthService.getProfileStatusFromState();
   * if (status.is_approved) {
   *   // Seller is approved
   * }
   */
  getProfileStatusFromState() {
    const state = store.getState().auth;
    return state.role === 'seller' ? state.profileStatus : null;
  }

  /**
   * Check if seller profile is complete
   * @returns {boolean} Profile completion status
   * 
   * Usage: In guards, components
   * if (SellerAuthService.isProfileComplete()) {
   *   // Allow access to certain features
   * }
   */
  isProfileComplete() {
    const status = this.getProfileStatusFromState();
    return status?.is_profile_complete || false;
  }

  /**
   * Check if seller is approved
   * @returns {boolean} Approval status
   * 
   * Usage: In guards, components
   * if (SellerAuthService.isApproved()) {
   *   // Seller can sell products
   * }
   */
  isApproved() {
    const status = this.getProfileStatusFromState();
    return status?.is_approved || false;
  }

  /**
   * Check if seller can add products
   * @returns {boolean} Permission status
   * 
   * Usage: In SellerProducts.jsx
   * if (SellerAuthService.canAddProducts()) {
   *   // Show "Add Product" button
   * }
   */
  canAddProducts() {
    const status = this.getProfileStatusFromState();
    return status?.can_add_products || false;
  }

  /**
   * Refresh user session
   * @returns {Promise<boolean>} Session validity
   * 
   * Usage: In App.jsx or SellerGuard.jsx on mount
   * const isValid = await SellerAuthService.refreshSession();
   */
  async refreshSession() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }

      // Get updated profile status
      const statusResponse = await this.getProfileStatus();
      
      if (!statusResponse.success) {
        return false;
      }

      return true;
    } catch (error) {
      this.clearAuthentication();
      return false;
    }
  }

  /**
   * Validate session on app start
   * @returns {Promise<boolean>} Whether session is valid
   * 
   * Usage: In App.jsx useEffect
   * useEffect(() => {
   *   SellerAuthService.validateSession();
   * }, []);
   */
  async validateSession() {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (!token || !userData) {
        this.clearAuthentication();
        return false;
      }

      const user = JSON.parse(userData);

      // Only validate if it's a seller
      if (user.userType !== 'seller') {
        return false;
      }

      // Check if token is still valid
      return await this.refreshSession();
    } catch (error) {
      this.clearAuthentication();
      return false;
    }
  }

  // ==========================================
  // HELPER METHODS (Private)
  // ==========================================

  /**
   * Determine redirect path based on profile status
   * @private
   */
  async determineRedirectAfterLogin(profileStatus) {
    if (!profileStatus) {
      return '/seller/account';
    }

    // Check approval status first - this is the most important check
    if (!profileStatus.is_approved) {
      if (profileStatus.approval_status === 'rejected') {
        return '/seller/account-rejected';
      }
      // If not approved and not rejected, they're pending
      return '/seller/pending-approval';
    }

    // Check profile completion
    if (!profileStatus.is_profile_complete) {
      if (!profileStatus.has_business_info || !profileStatus.has_address) {
        return '/seller/complete-profile';
      }
    }

    // Check payment method
    if (!profileStatus.has_payment_method) {
      return '/seller/add-payment';
    }

    // All checks passed - redirect to account page
    return '/seller/account';
  }

  /**
   * Store authentication data
   * @private
   */
  storeAuthentication(token, user, rememberMe = false) {
    // Ensure user has seller type and role
    const sellerUser = {
      ...user,
      userType: 'seller',
      role: 'seller'
    };

    console.log('[SellerAuthService] Storing user:', sellerUser);

    // Dispatch to Redux
    store.dispatch(setCredentials({
      token,
      user: sellerUser,
      rememberMe
    }));

    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(sellerUser));
    
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    }
  }
    /** 
    * Clear all authentication data
     * @private
     */
      /**
     * Clear authentication - UPDATED
     */
    clearAuthentication() {
      store.dispatch(clearAuth());
  
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token'); // ADD THIS
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');
    }

  /**
   * Handle and format errors
   * @private
   */
  handleError(error, defaultMessage) {
    const errorMessage = 
      error?.data?.message || 
      error?.message || 
      defaultMessage;

    // Dispatch error to Redux
    store.dispatch(setAuthError(errorMessage));

    return {
      success: false,
      error: errorMessage,
      message: errorMessage
    };
  }
  /**
     * Store authentication with refresh token
     * @private
     */
    storeAuthentication(token, refreshToken, user, rememberMe) {
      store.dispatch(setCredentials({
        token,
        refresh_token: refreshToken, // ADD THIS
        user: { ...user, userType: 'seller' },
        rememberMe
      }));
  
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken); // ADD THIS
      localStorage.setItem('user_data', JSON.stringify({ ...user, userType: 'seller' }));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    }
}

// Export singleton instance
export default new SellerAuthService();