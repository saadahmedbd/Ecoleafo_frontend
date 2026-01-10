import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const checkoutApi = createApi({
  reducerPath: 'checkoutApi',
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
  tagTypes: ['BuyerProfile', 'Addresses', 'Cart', 'Order', 'CartCount'],
  endpoints: (builder) => ({
    // GET BUYER PROFILE
    getBuyerProfile: builder.query({
      query: () => '/buyer/profile',
      providesTags: ['BuyerProfile'],
    }),

    // GET ADDRESSES
    getAddresses: builder.query({
      query: () => '/buyer/addresses',
      providesTags: ['Addresses'],
    }),

    // CREATE ADDRESS
    createAddress: builder.mutation({
      query: (data) => ({
        url: '/buyer/addresses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Addresses'],
    }),

    // UPDATE ADDRESS
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/buyer/addresses/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Addresses'],
    }),

    // VALIDATE CART
    validateCart: builder.query({
      query: (addressId) => {
        const url = addressId ? `/cart/validate?address_id=${addressId}` : '/cart/validate';
        return url;
      },
      keepUnusedDataFor: 0,
    }),

    // CREATE ORDER
    createOrder: builder.mutation({
      query: (data) => ({
        url: '/orders/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Cart', 'Order', 'CartCount'],
    }),
  }),
});

export const {
  useGetBuyerProfileQuery,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useValidateCartQuery,
  useCreateOrderMutation,
} = checkoutApi;