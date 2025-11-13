// src/routes/publicRoutes.jsx
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerProducts from '../pages/public/SellerProducts';
// import SellerAccount from '../pages/seller/SellerAccount';
import SellerSettings from '../pages/seller/SellerSettings';
import PendingApproval from '../pages/seller/PendingApproval';
import SellerInventory from '../pages/public/SellerInventory';
import SellerMessages from '../pages/public/SellerMessages';
import SellerOrder from '../pages/public/SellerOrders';
// import SellerOrders from '../pages/public/SellerOrders copy';
import SellerPayouts from '../pages/public/SellerPayouts';
import SellerAccount from '../pages/public/SellerAccount';
import  HomePage  from '../pages/public/HomePage';
import ProductDetails from '../pages/public/ProductDetails';
// import Home from '@/pages/public/HomePage';
// import Products from '../pages/public/Products';

const publicRoutes = {
  path: '/',
  element: <PublicLayout />,
  children: [
    { index: true, element: <HomePage/> },
    { path: 'products/:id', element: <ProductDetails /> },
  ],
};

export default publicRoutes;
