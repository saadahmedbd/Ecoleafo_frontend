import { Bell, ShoppingBag, Heart, ShoppingCart } from "lucide-react";

export default function Header({ onNotificationClick, onWishlistClick, onCartClick, wishlistCount, cartCount }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-[#059669]">TreeShop</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onWishlistClick}
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <Heart className="w-6 h-6 text-foreground" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {wishlistCount}
            </span>
          )}
        </button>
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <ShoppingCart className="w-6 h-6 text-foreground" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-[#059669] text-white text-xs rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          )}
        </button>
        <button
          onClick={onNotificationClick}
          className="relative p-2 hover:bg-secondary rounded-full transition-colors"
        >
          <Bell className="w-6 h-6 text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#f97316] rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
