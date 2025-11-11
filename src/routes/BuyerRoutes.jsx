// src/routes/buyerRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthGuard from '@/guards/AuthGuard';
import RoleGuard from '@/guards/RoleGuard';
import Login from '@/pages/public/Login';
import BuyerSignUp from '@/pages/public/SignUpPage';
import BuyerForgotPassword from '@/pages/public/ForgetPassword';
import ProductReviews from '@/pages/buyer/ProductReviews';
import CreateReview from '@/pages/buyer/CreateReview';
import MyReviews from '@/pages/buyer/MyReviews';
import EditReview from '@/pages/buyer/EditReview';
import Buyerlayout from '@/layouts/BuyerLayout';
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
    {
        path: '/buyer',
        element: (
            <AuthGuard>
            <RoleGuard allowedRoles={['buyer']}>
                <Buyerlayout/>
            </RoleGuard>
            </AuthGuard>
        ),
        children: [
            { index: true, element: <Navigate to="/buyer/dashboard" replace /> },
            // { path: 'dashboard', element: <BuyerDashboard /> },
            // { path: 'cart', element: <Cart /> },
            // { path: 'orders', element: <Orders /> },
            // { path: 'profile', element: <BuyerProfile /> },
            {
                path: 'reviews',
                children: [
                    { path: 'product/:productId', element: <ProductReviews /> },
                    { path: 'create/:productId', element: <CreateReview /> },
                    { path: 'my-reviews', element: <MyReviews /> },
                    { path: 'edit/:reviewId', element: <EditReview /> },
                ],
            },
        ],
    }
];


export default buyerRoutes;
