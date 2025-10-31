// src/features/auth/authApi.js
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
        if (!response?.token) {
          throw new Error('Registration failed: invalid response from server');
        }
        return {
          token: response.token,
          user: {
            userType: response.user_type,
            firstName: response.first_name,
            lastName: response.last_name,
            email: response.email,
            roles: response.roles || ['buyer'],
            fullName: `${response.first_name} ${response.last_name}`,
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
        },
      }),
      
      transformResponse: (response) => {
    if (!response?.token || !response?.user_type) {
      throw new Error('Invalid credentials');
    }
    return {
      token: response.token,
      user: {
        userType: response.user_type,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        roles: response.roles || ['buyer'],
        fullName: `${response.first_name} ${response.last_name}`,
      },
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
    // Logout
    // ==========================
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: [API_TAGS.AUTH],
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
  }),
});

// ==========================
// Export hooks
// ==========================
export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = buyerAuthApi;
 

// src/features/auth/authApi.js

// import { api } from '@/services/api';
// import { API_TAGS } from '@/utils/constants';

// /**
//  * Buyer Authentication API Endpoints
//  * Handles registration, login, and password management for buyers
//  * 
//  * Backend Integration:
//  * - Registration: POST /auth/register
//  * - Login: POST /auth/login
//  * - Logout: POST /auth/logout (optional)
//  * - Forgot Password: POST /auth/forgot-password
//  * - Reset Password: POST /auth/reset-password
//  */
// export const buyerAuthApi = api.injectEndpoints({
//   endpoints: (builder) => ({
//     /**
//      * Buyer Registration
//      * POST /auth/register
//      * 
//      * Request Body:
//      * {
//      *   first_name: string,
//      *   last_name: string,
//      *   email: string,
//      *   password: string
//      * }
//      * 
//      * Response:
//      * {
//      *   token: string,
//      *   user_type: "buyer",
//      *   first_name: string,
//      *   last_name: string,
//      *   email: string,
//      *   roles: ["buyer"]
//      * }
//      */
//     register: builder.mutation({
//       query: (credentials) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: {
//           first_name: credentials.firstName,
//           last_name: credentials.lastName,
//           email: credentials.email,
//           password: credentials.password,
//         },
//       }),
      
//       /**
//        * Transform backend response to frontend format
//        * Converts snake_case to camelCase
//        */
//       transformResponse: (response) => {
//         return {
//           token: response.token,
//           user: {
//             userType: response.user_type,
//             firstName: response.first_name,
//             lastName: response.last_name,
//             email: response.email,
//             roles: response.roles || ['buyer'],
//             // Derive full name for UI display
//             fullName: `${response.first_name} ${response.last_name}`,
//           },
//         };
//       },
      
//       /**
//        * Handle registration errors
//        * Common errors:
//        * - 400: Validation error (email exists, weak password)
//        * - 422: Invalid input format
//        * - 500: Server error
//        */
//       transformErrorResponse: (response) => {
//         const status = response.status;
//         const data = response.data;
        
//         // Map backend errors to user-friendly messages
//         if (status === 400) {
//           if (data?.message?.includes('email')) {
//             return { message: 'This email is already registered' };
//           }
//           if (data?.message?.includes('password')) {
//             return { message: 'Password must be at least 6 characters' };
//           }
//         }
        
//         return {
//           message: data?.message || 'Registration failed. Please try again.',
//           status,
//         };
//       },
      
//       invalidatesTags: [API_TAGS.AUTH],
//     }),

//     /**
//      * Buyer Login
//      * POST /auth/login
//      * 
//      * Request Body:
//      * {
//      *   email: string,
//      *   password: string
//      * }
//      * 
//      * Response:
//      * {
//      *   token: string,
//      *   user_type: "buyer",
//      *   first_name: string,
//      *   last_name: string,
//      *   email: string,
//      *   roles: ["buyer"]
//      * }
//      */
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: {
//           email: credentials.email,
//           password: credentials.password,
//         },
//       }),
      
//       /**
//        * Transform backend response to frontend format
//        */
//       transformResponse: (response) => {
//         return {
//           token: response.token,
//           user: {
//             userType: response.user_type,
//             firstName: response.first_name,
//             lastName: response.last_name,
//             email: response.email,
//             roles: response.roles || ['buyer'],
//             fullName: `${response.first_name} ${response.last_name}`,
//           },
//         };
//       },
      
//       /**
//        * Handle login errors
//        * Common errors:
//        * - 401: Invalid credentials
//        * - 403: Account locked/disabled
//        * - 404: User not found
//        */
//       transformErrorResponse: (response) => {
//         const status = response.status;
//         const data = response.data;
        
//         if (status === 401) {
//           return { message: 'Invalid email or password' };
//         }
        
//         if (status === 403) {
//           return { message: 'Your account has been disabled. Please contact support.' };
//         }
        
//         if (status === 404) {
//           return { message: 'No account found with this email' };
//         }
        
//         return {
//           message: data?.message || 'Login failed. Please try again.',
//           status,
//         };
//       },
      
//       invalidatesTags: [API_TAGS.AUTH],
//     }),

//     /**
//      * Logout
//      * POST /auth/logout
//      * 
//      * Clears server-side session if applicable
//      */
//     logout: builder.mutation({
//       query: () => ({
//         url: '/auth/logout',
//         method: 'POST',
//       }),
//       invalidatesTags: [API_TAGS.AUTH],
//     }),

//     /**
//      * Forgot Password
//      * POST /auth/forgot-password
//      * 
//      * Sends password reset email to user
//      * 
//      * Request Body:
//      * {
//      *   email: string
//      * }
//      */
//     forgotPassword: builder.mutation({
//       query: (data) => ({
//         url: '/auth/forgot-password',
//         method: 'POST',
//         body: { email: data.email },
//       }),
      
//       transformResponse: (response) => ({
//         message: response.message || 'Password reset link sent to your email',
//       }),
      
//       transformErrorResponse: (response) => ({
//         message: response.data?.message || 'Failed to send reset email. Please try again.',
//       }),
//     }),

//     /**
//      * Reset Password
//      * POST /auth/reset-password
//      * 
//      * Resets password using token from email
//      * 
//      * Request Body:
//      * {
//      *   token: string,
//      *   new_password: string
//      * }
//      */
//     resetPassword: builder.mutation({
//       query: (data) => ({
//         url: '/auth/reset-password',
//         method: 'POST',
//         body: {
//           token: data.token,
//           new_password: data.newPassword,
//         },
//       }),
      
//       transformResponse: (response) => ({
//         message: response.message || 'Password reset successful',
//       }),
      
//       transformErrorResponse: (response) => {
//         const status = response.status;
        
//         if (status === 400) {
//           return { message: 'Invalid or expired reset token' };
//         }
        
//         return {
//           message: response.data?.message || 'Failed to reset password. Please try again.',
//         };
//       },
//     }),

//     /**
//      * Get Current User Profile
//      * GET /auth/me
//      * 
//      * Fetches authenticated user's profile
//      */
//     getProfile: builder.query({
//       query: () => '/auth/me',
//       providesTags: [API_TAGS.AUTH],
      
//       transformResponse: (response) => ({
//         userType: response.user_type,
//         firstName: response.first_name,
//         lastName: response.last_name,
//         email: response.email,
//         roles: response.roles,
//         fullName: `${response.first_name} ${response.last_name}`,
//       }),
//     }),
//   }),
// });

// // Export hooks for use in components
// export const {
//   useRegisterMutation,
//   useLoginMutation,
//   useLogoutMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
//   useGetProfileQuery,
//   useLazyGetProfileQuery,
// } = buyerAuthApi;