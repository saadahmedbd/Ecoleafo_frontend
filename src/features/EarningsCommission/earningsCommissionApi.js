
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const earningsCommissionApi = createApi({
  reducerPath: 'earningsCommissionApi',
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
  tagTypes: ['CommissionSettings', 'Earnings', 'Payouts', 'PlatformEarnings'],
  endpoints: (builder) => ({
    // Commission Settings
    getCommissionSettings: builder.query({
      query: () => '/admin/commission/settings',
      providesTags: ['CommissionSettings'],
    }),

    updateCommissionSettings: builder.mutation({
      query: (body) => ({
        url: '/admin/commission/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CommissionSettings'],
    }),

    // Seller Earnings
    getSellerEarnings: builder.query({
      query: (seller_id) => `/admin/sellers/earnings?seller_id=${seller_id}`,
      providesTags: (result, error, seller_id) => [{ type: 'Earnings', id: seller_id }],
    }),

    getAllSellerEarnings: builder.query({
      query: ({ page = 1, limit = 20 }) => `/admin/sellers/earnings/all?page=${page}&limit=${limit}`,
      providesTags: ['Earnings'],
    }),

    // Platform Earnings
    getPlatformEarningsOverview: builder.query({
      query: () => '/admin/earnings/overview',
      providesTags: ['PlatformEarnings'],
    }),

    getMonthlyRevenue: builder.query({
      query: (year = new Date().getFullYear()) => `/admin/revenue/monthly?year=${year}`,
      providesTags: ['PlatformEarnings'],
    }),

    getTopSellersByRevenue: builder.query({
      query: (limit = 10) => `/admin/sellers/top?limit=${limit}`,
      providesTags: ['Earnings'],
    }),

    // Payouts
    getPendingPayouts: builder.query({
      query: ({ page = 1, limit = 20 }) => `/admin/payouts/pending?page=${page}&limit=${limit}`,
      providesTags: ['Payouts'],
    }),

    getPayoutHistory: builder.query({
      query: ({ seller_id, page = 1, limit = 20 }) => {
        let url = `/admin/payouts/history?page=${page}&limit=${limit}`;
        if (seller_id) url += `&seller_id=${seller_id}`;
        return url;
      },
      providesTags: ['Payouts'],
    }),

    processPayout: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/payouts/process?id=${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payouts', 'Earnings', 'PlatformEarnings'],
    }),

    rejectPayout: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/payouts/reject?id=${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payouts'],
    }),
  }),
});

export const {
  useGetCommissionSettingsQuery,
  useUpdateCommissionSettingsMutation,
  useGetSellerEarningsQuery,
  useGetAllSellerEarningsQuery,
  useGetPlatformEarningsOverviewQuery,
  useGetMonthlyRevenueQuery,
  useGetTopSellersByRevenueQuery,
  useGetPendingPayoutsQuery,
  useGetPayoutHistoryQuery,
  useProcessPayoutMutation,
  useRejectPayoutMutation,
} = earningsCommissionApi;