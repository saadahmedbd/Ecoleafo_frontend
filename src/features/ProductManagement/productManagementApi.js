// src/features/product/productApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const productManagementApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Products', 'ProductStats'],
  endpoints: (builder) => ({
    // ============================================
    // GET ALL PRODUCTS (Admin - Paginated)
    // ============================================
    getAllProducts: builder.query({
      query: ({ page = 0, limit = 20 } = {}) => ({
        url: '/products',
        params: { offset: page * limit, per_page: limit },
      }),
      providesTags: ['Products'],
      transformResponse: (response) => {
        const data = response.data || [];
        const total = response.total || 0;
        const perPage = response.per_page || 20;
        return {
          data: data,
          pagination: {
            total: total,
            page: Math.floor((response.next_offset || 0) / perPage) - 1 || 0,
            limit: perPage,
            total_pages: Math.ceil(total / perPage)
          }
        };
      },
    }),

    // ============================================
    // GET PENDING PRODUCTS
    // ============================================
    getPendingProducts: builder.query({
      query: () => '/products/pending',
      providesTags: ['Products'],
      transformResponse: (response) => {
        return {
          products: response.data || [],
          total: response.total || 0
        };
      },
    }),

    // ============================================
    // SEARCH PRODUCTS
    // ============================================
    searchProducts: builder.query({
      query: ({ q, status = '' } = {}) => ({
        url: '/products/search',
        params: { q, status },
      }),
      providesTags: ['Products'],
      transformResponse: (response) => {
        return {
          products: response.data || [],
          total: response.total || 0
        };
      },
    }),

    // ============================================
    // GET PRODUCT STATISTICS
    // ============================================
    getProductStats: builder.query({
      query: () => '/products/stats',
      providesTags: ['ProductStats'],
      transformResponse: (response) => {
        // Backend returns: { status, data: { total_products, pending_products, ... } }
        return response.data || {};
      },
    }),

    // ============================================
    // GET PRODUCT BY ID
    // ============================================
    getProductById: builder.query({
      query: (id) => ({
        url: '/products/get',
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Products', id }],
      transformResponse: (response) => {
        // Backend returns: { data: { ...product } } or just { ...product }
        return response.data || response || null;
      },
    }),

    // ============================================
    // APPROVE PRODUCT
    // ============================================
    approveProduct: builder.mutation({
      query: ({ productId }) => ({
        url: '/products/approve',
        method: 'POST',
        params: { id: productId },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
      transformResponse: (response) => {
        return response.data || response;
      },
    }),

    // ============================================
    // REJECT PRODUCT
    // ============================================
    rejectProduct: builder.mutation({
      query: ({ productId, reason }) => ({
        url: '/products/reject',
        method: 'POST',
        params: { id: productId },
        body: { reason },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
      transformResponse: (response) => {
        return response.data || response;
      },
    }),

    // ============================================
    // DELETE PRODUCT
    // ============================================
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: '/products/delete',
        method: 'DELETE',
        params: { id },
      }),
      invalidatesTags: ['Products', 'ProductStats'],
      transformResponse: (response) => {
        return response.data || response;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllProductsQuery,
  useGetPendingProductsQuery,
  useSearchProductsQuery,
  useGetProductStatsQuery,
  useGetProductByIdQuery,
  useApproveProductMutation,
  useRejectProductMutation,
  useDeleteProductMutation,
} = productManagementApi;