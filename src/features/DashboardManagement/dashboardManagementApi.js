// src/features/Dashboard/dashboardApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const dashboarManagementdApi = createApi({
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
  tagTypes: ['DashboardStats', 'TopProducts', 'TopSellers', 'RecentOrders'],
  endpoints: (builder) => ({
    // Get complete dashboard statistics
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['DashboardStats'],
    }),

    // Get top products
    getTopProducts: builder.query({
      query: (limit = 5) => `/products/top?limit=${limit}`,
      providesTags: ['TopProducts'],
    }),

    // Get top sellers
    getTopSellers: builder.query({
      query: (limit = 5) => `/sellers/top?limit=${limit}`,
      providesTags: ['TopSellers'],
    }),

    // Get recent orders
    getRecentOrders: builder.query({
      query: (limit = 5) => `/orders/recent?limit=${limit}`,
      providesTags: ['RecentOrders'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetTopProductsQuery,
  useGetTopSellersQuery,
  useGetRecentOrdersQuery,
} = dashboarManagementdApi;