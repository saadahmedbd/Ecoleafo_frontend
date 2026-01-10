
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const orderApi = createApi({
  reducerPath: 'orderApi',
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
  tagTypes: ['Orders', 'OrderDetails'],
  endpoints: (builder) => ({
    // Get seller's orders (paginated)
    getMyOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => `/orders/seller-orders?page=${page}&limit=${limit}`,
      providesTags: ['Orders'],
    }),

    // Get single order by ID
    getOrderById: builder.query({
      query: (orderId) => `/orders/get?id=${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'OrderDetails', id: orderId }],
    }),

    // Get order by order number
    getOrderByNumber: builder.query({
      query: (orderNumber) => `/orders/by-number?order_number=${orderNumber}`,
      providesTags: (result, error, orderNumber) => [{ type: 'OrderDetails', id: orderNumber }],
    }),

    // Get order history
    getOrderHistory: builder.query({
      query: (orderId) => `/orders/history?id=${orderId}`,
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, tracking_number, notes }) => ({
        url: `/seller/orders/${orderId}/status`,
        method: 'PUT',
        body: { status, tracking_number, notes },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        'Orders',
        { type: 'OrderDetails', id: orderId },
      ],
    }),

    // Update payment status
    updatePaymentStatus: builder.mutation({
      query: ({ orderId, paymentStatus }) => ({
        url: `/orders/update-payment?id=${orderId}`,
        method: 'POST',
        body: {
          payment_status: paymentStatus,
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        'Orders',
        { type: 'OrderDetails', id: orderId },
      ],
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/orders/cancel?id=${orderId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [
        'Orders',
        { type: 'OrderDetails', id: orderId },
      ],
    }),

    // Update individual order item status
    updateOrderItemStatus: builder.mutation({
      query: ({ itemId, status, comment }) => ({
        url: '/orders/update-item-status',
        method: 'POST',
        body: {
          item_id: itemId,
          status,
          comment: comment || '',
        },
      }),
      invalidatesTags: ['Orders', 'OrderDetails'],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByNumberQuery,
  useGetOrderHistoryQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
  useUpdateOrderItemStatusMutation,
} = orderApi;