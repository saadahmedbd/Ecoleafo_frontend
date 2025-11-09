
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const inventoryApi = createApi({
  reducerPath: 'inventoryApi',
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
  tagTypes: ['Inventory', 'InventoryStats'],
  endpoints: (builder) => ({
    // Get inventory with filters
    getInventory: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        
        return `/seller/inventory?${params.toString()}`;
      },
      providesTags: ['Inventory'],
    }),

    // Get inventory statistics
    getInventoryStats: builder.query({
      query: () => '/seller/inventory/stats',
      providesTags: ['InventoryStats'],
    }),

    // Update stock quantity
    updateStock: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/seller/inventory/${productId}/stock`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Inventory', 'InventoryStats'],
    }),

    // Bulk update stock
    bulkUpdateStock: builder.mutation({
      query: (updates) => ({
        url: '/seller/inventory/bulk-update',
        method: 'POST',
        body: { updates }, // Array of { product_id, quantity }
      }),
      invalidatesTags: ['Inventory', 'InventoryStats'],
    }),

    // Update low stock threshold
    updateLowStockThreshold: builder.mutation({
      query: ({ productId, threshold }) => ({
        url: `/seller/inventory/${productId}/threshold`,
        method: 'PUT',
        body: { min_quantity: threshold },
      }),
      invalidatesTags: ['Inventory'],
    }),

    // Get stock history
    getStockHistory: builder.query({
      query: ({ productId, limit = 10 }) => 
        `/seller/inventory/${productId}/history?limit=${limit}`,
    }),

    // Export inventory as CSV
    exportInventory: builder.mutation({
      query: () => ({
        url: '/seller/inventory/export',
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useGetInventoryStatsQuery,
  useUpdateStockMutation,
  useBulkUpdateStockMutation,
  useUpdateLowStockThresholdMutation,
  useGetStockHistoryQuery,
  useExportInventoryMutation,
} = inventoryApi;