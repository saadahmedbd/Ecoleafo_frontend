// src/routes/publicRoutes.jsx
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import  HomePage  from '../pages/public/HomePage';
import ProductDetails from '../pages/public/ProductDetails';

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
