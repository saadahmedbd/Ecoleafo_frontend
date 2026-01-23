// src/layouts/components/MobileHeader.jsx
import { Heart, ShoppingCart } from 'lucide-react';
import logo from '@/assets/AIRetouch_20251230_111158251.png';

export default function MobileHeader({ cartCount, wishlistCount, onCartClick, onWishlistClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <img src={logo} alt="Ecoleafo" className="h-10 w-auto" />
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onWishlistClick}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Wishlist"
        >
          <Heart className="w-6 h-6 text-gray-700" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {wishlistCount > 9 ? '9+' : wishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-[#059669] text-white text-xs rounded-full flex items-center justify-center font-medium">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
