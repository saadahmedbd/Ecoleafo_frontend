import {
  Bell,
  TrendingUp,
  TrendingDown,
  Star,
  Eye,
  Plus,
  ChevronRight,
  Box,
  Receipt,
  MessageSquare,
  Tag,
  CreditCard,
  Store,
  LogOut,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
// 
// *** FIX: Import Link ***
import { Link } from "react-router-dom";
//

export default function HomeSellerAccount() {
  // Mock data remains the same...
  const stats = [
    {
      id: 1,
      label: "Total Sales",
      value: "$12,850",
      change: "+5.2%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      label: "Pending Orders",
      value: "32",
      change: "+1.5%",
      isPositive: true,
      icon: ShoppingBag,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      label: "Product Rating",
      value: "4.8",
      change: "-0.1%",
      isPositive: false,
      icon: Star,
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 4,
      label: "Store Visits",
      value: "1,204",
      change: "+8.0%",
      isPositive: true,
      icon: Eye,
      color: "bg-green-100 text-green-600",
    },
  ];

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
      // *** NOTE: Logout still uses window.location.href because it's a security best practice to force a full redirect/session clear. ***
      window.location.href = "/seller/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6">
      {/* Header (No navigation here, so no change) */}
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
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-1 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-[#374151] mb-1">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.isPositive ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Product Button - FIX: Changed to Link */}
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
                // FIX: Converted from <button onClick={...}> to <Link to={...}>
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

        {/* Logout Button (No Change needed as it's a security-based full redirect) */}
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