// src/layouts/BuyerLayout.jsx

import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Breadcrumb from './components/Breadcrumb';
import useDeviceDetection from '@/hooks/useDeviceDetection';

/**
 * Buyer Desktop Layout
 * Layout for authenticated buyer users on desktop
 * 
 * Features:
 * - Full navigation header
 * - Shopping cart indicator
 * - Breadcrumb navigation
 * - Full-width content
 * - Footer
 * - View toggle button (switch to mobile view)
 * 
 * @returns {React.ReactNode}
 */
export function  BuyerLayout  () {
  const { toggleView } = useDeviceDetection();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with buyer-specific navigation */}
      <Header variant="buyer" />
      
      {/* Breadcrumb navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb />
        </div>
      </div>
      
      {/* Main content area */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* View toggle button - Fixed position */}
      <button
        onClick={toggleView}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Switch to mobile view"
        aria-label="Switch to mobile view"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
          />
        </svg>
      </button>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BuyerLayout;