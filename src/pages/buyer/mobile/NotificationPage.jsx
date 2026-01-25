import { ArrowLeft, Package, Tag, Bell, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * Notifications page component displaying user notifications grouped by time
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback function to navigate back
 */
export default function NotificationsPage({ onBack }) {
  usePageTitle('Notifications');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "order",
      title: "Order Delivered",
      message: "Your order #ORD12345 has been delivered successfully",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "promotion",
      title: "Flash Sale Alert! 🔥",
      message: "Get up to 50% off on Bonsai trees. Limited time offer!",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "order",
      title: "Order Shipped",
      message: "Your order #ORD12346 is on the way",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "promotion",
      title: "New Arrivals",
      message: "Check out our latest collection of exotic palm trees",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      type: "system",
      title: "Welcome to TreeShop! 🌳",
      message: "Start exploring our wide range of quality trees",
      time: "1 week ago",
      read: true,
    },
  ]);

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-[#059669]" />;
      case "promotion":
        return <Tag className="w-5 h-5 text-[#f97316]" />;
      case "system":
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const groupedNotifications = {
    today: notifications.filter((n) => n.time.includes("hour")),
    thisWeek: notifications.filter((n) => n.time.includes("day") && !n.time.includes("week")),
    older: notifications.filter((n) => n.time.includes("week") || n.time.includes("month")),
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4">
          <Bell className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl mb-2">No notifications</h2>
          <p className="text-gray-600 text-center">We'll notify you when something new arrives</p>
        </div>
      ) : (
        <div className="py-2">
          {groupedNotifications.today.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs text-gray-500 px-4 py-2">TODAY</h2>
              <div className="bg-white">
                {groupedNotifications.today.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="px-4 py-4 flex items-start gap-3 relative">
                      <div
                        className={`p-2 rounded-full ${
                          notification.read ? "bg-gray-100" : "bg-blue-50"
                        }`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-sm pr-2">{notification.title}</h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#059669] rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    {index < groupedNotifications.today.length - 1 && (
                      <div className="border-b border-gray-100 ml-16" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {groupedNotifications.thisWeek.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs text-gray-500 px-4 py-2">THIS WEEK</h2>
              <div className="bg-white">
                {groupedNotifications.thisWeek.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="px-4 py-4 flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    {index < groupedNotifications.thisWeek.length - 1 && (
                      <div className="border-b border-gray-100 ml-16" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {groupedNotifications.older.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xs text-gray-500 px-4 py-2">OLDER</h2>
              <div className="bg-white">
                {groupedNotifications.older.map((notification, index) => (
                  <div key={notification.id}>
                    <div className="px-4 py-4 flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                    {index < groupedNotifications.older.length - 1 && (
                      <div className="border-b border-gray-100 ml-16" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
