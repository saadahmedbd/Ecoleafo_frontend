// src/routes/AdminRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminGuard from '@/guards/adminGuard';
import AdminLayout from '@/layouts/AdminLayout';
import AdminLogin from '@/pages/admin/Login';
import AdminRegisterPage from '../pages/admin/Register';
import Homepage from '../pages/public/HomePage';
import AdminDashboard from '@/pages/admin/Dashboard';
import ForgotPassword from '../pages/admin/ForgotPassword';
import ActivityLogsPage from '../pages/admin/ActivityLogPage';
import AdminManagementPage from '../pages/admin/AdminManagementPage';
import EarningsPage from '../pages/admin/EarningsPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';
import OrdersListPage from '../pages/admin/OrderListPage';
import PayoutsPage from '../pages/admin/PayoutsPage';
import ProductsListPage from '../pages/admin/ProductsListPage';
import ProductDetailPage from '../pages/admin/ProductDetailsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import ReviewsPage from '../pages/admin/ReviewPage';
import AdminReviews from '../pages/admin/AdminReviews';
import SellerDetailPage from '../pages/admin/SellerDetailPage';
import SellersListPage from '../pages/admin/SellersListPage';
import SellerEarningsDetail from '../pages/admin/SellerEarningsDetail';
import AllSellerEarnings from '../pages/admin/AllSellerEarnings';
import SettingsPage from '../pages/admin/SettingPage';
import AdminInvitations from '../pages/admin/Invitations';
import Admins from '../pages/admin/Users';
import AdminProfile from '../pages/admin/Profile';
import UsersPage from '../pages/admin/UsersPage';
import BuyersListPage from '../pages/admin/BuyersListPage';
import BuyerDetailPage from '../pages/admin/BuyerDetailPage';
import CategoryManagement from '../pages/admin/CategoriesListPage';
import CategoriesTree from '../pages/admin/CategoryTreePage';
import CategoryFormPage from '../pages/admin/CategoryFormPage';
import CategoryDetailPage from '../pages/admin/CategoryDetailPage';

const adminRoutes = [
  // Admin Authentication Routes (Public)
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/register',
    element: <AdminRegisterPage />,
  },
  {
    path: '/admin/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/admin/forgot/password',
    element: <ForgotPassword />,
  },

  // Protected Admin Dashboard Routes
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'management', element: <AdminManagementPage /> },
      { path: 'earnings', element: <EarningsPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'orders', element: <OrdersListPage /> },
      { path: 'payouts', element: <PayoutsPage /> },
      { path: 'payouts/:id', element: <PayoutsPage /> },
      { path: 'products', element: <ProductsListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'reviews', element: <AdminReviews /> },
      { path: 'sellers/earnings/all', element: <AllSellerEarnings /> },
      { path: 'sellers/:id/earnings', element: <SellerEarningsDetail /> },
      { path: 'sellers/:id', element: <SellerDetailPage /> },
      { path: 'sellers', element: <SellersListPage /> },
      {path :'users',element:<UsersPage/>},
      {path:'buyers', element:<BuyersListPage/>},
      {path:'buyers/:id',element:<BuyerDetailPage/>},
      { path: 'settings', element: <SettingsPage /> },
      { path: 'all', element: <Admins /> },
      { path: 'invitations', element: <AdminInvitations /> },
      { path: 'profile', element: <AdminProfile /> },
      {path:'activity/logs', element:<ActivityLogsPage/>},
      {path:'categories', element:<CategoryManagement/>},
      {path:'categories/tree', element:<CategoriesTree/>},
      {path:'categories/create', element:<CategoryFormPage/>},
      {path:'categories/:id', element:<CategoryDetailPage/>},
      {path:'categories/:id/edit', element:<CategoryFormPage/>},





    ],
  },
];

export default adminRoutes;

