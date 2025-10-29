// src/features/auth/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../../utils/constants';

/**
 * Initial authentication state
 * Checks localStorage for existing auth data on initialization
 */
const initialState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_DATA)) || null,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  isLoading: false,
  error: null,
};

/**
 * Authentication slice
 * Manages user authentication state, login/logout actions
 * 
 * This slice handles local state only. API calls are handled by authApi.js
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set credentials after successful login
     * Stores token and user data in localStorage and state
     */
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    },
    
    /**
     * Update user profile information
     */
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
    },
    
    /**
     * Clear credentials and logout user
     * Removes all auth data from state and localStorage
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    
    /**
     * Set authentication error
     */
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    /**
     * Set loading state
     */
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    /**
     * Clear authentication error
     */
    clearAuthError: (state) => {
      state.error = null;
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
} = authSlice.actions;

// Export selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;

// Export reducer
export default authSlice.reducer;