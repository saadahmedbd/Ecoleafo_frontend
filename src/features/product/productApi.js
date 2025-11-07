import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Products', 'SellerProducts'],
  endpoints: (builder) => ({
    // Get seller's products with filters
    getSellerProducts: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.order) params.append('order', filters.order);
        
        return `/seller/products?${params.toString()}`;
      },
      providesTags: ['SellerProducts'],
    }),

    // Get single product by ID
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),

    // Create new product
    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/addproducts',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['SellerProducts'],
    }),

    // Update product
    updateProduct: builder.mutation({
      query: ({ productId, ...productData }) => ({
        url: `/updateproducts/${productId}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        'SellerProducts',
        { type: 'Products', id: productId },
      ],
    }),

    // Delete product
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/deleteproducts/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SellerProducts'],
    }),

    // Upload single image
    uploadProductImage: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}/images`, // matches backend {ImageId}
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        'SellerProducts',
      ],
    }),

    // Upload multiple images
    uploadMultipleProductImages: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/products/${productId}/images/multiple`, // matches backend {ImageId}
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        'SellerProducts',
      ],
    }),

    // Add image by URL
    addProductImageByURL: builder.mutation({
      query: ({ productId, imageData }) => ({
        url: `/products/${productId}/images/url`, // matches backend {ImageId}
        method: 'POST',
        body: imageData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        'SellerProducts',
      ],
    }),

    // Delete product image
    deleteProductImage: builder.mutation({
      query: ({ productId, imageId }) => ({
        url: `/product/${productId}/images/${imageId}`, // matches backend
        method: 'POST', // backend uses POST for delete
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: productId },
        'SellerProducts',
      ],
    }),
  }),
});

export const {
  useGetSellerProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
  useUploadMultipleProductImagesMutation,
  useAddProductImageByURLMutation,
  useDeleteProductImageMutation,
} = productApi;
