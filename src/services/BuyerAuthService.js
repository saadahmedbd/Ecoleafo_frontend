// ==========================================
// BUYER AUTHENTICATION SERVICE
// ==========================================
// Purpose: Centralized service for all buyer authentication operations
// Used in: Buyer login, signup, password reset, profile management
// Benefits: Separates business logic from UI components, reusable, testable
// ==========================================

import { store } from '../app/store';
import { setCredentials, clearAuth, setAuthError } from '../features/auth/authSlice';
import { buyerAuthApi } from '../features/auth/buyerAuthApi';

/**
 * Buyer Authentication Service
 * Provides high-level authentication methods for buyer operations
 */
class BuyerAuthService {
  /**
   * Register a new buyer account
   * @param {Object} credentials - Registration data
   * @returns {Promise<Object>} Registration response with token and user
   * 
   * Usage: In BuyerSignUp.jsx
   * const response = await BuyerAuthService.register({
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   email: 'john@example.com',
   *   password: 'password123'
   * });
   */
  async register(credentials) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.registerBuyer.initiate(credentials)
      ).unwrap();

      // Store with refresh token
      this.storeAuthentication(
        result.token, 
        result.refresh_token, // ADD THIS
        result.user, 
        false
      );

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
   * Login existing buyer
   * @param {Object} credentials - Login data (email, password, remember_me)
   * @returns {Promise<Object>} Login response
   * 
   * Usage: In BuyerLogin.jsx
   * const response = await BuyerAuthService.login({
   *   email: 'john@example.com',
   *   password: 'password123',
   *   remember_me: true
   * });
   */
   /**
   * Updated login method
   */
  async login(credentials) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.loginBuyer.initiate(credentials)
      ).unwrap();

      // Store with refresh token
      this.storeAuthentication(
        result.token,
        result.refresh_token, // ADD THIS
        result.user,
        credentials.remember_me || false
      );

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
   * Logout current buyer
   * @returns {Promise<Object>} Logout response
   * 
   * Usage: In BuyerDashboard.jsx, Header.jsx, Profile.jsx
   * await BuyerAuthService.logout();
   */
  async logout() {
    try {
      await store.dispatch(
        buyerAuthApi.endpoints.logoutBuyer.initiate()
      ).unwrap();

      // Clear authentication data
      this.clearAuthentication();

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Even if API fails, clear local data
      this.clearAuthentication();
      return {
        success: true,
        message: 'Logged out'
      };
    }
  }

  /**
   * Request password reset
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Response
   * 
   * Usage: In BuyerForgotPassword.jsx
   * const response = await BuyerAuthService.requestPasswordReset('john@example.com');
   */
  async requestPasswordReset(email) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.forgotPassword.initiate({ email })
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return this.handleError(error, 'Failed to send reset email');
    }
  }

  /**
   * Reset password with token
   * @param {Object} data - Reset data (token, new_password)
   * @returns {Promise<Object>} Response
   * 
   * Usage: In ResetPassword.jsx (when user clicks email link)
   * const response = await BuyerAuthService.resetPassword({
   *   token: 'reset_token_from_email',
   *   new_password: 'newpassword123',
   *   confirm_password: 'newpassword123'
   * });
   */
  async resetPassword(data) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.resetPassword.initiate(data)
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Password reset successful'
      };
    } catch (error) {
      return this.handleError(error, 'Password reset failed');
    }
  }

  /**
   * Update buyer profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Response
   * 
   * Usage: In BuyerProfile.jsx
   * const response = await BuyerAuthService.updateProfile({
   *   first_name: 'John',
   *   last_name: 'Doe',
   *   phone: '+8801712345678'
   * });
   */
  async updateProfile(profileData) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.updateProfile.initiate(profileData)
      ).unwrap();

      // Update user data in Redux and localStorage
      const currentAuth = store.getState().auth;
      const updatedUser = { ...currentAuth.user, ...result.user };
      
      this.storeAuthentication(
        currentAuth.token,
        updatedUser,
        currentAuth.rememberMe
      );

      return {
        success: true,
        data: result,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Profile update failed');
    }
  }

  /**
   * Change buyer password
   * @param {Object} passwordData - Old and new passwords
   * @returns {Promise<Object>} Response
   * 
   * Usage: In BuyerProfile.jsx (Change Password section)
   * const response = await BuyerAuthService.changePassword({
   *   old_password: 'oldpass123',
   *   new_password: 'newpass123',
   *   confirm_password: 'newpass123'
   * });
   */
  async changePassword(passwordData) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.changePassword.initiate(passwordData)
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Password changed successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Password change failed');
    }
  }

  /**
   * Verify email with token
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Response
   * 
   * Usage: In EmailVerification.jsx (when user clicks verification link)
   * const response = await BuyerAuthService.verifyEmail(token);
   */
  async verifyEmail(token) {
    try {
      const result = await store.dispatch(
        buyerAuthApi.endpoints.verifyEmail.initiate({ token })
      ).unwrap();

      return {
        success: true,
        data: result,
        message: 'Email verified successfully'
      };
    } catch (error) {
      return this.handleError(error, 'Email verification failed');
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   * 
   * Usage: In any component
   * if (BuyerAuthService.isAuthenticated()) {
   *   // User is logged in
   * }
   */
  isAuthenticated() {
    const state = store.getState().auth;
    return state.isAuthenticated && state.role === 'buyer';
  }

  /**
   * Get current buyer user data
   * @returns {Object|null} User data or null
   * 
   * Usage: In any component
   * const user = BuyerAuthService.getCurrentUser();
   * console.log(user.first_name, user.email);
   */
  getCurrentUser() {
    const state = store.getState().auth;
    return state.role === 'buyer' ? state.user : null;
  }

  /**
   * Get current authentication token
   * @returns {string|null} Token or null
   * 
   * Usage: In API calls, guards
   * const token = BuyerAuthService.getToken();
   */
  getToken() {
    const state = store.getState().auth;
    return state.role === 'buyer' ? state.token : null;
  }

  /**
   * Refresh user session (check if still valid)
   * @returns {Promise<boolean>} Session validity
   * 
   * Usage: In App.jsx or AuthGuard.jsx on mount
   * const isValid = await BuyerAuthService.refreshSession();
   */
  async refreshSession() {
    try {
      const token = this.getToken();
      
      if (!token) {
        return false;
      }

      // Verify token is still valid by making a profile request
      const result = await store.dispatch(
        buyerAuthApi.endpoints.getProfile.initiate()
      ).unwrap();

      // Update user data if token is valid
      const currentAuth = store.getState().auth;
      this.storeAuthentication(token, result.user, currentAuth.rememberMe);

      return true;
    } catch (error) {
      // Token expired or invalid
      this.clearAuthentication();
      return false;
    }
  }

  // ==========================================
  // HELPER METHODS (Private)
  // ==========================================

  /**
   * Store authentication data in Redux and localStorage
   * @private
   */
  storeAuthentication(token, user, rememberMe) {
    // Dispatch to Redux
    store.dispatch(setCredentials({
      token,
      user: { ...user, userType: 'buyer' },
      rememberMe
    }));

    // Store in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify({ ...user, userType: 'buyer' }));
    
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

    // Dispatch error to Redux if needed
    store.dispatch(setAuthError(errorMessage));

    return {
      success: false,
      error: errorMessage,
      message: errorMessage
    };
  }

  /**
   * Validate session on app start
   * @returns {Promise<boolean>} Whether session is valid
   * 
   * Usage: In App.jsx useEffect
   * useEffect(() => {
   *   BuyerAuthService.validateSession();
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

      // Only validate if it's a buyer
      if (user.userType !== 'buyer') {
        return false;
      }

      // Check if token is still valid
      return await this.refreshSession();
    } catch (error) {
      this.clearAuthentication();
      return false;
    }
  }
  /**
   * Store authentication with refresh token
   * @private
   */
  storeAuthentication(token, refreshToken, user, rememberMe) {
    store.dispatch(setCredentials({
      token,
      refresh_token: refreshToken, // ADD THIS
      user: { ...user, userType: 'buyer' },
      rememberMe
    }));

    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken); // ADD THIS
    localStorage.setItem('user_data', JSON.stringify({ ...user, userType: 'buyer' }));
    
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
    }
  }
  
  

}

// Export singleton instance
export default new BuyerAuthService();