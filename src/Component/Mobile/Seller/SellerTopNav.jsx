import { Search, Bell, Menu, User } from "lucide-react";
import { useState } from "react";

export default function SellerTopNav({ onMenuClick, isMobile }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-[#374151]" />
            </button>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#374151]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile - Desktop Only */}
          {!isMobile && (
            <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#FF9900] rounded-full flex items-center justify-center text-white text-sm">
                JD
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-[#374151]">John Doe</p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
