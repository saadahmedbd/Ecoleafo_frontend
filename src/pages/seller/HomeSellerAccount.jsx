import {
  Bell,
  Plus,
  ChevronRight,
  Box,
  Receipt,
  MessageSquare,
  Tag,
  CreditCard,
  Store,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HomeSellerAccount() {
  const managementItems = [
    {
      id: 1,
      label: "Seller Information",
      icon: Box,
      route: "/seller/account/information",
      color: "bg-orange-100 text-[#FF9900]",
    },
    {
      id: 2,
      label: "Manage Inventory",
      icon: Box,
      route: "/seller/inventory",
      color: "bg-orange-100 text-[#FF9900]",
    },
    {
      id: 3,
      label: "View Orders",
      icon: Receipt,
      route: "/seller/orders",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 4,
      label: "Customer Reviews",
      icon: MessageSquare,
      route: "/seller/reviews",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 5,
      label: "Promotions",
      icon: Tag,
      route: "/seller/promotions",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 6,
      label: "Payment Settings",
      icon: CreditCard,
      route: "/seller/add-payment",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      id: 7,
      label: "Store Settings",
      icon: Store,
      route: "/seller/setting",
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      alert("Logged out successfully");
      window.location.href = "/seller/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF9900] to-[#E68A00] flex items-center justify-center text-white font-bold text-sm shadow-md">
              PS
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#374151]">ProSeller Store</h1>
              <p className="text-xs text-gray-500">Seller Account</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Add Product Button */}
        <Link
          to="/seller/products"
          className="w-full bg-[#FF9900] hover:bg-[#E68A00] active:bg-[#D67A00] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </Link>

        {/* Management Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#374151] px-1">Management</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {managementItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.route}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                    index !== managementItems.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-base font-medium text-[#374151]">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full border-2 border-red-300 text-red-600 rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold hover:bg-red-50 active:bg-red-100 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
