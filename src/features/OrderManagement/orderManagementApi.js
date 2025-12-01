
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const orderManagementApi = createApi({
  reducerPath: 'orderManagementApi',
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
  tagTypes: ['Orders', 'OrderStats'],
  endpoints: (builder) => ({
    // Get all orders with filters
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, status = '' }) => {
        let url = `/orders?page=${page}&limit=${limit}`;
        if (status && status !== 'all') {
          url += `&status=${status}`;
        }
        return url;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Orders', id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    // Search orders
    searchOrders: builder.query({
      query: ({ query, page = 1, limit = 10 }) => 
        `/orders/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      providesTags: [{ type: 'Orders', id: 'SEARCH' }],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: (id) => `/get/orders?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    // Get order statistics
    getOrderStats: builder.query({
      query: () => '/orders/stats',
      providesTags: [{ type: 'OrderStats', id: 'STATS' }],
    }),

    // Get recent orders
    getRecentOrders: builder.query({
      query: (limit = 20) => `/orders/recent?limit=${limit}`,
      providesTags: [{ type: 'Orders', id: 'RECENT' }],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/update-status?id=${id}`,
        method: 'POST',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        { type: 'Orders', id: 'RECENT' },
        { type: 'OrderStats', id: 'STATS' },
      ],
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/orders/cancel?id=${id}`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Orders', id },
        { type: 'Orders', id: 'LIST' },
        { type: 'Orders', id: 'RECENT' },
        { type: 'OrderStats', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useSearchOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderStatsQuery,
  useGetRecentOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} = orderManagementApi;