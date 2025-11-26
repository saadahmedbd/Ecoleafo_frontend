// src/features/wishlist/wishlistApi.js - COMPLETE WITH COUNT ENDPOINT
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
  tagTypes: ['Wishlist', 'WishlistCount', 'Cart'],
  endpoints: (builder) => ({
    // GET WISHLIST - GET /api/wishlist
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),

    // GET WISHLIST COUNT - GET /api/wishlist/count
    getWishlistCount: builder.query({
      query: () => '/wishlist/count',
      providesTags: ['WishlistCount'],
    }),

    // ADD TO WISHLIST - POST /api/wishlist
    addToWishlist: builder.mutation({
      query: (data) => ({
        url: '/wishlist',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Wishlist', 'WishlistCount'],
    }),

    // REMOVE FROM WISHLIST - DELETE /api/wishlist/{productId}
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist', 'WishlistCount'],
    }),

    // MOVE WISHLIST ITEM TO CART - POST /api/wishlist/{productId}/move-to-cart
    moveWishlistItemToCart: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}/move-to-cart`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist', 'WishlistCount', 'Cart'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useGetWishlistCountQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveWishlistItemToCartMutation,
} = wishlistApi;