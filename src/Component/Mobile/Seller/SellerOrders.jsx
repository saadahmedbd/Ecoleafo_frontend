import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Truck,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "ORD-12345",
    customer: {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8900",
    },
    items: [
      { name: "Oak Tree Sapling", quantity: 1, price: 45, image: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100" },
      { name: "Pine Tree", quantity: 2, price: 65, image: "https://images.unsplash.com/photo-1681614942597-4fe49f824d6c?w=100" },
    ],
    total: 175,
    status: "delivered",
    date: "Oct 24, 2025",
    payment: "Credit Card",
    shipping: {
      address: "123 Oak Street, Portland, OR 97201",
      method: "Standard Delivery",
    },
    tracking: "TRK123456789",
  },
  {
    id: "ORD-12346",
    customer: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 234 567 8901",
    },
    items: [
      { name: "Cherry Blossom", quantity: 1, price: 85, image: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=100" },
    ],
    total: 85,
    status: "shipped",
    date: "Oct 23, 2025",
    payment: "PayPal",
    shipping: {
      address: "456 Cherry Lane, Seattle, WA 98101",
      method: "Express Delivery",
    },
    tracking: "TRK987654321",
  },
  {
    id: "ORD-12347",
    customer: {
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "+1 234 567 8902",
    },
    items: [
      { name: "Maple Tree", quantity: 1, price: 55, image: "https://images.unsplash.com/photo-1622901641231-a570d784e5e3?w=100" },
    ],
    total: 55,
    status: "pending",
    date: "Oct 23, 2025",
    payment: "Credit Card",
    shipping: {
      address: "789 Maple Drive, Boston, MA 02101",
      method: "Standard Delivery",
    },
    tracking: null,
  },
  {
    id: "ORD-12348",
    customer: {
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "+1 234 567 8903",
    },
    items: [
      { name: "Bonsai Tree", quantity: 1, price: 75, image: "https://images.unsplash.com/photo-1677897466760-ba23e614aa7f?w=100" },
    ],
    total: 75,
    status: "cancelled",
    date: "Oct 22, 2025",
    payment: "Credit Card",
    shipping: {
      address: "321 Pine Road, Denver, CO 80201",
      method: "Standard Delivery",
    },
    tracking: null,
  },
];

export default function SellerOrders() {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    { id: "pending", label: "Pending", count: orders.filter((o) => o.status === "pending").length },
    { id: "shipped", label: "Shipped", count: orders.filter((o) => o.status === "shipped").length },
    { id: "delivered", label: "Delivered", count: orders.filter((o) => o.status === "delivered").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter((o) => o.status === "cancelled").length },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast.success(`Order ${newStatus} successfully`);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#374151]">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#FF9900] text-white"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Orders List - Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-[#374151]">{order.id}</p>
                <p className="text-sm text-gray-500">{order.customer.name}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "shipped"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mb-3 overflow-x-auto">
              {order.items.map((item, idx) => (
                <img
                  key={idx}
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{order.date}</span>
              <span className="font-semibold text-[#FF9900]">${order.total}</span>
            </div>

            <button
              onClick={() => setSelectedOrder(order)}
              className="w-full px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Products</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#374151]">{order.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{order.customer.name}</p>
                    <p className="text-sm text-gray-500">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#374151]">${order.total}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#FF9900] hover:text-[#E68A00] flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={handleUpdateStatus} />}
    </div>
  );
}

function OrderDetailsModal({ order, onClose, onUpdateStatus }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#374151]">Order Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-2xl font-semibold text-[#374151]">{order.id}</p>
              <p className="text-gray-500 mt-1">{order.date}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize flex items-center gap-2 ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {order.status === "delivered" && <CheckCircle className="w-4 h-4" />}
              {order.status === "shipped" && <Truck className="w-4 h-4" />}
              {order.status === "pending" && <Clock className="w-4 h-4" />}
              {order.status === "cancelled" && <XCircle className="w-4 h-4" />}
              {order.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-[#374151]">Customer Information</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-900">{order.customer.name}</p>
              <p className="text-sm text-gray-600">{order.customer.email}</p>
              <p className="text-sm text-gray-600">{order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-[#374151]">Shipping Address</h3>
            </div>
            <p className="text-gray-600">{order.shipping.address}</p>
            <p className="text-sm text-gray-500 mt-2">{order.shipping.method}</p>
            {order.tracking && (
              <p className="text-sm text-gray-500 mt-1">Tracking: {order.tracking}</p>
            )}
          </div>

          {/* Items */}
          <div>
            <h3 className="font-medium text-[#374151] mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-[#374151]">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#374151]">${item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-[#374151]">Payment Method</h3>
            </div>
            <p className="text-gray-600">{order.payment}</p>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-[#374151]">Total</span>
              <span className="font-semibold text-[#FF9900]">${order.total}</span>
            </div>
          </div>

          {/* Actions */}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {order.status === "pending" && (
                <button
                  onClick={() => onUpdateStatus(order.id, "shipped")}
                  className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Mark as Shipped
                </button>
              )}
              {order.status === "shipped" && (
                <button
                  onClick={() => onUpdateStatus(order.id, "delivered")}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Delivered
                </button>
              )}
              <button
                onClick={() => onUpdateStatus(order.id, "cancelled")}
                className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
