
// src/features/categories/categoriesApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery,
  tagTypes: ['Categories'],
  endpoints: (builder) => ({
    // Get all categories with filters
    getCategories: builder.query({
      query: ({ page = 1, limit = 20, is_featured, is_active, parent_id, search } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (is_featured !== undefined) params.append('is_featured', is_featured);
        if (is_active !== undefined) params.append('is_active', is_active);
        if (parent_id !== undefined) params.append('parent_id', parent_id);
        if (search) params.append('search', search);
        return `/categories?${params.toString()}`;
      },
      providesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // Get category by ID
    getCategoryById: builder.query({
      query: (id) => `/categories/get?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),

    // Get category by slug
    getCategoryBySlug: builder.query({
      query: (slug) => `/categories/slug?slug=${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Categories', id: slug }],
    }),

    // Get root categories (for main navigation)
    getRootCategories: builder.query({
      query: () => '/categories/root',
      providesTags: [{ type: 'Categories', id: 'ROOT' }],
    }),

    // Get subcategories
    getSubcategories: builder.query({
      query: (parent_id) => `/categories/subcategories?parent_id=${parent_id}`,
      providesTags: (result, error, parent_id) => [
        { type: 'Categories', id: `SUB_${parent_id}` },
      ],
    }),

    // Get featured categories (for homepage)
    getFeaturedCategories: builder.query({
      query: (limit = 8) => `/categories/featured?limit=${limit}`,
      providesTags: [{ type: 'Categories', id: 'FEATURED' }],
    }),

    // Get category tree (hierarchical)
    getCategoryTree: builder.query({
      query: () => '/categories/tree',
      providesTags: [{ type: 'Categories', id: 'TREE' }],
    }),

    // Get breadcrumb
    getCategoryBreadcrumb: builder.query({
      query: (id) => `/categories/breadcrumb?id=${id}`,
      providesTags: (result, error, id) => [
        { type: 'Categories', id: `BREADCRUMB_${id}` },
      ],
    }),

    // Get products by category
    getCategoryProducts: builder.query({
      query: (id) => `/categories/products?id=${id}`,
      providesTags: (result, error, id) => [
        { type: 'Categories', id: `PRODUCTS_${id}` },
      ],
    }),

    // Get all categories for sellers (includes inactive)
    getSellerCategories: builder.query({
      query: () => '/categories/seller',
      transformResponse: (response) => {
        // Backend returns: { status, message, data: { categories: [...] } }
        return response?.data?.categories || [];
      },
      providesTags: [{ type: 'Categories', id: 'SELLER' }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useGetRootCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetFeaturedCategoriesQuery,
  useGetCategoryTreeQuery,
  useGetCategoryBreadcrumbQuery,
  useGetCategoryProductsQuery,
  useGetSellerCategoriesQuery,
} = categoriesApi;