import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingBag, Truck, CheckCircle, X, 
  ChevronRight, Loader2, AlertCircle, Search,
  RotateCcw, Star, MessageSquare, Clock, 
  CreditCard, XCircle, RefreshCw, ShoppingCart, Tag, Store, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetMyOrdersQuery, 
  useCancelOrderMutation,
  useAddToCartMutation 
} from '@/features/orders/ordersApi';
import { useGetMyReviewsQuery } from '@/features/review/reviewApi';
import orderService from '@/services/orderService';
import { usePageTitle } from '@/hooks/usePageTitle';

// Toast Component
function Toast({ type, message, onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3 animate-slide-up`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'info' && <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        <Icon className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          {actionText}
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const config = orderService.getStatusColor(status);
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
      {status === 'processing' && <Package className="w-3 h-3" />}
      {status === 'shipped' && <Truck className="w-3 h-3" />}
      {status === 'delivered' && <CheckCircle className="w-3 h-3" />}
      {status === 'cancelled' && <XCircle className="w-3 h-3" />}
      {statusText}
    </span>
  );
}

// Order Item Component
function OrderItemCard({ item }) {
  const navigate = useNavigate();
  const originalPrice = item.original_price || item.price;
  const hasDiscount = item.original_price && item.original_price > item.price;
  const discountPercent = hasDiscount ? (((originalPrice - item.price) / originalPrice) * 100).toFixed(0) : 0;
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.pending;
  };
  
  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
      <img
        src={item.image || 'https://via.placeholder.com/80'}
        alt={item.product_name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer border border-gray-200"
        onClick={() => navigate(`/products/${item.product_id}`)}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/80';
        }}
      />
      <div className="flex-1 min-w-0">
        <h4 
          className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-1 cursor-pointer hover:text-green-600 transition-colors"
          onClick={() => navigate(`/products/${item.product_id}`)}
        >
          {item.product_name}
        </h4>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Store className="w-3 h-3" />
            {item.seller_name}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">
              Qty: <span className="font-semibold">{item.quantity}</span>
            </span>
            {hasDiscount && (
              <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ৳{originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
            <span className="font-bold text-green-600 text-sm sm:text-base">
              ৳{item.total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ order, onViewDetails, onCancelOrder, onBuyAgain, onReturn, onReview }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelClick = async () => {
    setCancelling(true);
    await onCancelOrder(order.id);
    setCancelling(false);
    setShowCancelConfirm(false);
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isShipped = order.status === 'shipped';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 mb-1">Order Number</p>
              <p className="font-mono font-semibold text-gray-800 text-sm sm:text-base">
                {order.order_number}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Order Date</p>
            <p className="text-sm font-medium text-gray-700">
              {new Date(order.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(order.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3 mb-4">
          {order.order_items?.slice(0, 2).map((item) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
          {order.order_items?.length > 2 && (
            <button
              onClick={() => onViewDetails(order.id)}
              className="text-sm text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
            >
              +{order.order_items.length - 2} more items
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-3 mb-4">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>৳{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  Discount
                  <span className="text-xs bg-green-100 px-1.5 py-0.5 rounded">
                    {((order.discount_amount / order.subtotal) * 100).toFixed(0)}% OFF
                  </span>
                </span>
                <span>-৳{order.discount_amount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>৳{order.tax_amount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? 'FREE' : `৳${order.shipping_cost?.toLocaleString('en-IN')}`}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-800 font-semibold">Total Amount</span>
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              ৳{order.total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        
        {/* Payment & Shipping Info */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 mb-1">Payment Method</p>
            <p className="text-sm font-medium text-gray-700 capitalize">
              {order.payment_method?.replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Payment Status</p>
            <span className={`inline-block text-xs px-2 py-1 rounded font-semibold ${
              order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
              order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* View Details */}
          <button
            onClick={() => onViewDetails(order.id)}
            className="flex-1 min-w-[120px] px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Cancel Order */}
          {canCancel && !showCancelConfirm && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          )}

          {/* Cancel Confirmation */}
          {showCancelConfirm && (
            <>
              <button
                onClick={handleCancelClick}
                disabled={cancelling}
                className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
              >
                Cancel
              </button>
            </>
          )}

          {/* Buy Again - for cancelled or delivered */}
          {(isCancelled || isDelivered) && (
            <button
              onClick={() => onBuyAgain(order)}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Again
            </button>
          )}

          {/* Return - for delivered orders */}
          {isDelivered && (
            <button
              onClick={() => onReturn(order.id)}
              className="px-4 py-2.5 border border-orange-300 text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors text-sm flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Return
            </button>
          )}

          {/* Review - for delivered orders */}
          {isDelivered && (
            <button
              onClick={() => onReview(order)}
              className="px-4 py-2.5 border border-yellow-300 text-yellow-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors text-sm flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Review
            </button>
          )}
        </div>

        {/* Additional Info */}
        {isShipped && order.tracking_number && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">
                Tracking: {order.tracking_number}
              </span>
            </div>
          </div>
        )}
        
        {order.notes && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-medium mb-0.5">Note:</p>
                <p className="text-amber-700">{order.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main My Orders Component
export default function MyOrders() {
  usePageTitle('My Orders');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all orders (we'll filter client-side for better control)
  const {
    data: ordersData,
    isLoading,
    error,
    refetch
  } = useGetMyOrdersQuery({
    page: currentPage,
    limit: 50, // Fetch more to allow client-side filtering
    status: '' // Fetch all orders
  });

  // Mutations
  const [cancelOrder] = useCancelOrderMutation();
  const [addToCart] = useAddToCartMutation();

  const allOrders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;

  // Filter orders based on active tab
  const getFilteredOrders = (orders, tab) => {
    if (tab === 'all') return orders;

    const statusFilters = {
      'to_pay': ['pending'],
      'to_ship': ['confirmed', 'processing'],
      'to_receive': ['shipped'],
      'completed': ['delivered'],
      'cancelled': ['cancelled'],
    };

    const allowedStatuses = statusFilters[tab] || [];
    return orders.filter(order => allowedStatuses.includes(order.status));
  };

  const orders = getFilteredOrders(allOrders, activeTab);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle view order details
  const handleViewDetails = (orderId) => {
    navigate(`/buyer/orders/${orderId}`);
  };

  // Handle cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId).unwrap();
      setToast({ type: 'success', message: 'Order cancelled successfully' });
      refetch();
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to cancel order' });
    }
  };

  // Handle buy again
  const handleBuyAgain = async (order) => {
    try {
      // Add first item to cart (you can modify to add all items)
      const firstItem = order.order_items?.[0];
      if (!firstItem) {
        setToast({ type: 'error', message: 'No items found in this order' });
        return;
      }

      await addToCart({
        product_id: firstItem.product_id,
        quantity: firstItem.quantity,
      }).unwrap();

      setToast({ type: 'success', message: 'Product added to cart successfully!' });
      
      // Navigate to cart after a short delay
      setTimeout(() => {
        navigate('/buyer/cart');
      }, 1500);
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to add to cart' });
    }
  };

  // Handle return
  const handleReturn = (orderId) => {
    // Navigate to return form page (to be implemented)
    navigate(`/orders/${orderId}/return`);
    setToast({ type: 'info', message: 'Return feature coming soon' });
  };

  // Handle review
  const handleReview = (order) => {
    const firstItem = order.order_items?.[0];
    
    if (!firstItem) {
      alert('No items found in this order');
      setToast({ type: 'error', message: 'No items found in this order' });
      return;
    }
    
    const productId = firstItem.product_id;
    alert(`Product ID: ${productId}, Order ID: ${order.id}`);
    
    if (!productId) {
      alert('Product ID is undefined or null');
      setToast({ type: 'error', message: 'Product ID not found' });
      return;
    }
    
    navigate(`/buyer/orders/${order.id}/review?product_id=${productId}`);
  };

  // Filter orders by search query
  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_items?.some(item => 
      item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Tabs configuration
  const tabs = [
    { id: 'all', label: 'All Orders', icon: ShoppingBag },
    { id: 'to_pay', label: 'To Pay', icon: CreditCard },
    { id: 'to_ship', label: 'To Ship', icon: Package },
    { id: 'to_receive', label: 'To Receive', icon: Truck },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle },
    { id: 'reviews', label: 'My Reviews', icon: Star },
  ];

  // Fetch reviews when reviews tab is active
  const { data: reviewsData, isLoading: reviewsLoading } = useGetMyReviewsQuery(
    { page: 1, per_page: 50 },
    { skip: activeTab !== 'reviews' }
  );

  const myReviews = reviewsData?.data?.reviews || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4">
            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            My Orders
          </h1>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number or product name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Orders</h3>
            <p className="text-gray-600 mb-6">
              We couldn't load your orders. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredOrders.length === 0 && (
          <EmptyState
            icon={Package}
            title={searchQuery ? 'No orders found' : 'No orders yet'}
            description={
              searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start shopping to see your orders here'
            }
            actionText={!searchQuery ? 'Start Shopping' : undefined}
            onAction={!searchQuery ? () => navigate('/') : undefined}
          />
        )}

        {/* Orders List */}
        {!isLoading && !error && filteredOrders.length > 0 && activeTab !== 'reviews' && (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={handleViewDetails}
                onCancelOrder={handleCancelOrder}
                onBuyAgain={handleBuyAgain}
                onReturn={handleReturn}
                onReview={handleReview}
              />
            ))}
          </div>
        )}

        {/* Reviews List */}
        {activeTab === 'reviews' && (
          <div>
            {reviewsLoading ? (
              <div className="text-center py-16">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading your reviews...</p>
              </div>
            ) : myReviews.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No reviews yet"
                description="You haven't reviewed any products yet. Purchase and review products to see them here."
              />
            ) : (
              <div className="space-y-4">
                {myReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex gap-4">
                        <img
                          src={review.product?.image || 'https://via.placeholder.com/100'}
                          alt={review.product?.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg cursor-pointer border border-gray-200"
                          onClick={() => navigate(`/products/${review.product_id}`)}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                        />
                        <div className="flex-1">
                          <h3 
                            className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors"
                            onClick={() => navigate(`/products/${review.product_id}`)}
                          >
                            {review.product?.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          {review.title && (
                            <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                          )}
                          <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                          {review.images?.length > 0 && (
                            <div className="flex gap-2 mb-3">
                              {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/buyer/reviews/edit/${review.id}`)}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              Edit Review
                            </button>
                            <button
                              onClick={() => navigate(`/products/${review.product_id}`)}
                              className="px-4 py-2 border border-green-300 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                            >
                              View Product
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredOrders.length > 0 && totalOrders > 10 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={filteredOrders.length < 10}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
