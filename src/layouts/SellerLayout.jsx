import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, User, Store, CreditCard, Star, Box } from 'lucide-react';
import Sidebar from './components/Sidebar';
import SellerBottomNav from './components/SellerBottomNav';

const menuItems = [
  { id: 'dashboard', name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'products', name: 'Products', path: '/seller/products', icon: <Package className="w-5 h-5" /> },
  { id: 'orders', name: 'Orders', path: '/seller/orders', icon: <ShoppingCart className="w-5 h-5" /> },
  { id: 'inventory', name: 'Manage Inventory', path: '/seller/inventory', icon: <Box className="w-5 h-5" /> },
  { id: 'reviews', name: 'Customer Reviews', path: '/seller/reviews', icon: <Star className="w-5 h-5" /> },
  { id: 'payment', name: 'Payment Settings', path: '/seller/add-payment', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'settings', name: 'Store Settings', path: '/seller/setting', icon: <Store className="w-5 h-5" /> },
  { id: 'messages', name: 'Messages', path: '/seller/messages', icon: <MessageSquare className="w-5 h-5" /> },
  { id: 'account', name: 'Account', path: '/seller/account/information', icon: <User className="w-5 h-5" /> }
];

export default function SellerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const currentPage = menuItems.find(item => location.pathname.includes(item.path))?.id || 'dashboard';

  const handleNavigate = (id) => {
    // Mobile navigation paths
    const mobilePaths = {
      dashboard: '/seller/dashboard',
      products: '/seller/products',
      orders: '/seller/orders',
      messages: '/seller/messages',
      account: '/seller/account'
    };
    
    if (mobilePaths[id]) {
      navigate(mobilePaths[id]);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar only for desktop */}
      {!isMobile && (
        <Sidebar isOpen={isSidebarOpen} menuItems={menuItems} currentPath={location.pathname} role="seller" />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {!isMobile && (
          <header className="bg-white shadow-sm flex items-center justify-between px-6 py-4">
            <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Seller Dashboard</h1>
          </header>
        )}

        <main className="flex-1 p-4 pt-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav only for mobile */}
      {isMobile && (
        <SellerBottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}
