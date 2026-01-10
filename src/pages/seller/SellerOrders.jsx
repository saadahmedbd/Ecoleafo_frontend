import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ChevronDown,
  RefreshCw,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  Hash,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/features/seller_order_management/orderApi";
import {
  formatDate,
  formatDateShort,
  formatCurrency,
  getStatusColor,
  getPaymentStatusColor,
  formatPaymentMethod,
  calculateStatusCounts,
  canCancelOrder,
  filterOrders,
  exportOrdersToCSV,
  downloadCSV,
  printOrderReceipt,
} from "@/services/SellerOrderService";

export default function SellerOrders() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const ordersPerPage = 10;

  // RTK Query hooks
  const { data: ordersData, isLoading, error, refetch } = useGetMyOrdersQuery({
    page: currentPage,
    limit: ordersPerPage,
  });

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  // Calculate status counts
  const statusCounts = {
    all: totalOrders,
    ...calculateStatusCounts(orders),
  };

  const tabs = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "pending", label: "Pending", count: statusCounts.pending },
    { id: "processing", label: "Processing", count: statusCounts.processing },
    { id: "shipped", label: "Shipped", count: statusCounts.shipped },
    { id: "delivered", label: "Delivered", count: statusCounts.delivered },
    { id: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
  ];

  const filteredOrders = filterOrders(orders, searchQuery, activeTab);

  const handleExportCSV = () => {
    const csvContent = exportOrdersToCSV(filteredOrders);
    downloadCSV(csvContent, `orders-${Date.now()}.csv`);
    toast.success("Orders exported successfully");
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
      shipped: <Truck className="w-5 h-5 text-blue-500" />,
      processing: <Package className="w-5 h-5 text-purple-500" />,
      pending: <Clock className="w-5 h-5 text-yellow-500" />,
      cancelled: <XCircle className="w-5 h-5 text-red-500" />,
    };
    return icons[status] || <Package className="w-5 h-5 text-gray-500" />;
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#FF9900] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Orders</h3>
          <p className="text-red-700 mb-4">{error?.data?.message || error?.error || "Failed to load orders"}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 pb-24 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track your customer orders</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* TABS FOR DESKTOP (md and up) */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
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

      {/* DROPDOWN FOR MOBILE */}
      <div className="block md:hidden relative">
        <label htmlFor="order-status-filter" className="sr-only">Filter by status</label>
        <select
          id="order-status-filter"
          value={activeTab}
          onChange={(e) => {
            setActiveTab(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label} ({tab.count})
            </option>
          ))}
        </select>
        <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET CARDS (< lg) */}
      <div className="block lg:hidden space-y-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-[#374151]">{order.order_number}</p>
                <p className="text-sm text-gray-500">{order.customer_email}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateShort(order.created_at)}
              </span>
              <span className="font-semibold text-[#FF9900]">
                {formatCurrency(
                  order.order_items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Payment:</span>
                <span className="ml-1 font-medium">{formatPaymentMethod(order.payment_method)}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-1 px-2 py-0.5 rounded text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/seller/orders/${order.id}`)}
              className="w-full px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE (lg and up) */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Order Number</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#374151]">{order.order_number}</p>
                    {order.tracking_number && (
                      <p className="text-xs text-gray-500 mt-1">Track: {order.tracking_number}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{order.customer_email}</p>
                    {order.customer_phone && (
                      <p className="text-sm text-gray-500">{order.customer_phone}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{formatDateShort(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{formatPaymentMethod(order.payment_method)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#374151]">
                    {formatCurrency(
                      order.order_items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/seller/orders/${order.id}`)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500 text-center sm:text-left">
            Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
            {Math.min(currentPage * ordersPerPage, totalOrders)} of {totalOrders} orders
          </p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 bg-gray-50 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredOrders.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">No orders found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search query"
              : "You don't have any orders yet"}
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}

function OrderDetailsModal({ orderId, onClose }) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showTrackingInput, setShowTrackingInput] = useState(false);

  // RTK Query hooks
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === "shipped" && !order.tracking_number && !trackingNumber) {
      setShowTrackingInput(true);
      return;
    }

    try {
      await updateStatus({
        orderId: order.id,
        status: newStatus,
        trackingNumber: trackingNumber || order.tracking_number,
      }).unwrap();
      
      toast.success(`Order ${newStatus} successfully`);
      setShowTrackingInput(false);
      setTrackingNumber("");
    } catch (error) {
      toast.error(error?.data?.message || `Failed to update order status`);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order? Stock will be restored.")) {
      return;
    }

    try {
      await cancelOrder(order.id).unwrap();
      toast.success("Order cancelled successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to cancel order");
    }
  };

  const handlePrint = () => {
    printOrderReceipt(order);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center">
          <RefreshCw className="w-12 h-12 text-[#FF9900] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle className="w-4 h-4" />,
      shipped: <Truck className="w-4 h-4" />,
      processing: <Package className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
    };
    return icons[status] || <Package className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-[#374151]">Order Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-5 h-5 text-gray-400" />
                <p className="text-2xl font-semibold text-[#374151]">{order.order_number}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(order.created_at)}
                </span>
                {order.tracking_number && (
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    {order.tracking_number}
                  </span>
                )}
              </div>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium capitalize flex items-center gap-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>

          {/* Customer & Shipping Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-[#374151]">Customer Information</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{order.customer_phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="font-medium text-[#374151]">Shipping Address</h3>
              </div>
              <p className="text-gray-600">{order.shipping_address}</p>
              {order.tracking_number && (
                <p className="text-sm text-gray-500 mt-2">Tracking: {order.tracking_number}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-medium text-[#374151] mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items ({order.order_items?.length || 0})
            </h3>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-[#374151]">{item.product_name}</p>
                    <p className="text-sm text-gray-500">SKU: {item.product_sku}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">Qty: {item.quantity}</span>
                      <span className="text-gray-600">Price: {formatCurrency(item.price)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#374151]">{formatCurrency(item.total)}</p>
                    {item.seller_earning && (
                      <p className="text-sm text-green-600">Earning: {formatCurrency(item.seller_earning)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-[#374151]">Payment Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">{formatPaymentMethod(order.payment_method)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-medium capitalize px-2 py-1 rounded text-xs ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status}
                </span>
              </div>
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(
                    order.order_items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
                  )}
                </span>
              </div>
              {order.shipping_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">{formatCurrency(order.shipping_cost)}</span>
                </div>
              )}
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">{formatCurrency(order.tax_amount)}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span className="font-medium">-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 my-3"></div>
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-[#374151]">Total:</span>
                <span className="text-[#FF9900] flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {formatCurrency(
                    order.order_items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking Input */}
          {showTrackingInput && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-3">Add Tracking Number</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                />
                <button
                  onClick={() => handleStatusUpdate("shipped")}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isUpdating ? "..." : "Submit"}
                </button>
                <button
                  onClick={() => setShowTrackingInput(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-[#374151]">Update Order Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate("processing")}
                      disabled={isUpdating}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Package className="w-5 h-5" />
                      {isUpdating ? "Updating..." : "Start Processing"}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("shipped")}
                      disabled={isUpdating}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Truck className="w-5 h-5" />
                      {isUpdating ? "Updating..." : "Mark as Shipped"}
                    </button>
                  </>
                )}

                {order.status === "processing" && (
                  <button
                    onClick={() => handleStatusUpdate("shipped")}
                    disabled={isUpdating}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Truck className="w-5 h-5" />
                    {isUpdating ? "Updating..." : "Mark as Shipped"}
                  </button>
                )}

                {order.status === "shipped" && (
                  <button
                    onClick={() => handleStatusUpdate("delivered")}
                    disabled={isUpdating}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isUpdating ? "Updating..." : "Mark as Delivered"}
                  </button>
                )}

                {canCancelOrder(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="px-4 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    {isCancelling ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>

              {/* Status Flow Indicator */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 mb-3">Order Status Flow:</p>
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`flex-1 text-center ${
                      order.status === "pending" ? "text-yellow-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs">Pending</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-0.5 bg-gray-300"></div>
                  <div
                    className={`flex-1 text-center ${
                      order.status === "processing" ? "text-purple-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    <Package className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs">Processing</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-0.5 bg-gray-300"></div>
                  <div
                    className={`flex-1 text-center ${
                      order.status === "shipped" ? "text-blue-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs">Shipped</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-0.5 bg-gray-300"></div>
                  <div
                    className={`flex-1 text-center ${
                      order.status === "delivered" ? "text-green-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs">Delivered</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed/Cancelled Status */}
          {(order.status === "delivered" || order.status === "cancelled") && (
            <div
              className={`rounded-lg p-4 ${
                order.status === "delivered"
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {order.status === "delivered" ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Order Completed</p>
                      <p className="text-sm text-green-700">
                        This order has been successfully delivered
                        {order.delivered_at && ` on ${formatDate(order.delivered_at)}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Order Cancelled</p>
                      <p className="text-sm text-red-700">
                        This order has been cancelled. Stock has been restored.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}