// src/layouts/PublicLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

/**
 * Public Layout
 * Layout for non-authenticated pages (home, products, login, register)
 * 
 * Features:
 * - Simple header with login/register links
 * - Full-width content area
 * - Footer with site information
 * 
 * @returns {React.ReactNode}
 */
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with navigation */}
      <Header variant="public" />
      
      {/* Main content area */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicLayout;