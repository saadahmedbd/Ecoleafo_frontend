// src/layouts/PublicLayout.jsx

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DesktopHeader from './components/DesktopHeader';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';

/**
 * Public Layout
 * Layout for public pages with responsive header/footer
 */
const PublicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pages that should NOT show header/footer
  const noLayoutPages = ['/buyer/login', '/buyer/register', '/seller/login', '/seller/register'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  // Pages that should NOT show bottom nav on mobile
  const noBottomNavPages = location.pathname.startsWith('/products/') || location.pathname.startsWith('/buyer/messages');
  const showBottomNav = showLayout && isMobile && !noBottomNavPages;

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path.includes('/cart')) return 'cart';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/account') || path.includes('/profile')) return 'account';
    return 'home';
  };

  const handleNavigate = (page) => {
    const routes = {
      home: '/',
      orders: '/buyer/orders',
      wishlist: '/buyer/wishlist',
      cart: '/buyer/cart',
      account: '/buyer/account'
    };
    navigate(routes[page] || '/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Header */}
      {showLayout && (
        isMobile ? <MobileHeader title="TreeShop" /> : <DesktopHeader />
      )}
      
      {/* Main content */}
      <main className={`flex-1 bg-gray-50 ${isMobile && showBottomNav ? 'pb-20' : ''}`}>
        <Outlet />
      </main>
      
      {/* Conditional Footer */}
      {showLayout && !isMobile && <Footer />}
      
      {/* Bottom Navigation for Mobile - Hidden on product details */}
      {showBottomNav && (
        <BottomNav
          currentPage={getCurrentPage()}
          onNavigate={handleNavigate}
          cartCount={0}
        />
      )}
    </div>
  );
};

export default PublicLayout;