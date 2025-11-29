import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Star,
  BarChart3,
  FileText,
  Settings,
  Users
} from 'lucide-react';

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'admin/dashboard' },
    { icon: Store, label: 'Sellers', path: '/admin/sellers' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: DollarSign, label: 'Earnings', path: '/admin/earnings' },
    { icon: DollarSign, label: 'Payouts', path: '/admin/payouts' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: FileText, label: 'Activity Logs', path: '/admin/logs' },
    { icon: Users, label: 'Admin Management', path: '/admin' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#E5E5E5] z-40 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 flex flex-col
        `}
        style={{ top: '64px', height: 'calc(100vh - 64px)' }}
      >
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`
                  flex items-center gap-3 px-6 py-3 mx-2 rounded-lg transition-colors
                  ${active 
                    ? 'bg-[#064232] text-white' 
                    : 'text-[#666666] hover:bg-[#FFF5F2] hover:text-[#064232]'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
