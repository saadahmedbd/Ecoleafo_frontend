// src/layouts/components/MobileNav.jsx

import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectCurrentUser, logout } from '@/features/auth/authSlice';

/**
 * Mobile Navigation Component
 * Slide-out menu for mobile buyer layout
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Menu open/closed state
 * @param {Function} props.onClose - Close menu callback
 * @returns {React.ReactNode}
 */
const MobileNav = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    dispatch(logout());
    onClose();
  };

  /**
   * Handle link click - close menu
   */
  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 w-80 bg-white z-40 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-semibold">{user?.name || 'User'}</p>
            <p className="text-sm opacity-80">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="p-4 space-y-2">
        <Link
          to="/buyer/dashboard"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleLinkClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="font-medium">Dashboard</span>
        </Link>

        <Link
          to="/buyer/orders"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleLinkClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="font-medium">My Orders</span>
        </Link>

        <Link
          to="/buyer/wishlist"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleLinkClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="font-medium">Wishlist</span>
        </Link>

        <Link
          to="/buyer/profile"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleLinkClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">Profile</span>
        </Link>

        <hr className="my-4" />

        <Link
          to="/buyer/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={handleLinkClick}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-red-600 w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileNav;