
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productDetailsApi = createApi({
  reducerPath: 'productDetailsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/product/slug/${slug}`,
      providesTags: (result) => [{ type: 'Product', id: result?.data?.id }],
    }),
    getSellerProducts: builder.query({
      query: ({ sellerId, page = 1, limit = 10 }) => 
        `/seller/${sellerId}/products?page=${page}&limit=${limit}`,
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetSellerProductsQuery,
} = productDetailsApi;


