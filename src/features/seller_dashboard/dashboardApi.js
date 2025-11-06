
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
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
  tagTypes: ['Dashboard', 'Statistics', 'RecentOrders', 'TopProducts'],
  endpoints: (builder) => ({
    // Get seller statistics
    getSellerStatistics: builder.query({
      query: () => '/seller/statistics',
      providesTags: ['Statistics'],
    }),

    // Get seller profile (for dashboard header)
    getSellerProfile: builder.query({
      query: () => '/seller/profile',
      providesTags: ['Dashboard'],
    }),

    // Get recent orders
    getRecentOrders: builder.query({
      query: (params = { limit: 5 }) => ({
        url: '/seller/orders/recent',
        params,
      }),
      providesTags: ['RecentOrders'],
    }),

    // Get top products
    getTopProducts: builder.query({
      query: (params = { limit: 5 }) => ({
        url: '/seller/products/top',
        params,
      }),
      providesTags: ['TopProducts'],
    }),

    // Get low stock products
    getLowStockProducts: builder.query({
      query: (params = { threshold: 10 }) => ({
        url: '/seller/products/low-stock',
        params,
      }),
      providesTags: ['TopProducts'],
    }),

    // Get sales analytics
    getSalesAnalytics: builder.query({
      query: (params = { period: 'week' }) => ({
        url: '/seller/analytics/sales',
        params, // period: 'week', 'month', 'year'
      }),
      providesTags: ['Statistics'],
    }),

    // Get revenue analytics
    getRevenueAnalytics: builder.query({
      query: (params = { period: 'month' }) => ({
        url: '/seller/analytics/revenue',
        params,
      }),
      providesTags: ['Statistics'],
    }),

    // Get order status distribution
    getOrderDistribution: builder.query({
      query: () => '/seller/analytics/orders/distribution',
      providesTags: ['Statistics'],
    }),

    // Get performance metrics
    getPerformanceMetrics: builder.query({
      query: () => '/seller/analytics/performance',
      providesTags: ['Statistics'],
    }),

    // Get pending actions
    getPendingActions: builder.query({
      query: () => '/seller/dashboard/pending-actions',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetSellerStatisticsQuery,
  useGetSellerProfileQuery,
  useGetRecentOrdersQuery,
  useGetTopProductsQuery,
  useGetLowStockProductsQuery,
  useGetSalesAnalyticsQuery,
  useGetRevenueAnalyticsQuery,
  useGetOrderDistributionQuery,
    useGetPendingActionsQuery,
  useGetPerformanceMetricsQuery,
  
  
} = dashboardApi;