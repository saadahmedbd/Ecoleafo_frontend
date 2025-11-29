import React, { useState } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';

export default function TopNav({ toggleSidebar, isSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: 'New seller registration', message: 'Tech Store 2024 has registered', time: '5 min ago', unread: true },
    { id: 2, title: 'Product approval needed', message: '3 products waiting for approval', time: '15 min ago', unread: true },
    { id: 3, title: 'Payout request', message: 'Fashion Hub requested $2,500 payout', time: '1 hour ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="h-16 bg-[#064232] text-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#F5BABB] rounded-lg flex items-center justify-center">
            <span className="text-[#064232]">E</span>
          </div>
          <span className="hidden md:block">E-Commerce Admin</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-colors"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-white/10 rounded-md transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-[#F5BABB] text-[#064232] rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-4 bg-[#064232] text-white flex items-center justify-between">
                  <h3>Notifications</h3>
                  <button className="text-sm text-[#F5BABB] hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id}
                      className={`p-4 border-b border-gray-200 hover:bg-[#FFF5F2] cursor-pointer ${notif.unread ? 'bg-[#FFF5F2]' : 'bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-[#F5BABB] rounded-full mt-2" />
                        )}
                        <div className="flex-1">
                          <p className="text-[#1A1A1A]">{notif.title}</p>
                          <p className="text-sm text-[#666666] mt-1">{notif.message}</p>
                          <p className="text-xs text-[#666666] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-md transition-colors"
          >
            <div className="w-8 h-8 bg-[#568F87] rounded-full flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="hidden md:block">Admin</span>
          </button>

          {showProfile && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 text-[#1A1A1A] hover:bg-[#FFF5F2] rounded">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 text-[#1A1A1A] hover:bg-[#FFF5F2] rounded">
                    Settings
                  </button>
                  <hr className="my-2 border-[#E5E5E5]" />
                  <button className="w-full text-left px-4 py-2 text-[#EF4444] hover:bg-[#FFF5F2] rounded">
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
