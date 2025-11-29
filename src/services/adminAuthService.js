import { adminAuthApi } from '@/features/auth/adminAuthApi';

class AdminAuthService {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  /**
   * Validate invitation token
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} Validation result
   */
  async validateInvitation(token) {
    try {
      const response = await this.dispatch(
        adminAuthApi.endpoints.validateInvitation.initiate(token)
      ).unwrap();

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Invitation validation error:', error);
      
      return {
        success: false,
        error: error.data?.message || error.message || 'Invalid or expired invitation token',
      };
    }
  }

  /**
   * Register new admin with invitation token
   * @param {Object} registrationData
   * @returns {Promise<Object>} Registration result
   */
  async register(registrationData) {
    try {
      const response = await this.dispatch(
        adminAuthApi.endpoints.registerAdmin.initiate(registrationData)
      ).unwrap();

      // Check if response includes auth tokens
      if (response.token && response.user) {
        // Store tokens and user data
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('refresh_token', response.refresh_token || '');
        localStorage.setItem('user_data', JSON.stringify(response.user));

        return {
          success: true,
          user: response.user,
          token: response.token,
          autoLogin: true,
          message: 'Registration successful',
        };
      }

      // Registration successful but no auto-login
      return {
        success: true,
        user: response,
        autoLogin: false,
        message: 'Registration successful. Please login to continue.',
      };
    } catch (error) {
      console.error('Admin registration error:', error);
      
      return {
        success: false,
        error: error.data?.message || error.message || 'Registration failed. Please try again.',
      };
    }
  }

  /**
   * Admin login with email and password
   * @param {Object} credentials - { email, password, rememberMe }
   * @returns {Promise<Object>} Login response with token and user data
   */
  async login(credentials) {
    try {
      const response = await this.dispatch(
        adminAuthApi.endpoints.adminLogin.initiate({
          email: credentials.email,
          password: credentials.password,
        })
      ).unwrap();

      // Handle backend response structure: access_token, refresh_token, user_type, first_name, last_name, email, roles
      const token = response.access_token;
      const refreshToken = response.refresh_token;
      
      if (!token || !refreshToken) {
        throw new Error('Invalid response format');
      }

      // Construct user object from response
      const user = {
        id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        userType: response.user_type || 'admin',
        roles: response.roles || ['admin'],
      };
      
      // Store access token
      localStorage.setItem('auth_token', token);
      
      // Store refresh token (respect rememberMe preference)
      if (credentials.rememberMe) {
        localStorage.setItem('refresh_token', refreshToken);
      } else {
        sessionStorage.setItem('refresh_token', refreshToken);
      }
      
      // Store user data
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return {
        success: true,
        user,
        token,
        refresh_token: refreshToken,
        access_token: token,
        user_id: response.user_id,
        email: response.email,
        first_name: response.first_name,
        last_name: response.last_name,
        user_type: response.user_type,
        roles: response.roles,
        message: 'Login successful',
      };
    } catch (error) {
      console.error('Admin login error:', error);
      
      return {
        success: false,
        error: error.data?.message || error.message || 'Login failed. Please try again.',
      };
    }
  }

  /**
   * Admin logout
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      await this.dispatch(
        adminAuthApi.endpoints.adminLogout.initiate()
      ).unwrap();

      this.clearStoredData();

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      console.error('Admin logout error:', error);
      
      // Clear data even if API call fails
      this.clearStoredData();
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    }
  }

  /**
   * Refresh admin access token
   * @returns {Promise<Object>} New access token
   */
  async refreshToken() {
    try {
      const refreshToken = 
        localStorage.getItem('refresh_token') || 
        sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.dispatch(
        adminAuthApi.endpoints.refreshAdminToken.initiate(refreshToken)
      ).unwrap();

      // Handle both nested and flat response structures
      const accessToken = response.access_token || response.data?.access_token;
      const newRefreshToken = response.refresh_token || response.data?.refresh_token;

      if (!accessToken) {
        throw new Error('Invalid refresh response');
      }

      localStorage.setItem('auth_token', accessToken);
      
      if (newRefreshToken) {
        const storedInLocal = localStorage.getItem('refresh_token');
        if (storedInLocal) {
          localStorage.setItem('refresh_token', newRefreshToken);
        } else {
          sessionStorage.setItem('refresh_token', newRefreshToken);
        }
      }
      
      return {
        success: true,
        token: accessToken,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      
      this.clearStoredData();
      
      return {
        success: false,
        error: 'Session expired. Please login again.',
      };
    }
  }

  /**
   * Get stored admin user data
   * @returns {Object|null} Admin user data
   */
  getStoredUser() {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Get stored access token
   * @returns {string|null} Access token
   */
  getStoredToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get stored refresh token
   * @returns {string|null} Refresh token
   */
  getStoredRefreshToken() {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  }

  /**
   * Check if admin is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user && user.userType === 'admin');
  }

  /**
   * Clear all stored authentication data
   */
  clearStoredData() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('refresh_token');
  }

  /**
   * Verify admin session with backend
   * @returns {Promise<Object>} Verification response
   */
  async verifySession() {
    try {
      const response = await this.dispatch(
        adminAuthApi.endpoints.verifyAdminSession.initiate()
      ).unwrap();

      return {
        success: true,
        valid: response.data?.valid || false,
      };
    } catch (error) {
      return {
        success: false,
        valid: false,
      };
    }
  }
}

export default AdminAuthService;