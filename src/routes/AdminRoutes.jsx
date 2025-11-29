// // src/routes/adminRoutes.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import AuthGuard from '@/guards/AuthGuard';
// import RoleGuard from '@/guards/RoleGuard';
// import AdminLayout from '@/layouts/AdminLayout';
// import AdminDashboard from '@/pages/admin/Dashboard';
// import AdminUsers from '@/pages/admin/Users';
// import AdminProducts from '@/pages/admin/Products';
// import AdminSettings from '@/pages/admin/Settings';

// const adminRoutes = {
//   path: '/admin',
//   element: (
//     <AuthGuard>
//       <RoleGuard allowedRoles={['admin']}>
//         <AdminLayout />
//       </RoleGuard>
//     </AuthGuard>
//   ),
//   children: [
//     { index: true, element: <Navigate to="/admin/dashboard" replace /> },
//     { path: 'dashboard', element: <AdminDashboard /> },
//     { path: 'users', element: <AdminUsers /> },
//     { path: 'products', element: <AdminProducts /> },
//     { path: 'settings', element: <AdminSettings /> },
//   ],
// };

// export default adminRoutes;

import React from 'react';
import AdminLayout from '@/layouts/AdminLayout'
import AdminLogin from '@/pages/admin/Login'
import Homepage from '../pages/public/HomePage';
import AdminDashboard from '@/pages/admin/Dashboard'
import ForgotPassword from '../pages/admin/ForgotPassword';
import ActivityLogsPage from '../pages/admin/ActivityLogPage';
import AdminManagementPage from '../pages/admin/AdminManagementPage';
import EarningsPage from '../pages/admin/EarningsPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';
import OrdersListPage from '../pages/admin/OrderListPage';
import PayoutsPage from '../pages/admin/PayoutsPage';
import { path } from 'framer-motion/client';
import ProductsListPage from '../pages/admin/ProductsListPage';
import ProductDetailPage from '../pages/admin/ProductDetailsPage';
import ReportsPage from '../pages/admin/ReportsPage';
import ReviewsPage from '../pages/admin/ReviewPage';
import SellerDetailPage from '../pages/admin/SellerDetailPage';
import SellersListPage from '../pages/admin/SellerListPage';
import SettingsPage from '../pages/admin/SettingPage';

// import Products from '../pages/public/Products';

const AdminRoutes = {
  path: '/',
   element: <AdminLayout />,
  children: [
    { index: true, element: <Homepage/> },
    { path: 'admin/login', element: <AdminLogin /> },
    {path:'admin/forgot-password', element: <ForgotPassword/>},
    {path:'admin/management', element: <AdminManagementPage/>},
    {path:'admin/earnings', element: <EarningsPage/>},
    {path:'admin/orders/:id', element: <OrderDetailPage/>},
    {path:'admin/orders', element: <OrdersListPage/>},
    {path:'admin/payouts', element: <PayoutsPage/>},
    {path:'admin/products', element: <ProductsListPage/>},
    {path:'admin/products/:id', element: <ProductDetailPage/>},
    {path:'admin/products/:id', element: <ProductDetailPage/>},
    {path:'admin/reports', element: <ReportsPage/>},
    {path:'admin/reviews', element: <ReviewsPage/>},
    {path:'admin/sellers/:id', element: <SellerDetailPage/>},
    {path:'admin/sellers', element: <SellersListPage/>},
    {path:'admin/settings', element: <SettingsPage/>},

    {path:'admin/activity/logs', element: <ActivityLogsPage/>},

    { path: 'admin/dashboard', element: <AdminDashboard /> },

  ],
};

export default AdminRoutes;