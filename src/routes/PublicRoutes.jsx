// src/routes/publicRoutes.jsx
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerProducts from '../pages/public/SellerProducts';
import SellerAccount from '../pages/seller/SellerAccount';
import SellerSettings from '../pages/seller/SellerSettings';
import PendingApproval from '../pages/seller/PendingApproval';
import Home from '@/pages/public/HomePage';
// import Products from '@/pages/public/Products';

const publicRoutes = {
  path: '/',
  element: <PublicLayout />,
  children: [
    // { index: true, element: <Home /> },
    {path: 'deshboard', element:<SellerDashboard/>}
    // {path :"seller/products", element: <SellerProducts/>}
    // { path: 'products', element: <Products /> },
    // { path: 'products/:id', element: <div>Product Details</div> },
  ],
};

export default publicRoutes;
