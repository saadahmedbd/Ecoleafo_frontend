

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_TAGS, STORAGE_KEYS } from '../utils/constants';
import { logError } from '../utils/errorHandler';

/**
 * Base query configuration with authentication and error handling
 * Automatically attaches auth token to requests and handles common errors
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  
  // Prepare headers for each request
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage or Redux state
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Alternatively, get from Redux state:
    // const token = getState().auth.token;
    
    // Attach token to Authorization header if available
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Set default content type
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    
    return headers;
  },
  
  // Credentials for CORS requests
  credentials: 'include',
  
  // Custom response handler to handle both JSON and text responses
  responseHandler: async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      // If not JSON, return as text
      return text;
    }
  },
});

/**
 * Base query with error handling and token refresh logic
 * Wraps baseQuery to handle 401 errors and refresh tokens
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.log('🔒 ===== 401 UNAUTHORIZED DETECTED =====');
    console.log('🔒 Request URL:', args.url || args);
    console.log('🔒 Attempting token refresh via API interceptor...');
    
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    console.log('🔒 Refresh Token:', refreshToken ? 'EXISTS' : 'MISSING');
    console.log('🔒 User Data:', userData);
    
    // Determine user type for correct endpoint
    let userType = 'buyer';
    try {
      if (userData) {
        const user = JSON.parse(userData);
        userType = user.userType || user.role || 'buyer';
        console.log('🔒 User Type:', userType);
      }
    } catch (e) {
      console.error('❌ Failed to parse user data:', e);
    }

    if (refreshToken) {
      // Use role-specific refresh endpoint
      const refreshUrl = userType === 'seller' 
        ? '/seller/auth/refresh' 
        : userType === 'admin'
        ? '/admin/auth/refresh'
        : '/buyer/auth/refresh';

      console.log('🔒 Refresh URL:', refreshUrl);
      console.log('🔒 Sending refresh request...');

      const refreshResult = await baseQuery(
        {
          url: refreshUrl,
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      console.log('🔒 Refresh Result:', refreshResult);

      const newToken = refreshResult.data?.access_token || refreshResult.data?.token;
      const newRefreshToken = refreshResult.data?.refresh_token;

      console.log('🔒 New Access Token:', newToken ? 'RECEIVED' : 'MISSING');
      console.log('🔒 New Refresh Token:', newRefreshToken ? 'RECEIVED' : 'MISSING');

      if (newToken) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        if (newRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
        }

        console.log('✅ Token refreshed, retrying original request...');
        result = await baseQuery(args, api, extraOptions);
        console.log('✅ Original request retry result:', result.error ? 'FAILED' : 'SUCCESS');
      } else {
        console.error('❌ Token refresh failed - no new token received');
        console.error('❌ Refresh result data:', refreshResult.data);
        console.error('❌ Refresh result error:', refreshResult.error);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = userType === 'seller' ? '/seller/login' 
          : userType === 'admin' ? '/admin/login' 
          : '/buyer/login';
      }
    } else {
      console.error('❌ No refresh token available, redirecting to login');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = userType === 'seller' ? '/seller/login' 
        : userType === 'admin' ? '/admin/login' 
        : '/buyer/login';
    }
    console.log('🔒 ===== 401 HANDLING COMPLETE =====');
  }

  if (result.error) logError(result.error);

  return result;
};

/**
 * Base API configuration using RTK Query
 * This is the foundation for all API endpoints
 * 
 * Features:
 * - Automatic caching
 * - Request deduplication
 * - Automatic refetching
 * - Tag-based cache invalidation
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  
  // Define tag types for cache invalidation
  tagTypes: Object.values(API_TAGS),
  
  // Keep unused data in cache for 60 seconds
  keepUnusedDataFor: 60,
  
  // Refetch on mount if data is older than 60 seconds
  refetchOnMountOrArgChange: 60,
  
  // Refetch on window focus
  refetchOnFocus: false,
  
  // Refetch on network reconnect
  refetchOnReconnect: true,
  
  // Endpoints will be injected by individual feature APIs
  endpoints: () => ({}),
});

export default api;