// src/layouts/components/Sidebar.jsx

import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';

/**
 * Reusable Sidebar Component
 * Used in Seller and Admin layouts
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Sidebar open/closed state
 * @param {Array} props.menuItems - Array of menu item objects
 * @param {string} props.currentPath - Current route path for active state
 * @param {string} props.role - User role (seller/admin) for styling
 * @returns {React.ReactNode}
 */
const Sidebar = ({ isOpen, menuItems, currentPath, role }) => {
  const dispatch = useAppDispatch();

  /**
   * Handle logout
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  /**
   * Determine sidebar color based on role
   */
  const getSidebarColor = () => {
    switch (role) {
      case 'admin':
        return 'bg-gray-900 text-white';
      case 'seller':
        return 'bg-blue-900 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <aside
      style={{ width: isOpen ? '240px' : '80px' }}
      className={`
        ${getSidebarColor()}
        transition-all duration-300 ease-in-out
        flex flex-col
        h-screen sticky top-0
        flex-shrink-0
      `}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-white border-opacity-20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center font-bold text-xl">
            {role === 'admin' ? 'A' : 'S'}
          </div>
          {isOpen && (
            <div>
              <h2 className="text-lg font-bold">
                {role === 'admin' ? 'Admin' : 'Seller'}
              </h2>
              <p className="text-xs opacity-70">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive 
                  ? 'bg-white bg-opacity-20 font-semibold' 
                  : 'hover:bg-white hover:bg-opacity-10'
                }
              `}
              title={!isOpen ? item.name : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="p-4 border-t border-white border-opacity-20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          title={!isOpen ? 'Logout' : ''}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;