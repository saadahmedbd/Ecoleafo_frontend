// src/routes/buyerRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '@/guards/AuthGuard';
import RoleGuard from '@/guards/RoleGuard';
import Login from '@/pages/public/Login';
import BuyerSignUp from '@/pages/public/SignUpPage';
import BuyerForgotPassword from '@/pages/public/ForgetPassword';
// import BuyerDashboard from '../pages/buyer/Dashboard';
// import Cart from '../pages/buyer/Cart';
// import Orders from '../pages/buyer/Orders';
// import BuyerProfile from '../pages/buyer/Profile';
// import BuyerLayoutWrapper from '@/layouts/BuyerLayoutWrapper';

const buyerRoutes = [
    {
        path: '/buyer/login',
        element: (
          // <GuestGuard redirectTo="/buyer/dashboard">
            <Login />
          // </GuestGuard>
        ),
      },
      {
        path: '/buyer/signup',
        element: (
          // <GuestGuard redirectTo="/buyer/dashboard">
            <BuyerSignUp />
          // </GuestGuard>
        ),
      },
        {
            path: '/buyer/forgot-password',
            element: (
            // <GuestGuard redirectTo="/buyer/dashboard">
                <BuyerForgotPassword />
            // </GuestGuard>
            ),
        },
    // {
    //     path: '/buyer',
    //     element: (
    //         <AuthGuard>
    //         <RoleGuard allowedRoles={['buyer']}>
    //             <BuyerLayoutWrapper />
    //         </RoleGuard>
    //         </AuthGuard>
    //     ),

    //     children: [
    //         { index: true, element: <Navigate to="/buyer/dashboard" replace /> },
    //         { path: 'dashboard', element: <BuyerDashboard /> },
    //         { path: 'cart', element: <Cart /> },
    //         { path: 'orders', element: <Orders /> },
    //         { path: 'profile', element: <BuyerProfile /> },
    //     ],
    // }
];


export default buyerRoutes;
