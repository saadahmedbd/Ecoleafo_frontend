// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';
// Import other feature slices as needed
// import userReducer from '../features/users/userSlice';

/**
 * Redux Store Configuration
 * 
 * Features:
 * - Redux Toolkit for simplified Redux setup
 * - RTK Query for API state management
 * - Redux DevTools integration (automatically enabled in development)
 * - Middleware for API caching and invalidation
 */
export const store = configureStore({
  reducer: {
    // RTK Query API slice - handles all API state
    [api.reducerPath]: api.reducer,
    
    // Feature slices - handle local state
    auth: authReducer,
    // users: userReducer,
    // Add other feature reducers here
  },
  
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Middleware options
      serializableCheck: {
        // Ignore these action types for serialization check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these paths in the state
        ignoredPaths: ['api'],
      },
    }).concat(api.middleware), // Add RTK Query middleware
  
  // Enable Redux DevTools in development
  devTools: import.meta.env.DEV,
});

/**
 * Setup listeners for RTK Query
 * Enables automatic refetching on focus/reconnect
 * Must be called after store creation
 */
setupListeners(store.dispatch);

// Export store type for TypeScript (if migrating later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;