// src/layouts/components/DesktopHeader.jsx - FIXED WITH PROPER COUNT APIS
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Bell } from 'lucide-react';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import { useGetWishlistCountQuery } from '@/features/wishlist/wishlistApi';

export default function DesktopHeader() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get cart and wishlist counts from backend - PROPER APIS
  const { data: cartCountData } = useGetCartCountQuery();
  const { data: wishlistCountData } = useGetWishlistCountQuery();
  
  const cartCount = cartCountData?.count || 0;
  const wishlistCount = wishlistCountData?.count || 0;

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userName = userData?.name || userData?.full_name || '';
  const userAvatar = userData?.avatar || userData?.profile_picture || '';
  
  // Get first letter of name for avatar fallback
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Logo - Left Side */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <div className="bg-[#16a34a] p-2 rounded-lg">
              <span className="text-white text-2xl">🌳</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 hidden lg:block">TreeShop</h1>
          </div>

          {/* Search Bar - Center (Maximum Width) */}
          <form 
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for trees, plants, and more..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </form>

          {/* Action Icons - Right Side */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => navigate('/buyer/wishlist')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
              title="Wishlist"
            >
              <Heart className="w-6 h-6 text-gray-600 group-hover:text-[#16a34a] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/buyer/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
              title="Cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-600 group-hover:text-[#16a34a] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16a34a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/buyer/notifications')}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group"
              title="Notifications"
            >
              <Bell className="w-6 h-6 text-gray-600 group-hover:text-[#16a34a] transition-colors" />
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Account - Enhanced with user avatar/initial */}
            <button
              onClick={() => navigate('/buyer/profile')}
              className="relative p-1 hover:bg-gray-100 rounded-full transition-colors group"
              title="Account"
            >
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#16a34a]"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-8 h-8 rounded-full bg-[#16a34a] text-white font-semibold flex items-center justify-center text-sm group-hover:bg-[#15803d] transition-colors ${userAvatar ? 'hidden' : 'flex'}`}
              >
                {userInitial}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}