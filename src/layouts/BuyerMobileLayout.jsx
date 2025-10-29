// src/layouts/BuyerMobileLayout.jsx

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MobileNav from './components/MobileNav';
import useDeviceDetection from '@/hooks/useDeviceDetection';

/**
 * Buyer Mobile Layout
 * Optimized layout for buyer users on mobile devices
 * 
 * Features:
 * - Compact mobile header
 * - Bottom navigation bar
 * - Full-screen content
 * - Slide-out menu
 * - View toggle (switch to desktop view)
 * 
 * @returns {React.ReactNode}
 */
const BuyerMobileLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleView } = useDeviceDetection();

  /**
   * Toggle mobile menu
   */
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  /**
   * Close menu
   */
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu button */}
          <button
            onClick={handleMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
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
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
          
          {/* Logo */}
          <div className="text-xl font-bold text-gray-800">
            Shop
          </div>
          
          {/* Cart icon */}
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 relative"
            aria-label="Shopping cart"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            {/* Cart count badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </header>
      
      {/* Slide-out mobile menu */}
      <MobileNav isOpen={isMenuOpen} onClose={closeMenu} />
      
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMenu}
        />
      )}
      
      {/* Main content area - with bottom padding for nav */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      
      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40">
        <div className="flex justify-around items-center py-2">
          {/* Home */}
          <button className="flex flex-col items-center p-2 text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          
          {/* Categories */}
          <button className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-xs mt-1">Categories</span>
          </button>
          
          {/* Orders */}
          <button className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs mt-1">Orders</span>
          </button>
          
          {/* Profile */}
          <button className="flex flex-col items-center p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
      
      {/* View toggle button - Bottom left */}
      <button
        onClick={toggleView}
        className="fixed bottom-20 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Switch to desktop view"
        aria-label="Switch to desktop view"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
      </button>
    </div>
  );
};

export default BuyerMobileLayout;