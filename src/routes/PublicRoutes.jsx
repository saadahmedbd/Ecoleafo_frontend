// src/routes/publicRoutes.jsx
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import SellerDashboard from '../pages/seller/SellerDashboard';
import SellerAccount from '../pages/seller/SellerAccount';
import SellerSettings from '../pages/seller/SellerSetting';
import Home from '@/pages/public/HomePage';
// import Products from '@/pages/public/Products';

const publicRoutes = {
  path: '/',
  element: <PublicLayout />,
  children: [
    // {index:'seller/dashboard', element:<SellerDashboard/>},
    // {index:'seller/account', element:<SellerAccount/>}
    //  {index:'seller/setting', element:<SellerSettings/>}


    // { index: true, element: <Home /> },
    // { path: 'products', element: <Products /> },
    // { path: 'products/:id', element: <div>Product Details</div> },
  ],
};

export default publicRoutes;
