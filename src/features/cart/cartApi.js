// src/features/cart/cartApi.js - FIXED TO HANDLE PLAIN TEXT ERRORS
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Custom base query that handles both JSON and plain text responses
const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  validateStatus: (response) => response.status >= 200 && response.status < 300,
});

// Wrapper to handle plain text errors
const baseQueryWithTextErrorHandling = async (args, api, extraOptions) => {
  const result = await customBaseQuery(args, api, extraOptions);
  
  if (result.error && typeof result.error.data === 'string') {
    return {
      error: {
        status: result.error.status,
        data: { message: result.error.data.trim() }
      }
    };
  }
  
  return result;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: baseQueryWithTextErrorHandling,
  tagTypes: ['Cart', 'CartCount'],
  endpoints: (builder) => ({
    // ADD TO CART - POST /api/cart
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart', 'CartCount'],
      transformErrorResponse: (response) => {
        if (typeof response.data === 'string') {
          return { message: response.data.trim() };
        }
        return response.data;
      },
    }),

    // GET CART - GET /api/cart
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
      transformResponse: (response) => {
        return response?.data ? response : { data: response };
      },
    }),

    // GET CART SUMMARY - GET /api/cart/summary
    getCartSummary: builder.query({
      query: () => '/cart/summary',
      providesTags: ['Cart'],
      transformResponse: (response) => {
        return response?.data ? response : { data: response };
      },
    }),

    // GET CART COUNT - GET /api/cart/count
    getCartCount: builder.query({
      query: () => '/cart/count',
      providesTags: ['CartCount'],
      transformResponse: (response) => {
        if (response?.count !== undefined) return response;
        if (response?.data?.count !== undefined) return response.data;
        return { count: 0 };
      },
    }),

    // UPDATE CART ITEM - PUT /api/cart/{productId}
    updateCartItem: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/cart/${productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // REMOVE FROM CART - DELETE /api/cart/{productId}
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart', 'CartCount'],
      transformErrorResponse: (response) => {
        if (typeof response.data === 'string') {
          return { message: response.data.trim() };
        }
        return response.data;
      },
    }),

    // CLEAR CART - DELETE /api/cart
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // INCREMENT QUANTITY - POST /api/cart/{productId}/increment
    incrementQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/increment`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // DECREMENT QUANTITY - POST /api/cart/{productId}/decrement
    decrementQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/decrement`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // BULK UPDATE CART - POST /api/cart/bulk-update
    bulkUpdateCart: builder.mutation({
      query: (data) => ({
        url: '/cart/bulk-update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // SAVE FOR LATER - POST /api/cart/{productId}/save-later
    saveForLater: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/save-later`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // GET SAVED FOR LATER - GET /api/cart/saved-for-later
    getSavedForLater: builder.query({
      query: () => '/cart/saved-for-later',
      providesTags: ['Cart'],
    }),

    // MOVE TO CART (from saved) - POST /api/cart/{productId}/move-to-cart
    moveToCartFromSaved: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/move-to-cart`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart', 'CartCount'],
    }),

    // VALIDATE CART - GET /api/cart/validate
    validateCart: builder.query({
      query: () => '/cart/validate',
      providesTags: ['Cart'],
    }),

    // GET CART TOTAL - GET /api/cart/total
    getCartTotal: builder.query({
      query: () => '/cart/total',
      providesTags: ['Cart'],
    }),

    // MOVE CART ITEM TO WISHLIST - POST /api/cart/{productId}/move-to-wishlist
    moveCartItemToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/move-to-wishlist`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart', 'CartCount', 'Wishlist'],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useGetCartSummaryQuery,
  useGetCartCountQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useIncrementQuantityMutation,
  useDecrementQuantityMutation,
  useBulkUpdateCartMutation,
  useSaveForLaterMutation,
  useGetSavedForLaterQuery,
  useMoveToCartFromSavedMutation,
  useValidateCartQuery,
  useGetCartTotalQuery,
  useMoveCartItemToWishlistMutation,
} = cartApi;