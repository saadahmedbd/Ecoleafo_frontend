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
    path: '/seller/add-payment',
    element: (
      <AuthGuard>
        <RoleGuard allowedRoles={['seller']}>
          <AddPayment />
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
      { index: true, element: <Navigate to="/seller/account" replace /> },
      { path: 'dashboard', element: <SellerDashboard /> },
      { path: 'account', element: <SellerAccount /> },
      { path: 'setting', element: <SellerSettings /> },


    ],
  },
];

export default sellerRoutes;
