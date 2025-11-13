import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    // 1. ADD TO CART - POST /api/get/cart (Yes, it's POST to /get/cart)
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/get/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),

    // 2. GET CART - GET /api/cart
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    // 3. GET CART SUMMARY - GET /api/cart/summary
    getCartSummary: builder.query({
      query: () => '/cart/summary',
      providesTags: ['Cart'],
    }),

    // 4. UPDATE CART ITEM - PUT /api/cart/{productId}
    updateCartItem: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/cart/${productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),

    // 5. REMOVE FROM CART - DELETE /api/cart/{productId}
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 6. CLEAR CART - DELETE /api/cart
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 7. INCREMENT QUANTITY - POST /api/cart/{productId}/increment
    incrementQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/increment`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 8. DECREMENT QUANTITY - POST /api/cart/{productId}/decrement
    decrementQuantity: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/decrement`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 9. BULK UPDATE CART - POST /api/cart/bulk-update
    bulkUpdateCart: builder.mutation({
      query: (data) => ({
        url: '/cart/bulk-update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),

    // 10. SAVE FOR LATER - POST /api/cart/{productId}/save-later
    saveForLater: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/save-later`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 11. GET SAVED FOR LATER - GET /api/cart/saved-for-later
    getSavedForLater: builder.query({
      query: () => '/cart/saved-for-later',
      providesTags: ['Cart'],
    }),

    // 12. MOVE TO CART (from saved) - POST /api/cart/{productId}/move-to-cart
    moveToCartFromSaved: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/move-to-cart`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart'],
    }),

    // 18. VALIDATE CART - GET /api/cart/validate
    validateCart: builder.query({
      query: () => '/cart/validate',
      providesTags: ['Cart'],
    }),

    // 19. GET CART ITEM COUNT - GET /api/cart/count
    getCartCount: builder.query({
      query: () => '/cart/count',
      providesTags: ['Cart'],
    }),

    // 20. GET CART TOTAL - GET /api/cart/total
    getCartTotal: builder.query({
      query: () => '/cart/total',
      providesTags: ['Cart'],
    }),

    // 15. MOVE CART ITEM TO WISHLIST - POST /api/cart/{productId}/move-to-wishlist
    moveCartItemToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}/move-to-wishlist`,
        method: 'POST',
      }),
      invalidatesTags: ['Cart', 'Wishlist'],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useGetCartSummaryQuery,
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
  useGetCartCountQuery,
  useGetCartTotalQuery,
  useMoveCartItemToWishlistMutation,
} = cartApi;
