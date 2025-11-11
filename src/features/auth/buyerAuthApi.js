import { api } from '@/services/api';
import { API_TAGS } from '@/utils/constants';

export const buyerAuthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    
    // ==========================
    // Buyer Registration
    // ==========================
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          email: credentials.email,
          password: credentials.password,
        },
      }),
      
      transformResponse: (response) => {
        const data = response.data || response;
        
        console.log('Registration response:', data);
        
        if (!data?.access_token && !data?.token) {
          throw new Error('Registration failed: invalid response from server');
        }
        
        const token = data.access_token || data.token;
        const refresh_token = data.refresh_token || '';
        
        return {
          token,
          refresh_token,
          user: {
            userType: data.user_type || 'buyer',
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            roles: data.roles || ['buyer'],
            fullName: `${data.first_name} ${data.last_name}`,
          },
        };
      },
      
      transformErrorResponse: (response) => {
        const status = response.status;
        const message = response.data?.message || 'Registration failed';
        
        if (status === 400 && message.includes('email')) {
          return { message: 'This email is already registered' };
        }
        if (status === 400 && message.includes('password')) {
          return { message: 'Password must be at least 6 characters' };
        }
        return { message, status };
      },
      
      invalidatesTags: [API_TAGS.AUTH],
    }),

    // ==========================
    // Buyer Login
    // ==========================
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          remember_me: credentials.remember_me,
        },
      }),
      
      transformResponse: (response, meta, arg) => {
        const data = response.data || response;
        
        console.log('Login response:', data);
        
        if (!data?.access_token && !data?.token) {
          throw new Error('Invalid credentials');
        }
        
        const token = data.access_token || data.token;
        const refresh_token = data.refresh_token || '';
        
        return {
          token,
          refresh_token,
          user: {
            userType: data.user_type || 'buyer',
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            roles: data.roles || ['buyer'],
            fullName: `${data.first_name} ${data.last_name}`,
          },
          rememberMe: arg?.remember_me || false,
        };
      },

      transformErrorResponse: (response) => {
        const status = response.status;
        const message = response.data?.message || 'Login failed';
        
        if (status === 401) return { message: 'Invalid email or password' };
        if (status === 403) return { message: 'Account disabled. Contact support.' };
        if (status === 404) return { message: 'No account found with this email' };
        
        return { message, status };
      },
      
      invalidatesTags: [API_TAGS.AUTH],
    }),

    // ==========================
    // Logout - UPDATED to send refresh token
    // ==========================
    logout: builder.mutation({
      query: (_, { getState }) => {
        // Get refresh token from Redux state
        const refreshToken = getState().auth.refreshToken;
        
        return {
          url: '/auth/logout',
          method: 'POST',
          body: { 
            refresh_token: refreshToken  // ADDED: send refresh token to revoke
          },
        };
      },
      invalidatesTags: [API_TAGS.AUTH],
    }),

    // ==========================
    // Refresh Token - NEW ENDPOINT
    // ==========================
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { 
          refresh_token: refreshToken 
        },
      }),
      transformResponse: (response) => {
        if (!response?.access_token || !response?.refresh_token) {
          throw new Error('Failed to refresh token');
        }
        
        return {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expires_in: response.expires_in || 900,
        };
      },
      transformErrorResponse: (response) => ({
        message: response.data?.message || 'Session expired. Please login again.',
      }),
    }),

    // ==========================
    // Get Current User Profile
    // ==========================
    getProfile: builder.query({
      query: () => '/auth/me',
      providesTags: [API_TAGS.AUTH],
      transformResponse: (response) => {
        if (!response?.email) throw new Error('Failed to fetch profile');
        return {
          userType: response.user_type,
          firstName: response.first_name,
          lastName: response.last_name,
          email: response.email,
          roles: response.roles || ['buyer'],
          fullName: `${response.first_name} ${response.last_name}`,
        };
      },
    }),

    // ==========================
    // Forgot Password
    // ==========================
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email: data.email },
      }),
      transformResponse: (response) => ({
        message: response.message || 'Password reset link sent',
      }),
      transformErrorResponse: (response) => ({
        message: response.data?.message || 'Failed to send reset email',
      }),
    }),

    // ==========================
    // Reset Password
    // ==========================
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: {
          token: data.token,
          new_password: data.newPassword,
        },
      }),
      transformResponse: (response) => ({
        message: response.message || 'Password reset successful',
      }),
      transformErrorResponse: (response) => {
        if (response.status === 400) {
          return { message: 'Invalid or expired reset token' };
        }
        return { message: response.data?.message || 'Failed to reset password' };
      },
    }),

    // ==========================
    // Update Profile - OPTIONAL
    // ==========================
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: [API_TAGS.AUTH],
      transformResponse: (response) => ({
        message: response.message || 'Profile updated successfully',
        user: response.user,
      }),
    }),

    // ==========================
    // Change Password - OPTIONAL
    // ==========================
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: {
          old_password: data.oldPassword,
          new_password: data.newPassword,
        },
      }),
      transformResponse: (response) => ({
        message: response.message || 'Password changed successfully',
      }),
      transformErrorResponse: (response) => {
        if (response.status === 401) {
          return { message: 'Current password is incorrect' };
        }
        return { message: response.data?.message || 'Failed to change password' };
      },
    }),

    // ==========================
    // Verify Email - OPTIONAL
    // ==========================
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token: data.token },
      }),
      transformResponse: (response) => ({
        message: response.message || 'Email verified successfully',
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,        //  NEW
  useGetProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
} = buyerAuthApi;

export default buyerAuthApi;



