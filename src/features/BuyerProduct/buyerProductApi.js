// src/features/products/productsApi.js - COMPLETE PRODUCT API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const buyerProductApi = createApi({
  reducerPath: 'buyerProductApi',
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
  tagTypes: ['Products', 'Product', 'Categories', 'Reviews'],
  endpoints: (builder) => ({
    // Get all products with filters
    getProducts: builder.query({
      query: ({ page = 1, limit = 20, category, min_price, max_price, sort } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (category) params.append('category', category);
        if (min_price) params.append('min_price', min_price);
        if (max_price) params.append('max_price', max_price);
        if (sort) params.append('sort', sort);
        return `/products?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Products', id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),

    // Search products
    searchProducts: builder.query({
      query: ({ q, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        params.append('q', q);
        params.append('page', page);
        params.append('limit', limit);
        return `/products/search?${params.toString()}`;
      },
      providesTags: [{ type: 'Products', id: 'SEARCH' }],
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get product by slug (use ID from route params)
    getProductBySlug: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // Get seller's public products
    getSellerProducts: builder.query({
      query: ({ sellerId, page = 1, limit = 20 }) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        return `/seller/${sellerId}/products?${params.toString()}`;
      },
      providesTags: (result, error, { sellerId }) => [
        { type: 'Products', id: `SELLER_${sellerId}` },
      ],
    }),

    // Get product reviews
    getProductReviews: builder.query({
      query: ({ product_id, page = 1, limit = 10, sort = 'recent' }) => {
        const params = new URLSearchParams();
        params.append('product_id', product_id);
        params.append('page', page);
        params.append('limit', limit);
        params.append('sort', sort);
        return `/reviews/product?${params.toString()}`;
      },
      providesTags: (result, error, { product_id }) => [
        { type: 'Reviews', id: product_id },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetSellerProductsQuery,
  useGetProductReviewsQuery,
} = buyerProductApi;

