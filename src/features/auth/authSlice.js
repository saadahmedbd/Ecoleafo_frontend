// src/features/auth/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Initial authentication state
 * Checks localStorage for existing auth data on app load
 */
const getInitialState = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    if (token && userData) {
      return {
        user: JSON.parse(userData),
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

/**
 * Authentication Slice
 * Manages buyer authentication state and actions
 * 
 * State Structure:
 * {
 *   user: {
 *     userType: "buyer",
 *     firstName: string,
 *     lastName: string,
 *     email: string,
 *     roles: ["buyer"],
 *     fullName: string
 *   },
 *   token: string,
 *   isAuthenticated: boolean,
 *   isLoading: boolean,
 *   error: string | null
 * }
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    /**
     * Set credentials after successful login/registration
     * Stores token and user data in localStorage and state
     * 
     * @param {Object} payload - { user, token }
     */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      
      // Validate user type for buyer app
      if (user.userType !== 'buyer') {
        state.error = 'Invalid user type. This portal is for buyers only.';
        return;
      }
      
      // Update state
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
    
    /**
     * Update user profile information
     * Used when user updates their profile
     * 
     * @param {Object} payload - Partial user data to update
     */
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update full name if first or last name changed
        if (action.payload.firstName || action.payload.lastName) {
          state.user.fullName = `${state.user.firstName} ${state.user.lastName}`;
        }
        
        // Persist updated user data
        try {
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
        } catch (error) {
          console.error('Error updating localStorage:', error);
        }
      }
    },
    
    /**
     * Clear credentials and logout user
     * Removes all auth data from state and localStorage
     */
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      try {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        // Clear device preference on logout
        localStorage.removeItem('viewPreference');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
    
    /**
     * Set authentication error
     * Used for displaying error messages to users
     * 
     * @param {string} payload - Error message
     */
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    /**
     * Set loading state
     * Shows loading indicators during auth operations
     * 
     * @param {boolean} payload - Loading state
     */
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Clear authentication error
     * Removes error message from state
     */
    clearAuthError: (state) => {
      state.error = null;
    },
    
    /**
     * Update token
     * Used for token refresh functionality
     * 
     * @param {string} payload - New token
     */
    updateToken: (state, action) => {
      state.token = action.payload;
      
      try {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload);
      } catch (error) {
        console.error('Error updating token:', error);
      }
    },
  },
});

// Export actions
export const {
  setCredentials,
  updateUser,
  logout,
  setAuthError,
  setAuthLoading,
  clearAuthError,
  updateToken,
} = authSlice.actions;

// Selectors
/**
 * Select current user object
 * Returns null if not authenticated
 */
export const selectCurrentUser = (state) => state.auth.user;

/**
 * Select authentication status
 * Returns true if user is logged in
 */
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

/**
 * Select auth token
 * Returns null if not authenticated
 */
export const selectAuthToken = (state) => state.auth.token;

/**
 * Select authentication error
 * Returns null if no error
 */
export const selectAuthError = (state) => state.auth.error;

/**
 * Select loading state
 * Returns true during auth operations
 */
export const selectAuthLoading = (state) => state.auth.isLoading;

/**
 * Select user's full name
 * Returns empty string if not authenticated
 */
export const selectUserFullName = (state) => state.auth.user?.fullName || '';

/**
 * Select user's email
 * Returns empty string if not authenticated
 */
export const selectUserEmail = (state) => state.auth.user?.email || '';

/**
 * Select user's first name
 * Returns empty string if not authenticated
 */
export const selectUserFirstName = (state) => state.auth.user?.firstName || '';

/**
 * Check if user has specific role
 * 
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const selectHasRole = (role) => (state) => {
  return state.auth.user?.roles?.includes(role) || false;
};

// Export reducer
export default authSlice.reducer;