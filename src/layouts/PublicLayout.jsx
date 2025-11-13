// src/layouts/PublicLayout.jsx

import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DesktopHeader from './components/DesktopHeader';
import MobileHeader from './components/MobileHeader';
import Footer from './components/Footer';

/**
 * Public Layout
 * Layout for public pages with responsive header/footer
 */
const PublicLayout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pages that should NOT show header/footer
  const noLayoutPages = ['/buyer/login', '/buyer/register', '/seller/login', '/seller/register'];
  const showLayout = !noLayoutPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Header */}
      {showLayout && (
        isMobile ? <MobileHeader title="TreeShop" /> : <DesktopHeader />
      )}
      
      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      
      {/* Conditional Footer */}
      {showLayout && <Footer />}
    </div>
  );
};

export default PublicLayout;