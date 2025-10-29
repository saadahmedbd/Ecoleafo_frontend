import { Home, Package, Heart, ShoppingCart, User } from "lucide-react";

/**
 * Bottom navigation bar component for mobile view
 * @param {Object} props - Component props
 * @param {string} props.currentPage - Currently active page ID
 * @param {Function} props.onNavigate - Navigation handler function
 * @param {number} [props.cartCount=0] - Number of items in cart for badge display
 */
export default function BottomNav({ currentPage, onNavigate, cartCount = 0 }) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "orders", icon: Package, label: "Orders" },
    { id: "wishlist", icon: Heart, label: "Wishlist" },
    { id: "cart", icon: ShoppingCart, label: "Cart" },
    { id: "account", icon: User, label: "Account" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-2 py-2 z-50 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]"
              style={{
                color: isActive ? "#059669" : "#6b7280",
              }}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
