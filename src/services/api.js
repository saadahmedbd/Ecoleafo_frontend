

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL, API_TAGS, STORAGE_KEYS } from '../utils/constants';
import { logError } from '../utils/errorHandler';
import { updateToken, clearAuth } from '../features/auth/authSlice'

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

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data?.token) {
        const newToken = refreshResult.data.token;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
        api.dispatch(updateToken(newToken));

        // Retry original request with new token
        result = await baseQuery(
          {
            ...args,
            headers: { 
              ...args.headers, 
              Authorization: `Bearer ${newToken}` 
            },
          },
          api,
          extraOptions
        );
      } else {
        api.dispatch(clearAuth());
        // Use React Router navigation in your component instead
        window.location.href = '/auth/login';
      }
    }
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