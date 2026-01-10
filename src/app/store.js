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
import { dashboardApi } from '../features/seller_dashboard/dashboardApi';
import { productApi } from '../features/product/productApi';
import { orderApi } from '../features/seller_order_management/orderApi';
import { inventoryApi } from '../features/seller_inventory/InventoryApi';
import reducer from '../features/auth/authSlice';
import { cartApi } from '../features/cart/cartApi';
import { wishlistApi } from '../features/wishlist/wishlistApi';
import { categoriesApi } from '../features/categories/categoriesApi';
import { buyerProductApi } from '../features/BuyerProduct/buyerProductApi';
import { buyerProfileApi } from '../features/buyerProfile/buyerProfileApi';
import { checkoutApi } from '../features/checkout/checkoutApi';
import checkoutReducer from '../features/checkout/checkoutSlice';
import { ordersApi } from '../features/orders/ordersApi';
import { adminAuthApi } from '../features/auth/adminAuthApi';
import { adminApi } from '../features/Admin/adminAPI';
import { userManagementApi } from '../features/UsersManagement/usersManagementApi';
import { productManagementApi } from '../features/ProductManagement/productManagementApi';
import { orderManagementApi } from '../features/OrderManagement/orderManagementApi';
import { dashboarManagementdApi } from '../features/DashboardManagement/dashboardManagementApi';
import { categoryManagementApi } from '../features/CategoryManagement/categoryManagementApi';
import { earningsCommissionApi } from '../features/EarningsCommission/earningsCommissionApi';
import { auditLogApi } from '../features/AuditLog/auditLogApi';
import { messagingApi } from '../features/Messaging/messagingApi';
import { productDetailsApi } from '../features/ProductsDetail/productDetailsApi';
import {reviewApi} from '../features/review/reviewApi'
import { searchApi } from '../features/search/searchApi';
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
    [productApi.reducerPath]:productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [inventoryApi.reducerPath]:inventoryApi.reducer,
    [buyerProductApi.reducerPath]: buyerProductApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [buyerProfileApi.reducerPath]:buyerProfileApi.reducer,
    [checkoutApi.reducerPath]:checkoutApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    [adminApi.reducerPath]:adminApi.reducer,
    [userManagementApi.reducerPath]:userManagementApi.reducer,
    [productManagementApi.reducerPath]:productManagementApi.reducer,
    [orderManagementApi.reducerPath]:orderManagementApi.reducer,
    [dashboarManagementdApi.reducerPath]:dashboarManagementdApi.reducer,
    [categoryManagementApi.reducerPath]:categoryManagementApi.reducer,
    [earningsCommissionApi.reducerPath]:earningsCommissionApi.reducer,
    [auditLogApi.reducerPath]:auditLogApi.reducer,
    [messagingApi.reducerPath]:messagingApi.reducer,
    [productDetailsApi.reducerPath]:productDetailsApi.reducer,
    [reviewApi.reducerPath]:reviewApi.reducer,
    [searchApi.reducerPath]:searchApi.reducer,




    // Checkout state
    checkout: checkoutReducer,

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
      buyerProductApi.middleware,
      cartApi.middleware,
      wishlistApi.middleware,
      categoriesApi.middleware,
      buyerProfileApi.middleware,
      checkoutApi.middleware,
      ordersApi.middleware,
      adminAuthApi.middleware,
      adminApi.middleware,
      userManagementApi.middleware,
      productManagementApi.middleware,
      orderManagementApi.middleware,
      dashboarManagementdApi.middleware,
      categoryManagementApi.middleware,
      earningsCommissionApi.middleware,
      auditLogApi.middleware,
      messagingApi.middleware,
      productDetailsApi.middleware,
      reviewApi.middleware,
      searchApi.middleware,
      
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