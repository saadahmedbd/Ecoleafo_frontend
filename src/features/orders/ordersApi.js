import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
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
  tagTypes: ['Order', 'Orders', 'Cart'],
  endpoints: (builder) => ({
    // GET ORDER BY ID
    getOrderById: builder.query({
      query: (orderId) => `/orders/get?id=${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // GET ORDER BY ORDER NUMBER
    getOrderByNumber: builder.query({
      query: (orderNumber) => `/orders/buyer/by-number?order_number=${orderNumber}`,
      providesTags: (result) => [{ type: 'Order', id: result?.order_number }],
    }),

    // GET MY ORDERS (LIST) - WITH PAGINATION
    getMyOrders: builder.query({
      query: ({ page = 1, limit = 10, status = '' } = {}) => {
        let url = `/orders/my-orders?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
      providesTags: ['Orders'],
    }),

    // CANCEL ORDER
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/buyer/cancel?id=${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Orders', 'Order'],
    }),

    // ADD TO CART (for Buy Again)
    addToCart: builder.mutation({
      query: (data) => ({
        url: '/cart',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
  useAddToCartMutation,
} = ordersApi;
