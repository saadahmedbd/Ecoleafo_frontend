// src/layouts/BuyerLayout.jsx

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import { useGetCartCountQuery } from '@/features/cart/cartApi';

export function BuyerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cartCountData } = useGetCartCountQuery();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/cart')) return 'cart';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/profile') || path.includes('/profile')) return 'account';
    return 'home';
  };

  const handleNavigate = (page) => {
    const routes = {
      home: '/buyer',
      orders: '/buyer/orders',
      wishlist: '/buyer/wishlist',
      cart: '/buyer/cart',
      account: '/buyer/account'
    };
    navigate(routes[page] || '/buyer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className={`flex-1 ${isMobile ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {isMobile && (
        <BottomNav
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          cartCount={cartCountData?.count || 0}
        />
      )}
    </div>
  );
}

export default BuyerLayout;