import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Wallet,
  MessageSquare,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  TreeDeciduous,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "products", icon: Package, label: "Products" },
  { id: "orders", icon: ShoppingBag, label: "Orders" },
  { id: "inventory", icon: Boxes, label: "Inventory" },
  { id: "payouts", icon: Wallet, label: "Payouts" },
  { id: "messages", icon: MessageSquare, label: "Messages" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "account", icon: User, label: "Account" },
];

export default function SellerSidebar({ isCollapsed, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current section from the URL (e.g. "products" from /seller/products)
  const currentPage = location.pathname.split("/seller/")[1] || "dashboard";

  const handleNavigate = (pageId) => {
    navigate(`/seller/${pageId}`);
    window.scrollTo(0, 0);
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF9900] rounded-lg flex items-center justify-center">
              <TreeDeciduous className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-[#374151]">TreeShop Seller</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-[#FF9900] rounded-lg flex items-center justify-center mx-auto">
            <TreeDeciduous className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Toggle Button (Desktop only) */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="p-3 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[#FF9900] text-white shadow-sm"
                  : "text-[#374151] hover:bg-gray-100"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && isActive && (
                <div className="absolute right-0 w-1 h-8 bg-[#FF9900] rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF9900] rounded-full flex items-center justify-center text-white">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#374151] truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">Seller ID: #12345</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
