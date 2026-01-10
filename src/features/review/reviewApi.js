import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Reviews', 'MyReviews'],
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ product_id, rating, page = 1, per_page = 10, sort_by = 'newest' }) => {
        let url = `/reviews/product?product_id=${product_id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`;
        if (rating) url += `&rating=${rating}`;
        return url;
      },
      providesTags: (result, error, { product_id }) => [{ type: 'Reviews', id: product_id }],
      transformResponse: (response) => {
        console.log('Product Reviews API Response:', response);
        console.log('First Review Object:', response?.data?.data?.reviews?.[0] || response?.data?.reviews?.[0]);
        return response;
      },
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: '/buyer/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: 'Reviews', id: product_id },
        { type: 'MyReviews', id: 'LIST' },
      ],
    }),
    checkReviewEligibility: builder.query({
      query: ({ product_id }) => `/buyer/review/can-review?product_id=${product_id}`,
    }),
    getMyReviews: builder.query({
      query: ({ page = 1, per_page = 10 }) =>
        `/buyer/reviews/my-reviews?page=${page}&per_page=${per_page}`,
      providesTags: [{ type: 'MyReviews', id: 'LIST' }],
      transformResponse: (response) => {
        console.log('Raw API Response:', response);
        return response;
      },
    }),
    updateReview: builder.mutation({
      query: ({ id, ...reviewData }) => ({
        url: `/buyer/reviews/${id}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { product_id }) => [
        { type: 'Reviews', id: product_id },
        { type: 'MyReviews', id: 'LIST' },
      ],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/buyer/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'MyReviews', id: 'LIST' }],
    }),
    getSellerReviews: builder.query({
      query: ({ page = 1, per_page = 10, rating, sort_by = 'newest' }) => {
        let url = `/seller/reviews/my-products?page=${page}&per_page=${per_page}&sort_by=${sort_by}`;
        if (rating) url += `&rating=${rating}`;
        return url;
      },
      providesTags: ['Reviews'],
    }),
    respondToReview: builder.mutation({
      query: ({ reviewId, response }) => ({
        url: `/seller/reviews/${reviewId}/respond`,
        method: 'POST',
        body: { response },
      }),
      invalidatesTags: ['Reviews'],
    }),
    // Admin endpoints
    getAdminReviews: builder.query({
      query: ({ page = 1, limit = 20, status, rating, is_reported, search }) => {
        let url = `/admin/reviews?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (rating) url += `&rating=${rating}`;
        if (is_reported !== undefined) url += `&is_reported=${is_reported}`;
        if (search) url += `&search=${search}`;
        return url;
      },
      providesTags: ['Reviews'],
    }),
    getAdminPendingReviews: builder.query({
      query: ({ page = 1, limit = 20 }) => `/admin/reviews/pending?page=${page}&limit=${limit}`,
      providesTags: ['Reviews'],
    }),
    getAdminReportedReviews: builder.query({
      query: ({ page = 1, limit = 20 }) => `/admin/reviews/reported?page=${page}&limit=${limit}`,
      providesTags: ['Reviews'],
    }),
    moderateReview: builder.mutation({
      query: ({ id, action, reason }) => ({
        url: `/admin/reviews/moderate?id=${id}`,
        method: 'POST',
        body: { action, reason },
      }),
      invalidatesTags: ['Reviews'],
    }),
    deleteAdminReview: builder.mutation({
      query: (id) => ({
        url: `/admin/reviews/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
    getReviewStats: builder.query({
      query: () => '/admin/stats',
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useCheckReviewEligibilityQuery,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetSellerReviewsQuery,
  useRespondToReviewMutation,
  useGetAdminReviewsQuery,
  useGetAdminPendingReviewsQuery,
  useGetAdminReportedReviewsQuery,
  useModerateReviewMutation,
  useDeleteAdminReviewMutation,
  useGetReviewStatsQuery,
} = reviewApi;
