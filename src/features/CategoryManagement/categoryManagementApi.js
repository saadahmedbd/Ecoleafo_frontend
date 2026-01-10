
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const categoryManagementApi = createApi({
  reducerPath: 'categoryManagementApi',
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
  tagTypes: ['Categories', 'CategoryTree'],
  endpoints: (builder) => ({
    // Get all categories with filters and pagination
    getAllCategories: builder.query({
      query: ({ page = 1, limit = 20, is_featured, is_active, search, parent_id }) => {
        let url = `/categories?page=${page}&limit=${limit}`;
        if (is_featured !== undefined) url += `&is_featured=${is_featured}`;
        if (is_active !== undefined) url += `&is_active=${is_active}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (parent_id !== undefined) url += `&parent_id=${parent_id}`;
        return url;
      },
      providesTags: (result) =>
        result?.data?.categories
          ? [
              ...result.data.categories.map(({ id }) => ({ type: 'Categories', id })),
              { type: 'Categories', id: 'LIST' },
            ]
          : [{ type: 'Categories', id: 'LIST' }],
    }),

    // Get category by ID
    getCategoryById: builder.query({
      query: (id) => `/categories/get?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Categories', id }],
    }),

    // Get category tree (hierarchical)
    getCategoryTree: builder.query({
      query: () => '/categories/tree',
      providesTags: [{ type: 'CategoryTree', id: 'TREE' }],
    }),

    // Get root categories
    getRootCategories: builder.query({
      query: () => '/categories/root',
      providesTags: [{ type: 'Categories', id: 'ROOT' }],
    }),

    // Get subcategories
    getSubcategories: builder.query({
      query: (parent_id) => `/categories/subcategories?parent_id=${parent_id}`,
      providesTags: (result, error, parent_id) => [{ type: 'Categories', id: `SUB_${parent_id}` }],
    }),

    // Get featured categories
    getFeaturedCategories: builder.query({
      query: (limit = 8) => `/categories/featured?limit=${limit}`,
      providesTags: [{ type: 'Categories', id: 'FEATURED' }],
    }),

    // Get breadcrumb
    getCategoryBreadcrumb: builder.query({
      query: (id) => `/categories/breadcrumb?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Categories', id: `BREADCRUMB_${id}` }],
    }),

    // Create category (Admin)
    createCategory: builder.mutation({
      query: (body) => ({
        url: '/categories/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' },
        { type: 'Categories', id: 'ROOT' },
        { type: 'CategoryTree', id: 'TREE' },
      ],
    }),

    // Update category (Admin)
    updateCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/categories/update?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
        { type: 'Categories', id: 'ROOT' },
        { type: 'CategoryTree', id: 'TREE' },
      ],
    }),

    // Delete category (Admin)
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/delete?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' },
        { type: 'Categories', id: 'ROOT' },
        { type: 'CategoryTree', id: 'TREE' },
      ],
    }),

    // Reorder categories (Admin)
    reorderCategories: builder.mutation({
      query: (body) => ({
        url: '/categories/reorder',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Categories', id: 'LIST' },
        { type: 'CategoryTree', id: 'TREE' },
      ],
    }),

    // Upload category image (Admin)
    uploadCategoryImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/categories/upload-image?id=${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    // Upload category icon (Admin)
    uploadCategoryIcon: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/categories/upload-icon?id=${id}`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryTreeQuery,
  useGetRootCategoriesQuery,
  useGetSubcategoriesQuery,
  useGetFeaturedCategoriesQuery,
  useGetCategoryBreadcrumbQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation,
  useUploadCategoryImageMutation,
  useUploadCategoryIconMutation,
} = categoryManagementApi;