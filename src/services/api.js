

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
});

/**
 * Base query with error handling and token refresh logic
 * Wraps baseQuery to handle 401 errors and refresh tokens
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Handle 401 Unauthorized - Token expired
  if (result.error && result.error.status === 401) {
    logError(result.error, 'Authentication Error');
    
    // TODO: Implement token refresh logic
    // const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    // if (refreshToken) {
    //   const refreshResult = await baseQuery(
    //     { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
    //     api,
    //     extraOptions
    //   );
    //   
    //   if (refreshResult.data) {
    //     localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResult.data.token);
    //     result = await baseQuery(args, api, extraOptions);
    //   } else {
    //     // Refresh failed - logout user
    //     localStorage.clear();
    //     window.location.href = '/login';
    //   }
    // }
    
    // For now, clear auth and redirect to login
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    
    // Dispatch logout action if needed
    // api.dispatch(logout());
  }
  
  // Log other errors in development
  if (result.error) {
    logError(result.error, `API Error: ${args.url}`);
  }
  
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