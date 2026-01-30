// src/routes/index.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import publicRoutes from './PublicRoutes'
import buyerRoutes from './BuyerRoutes';
import sellerRoutes from './SellerRoutes';
import adminRoutes from './AdminRoutes'
import { pageview } from '../utils/analytics';
// import NotFound from '@/pages/errors/NotFound';
// import Unauthorized from '@/pages/errors/Unauthorized';

const router = createBrowserRouter([
  publicRoutes,
  ...buyerRoutes,
  ...sellerRoutes,  // spread because sellerRoutes is an array
  ...adminRoutes,
  // {
  //   path: '/unauthorized',
  //   element: <Unauthorized />,
  // },
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

export default function AppRoutes() {
  useEffect(() => {
    pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      if (state.navigation.state === 'idle') {
        pageview(state.location.pathname + state.location.search);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  return <RouterProvider router={router} />;
}