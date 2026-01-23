// src/routes/publicRoutes.jsx
import React from 'react';
import PublicLayout from '@/layouts/PublicLayout';
import  HomePage  from '../pages/public/HomePage';
import ProductDetails from '../pages/public/ProductDetails';
import GoogleCallback from '../pages/auth/GoogleCallback';
import Login from '../pages/public/Login';
import SignUpPage from '../pages/public/SignUpPage';
import SearchPage from '../pages/public/SearchPage';
import AboutUs from '@/pages/public/AboutUs';
import Contact from '@/pages/public/Contact';
import HelpCenter from '@/pages/public/HelpCenter';
import ShippingInfo from '@/pages/public/ShippingInfo';
import Returns from '@/pages/public/Returns';
import PrivacyPolicy from '@/pages/public/PrivacyPolicy';
import TermsOfService from '@/pages/public/TermsOfService';
import CategoriesPage from '@/pages/buyer/CategoriesPage';
import CategoryProductsPage from '@/pages/buyer/CategoryProductsPage';


const publicRoutes = {
  path: '/',
  element: <PublicLayout />,
  children: [
    { index: true, element: <HomePage/> },
    { path: 'search', element: <SearchPage /> },
    { path: 'products/:id', element: <ProductDetails /> },
    { path: 'categories', element: <CategoriesPage /> },
    { path: 'category/:slug', element: <CategoryProductsPage /> },
    { path: 'auth/callback', element: <GoogleCallback /> },
    { path: 'auth/google/callback', element: <GoogleCallback /> },
    { path: 'buyer/login', element: <Login /> },
    { path: 'about', element: <AboutUs /> },
    { path: 'contact', element: <Contact /> },
   { path: 'help', element: <HelpCenter /> },
   { path: 'shipping', element: <ShippingInfo /> },
               { path: 'returns', element: <Returns /> },
               { path: 'privacy', element: <PrivacyPolicy /> },
               { path: 'terms', element: <TermsOfService /> },
            
  ],
};

export default publicRoutes;
