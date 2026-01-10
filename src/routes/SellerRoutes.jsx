import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '@/guards/AuthGuard';
import RoleGuard from '@/guards/RoleGuard';
import SellerGuard from '@/guards/SellerGuard';
import SellerLayout from '@/layouts/SellerLayout';
import SellerLogin from '@/pages/seller/SellerLogin';
import SellerRegister from '@/pages/seller/SellerRegister';
import CompleteProfile from '@/pages/seller/CompleteProfile';
import AddPayment from '@/pages/seller/AddPayment';
import PendingApproval from '@/pages/seller/PendingApproval';
import SellerAccount from '@/pages/seller/SellerAccount';
import SellerDashboard from '@/pages/seller/SellerDashboard';
import SellerSettings from '../pages/seller/SellerSettings';
import SellerProducts from '../pages/seller/SellerProducts';
import SellerOrders from '../pages/seller/SellerOrders';
import SellerOrderDetails from '../pages/seller/SellerOrderDetails';
import HomeSellerAccount from '../pages/seller/HomeSellerAccount';
import SellerInventory from '../pages/seller/SellerInventory';
import AddProduct from '../pages/seller/AddProduct';
import EditProduct from '../pages/seller/EditProduct';
import ProductDetail from '../pages/seller/ProductDetail';
import SellerMessages from '../pages/seller/SellerMessages';
import SellerReviews from '../pages/seller/SellerReviews';

const sellerRoutes = [
  // Seller Authentication
  {
    path: '/seller/login',
    element: <SellerLogin />,
  },
  {
    path: '/seller/register',
    element: <SellerRegister />,
  },

  // Seller Onboarding
  {
    path: '/seller/complete-profile',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['seller']}>
          <CompleteProfile />
        </RoleGuard>
      </AuthGuard>
    ),
  },
  {
    path: '/seller/pending-approval',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['seller']}>
          <PendingApproval />
        </RoleGuard>
      </AuthGuard>
    ),
  },

  // Protected Seller Dashboard Routes

  {
    path: '/seller',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['seller']}>
          <SellerGuard>
            <SellerLayout />
          </SellerGuard>
        </RoleGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/seller/dashboard" replace /> },
      { path: 'dashboard', element: <SellerDashboard /> },
      { path: 'account', element: <HomeSellerAccount /> },
      { path: 'account/information', element: <SellerAccount /> },
      { path: 'add-payment', element: <AddPayment /> },
      { path: 'setting', element: <SellerSettings /> },
      { path: 'products', element: <SellerProducts /> },
      { path: 'products/add', element: <AddProduct /> },
      { path: 'products/:productId', element: <ProductDetail /> },
      { path: 'products/:productId/edit', element: <EditProduct /> },

      { path: 'orders', element: <SellerOrders /> },
      { path: 'orders/:id', element: <SellerOrderDetails /> },
      { path: 'inventory', element:<SellerInventory/> },
      { path: 'reviews', element: <SellerReviews /> },
      { path: 'messages', element: <SellerMessages /> },
    ],
  },
];

export default sellerRoutes;
