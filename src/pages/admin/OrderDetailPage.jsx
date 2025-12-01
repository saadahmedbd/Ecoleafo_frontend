// src/pages/admin/OrderDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, RefreshCw, AlertCircle, Package, User, MapPin, 
  CreditCard, Truck, Calendar, DollarSign, CheckCircle, XCircle,
  Clock, FileText, Phone, Mail, Store
} from 'lucide-react';
import { 
  useGetOrderByIdQuery, 
  useUpdateOrderStatusMutation,
  useCancelOrderMutation 
} from '../../features/OrderManagement/orderManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [actionModal, setActionModal] = useState(null);

  // Fetch order data
  const { data: orderData, isLoading, error, refetch } = useGetOrderByIdQuery(id);
  
  // Mutations
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = orderData?.data;

  const tabs = [
    { id: 'details', label: 'Order Details' },
    { id: 'items', label: 'Order Items' },
    { id: 'customer', label: 'Customer Info' },
    { id: 'history', label: 'Order History' },
  ];

  // Status progression
  const statusFlow = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  
  const getNextStatus = (currentStatus) => {
    const index = statusFlow.indexOf(currentStatus?.toLowerCase());
    return index >= 0 && index < statusFlow.length - 1 ? statusFlow[index + 1] : null;
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus({ id: parseInt(id), status: newStatus }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error?.data?.message || 'Failed to update order status');
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async (reason) => {
    try {
      await cancelOrder({ id: parseInt(id), reason }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert(error?.data?.message || 'Failed to cancel order');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get customer name
  const getCustomerName = () => {
    const buyer = order?.buyer?.reg_user;
    if (!buyer) return 'Unknown Customer';
    return `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || buyer.email || 'Unknown';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load order</h3>
          <p className="text-[#666666] mb-4">{error?.data?.message || 'Order not found'}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()}>
              <RefreshCw size={18} />
              Retry
            </Button>
            <Link to="/admin/orders">
              <Button variant="outline">
                <ArrowLeft size={18} />
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);
  const canCancel = !['delivered', 'cancelled'].includes(order.status?.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[#1A1A1A]">{order.order_number}</h1>
              <StatusBadge status={order.status} type="order" />
              <StatusBadge status={order.payment_status} type="payment" />
            </div>
            <div className="flex items-center gap-4 text-[#666666] text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(order.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={16} />
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw size={18} />
              Refresh
            </Button>
            {nextStatus && (
              <Button 
                variant="primary" 
                onClick={() => setActionModal({ type: 'updateStatus', status: nextStatus })}
              >
                <CheckCircle size={18} />
                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </Button>
            )}
            {canCancel && (
              <Button 
                variant="danger" 
                onClick={() => setActionModal({ type: 'cancel' })}
              >
                <XCircle size={18} />
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#064232] text-white'
                  : 'text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details Tab */}
          {activeTab === 'details' && (
            <>
              {/* Shipping & Billing */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                <h2 className="text-[#1A1A1A] mb-4">Addresses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="text-[#568F87]" size={20} />
                      <h3 className="text-[#1A1A1A]">Shipping Address</h3>
                    </div>
                    <div className="bg-[#FFF5F2] p-4 rounded-lg">
                      <p className="text-[#1A1A1A] whitespace-pre-wrap">
                        {order.shipping_address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="text-[#568F87]" size={20} />
                      <h3 className="text-[#1A1A1A]">Billing Address</h3>
                    </div>
                    <div className="bg-[#FFF5F2] p-4 rounded-lg">
                      <p className="text-[#1A1A1A] whitespace-pre-wrap">
                        {order.billing_address || 'Same as shipping'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment & Shipping Info */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                <h2 className="text-[#1A1A1A] mb-4">Payment & Shipping</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FFF5F2] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="text-[#568F87]" size={18} />
                      <p className="text-sm text-[#666666]">Payment Method</p>
                    </div>
                    <p className="text-[#1A1A1A] font-medium">
                      {order.payment_method?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-[#FFF5F2] p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="text-[#568F87]" size={18} />
                      <p className="text-sm text-[#666666]">Tracking Number</p>
                    </div>
                    <p className="text-[#1A1A1A] font-medium">
                      {order.tracking_number || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="text-[#568F87]" size={20} />
                    <h2 className="text-[#1A1A1A]">Order Notes</h2>
                  </div>
                  <div className="bg-[#FFF5F2] p-4 rounded-lg">
                    <p className="text-[#666666]">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Cancellation Info */}
              {order.cancellation_reason && (
                <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="text-[#EF4444]" size={20} />
                    <h2 className="text-[#1A1A1A]">Cancellation Details</h2>
                  </div>
                  <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-4 rounded-lg">
                    <p className="text-sm text-[#666666] mb-1">Cancelled by: {order.cancelled_by || 'N/A'}</p>
                    <p className="text-[#EF4444]">{order.cancellation_reason}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Order Items Tab */}
          {activeTab === 'items' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Order Items</h2>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-[#FFF5F2] rounded-lg">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images.find(img => img.is_primary)?.image_url || item.product.images[0]?.image_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="text-[#E5E5E5]" size={32} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#1A1A1A] font-medium mb-1">{item.product_name}</h3>
                        <p className="text-[#666666] text-sm mb-2">SKU: {item.product_sku}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-[#666666]">Qty: {item.quantity}</span>
                          <span className="text-[#666666]">Price: {formatCurrency(item.price)}</span>
                          <span className="text-[#064232] font-semibold">Total: {formatCurrency(item.total)}</span>
                        </div>
                        {item.seller && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-[#666666]">
                            <Store size={14} />
                            <span>Sold by: {item.seller.store_name}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <StatusBadge status={item.status} type="order" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto mb-3 text-[#E5E5E5]" size={48} />
                  <p className="text-[#666666]">No items in this order</p>
                </div>
              )}
            </div>
          )}

          {/* Customer Info Tab */}
          {activeTab === 'customer' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-[#568F87] mt-1" size={20} />
                  <div>
                    <p className="text-sm text-[#666666]">Customer Name</p>
                    <p className="text-[#1A1A1A] font-medium">{getCustomerName()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-[#568F87] mt-1" size={20} />
                  <div>
                    <p className="text-sm text-[#666666]">Email</p>
                    <p className="text-[#1A1A1A]">{order.customer_email || order.buyer?.reg_user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#568F87] mt-1" size={20} />
                  <div>
                    <p className="text-sm text-[#666666]">Phone</p>
                    <p className="text-[#1A1A1A]">{order.customer_phone || order.buyer?.phone || 'N/A'}</p>
                  </div>
                </div>
                {order.buyer && (
                  <div className="pt-4 border-t border-[#E5E5E5]">
                    <Link to={`/admin/buyers/${order.buyer.id}`}>
                      <Button variant="outline" className="w-full">
                        View Full Customer Profile
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <TimelineItem
                  icon={<Clock />}
                  title="Order Created"
                  date={formatDate(order.created_at)}
                  isCompleted={true}
                />
                {order.confirmed_at && (
                  <TimelineItem
                    icon={<CheckCircle />}
                    title="Order Confirmed"
                    date={formatDate(order.confirmed_at)}
                    isCompleted={true}
                  />
                )}
                {order.shipped_at && (
                  <TimelineItem
                    icon={<Truck />}
                    title="Order Shipped"
                    date={formatDate(order.shipped_at)}
                    isCompleted={true}
                  />
                )}
                {order.delivered_at && (
                  <TimelineItem
                    icon={<Package />}
                    title="Order Delivered"
                    date={formatDate(order.delivered_at)}
                    isCompleted={true}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-[#666666]">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_cost)}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-[#666666]">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax_amount)}</span>
                </div>
              )}
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-[#10B981]">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#E5E5E5] flex justify-between">
                <span className="text-[#1A1A1A] font-semibold">Total</span>
                <span className="text-[#064232] text-xl font-bold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Commission Details */}
          {order.commission_rate > 0 && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Commission Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-[#666666]">
                  <span>Commission Rate</span>
                  <span>{order.commission_rate}%</span>
                </div>
                <div className="flex justify-between text-[#666666]">
                  <span>Commission Amount</span>
                  <span>{formatCurrency(order.commission_amount)}</span>
                </div>
                <div className="flex justify-between text-[#064232] font-semibold">
                  <span>Seller Earnings</span>
                  <span>{formatCurrency(order.seller_earnings)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {nextStatus && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setActionModal({ type: 'updateStatus', status: nextStatus })}
                >
                  <CheckCircle size={18} />
                  Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </Button>
              )}
              {canCancel && (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => setActionModal({ type: 'cancel' })}
                >
                  <XCircle size={18} />
                  Cancel Order
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <FileText size={18} />
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          action={actionModal}
          order={order}
          onClose={() => setActionModal(null)}
          onUpdateStatus={handleStatusUpdate}
          onCancelOrder={handleCancelOrder}
          isLoading={isUpdating || isCancelling}
        />
      )}
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ icon, title, date, isCompleted }) {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        isCompleted ? 'bg-[#10B981] text-white' : 'bg-[#E5E5E5] text-[#666666]'
      }`}>
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <div className="flex-1">
        <p className="text-[#1A1A1A] font-medium">{title}</p>
        <p className="text-[#666666] text-sm">{date}</p>
      </div>
    </div>
  );
}

// Action Modal Component
function ActionModal({ action, order, onClose, onUpdateStatus, onCancelOrder, isLoading }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (action.type === 'updateStatus') {
      onUpdateStatus(action.status);
    } else if (action.type === 'cancel') {
      if (!reason.trim()) {
        alert('Please provide a cancellation reason');
        return;
      }
      onCancelOrder(reason);
    }
  };

  const config = action.type === 'updateStatus' ? {
    title: 'Update Order Status',
    message: `Are you sure you want to mark this order as "${action.status}"?`,
    needsReason: false,
    buttonText: 'Update Status',
    buttonVariant: 'primary'
  } : {
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order?',
    needsReason: true,
    buttonText: 'Cancel Order',
    buttonVariant: 'danger'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{config.title}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">{config.message}</p>
          
          {config.needsReason && (
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Cancellation Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                rows="3"
                placeholder="Provide a reason for cancellation..."
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant={config.buttonVariant}
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : config.buttonText}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}