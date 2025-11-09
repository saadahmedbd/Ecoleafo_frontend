// ==========================================
// REDUX STORE CONFIGURATION
// ==========================================
// Purpose: Configure Redux store with all slices and middleware
// Includes: Auth, Buyer API, Seller API, and other feature slices
// ==========================================

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { buyerAuthApi } from '../features/auth/buyerAuthApi';
import { sellerAuthApi } from '../features/auth/sellerAuthApi';
import { dashboardApi } from '../features/seller_dashboard/dashboardAPI';
import { productApi } from '../features/product/productApi';
import { orderApi } from '../features/seller_order_management/orderApi';
import { inventoryApi } from '../features/seller_inventory/InventoryApi';
import reducer from '../features/auth/authSlice';

/**
 * Configure Redux store
 */
export const store = configureStore({
  reducer: {
    // Authentication state
    auth: authReducer,
    
    // RTK Query API slices
    [buyerAuthApi.reducerPath]: buyerAuthApi.reducer,
    [sellerAuthApi.reducerPath]: sellerAuthApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [inventoryApi.reducerPath]:inventoryApi.reducer,
    
    // Add other feature slices here as needed
    // cart: cartReducer,
    // products: productsReducer,
    // etc.
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure middleware options
      serializableCheck: {
        // Ignore these action types for serializable checks
        ignoredActions: [
          'auth/setCredentials',
          'auth/setProfileStatus',
        ],
      },
    }).concat(
      // Add RTK Query middleware
      buyerAuthApi.middleware,
      sellerAuthApi.middleware,
      dashboardApi.middleware,
      productApi.middleware,
      orderApi.middleware,
      inventoryApi.middleware,
    ),
  
  devTools: import.meta.env.MODE !== 'production', // Enable Redux DevTools in development
});

/**
 * Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
 */
setupListeners(store.dispatch);

// Export types for TypeScript (if needed in future)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;