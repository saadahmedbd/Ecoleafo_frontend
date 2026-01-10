// src/layouts/components/DesktopHeader.jsx - FIXED WITH PROPER COUNT APIS
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Bell } from 'lucide-react';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import { useGetWishlistCountQuery } from '@/features/wishlist/wishlistApi';
import { useGetBuyerProfileQuery } from '@/features/buyerProfile/buyerProfileApi';
import { useGetAutocompleteQuery } from '@/features/search/searchApi';
import logo from '@/assets/AIRetouch_20251230_111158251.png';

export default function DesktopHeader() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Get cart and wishlist counts from backend - PROPER APIS
  const { data: cartCountData } = useGetCartCountQuery();
  const { data: wishlistCountData } = useGetWishlistCountQuery();
  const { data: profileData } = useGetBuyerProfileQuery();
  
  // Autocomplete
  const { data: suggestions } = useGetAutocompleteQuery(searchQuery, {
    skip: searchQuery.length < 2
  });
  
  const cartCount = cartCountData?.count || 0;
  const wishlistCount = wishlistCountData?.count || 0;

  // Get user data from profile API or localStorage
  const profile = profileData?.data || profileData;
  const firstName = profile?.reg_user?.first_name || profile?.first_name || '';
  const lastName = profile?.reg_user?.last_name || profile?.last_name || '';
  const userName = `${firstName} ${lastName}`.trim();
  const userAvatar = profile?.profile_picture_url || profile?.profile_photo || '';
  
  // Get first letter of first name for avatar badge
  const userInitial = firstName ? firstName.charAt(0).toUpperCase() : 'U';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Logo - Left Side */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img src={logo} alt="TreeShop" className="h-12 w-auto" />
          </div>

          {/* Search Bar - Center (Maximum Width) */}
          <form 
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl relative"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for trees, plants, and more..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            
            {/* Autocomplete Dropdown */}
            {showSuggestions && searchQuery.length >= 2 && suggestions?.data?.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {suggestions.data.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(item.name || item)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{item.name || item}</span>
                  </button>
                ))}
              </div>
            )}
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

            {/* Account - Badge with user initial */}
            <button
              onClick={() => navigate('/buyer/account')}
              className="relative hover:opacity-80 transition-opacity"
              title={userName || 'Account'}
            >
              {userAvatar ? (
                <div className="relative">
                  <img 
                    src={userAvatar} 
                    alt={userName || 'User'}
                    className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 hover:border-[#16a34a] transition-colors"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.nextElementSibling.style.display = 'flex';
                    }}
                  />
                </div>
              ) : null}
              <div 
                className={`w-9 h-9 rounded-full bg-gradient-to-br from-[#16a34a] to-[#15803d] text-white font-bold flex items-center justify-center text-base shadow-md hover:shadow-lg transition-all ${userAvatar ? 'hidden' : 'flex'}`}
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