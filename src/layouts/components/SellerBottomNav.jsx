import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  User,
} from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", path: "/seller/dashboard" },
  { id: "products", icon: Package, label: "Products", path: "/seller/products" },
  { id: "orders", icon: ShoppingBag, label: "Orders", path: "/seller/orders" },
  { id: "messages", icon: MessageSquare, label: "Messages", path: "/seller/messages" },
  { id: "account", icon: User, label: "Account", path: "/seller/account" },
];

export default function SellerBottomNav({ currentPage, onNavigate }) {
  const handleNavigation = (item) => {
    onNavigate(item.id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all min-w-[60px] ${
                isActive ? "text-[#FF9900]" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
