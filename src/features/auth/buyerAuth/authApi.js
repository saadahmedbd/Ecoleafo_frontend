// src/features/auth/authApi.js

import { api } from '../../../services/api';
import { API_TAGS } from '../../../utils/constants';

/**
 * Authentication API endpoints
 * Handles login, register, logout, and profile operations
 * 
 * Uses RTK Query for automatic caching and state management
 */
export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login endpoint
     * POST /auth/login
     * 
     * @param {Object} credentials - { email: string, password: string }
     * @returns {Object} { user, token }
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [API_TAGS.AUTH],
      
      // Optional: Transform response before storing in cache
      transformResponse: (response) => {
        // Your Go backend might return data in a specific format
        // Adjust this based on your actual API response structure
        return {
          user: response.user || response.data?.user,
          token: response.token || response.data?.token,
        };
      },
    }),
    
    /**
     * Register endpoint
     * POST /auth/register
     * 
     * @param {Object} userData - { email, password, name, ... }
     * @returns {Object} { user, token }
     */
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [API_TAGS.AUTH],
      transformResponse: (response) => ({
        user: response.user || response.data?.user,
        token: response.token || response.data?.token,
      }),
    }),
    
    /**
     * Logout endpoint
     * POST /auth/logout
     */
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    
    /**
     * Get current user profile
     * GET /auth/me
     */
    getProfile: builder.query({
      query: () => '/auth/me',
      providesTags: [API_TAGS.AUTH],
      transformResponse: (response) => response.user || response.data?.user || response,
    }),
    
    /**
     * Update user profile
     * PUT /auth/profile
     * 
     * @param {Object} userData - Updated user data
     */
    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: [API_TAGS.AUTH],
      transformResponse: (response) => response.user || response.data?.user || response,
    }),
    
    /**
     * Change password
     * POST /auth/change-password
     * 
     * @param {Object} passwords - { currentPassword, newPassword }
     */
    changePassword: builder.mutation({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
    
    /**
     * Request password reset
     * POST /auth/forgot-password
     * 
     * @param {Object} data - { email }
     */
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    /**
     * Reset password with token
     * POST /auth/reset-password
     * 
     * @param {Object} data - { token, newPassword }
     */
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;