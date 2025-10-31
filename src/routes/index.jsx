// src/routes/index.jsx
import { createBrowserRouter,RouterProvider  } from 'react-router-dom';
import publicRoutes from './PublicRoutes'
import buyerRoutes from './BuyerRoutes';
import sellerRoutes from './SellerRoutes';
// import adminRoutes from './routes//adminRoutes';
// import NotFound from '@/pages/errors/NotFound';
// import Unauthorized from '@/pages/errors/Unauthorized';

const router = createBrowserRouter([
  publicRoutes,
  ...buyerRoutes,
  ...sellerRoutes,  // spread because sellerRoutes is an array
  // adminRoutes,
  // {
  //   path: '/unauthorized',
  //   element: <Unauthorized />,
  // },
  // {
  //   path: '*',
  //   element: <NotFound />,
  // },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}