
import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Menu,
  X,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Home,
  Users,
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  FileText,
  Settings,
  Search,
  DollarSign,
  CircleDollarSignIcon,
  Star
} from 'lucide-react';
import AdminAuthService from '@/services/adminAuthService';
import { clearAuth, selectUser } from '@/features/auth/authSlice';
import { path } from 'framer-motion/client';

/**
 * Fully Responsive Admin Dashboard Layout
 * Adapts to mobile, tablet, and desktop screens
 * 
 * Features:
 * - Mobile: Bottom navigation + hamburger menu
 * - Tablet: Collapsible sidebar
 * - Desktop: Full sidebar with icons and labels
 * - Touch-optimized for all screen sizes
 * - Smooth animations and transitions
 */
const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const adminAuthService = new AdminAuthService(dispatch);

  // State management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Menu items configuration
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
    { name: 'Users', path: '/admin/sellers', icon: Users },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    {name:'Earnings',path:'/admin/earnings', icon:DollarSign},
    {name:"Payouts", path:'/admin/payouts', icon:CircleDollarSignIcon},
    {name:"Reviews", path:'/admin/reviews', icon:Star},
    {name:"Activity Logs", path:'/admin/activity/logs', icon:FileText},
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Reports', path: '/admin/reports', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'A';
  };

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    setIsLoggingOut(true);
    try {
      await adminAuthService.logout();
      dispatch(clearAuth());
      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo/Title */}
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#064232] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-gray-800">Admin</span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-8 h-8 bg-[#064232] rounded-lg flex items-center justify-center text-white font-semibold text-sm"
            >
              {getUserInitials()}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] focus:border-transparent text-sm"
            />
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                System Active
              </span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users, products, orders..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors text-sm font-medium">
              Quick Action
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#064232] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-sm font-medium text-gray-800">{user?.full_name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <Link
                      to="/admin/profile"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span className="text-sm text-gray-700">Profile</span>
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings size={18} />
                      <span className="text-sm text-gray-700">Settings</span>
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={18} />
                      <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transition-all duration-300 ease-in-out
          ${isMobile ? 'top-[121px]' : 'top-[73px]'}
          ${isSidebarOpen 
            ? 'translate-x-0 w-64' 
            : isMobile 
              ? '-translate-x-full w-64' 
              : 'w-20'
          }
        `}
      >
        {/* Logo - Desktop only when collapsed */}
        {!isMobile && !isSidebarOpen && (
          <div className="flex items-center justify-center py-6 border-b border-gray-200">
            <div className="w-10 h-10 bg-[#064232] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-full pb-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                    ? 'bg-[#064232] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}
                `}
                title={!isSidebarOpen && !isMobile ? item.name : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {(isSidebarOpen || isMobile) && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}

          {/* Logout button - Mobile only */}
          {isMobile && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 mt-4"
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className="font-medium text-sm">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
          )}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? 'pt-[121px] px-4 pb-20' 
            : `pt-[73px] px-6 pb-6 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`
          }
        `}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {menuItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[70px]
                    ${isActive
                      ? 'text-[#064232] bg-[#064232]/10'
                      : 'text-gray-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile profile menu */}
      {isMobile && isProfileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsProfileMenuOpen(false)}
          />
          <div className="fixed top-[70px] right-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#064232] rounded-lg flex items-center justify-center text-white font-semibold">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.full_name || 'Admin'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="py-2">
              <Link
                to="/admin/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <User size={18} />
                <span className="text-sm text-gray-700">Profile</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
              >
                <Settings size={18} />
                <span className="text-sm text-gray-700">Settings</span>
              </Link>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
              >
                <LogOut size={18} />
                <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;