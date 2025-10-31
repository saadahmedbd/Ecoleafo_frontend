// ==========================================
// SELLER AUTHENTICATION API SLICE
// ==========================================
// Purpose: RTK Query API slice for all seller authentication operations
// Endpoints: register, login, profile completion, payment methods, profile status
// Base URL: http://localhost:3000/api
// ==========================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base query configuration with automatic token injection
 */
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux state or localStorage
    const token = getState().auth.token || localStorage.getItem('auth_token');
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/**
 * Base query wrapper with error transformation
 */
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  
  // Transform backend errors to user-friendly messages
  if (result.error) {
    const { status, data } = result.error;
    
    // Handle common HTTP errors
    if (status === 401) {
      result.error.data = { message: 'Authentication failed. Please login again.' };
    } else if (status === 403) {
      result.error.data = { message: 'You do not have permission to perform this action.' };
    } else if (status === 404) {
      result.error.data = { message: 'Resource not found.' };
    } else if (status === 500) {
      result.error.data = { message: 'Server error. Please try again later.' };
    } else if (data?.message) {
      // Use backend error message if available
      result.error.data = { message: data.message };
    }
  }
  
  return result;
};

/**
 * Seller Authentication API
 */
export const sellerAuthApi = createApi({
  reducerPath: 'sellerAuthApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ['SellerProfile', 'PaymentMethods', 'ProfileStatus'],
  
  endpoints: (builder) => ({
    /**
     * Register new seller account (Step 1 - Account Creation)
     * POST /api/seller/register
     */
    registerSeller: builder.mutation({
      query: (credentials) => ({
        url: '/seller/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['SellerProfile', 'ProfileStatus'],
      transformResponse: (response) => {
        // Store token immediately after registration
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        return response;
      },
    }),

    /**
     * Login existing seller
     * POST /api/seller/login
     */
    loginSeller: builder.mutation({
      query: (credentials) => ({
        url: '/seller/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['SellerProfile', 'ProfileStatus'],
      transformResponse: (response) => {
        // Store token and user data
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        return response;
      },
    }),

    /**
     * Get seller profile completion status
     * GET /api/seller/profile/status
     */
    getProfileStatus: builder.query({
      query: () => '/seller/profile/status',
      providesTags: ['ProfileStatus'],
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || 'Failed to fetch profile status',
        };
      },
    }),

    /**
     * Complete seller business profile (Step 2 & 3 combined)
     * POST /api/seller/profile/complete
     */
    completeProfile: builder.mutation({
      query: (profileData) => ({
        url: '/seller/profile/complete',
        method: 'POST',
        body: profileData,
      }),
      invalidatesTags: ['SellerProfile', 'ProfileStatus'],
    }),

    /**
     * Get full seller profile
     * GET /api/seller/profile
     */
    getProfile: builder.query({
      query: () => '/seller/profile',
      providesTags: ['SellerProfile'],
    }),

    /**
     * Update store information
     * PUT /api/seller/store
     */
    updateStore: builder.mutation({
      query: (storeData) => ({
        url: '/seller/store',
        method: 'PUT',
        body: storeData,
      }),
      invalidatesTags: ['SellerProfile'],
    }),

    /**
     * Get all payment methods
     * GET /api/seller/payment-methods
     */
    getPaymentMethods: builder.query({
      query: () => '/seller/payment-methods',
      providesTags: ['PaymentMethods'],
    }),

    /**
     * Add new payment method (Step 4)
     * POST /api/seller/payment-methods
     */
    addPaymentMethod: builder.mutation({
      query: (paymentData) => ({
        url: '/seller/payment-methods',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: ['PaymentMethods', 'ProfileStatus'],
    }),

    /**
     * Update existing payment method
     * PUT /api/seller/payment-methods/:id
     */
    updatePaymentMethod: builder.mutation({
      query: ({ id, ...paymentData }) => ({
        url: `/seller/payment-methods/${id}`,
        method: 'PUT',
        body: paymentData,
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    /**
     * Delete payment method
     * DELETE /api/seller/payment-methods/:id
     */
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/seller/payment-methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PaymentMethods', 'ProfileStatus'],
    }),

    /**
     * Set default payment method
     * PUT /api/seller/payment-methods/:id/set-default
     */
    setDefaultPaymentMethod: builder.mutation({
      query: (id) => ({
        url: `/seller/payment-methods/${id}/set-default`,
        method: 'PUT',
      }),
      invalidatesTags: ['PaymentMethods'],
    }),

    /**
     * Logout seller (client-side only, clears local storage)
     */
    logoutSeller: builder.mutation({
      queryFn: () => {
        // Clear all auth-related data from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('remember_me');
        
        return { data: { success: true } };
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useRegisterSellerMutation,
  useLoginSellerMutation,
  useGetProfileStatusQuery,
  useCompleteProfileMutation,
  useGetProfileQuery,
  useUpdateStoreMutation,
  useGetPaymentMethodsQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useLogoutSellerMutation,
} = sellerAuthApi;