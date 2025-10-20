import { Package, Clock, CheckCircle2, XCircle, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function OrdersPage({ orders, onOrderClick }) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "track", label: "Track" },
    { id: "returns", label: "Returns" },
    { id: "cancelled", label: "Cancelled" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Delivered
          </div>
        );
      case "in-progress":
        return (
          <div className="flex items-center gap-1 text-[#f97316] bg-orange-50 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            In Progress
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
            <XCircle className="w-4 h-4" />
            Cancelled
          </div>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "track") return order.status === "in-progress";
    if (activeTab === "returns") return false; // No returns in mock data
    if (activeTab === "cancelled") return order.status === "cancelled";
    return true;
  });

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 mb-2">
        <h1 className="text-xl">My Orders</h1>
        <p className="text-sm text-gray-600">{orders.length} total orders</p>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-2 mb-2 overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-[#059669] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="px-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">No orders found</h3>
            <p className="text-gray-600 text-sm">Orders will appear here once you place them</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderClick(order)}
              className="bg-white rounded-xl p-4 shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm mb-1">Order #{order.id}</h3>
                  <p className="text-xs text-gray-600">{order.date}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="flex gap-2 mb-3 overflow-x-auto">
                {order.items.map((item, index) => (
                  <ImageWithFallback
                    key={index}
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                </span>
                <span className="text-[#059669]">${order.total.toFixed(2)}</span>
              </div>

              {order.status === "delivered" && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4" />
                    Invoice
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] text-sm">
                    <RotateCcw className="w-4 h-4" />
                    Reorder
                  </button>
                </div>
              )}

              {order.status === "in-progress" && (
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] text-sm mt-3">
                  Track Order
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
