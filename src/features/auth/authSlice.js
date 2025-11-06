// ==========================================
// UNIFIED AUTHENTICATION SLICE
// ==========================================
// Purpose: Manages authentication state for buyers, sellers, and admins
// Handles: Login/logout, token management, user roles, profile completion status
// ==========================================

import { createSlice } from '@reduxjs/toolkit';
import { buyerAuthApi } from './buyerAuthApi';
import { sellerAuthApi } from './sellerAuthApi';

/**
 * Load initial state from localStorage
 */

const loadInitialState = () => {
  try {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    const rememberMe = localStorage.getItem('remember_me') === 'true';

    if (token && userData) {
      const user = JSON.parse(userData);
      return {
        isAuthenticated: true,
        token,
        user,
        role: user?.userType || user?.role || null,
        rememberMe,
        isLoading: false,
        error: null,
        profileStatus: null,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  return {
    isAuthenticated: false,
    token: null,
    user: null,
    role: null,
    rememberMe: false,
    isLoading: false,
    error: null,
    profileStatus: null,
  };
};


/**
 * Authentication Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  
  reducers: {
    /**
     * Set credentials manually (for custom login flows)
     */
    setCredentials: (state, action) => {
      const { token, user, rememberMe } = action.payload;
      
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.role = user.userType || user.role || user.user_type;
      state.rememberMe = rememberMe || false;
      state.error = null;

      // Persist to localStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }
    },

    /**
     * Update profile completion status (for sellers)
     */
    setProfileStatus: (state, action) => {
      state.profileStatus = action.payload;
    },

    /**
     * Clear all authentication data
     */
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.role = null;
      state.rememberMe = false;
      state.error = null;
      state.profileStatus = null;

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('remember_me');
    },

    /**
     * Set authentication error
     */
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear authentication error
     */
    clearAuthError: (state) => {
      state.error = null;
    },

    /**
     * Set loading state
     */
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ==========================================
    // BUYER AUTHENTICATION
    // ==========================================
    
    // Buyer Registration
    builder.addMatcher(
      buyerAuthApi.endpoints.register.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      buyerAuthApi.endpoints.register.matchFulfilled,
      (state, action) => {
        const { token, user } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        state.role = 'buyer';
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );
    builder.addMatcher(
      buyerAuthApi.endpoints.register.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message || 'Registration failed';
      }
    );

    // Buyer Login
    builder.addMatcher(
      buyerAuthApi.endpoints.login.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      buyerAuthApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { token, user, rememberMe } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        state.role = 'buyer';
        state.rememberMe = rememberMe || false;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        }
      }
    );
    builder.addMatcher(
      buyerAuthApi.endpoints.login.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message || 'Login failed';
      }
    );

    // ==========================================
    // SELLER AUTHENTICATION
    // ==========================================
    
    // Seller Registration
    builder.addMatcher(
      sellerAuthApi.endpoints.registerSeller.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerAuthApi.endpoints.registerSeller.matchFulfilled,
      (state, action) => {
        const { token, user_id, seller_id, profile_status } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.user = {
          id: user_id,
          seller_id: seller_id,
          userType: 'seller',
        };
        state.role = 'seller';
        state.profileStatus = profile_status;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(state.user));
      }
    );
    builder.addMatcher(
      sellerAuthApi.endpoints.registerSeller.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message || 'Registration failed';
      }
    );

    // Seller Login
    builder.addMatcher(
      sellerAuthApi.endpoints.loginSeller.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      sellerAuthApi.endpoints.loginSeller.matchFulfilled,
      (state, action) => {
        const { token, user, profile_status } = action.payload;
        
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;
        state.role = 'seller';
        state.profileStatus = profile_status;
        state.isLoading = false;
        state.error = null;

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
    );
    builder.addMatcher(
      sellerAuthApi.endpoints.loginSeller.matchRejected,
      (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error.message || 'Login failed';
      }
    );

    // Profile Status Query
    builder.addMatcher(
      sellerAuthApi.endpoints.getProfileStatus.matchFulfilled,
      (state, action) => {
        state.profileStatus = action.payload;
      }
    );

    // Profile Completion
    builder.addMatcher(
      sellerAuthApi.endpoints.completeProfile.matchFulfilled,
      (state, action) => {
        // Update profile status after completion
        if (action.payload.profile_status) {
          state.profileStatus = action.payload.profile_status;
        }
      }
    );

    // Payment Method Addition
    builder.addMatcher(
      sellerAuthApi.endpoints.addPaymentMethod.matchFulfilled,
      (state) => {
        // Mark payment method as added
        if (state.profileStatus) {
          state.profileStatus.has_payment_method = true;
        }
      }
    );
     /**
     * Update token (for refresh flow)
     */
    updateToken: (state, action) => {
      state.token = action.payload; // payload = new access token
      localStorage.setItem('auth_token', action.payload);
    },
    /**
     * Logout user manually
     */
    logout; (state) => {
    // call clearAuth logic internally
    state.isAuthenticated = false;
    state.token = null;
    state.user = null;
    state.role = null;
    state.rememberMe = false;
    state.error = null;
    state.profileStatus = null;

    // also clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('remember_me');
  },



    // Logout (both buyer and seller)
    builder.addMatcher(
      (action) => 
        action.type === buyerAuthApi.endpoints.logout.matchFulfilled.type ||
        action.type === sellerAuthApi.endpoints.logoutSeller.matchFulfilled.type,
      (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.role = null;
        state.rememberMe = false;
        state.error = null;
        state.profileStatus = null;

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('remember_me');
      }
    );
  },
});

// Export actions
export const {
  setCredentials,
  setProfileStatus,
  clearAuth,
  setAuthError,
  logout,
  updateToken,
  clearAuthError,
  setAuthLoading,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectUserRole = (state) => state.auth.role;
export const selectProfileStatus = (state) => state.auth.profileStatus;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectCurrentUser = (state) => state.auth.user;


// Export reducer
export default authSlice.reducer;