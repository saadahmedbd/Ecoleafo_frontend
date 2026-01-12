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
        // FIXED: Handle both nested and flat responses
        const data = response?.data || response;
        
        console.log('🔍 Raw Backend Response:', response);
        console.log('🔍 Extracted Data:', data);
        
        // Validate response
        if (!data?.access_token && !data?.token) {
          throw new Error('Registration failed: No access token in response');
        }
        
        // Extract tokens with better handling
        const token = data.access_token || data.token;
        const refresh_token = data.refresh_token || data.refreshToken || data.refresh || null;
        
        console.log('📦 Token Extraction:', {
          hasAccessToken: !!token,
          hasRefreshToken: !!refresh_token,
          refreshTokenType: typeof refresh_token,
          refreshTokenValue: refresh_token ? `${refresh_token.substring(0, 20)}...` : 'NULL'
        });
        
        // CRITICAL: Warn if refresh token is missing
        if (!refresh_token) {
          console.error('❌ CRITICAL: Backend did not return refresh_token!');
          console.error('❌ Response keys:', Object.keys(data));
          console.error('❌ Full response:', JSON.stringify(data, null, 2));
        }
        
        return {
          token,
          refresh_token: refresh_token || null,
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
    // Buyer Login - FIXED
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
        // FIXED: Handle both nested and flat responses properly
        console.log('🔍 ===== LOGIN RESPONSE DEBUG =====');
        console.log('🔍 Raw Response:', response);
        console.log('🔍 Response Type:', typeof response);
        console.log('🔍 Response Keys:', Object.keys(response || {}));
        
        // Try to extract data - handle both {data: {...}} and flat {...} responses
        let data;
        if (response?.data && typeof response.data === 'object') {
          data = response.data;
          console.log('📦 Using nested response.data');
        } else if (response && typeof response === 'object') {
          data = response;
          console.log('📦 Using flat response');
        } else {
          console.error('❌ Invalid response structure:', response);
          throw new Error('Invalid response from server');
        }
        
        console.log('📦 Extracted Data:', data);
        console.log('📦 Data Keys:', Object.keys(data));
        
        // Validate access token
        if (!data?.access_token && !data?.token) {
          console.error('❌ No access token found in response!');
          throw new Error('Invalid credentials - no token received');
        }
        
        // Extract tokens with comprehensive field name checking
        const token = data.access_token || data.accessToken || data.token;
        const refresh_token = data.refresh_token || data.refreshToken || data.refresh || null;
        
        console.log('🔑 Token Extraction Results:');
        console.log('  ✓ Access Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
        console.log('  ✓ Refresh Token:', refresh_token ? `${refresh_token.substring(0, 20)}...` : 'MISSING');
        console.log('  ✓ Refresh Token Type:', typeof refresh_token);
        console.log('  ✓ Refresh Token Truthy:', !!refresh_token);
        
        // CRITICAL CHECK: Verify refresh token is actually present
        if (!refresh_token || refresh_token === 'null' || refresh_token === 'undefined') {
          console.error('❌ ===== CRITICAL ERROR =====');
          console.error('❌ NO VALID REFRESH TOKEN RECEIVED FROM BACKEND!');
          console.error('❌ Backend must return one of: refresh_token, refreshToken, or refresh');
          console.error('❌ Current response fields:', Object.keys(data).join(', '));
          console.error('❌ ==========================');
          
          // Don't throw error, but log warning
          console.warn('⚠️ Continuing without refresh token - automatic token refresh will not work!');
        }
        
        // Store tokens IMMEDIATELY in localStorage with validation
        if (token && typeof token === 'string' && token.length > 10) {
          localStorage.setItem('auth_token', token);
          console.log('✅ Access token stored in localStorage');
        } else {
          console.error('❌ Invalid access token, not storing');
        }
        
        if (refresh_token && typeof refresh_token === 'string' && refresh_token.length > 10) {
          localStorage.setItem('refresh_token', refresh_token);
          console.log('✅ Refresh token stored in localStorage:', refresh_token.substring(0, 20) + '...');
          
          // Verify storage
          const stored = localStorage.getItem('refresh_token');
          if (stored === refresh_token) {
            console.log('✅✅ Refresh token storage VERIFIED');
          } else {
            console.error('❌ Refresh token storage FAILED - stored value differs!');
          }
        } else {
          console.warn('⚠️ No valid refresh token to store');
          console.warn('⚠️ Value received:', refresh_token);
        }
        
        // Build user object
        const user = {
          userType: data.user_type || 'buyer',
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          roles: data.roles || ['buyer'],
          fullName: `${data.first_name} ${data.last_name}`,
        };
        
        localStorage.setItem('user_data', JSON.stringify(user));
        console.log('✅ User data stored in localStorage');
        
        const result = {
          token,
          refresh_token: refresh_token || null,
          user,
          rememberMe: arg?.remember_me || false,
        };
        
        console.log('🚀 Final Login Result:', {
          hasToken: !!result.token,
          hasRefreshToken: !!result.refresh_token,
          userEmail: result.user.email
        });
        console.log('🔍 ===== LOGIN RESPONSE DEBUG END =====');
        
        return result;
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
    // Logout
    // ==========================
    logout: builder.mutation({
      query: () => {
        const refreshToken = localStorage.getItem('refresh_token');
        
        console.log('🚪 Logout - Refresh Token:', refreshToken ? 'EXISTS' : 'MISSING');

        return {
          url: '/auth/logout',
          method: 'POST',
          body: { refresh_token: refreshToken || null },
        };
      },

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log('✅ Logout successful');
        } catch (err) {
          console.warn('⚠️ Logout API error (continuing with local cleanup):', err);
        } finally {
          // Always clear auth state locally
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('remember_me');
          
          console.log('✅ Local storage cleared');
        }
      },

      invalidatesTags: [API_TAGS.AUTH],
    }),

    // ==========================
    // Refresh Token
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
        const data = response?.data || response;
        
        if (!data?.access_token || !data?.refresh_token) {
          throw new Error('Failed to refresh token');
        }
        
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: data.expires_in || 900,
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
        const data = response?.data || response;
        if (!data?.email) throw new Error('Failed to fetch profile');
        return {
          userType: data.user_type,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          roles: data.roles || ['buyer'],
          fullName: `${data.first_name} ${data.last_name}`,
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
    // Update Profile
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
    // Change Password
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
    // Verify Email
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

// Export hooks
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
} = buyerAuthApi;

export default buyerAuthApi;