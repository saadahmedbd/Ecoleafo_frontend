import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Package, MapPin, CreditCard, Calendar,
  ShoppingBag, ArrowRight, Home, Loader2, AlertCircle,
  Phone, Mail, Truck, Clock, User, Store, Tag, Gift
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetOrderByIdQuery, useGetOrderByNumberQuery } from '@/features/orders/ordersApi';
import orderService from '@/services/orderService';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';

// Success Animation Component
function SuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.1
      }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="absolute inset-0 bg-green-100 rounded-full blur-2xl"
      />
      <motion.div
        className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 shadow-2xl"
        animate={{ 
          boxShadow: [
            "0 10px 40px rgba(34, 197, 94, 0.3)",
            "0 10px 60px rgba(34, 197, 94, 0.4)",
            "0 10px 40px rgba(34, 197, 94, 0.3)",
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <CheckCircle className="w-16 h-16 text-white" strokeWidth={2.5} />
      </motion.div>
      
      {/* Confetti Effect */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          initial={{ 
            x: 0, 
            y: 0,
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            x: Math.cos(i * 30 * Math.PI / 180) * 100,
            y: Math.sin(i * 30 * Math.PI / 180) * 100,
            opacity: 0,
            scale: 1
          }}
          transition={{ 
            duration: 0.8,
            delay: 0.3,
            ease: "easeOut"
          }}
          style={{
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </motion.div>
  );
}

// Order Item Component
function OrderItemCard({ item }) {
  // Debug log to see what data we're getting
  console.log('Order Item Data:', item);
  
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border-purple-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  // Calculate if there's a discount (assuming original_price exists or calculate from discount)
  const originalPrice = item.original_price || item.price;
  const hasDiscount = item.original_price && item.original_price > item.price;
  const discountPercent = hasDiscount ? (((originalPrice - item.price) / originalPrice) * 100).toFixed(0) : 0;
  
  // Check multiple possible field names for gift message
  const giftMessage = item.gift_message || item.giftMessage || item.gift_note || item.message;
  const isGift = item.is_gift || item.isGift || item.gift || giftMessage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <div className="flex gap-4">
        <img
          src={item.image || 'https://via.placeholder.com/80'}
          alt={item.product_name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-200"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/80';
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-gray-800 line-clamp-2">
              {item.product_name}
            </h4>
            {isGift && (
              <div className="flex-shrink-0">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {item.product_sku}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-600">{item.seller_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-600">Qty: <span className="font-semibold">{item.quantity}</span></span>
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
                <span className="text-sm font-semibold text-gray-700">
                  ৳{item.price?.toLocaleString('en-IN')} each
                </span>
              </div>
            </div>
            <span className="font-bold text-green-600">
              ৳{item.total?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
      
      {/* Gift Message */}
      {giftMessage && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Gift className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-purple-900 mb-1">🎁 Gift Message</p>
              <p className="text-sm text-purple-700 italic">"{giftMessage}"</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Info Card Component
function InfoCard({ icon: Icon, title, content, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-green-50 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1 text-sm">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Order Confirmation Component
export default function OrderConfirmation() {
  usePageTitle('Orders');
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order_number');

  // Fetch order data - try both ID and order number
  const {
    data: orderByIdData,
    isLoading: loadingById,
    error: errorById,
    refetch: refetchOrderById
  } = useGetOrderByIdQuery(orderId, {
    skip: !orderId
  });

  const {
    data: orderByNumberData,
    isLoading: loadingByNumber,
    error: errorByNumber
  } = useGetOrderByNumberQuery(orderNumber, {
    skip: !orderNumber
  });

  // Debug logging
  console.log('OrderConfirmation Debug:', {
    orderId,
    orderNumber,
    orderByIdData,
    orderByNumberData,
    loadingById,
    loadingByNumber,
    errorById,
    errorByNumber
  });

  // If no orderId but we have orderNumber, try to get orderId from orderByNumberData
  const orderIdFromNumber = orderByNumberData?.id;
  const {
    data: orderByIdFromNumberData,
    isLoading: loadingByIdFromNumber,
    error: errorByIdFromNumber
  } = useGetOrderByIdQuery(orderIdFromNumber, {
    skip: !orderIdFromNumber || !!orderId
  });

  // Determine which data to use
  const order = orderByIdData || orderByNumberData || orderByIdFromNumberData;
  const isLoading = loadingById || loadingByNumber || loadingByIdFromNumber;
  const error = errorById || errorByNumber || errorByIdFromNumber;

  // Add timeout for loading state - if no data after 10 seconds, show error
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  useEffect(() => {
    if (isLoading && !order && !error) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 10000); // 10 seconds timeout
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [isLoading, order, error]);

  // Force refetch on component mount to ensure fresh data
  useEffect(() => {
    if (orderId && !orderByIdData && !loadingById) {
      console.log('Force refetching order data for ID:', orderId);
      refetchOrderById();
    }
  }, [orderId, orderByIdData, loadingById, refetchOrderById]);

  // Calculate delivery date
  const expectedDeliveryDate = order 
    ? orderService.calculateDeliveryDate(order.created_at, 7)
    : null;

  const formattedDeliveryDate = expectedDeliveryDate
    ? orderService.formatDeliveryDate(expectedDeliveryDate)
    : null;

  const orderSummary = order ? orderService.getOrderSummary(order) : null;

  // Loading state
  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the order you're looking for. It may have been cancelled or doesn't exist.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/buyer/orders')}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <SuccessAnimation />
          </div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2"
          >
            Order Placed Successfully! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg"
          >
            Thank you for your purchase. Your order has been confirmed!
          </motion.p>
        </motion.div>

        {/* Order Number Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-green-200"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-xl font-bold text-gray-800 font-mono">
                {orderService.formatOrderNumber(order.order_number)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-semibold text-gray-800">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(order.created_at).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm text-gray-600 mb-1">Order Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'processing' ? 'bg-purple-100 text-purple-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Order Items ({orderSummary.itemCount})
          </h2>
          <div className="space-y-3">
            {order.order_items?.map((item, index) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">৳{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-2">
                  Discount
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                    {((order.discount_amount / order.subtotal) * 100).toFixed(0)}% OFF
                  </span>
                </span>
                <span className="font-semibold">-৳{order.discount_amount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            {order.tax_amount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-semibold">৳{order.tax_amount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="font-semibold">
                {order.shipping_cost === 0 ? 'FREE' : `৳${order.shipping_cost?.toLocaleString('en-IN')}`}
              </span>
            </div>
            {order.gift_charge > 0 && (
              <div className="flex justify-between text-purple-600">
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Gift Wrapping
                </span>
                <span className="font-semibold">৳{order.gift_charge?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
              <span className="text-lg font-bold text-gray-800">Total Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ৳{order.total?.toLocaleString('en-IN')}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 p-3 rounded-lg text-center text-sm font-medium">
                🎉 You saved ৳{order.discount_amount?.toLocaleString('en-IN')} ({((order.discount_amount / order.subtotal) * 100).toFixed(1)}%) on this order!
              </div>
            )}
          </div>
        </motion.div>

        {/* Delivery & Payment Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <InfoCard
            icon={Calendar}
            title="Expected Delivery"
            content={formattedDeliveryDate || 'Within 5-7 business days'}
            delay={0.8}
          />
          <InfoCard
            icon={CreditCard}
            title="Payment Method"
            content={orderService.formatPaymentMethod(order.payment_method)}
            delay={0.85}
          />
        </div>

        {/* Payment Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.87 }}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow mb-6"
        >
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-lg flex-shrink-0 ${
              order.payment_status === 'paid' ? 'bg-green-50' : 'bg-yellow-50'
            }`}>
              <CreditCard className={`w-5 h-5 ${
                order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                Payment Status
              </h3>
              <p className="text-gray-600 text-sm">
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                  order.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Addresses Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <InfoCard
            icon={MapPin}
            title="Shipping Address"
            content={order.shipping_address}
            delay={0.9}
          />
          <InfoCard
            icon={MapPin}
            title="Billing Address"
            content={order.billing_address}
            delay={0.92}
          />
        </div>

        {/* Tracking Number */}
        {order.tracking_number && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.93 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Tracking Number</p>
                <p className="text-blue-700 font-mono text-sm">{order.tracking_number}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Notes */}
        {order.notes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.94 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Special Instructions</p>
                <p className="text-amber-700 text-sm">{order.notes}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="bg-white rounded-2xl shadow-xl p-6 my-6"
        >
          <h3 className="font-semibold text-gray-800 mb-3">Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{order.customer_phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">{order.customer_email}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/buyer/orders')}
            className="flex-1 py-4 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Continue Shopping
          </button>
        </motion.div>

        {/* Help Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Need help? Contact our support team at{' '}
          <a href="mailto:support@treeshop.com" className="text-green-600 hover:underline">
            support@treeshop.com
          </a>
        </motion.p>
      </div>
    </div>
  );
}