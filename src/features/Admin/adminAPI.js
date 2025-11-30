
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Admin', 'Invitation'],
  endpoints: (builder) => ({
    // Get current admin profile
    getAdminProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['Admin'],
    }),

    // Get admin by ID
    getAdminById: builder.query({
      query: (id) => `/admin/get?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),

    // Get all admins with pagination
    getAllAdmins: builder.query({
      query: ({ page = 1, limit = 10 }) => `/admin/all?page=${page}&limit=${limit}`,
      providesTags: ['Admin'],
    }),

    // Update admin profile
    updateAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/update?id=${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }, 'Admin'],
    }),

    // Create invitation (Super Admin only)
    createInvitation: builder.mutation({
      query: (data) => ({
        url: '/admin/invite',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invitation'],
    }),

    // Update admin permissions (Super Admin only)
    updatePermissions: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/update-permissions?id=${id}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }, 'Admin'],
    }),

    // Deactivate admin (Super Admin only)
    deactivateAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/deactivate?id=${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),

    // Activate admin (Super Admin only)
    activateAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/activate?id=${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),

    // Get pending invitations (Super Admin only)
    getPendingInvitations: builder.query({
      query: () => '/admin/invitations',
      providesTags: ['Invitation'],
    }),

    // Cancel invitation (Super Admin only)
    cancelInvitation: builder.mutation({
      query: (id) => ({
        url: `/admin/cancel-invitation?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Invitation'],
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useGetAdminByIdQuery,
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
  useCreateInvitationMutation,
  useUpdatePermissionsMutation,
  useDeactivateAdminMutation,
  useActivateAdminMutation,
  useGetPendingInvitationsQuery,
  useCancelInvitationMutation,
} = adminApi;