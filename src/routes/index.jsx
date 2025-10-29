// src/routes/index.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/features/auth/authSlice';
import { USER_ROLES, ROLE_DEFAULT_ROUTES } from '@/constants/roles';

// Guards
import AuthGuard from '@/guards/AuthGuard';
import RoleGuard from '@/guards/RoleGuard';
import GuestGuard from '@/guards/GuestGuard';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import BuyerLayoutWrapper from '@/layouts/BuyerLayoutWrapper';
import SellerLayout from '@/layouts/SellerLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Public Pages
import HomePage from '@/pages/public/Home';
import LoginPage from '@/pages/public/Login';
import SignUpPage from '@/pages/public/SignUp';
import ForgotPasswordPage from '@/pages/public/ForgetPassword';
import ProductsPage from '@/pages/public/Products';

// Buyer Pages
import BuyerDashboard from '@/pages/buyer/Dashboard';
import BuyerCart from '@/pages/buyer/Cart';
import BuyerOrders from '@/pages/buyer/Orders';
import BuyerProfile from '@/pages/buyer/Profile';

// Seller Pages
import SellerDashboard from '@/pages/seller/Dashboard';
import SellerProducts from '@/pages/seller/Products';
import SellerOrders from '@/pages/seller/Orders';
import SellerAnalytics from '@/pages/seller/Analytics';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';
import AdminProducts from '@/pages/admin/Products';
import AdminSettings from '@/pages/admin/Settings';

/**
 * Main Application Routes
 * Centralized route configuration with role-based access control
 * 
 * Route Structure:
 * - Public routes (accessible to all)
 * - Guest-only routes (login, register)
 * - Buyer routes (authenticated buyers only)
 * - Seller routes (authenticated sellers only)
 * - Admin routes (authenticated admins only)
 * 
 * @returns {React.ReactNode}
 */
const AppRoutes = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  /**
   * Determine redirect path for root route
   */
  const getRootRedirect = () => {
    if (!isAuthenticated) {
      return '/';
    }
    return ROLE_DEFAULT_ROUTES[user?.role] || '/';
  };

  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Route>

      {/* ==================== GUEST-ONLY ROUTES ==================== */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage
              onBack={() => navigate('/')}
              onSignUpClick={() => navigate('/signup')}
              onForgotPasswordClick={() => navigate('/forgot-password')}
              onGuestContinue={() => navigate('/products')}
            />
          </GuestGuard>
        }
      />

        <Route
        path="/signup"
        element={
          <GuestGuard>
            <SignUpPage
              onBack={() => navigate('/')}
              onLoginClick={() => navigate('/login')}
            />
          </GuestGuard>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestGuard>
            <ForgotPasswordPage
              onBack={() => navigate('/login')}
              onLoginClick={() => navigate('/login')}
            />
          </GuestGuard>
        }
      />

      {/* ==================== BUYER ROUTES ==================== */}
      <Route
        path="/buyer/*"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.BUYER]}>
              <BuyerLayoutWrapper />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<BuyerDashboard />} />
        <Route path="cart" element={<BuyerCart />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="profile" element={<BuyerProfile />} />
        <Route path="wishlist" element={<div>Wishlist Page</div>} />
        <Route path="settings" element={<div>Settings Page</div>} />
        
        {/* Redirect /buyer to /buyer/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ==================== SELLER ROUTES ==================== */}
      <Route
        path="/seller/*"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.SELLER]}>
              <SellerLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="settings" element={<div>Seller Settings</div>} />
        
        {/* Redirect /seller to /seller/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ==================== ADMIN ROUTES ==================== */}
      <Route
        path="/admin/*"
        element={
          <AuthGuard>
            <RoleGuard allowedRoles={[USER_ROLES.ADMIN]}>
              <AdminLayout />
            </RoleGuard>
          </AuthGuard>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<div>Admin Orders</div>} />
        <Route path="categories" element={<div>Categories Management</div>} />
        <Route path="analytics" element={<div>System Analytics</div>} />
        <Route path="reports" element={<div>Reports</div>} />
        <Route path="settings" element={<AdminSettings />} />
        
        {/* Redirect /admin to /admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ==================== FALLBACK ROUTES ==================== */}
      {/* 404 Not Found */}
      <Route path="/404" element={<div>404 - Page Not Found</div>} />
      
      {/* Catch all - redirect to root or 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;