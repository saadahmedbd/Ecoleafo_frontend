import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.q) queryParams.append('q', params.q);
        if (params.category) queryParams.append('category', params.category);
        if (params.min_price) queryParams.append('min_price', params.min_price);
        if (params.max_price) queryParams.append('max_price', params.max_price);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        return `/search?${queryParams.toString()}`;
      },
    }),

    getAutocomplete: builder.query({
      query: (query) => `/search/autocomplete?q=${encodeURIComponent(query)}`,
    }),

    getBestSellingProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit);
        
        return `/product/bestselling?${queryParams.toString()}`;
      },
    }),

    getTopProducts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.limit) queryParams.append('limit', params.limit);
        
        return `/product/topproduct?${queryParams.toString()}`;
      },
    }),
  }),
});

export const {
  useSearchProductsQuery,
  useGetAutocompleteQuery,
  useGetBestSellingProductsQuery,
  useGetTopProductsQuery,
} = searchApi;
