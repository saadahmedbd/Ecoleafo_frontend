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
import ProductDetails from '@/pages/public/ProductDetails';
import HomePage from '@/pages/public/HomePage';
import Cart from '../pages/buyer/Cart';
import Wishlist from '../pages/buyer/Wishlist';
import AccountPage from '../pages/buyer/AccountPage';
import BuyerProfilePage from '../pages/buyer/BuyerProfilepage';
import BuyerPasswordPage from '../pages/buyer/BuyerPasswordPage';
import BuyerAddressesPage from '../pages/buyer/BuyerAddressesPage';
import CheckoutPage from '../pages/buyer/CheckoutPage';
import Orders from '../pages/buyer/Orders'
import MyOrders from '../pages/buyer/MyOrders'
// import OrdersPage from '../pages/buyer/OrdersPage';

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
            { index: true, element: <HomePage /> },
            // { path: 'orders', element: <OrdersPage /> },
            { path: 'cart', element: <Cart /> },
            { path: 'wishlist', element: <Wishlist /> },
            { path: 'products/:slug', element: <ProductDetails /> },
            { path: 'account', element: <AccountPage /> },
            { path: 'profile', element: <BuyerProfilePage /> },
            { path: 'password', element: <BuyerPasswordPage /> },
            { path: 'addresses', element: <BuyerAddressesPage /> },
            { path: 'checkout', element: <CheckoutPage /> },
            { path: 'orders/:orderId', element: <Orders /> },
            { path: 'orders', element: <MyOrders /> },



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
