
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const wishlistApi = createApi({
  reducerPath: 'wishlistApi',
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
  tagTypes: ['Wishlist', 'Cart'],
  endpoints: (builder) => ({
    // 13. ADD TO WISHLIST - POST /api/wishlist
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wishlist'],
    }),

    // 14. GET WISHLIST - GET /api/wishlist
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),

    // 16. MOVE WISHLIST ITEM TO CART - POST /api/wishlist/{productId}/move-to-cart
    moveWishlistItemToCart: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}/move-to-cart`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist', 'Cart'],
    }),

    // 17. REMOVE FROM WISHLIST - DELETE /api/wishlist/{productId}
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useMoveWishlistItemToCartMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
