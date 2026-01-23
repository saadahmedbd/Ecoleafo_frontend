// src/layouts/BuyerLayout.jsx

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import DesktopHeader from './components/DesktopHeader';
import MobileHeader from './components/MobileHeader';
import CategoryNav from './components/CategoryNav';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import { useGetWishlistCountQuery } from '@/features/wishlist/wishlistApi';

export function BuyerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: cartCountData } = useGetCartCountQuery();
  const { data: wishlistCountData } = useGetWishlistCountQuery();
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

  // Pages that should NOT show bottom nav
  const noBottomNavPages =  location.pathname.includes('/products/');
  const showBottomNav = isMobile && !noBottomNavPages;
  
  // Pages that should NOT show category nav
  const noCategoryNavPages = location.pathname.includes('/cart') || 
                             location.pathname.includes('/wishlist')|| 
                            location.pathname.includes('/checkout') ||
                             location.pathname.includes('/order') ||
                             location.pathname.includes('/profile') ||
                             location.pathname.includes('/account') ||
                             location.pathname.includes('/buyer/categories') ||
                             location.pathname.includes('/buyer/category/:slug');

                             
  const showCategoryNav = !isMobile && !noCategoryNavPages;

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
      {isMobile ? (
        <MobileHeader 
          cartCount={cartCountData?.count || 0}
          wishlistCount={wishlistCountData?.count || 0}
          onCartClick={() => navigate('/buyer/cart')}
          onWishlistClick={() => navigate('/buyer/wishlist')}
        />
      ) : (
        <DesktopHeader />
      )}
      {showCategoryNav && <CategoryNav />}
      <main className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      {showBottomNav && (
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