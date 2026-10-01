
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/utils/constants';

export const adminAuthApi = createApi({
  reducerPath: 'adminAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Validate invitation token
    validateInvitation: builder.query({
      query: (token) => `/admin/validate-invitation?token=${token}`,
    }),

    // Register admin with invitation token
    registerAdmin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/register',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Admin login
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/admin/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Admin logout
    adminLogout: builder.mutation({
      query: () => ({
        url: '/auth/admin/logout',
        method: 'POST',
      }),
    }),

    // Refresh admin token
    refreshAdminToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
    }),

    // Get admin profile
    getAdminProfile: builder.query({
      query: () => '/auth/admin/profile',
    }),

    // Verify admin session
    verifyAdminSession: builder.query({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useValidateInvitationQuery,
  useRegisterAdminMutation,
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useRefreshAdminTokenMutation,
  useGetAdminProfileQuery,
  useVerifyAdminSessionQuery,
} = adminAuthApi;