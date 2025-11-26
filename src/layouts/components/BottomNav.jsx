// src/layouts/components/BottomNav.jsx - FIXED WITH PROPER COUNT APIS
import React from 'react';
import { Home, Package, Heart, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import { useGetWishlistCountQuery } from '@/features/wishlist/wishlistApi';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get cart and wishlist counts from backend - PROPER APIS
  const { data: cartCountData } = useGetCartCountQuery();
  const { data: wishlistCountData } = useGetWishlistCountQuery();
  
  const cartCount = cartCountData?.count || 0;
  const wishlistCount = wishlistCountData?.count || 0;

  // Determine current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/cart')) return 'cart';
    if (path.includes('/profile') || path.includes('/account')) return 'account';
    return 'home';
  };

  const currentPage = getCurrentPage();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'orders', icon: Package, label: 'Orders', path: '/buyer/orders' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/buyer/wishlist', count: wishlistCount },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', path: '/buyer/cart', count: cartCount },
    { id: 'account', icon: User, label: 'Account', path: '/buyer/profile' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-lg md:hidden" 
      style={{ zIndex: 9999 }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px] ${
                isActive ? 'bg-green-50' : ''
              }`}
              style={{
                color: isActive ? '#16a34a' : '#6b7280',
              }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}