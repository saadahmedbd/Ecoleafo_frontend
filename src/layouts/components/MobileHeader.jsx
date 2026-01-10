// src/layouts/components/MobileHeader.jsx
import React, { useState } from 'react';
import { ArrowLeft, Search, ShoppingCart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import logo from '@/assets/AIRetouch_20251230_111158251.png';

export default function MobileHeader({
  title = "TreeShop",
  subtitle = "",
  showBack = false,
  onBack,
  showSearch = false,
  showCart = true,
  showNotifications = false
}) {
  const navigate = useNavigate();
  const { data: cartCountData } = useGetCartCountQuery();
  const cartCount = cartCountData?.count || 0;
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex flex-col">
        {/* Main Header Row */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showBack && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
            )}

            <div className="flex-1 min-w-0">
              {title === "TreeShop" ? (
                <img src={logo} alt="TreeShop" className="h-8 w-auto" />
              ) : (
                <>
                  <h1 className="text-lg font-bold text-gray-800 truncate">{title}</h1>
                  {subtitle && (
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {showCart && (
              <button
                onClick={() => navigate('/buyer/cart')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#16a34a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            )}

            {showNotifications && (
              <button
                onClick={() => navigate('/buyer/notifications')}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Row - Always visible for homepage */}
        {title === "TreeShop" && (
          <div className="px-4 pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for trees, plants..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
