import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const buyerProfileApi = createApi({
  reducerPath: 'buyerProfileApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_BASE_URL}/buyer`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['BuyerProfile', 'BuyerAddresses', 'BuyerStats'],
  endpoints: (builder) => ({
    // GET BUYER PROFILE
    getBuyerProfile: builder.query({
      query: () => '/profile',
      providesTags: ['BuyerProfile'],
    }),

    // UPDATE BUYER PROFILE
    updateBuyerProfile: builder.mutation({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BuyerProfile'],
    }),

    // UPLOAD PROFILE PICTURE
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: '/profile/upload-picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['BuyerProfile'],
    }),

    // DELETE PROFILE PICTURE
    deleteProfilePicture: builder.mutation({
      query: () => ({
        url: '/profile/delete-picture',
        method: 'DELETE',
      }),
      invalidatesTags: ['BuyerProfile'],
    }),

    // CHANGE PASSWORD
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/profile/change-password',
        method: 'PUT',
        body: data,
      }),
    }),

    // GET ALL ADDRESSES
    getAddresses: builder.query({
      query: () => '/addresses',
      providesTags: ['BuyerAddresses'],
      transformResponse: (response) => {
        // Handle both array response and object with data property
        return Array.isArray(response) ? response : response;
      },
    }),

    // CREATE ADDRESS
    createAddress: builder.mutation({
      query: (data) => ({
        url: '/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BuyerAddresses', 'BuyerProfile'],
    }),

    // UPDATE ADDRESS
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/addresses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['BuyerAddresses', 'BuyerProfile'],
    }),

    // DELETE ADDRESS
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BuyerAddresses', 'BuyerProfile'],
    }),

    // GET ORDER HISTORY
    getOrderHistory: builder.query({
      query: ({ page = 1, limit = 10, status = '' } = {}) => {
        let url = `/orders?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        return url;
      },
    }),

    // GET BUYER STATS
    getBuyerStats: builder.query({
      query: () => '/stats',
      providesTags: ['BuyerStats'],
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),
  }),
});

export const {
  useGetBuyerProfileQuery,
  useUpdateBuyerProfileMutation,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
  useChangePasswordMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetOrderHistoryQuery,
  useGetBuyerStatsQuery,
} = buyerProfileApi;
