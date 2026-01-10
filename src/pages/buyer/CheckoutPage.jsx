import React, { useState, useEffect } from 'react';
import { 
  MapPin, Phone, Mail, User, CreditCard, Truck, 
  Package, CheckCircle, AlertCircle, X, Loader2,
  Edit2, Plus, ArrowLeft, ChevronRight, ShieldCheck, Gift
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import {
  useGetBuyerProfileQuery,
  useGetAddressesQuery,
  useValidateCartQuery,
  useCreateAddressMutation,
  useCreateOrderMutation,
} from '@/features/checkout/checkoutApi';
import { useGetCartCountQuery } from '@/features/cart/cartApi';
import {
  setSelectedAddress,
  setPaymentMethod,
  setShippingMethod,
  setOrderNotes,
  setProcessing,
  resetCheckout,
} from '@/features/checkout/checkoutSlice';
import checkoutService from '@/services/checkoutService';

// Toast Component
function Toast({ type, message, onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'warning' && <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Address Modal Component
function AddressModal({ isOpen, onClose, onSave, existingAddress = null }) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    street: '',
    city: '',
    district: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh',
    is_default: false,
  });

  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    }
  }, [existingAddress]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            {existingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              placeholder="House no, Building name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              placeholder="Road name, Area"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District *
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Checkout Component
export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const { isDesktop } = useDeviceDetection();

  // Redux state
  const checkoutState = useSelector((state) => state.checkout);

  // API queries
  const { data: profileData, isLoading: profileLoading } = useGetBuyerProfileQuery();
  const { data: addressesData, isLoading: addressesLoading } = useGetAddressesQuery();
  const { data: cartData, isLoading: cartLoading, refetch: refetchCart } = useValidateCartQuery(
    checkoutState.selectedAddress?.id
  );

  // API mutations
  const [createAddress, { isLoading: creatingAddress }] = useCreateAddressMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const { refetch: refetchCartCount } = useGetCartCountQuery();

  const profile = profileData;
  const addresses = addressesData || [];
  const cart = cartData || {};
  // Show all cart items (backend should return only selected items)
  const allCartItems = cart.items || [];
  const cartItems = allCartItems;

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !checkoutState.selectedAddress) {
      const defaultAddr = addresses.find(addr => addr.is_default) || addresses[0];
      dispatch(setSelectedAddress(defaultAddr));
    }
  }, [addresses, checkoutState.selectedAddress, dispatch]);

  // Refetch cart when address changes to update shipping cost
  useEffect(() => {
    if (checkoutState.selectedAddress?.id) {
      setTimeout(() => refetchCart(), 100);
    }
  }, [checkoutState.selectedAddress?.id, refetchCart]);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Redirect if cart is empty (but not on initial load)
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && cart.item_count === 0) {
      navigate('/buyer/cart');
    }
  }, [cartItems, cartLoading, cart.item_count, navigate]);



  // Calculate totals for selected items only
  const selectedSubtotal = cartItems.reduce((sum, item) => {
    const price = item.discount_price || item.price || item.original_price;
    return sum + (price * item.quantity);
  }, 0);
  
  const selectedDiscount = cartItems.reduce((sum, item) => {
    if (item.discount_price && item.original_price > item.discount_price) {
      return sum + ((item.original_price - item.discount_price) * item.quantity);
    }
    return sum;
  }, 0);

  const giftCharge = cartItems.some(item => item.is_gift || item.gift) ? 50 : 0;

  const orderSummary = {
    subtotal: Math.round(selectedSubtotal),
    discount: Math.round(selectedDiscount),
    shippingCost: Math.round(cart?.shipping_cost || 0),
    giftCharge: giftCharge,
    total: Math.round(selectedSubtotal + (cart?.shipping_cost || 0) + giftCharge),
    savings: Math.round(selectedDiscount),
    canCheckout: cart?.can_checkout ?? true
  };
  


  // Handle address save
  const handleSaveAddress = async (addressData) => {
    try {
      const result = await createAddress(addressData).unwrap();
      setShowAddressModal(false);
      dispatch(setSelectedAddress(result));
      setToast({ type: 'success', message: 'Address saved successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: error.data?.message || 'Failed to save address' });
    }
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Validation
    if (!checkoutState.selectedAddress) {
      setToast({ type: 'error', message: 'Please select a delivery address' });
      return;
    }

    // Check if cart has items and is valid
    if (!cart || !cart.items || cart.items.length === 0) {
      setToast({ type: 'error', message: 'Your cart is empty' });
      return;
    }

    // Check for out of stock items
    const outOfStockItems = cart.items.filter(item => !item.is_available || item.stock_quantity <= 0);
    if (outOfStockItems.length > 0) {
      setToast({ type: 'error', message: 'Some items in your cart are out of stock' });
      return;
    }

    // Format order data
    const orderData = checkoutService.formatOrderData(
      checkoutState,
      profile,
      checkoutState.selectedAddress,
      cart
    );

    // Validate
    const validation = checkoutService.validateCheckoutData(orderData);
    if (!validation.isValid) {
      setToast({ type: 'error', message: validation.errors[0] });
      return;
    }

    // Create order
    try {
      dispatch(setProcessing(true));
      const result = await createOrder(orderData).unwrap();

      setToast({ type: 'success', message: 'Order placed successfully!' });
      dispatch(resetCheckout());
      
      // Refetch cart count to update header
      refetchCartCount();

      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/buyer/orders/${result.id}`);
      }, 1500);
    } catch (error) {
      setToast({
        type: 'error',
        message: error.data?.message || 'Failed to place order. Please try again.'
      });
    } finally {
      dispatch(setProcessing(false));
    }
  };

  // Loading state
  if (profileLoading || addressesLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={handleSaveAddress}
      />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/buyer/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Cart</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            Secure Checkout
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Section - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="flex items-center gap-1 text-green-600 font-medium text-sm hover:text-green-700"
                >
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No delivery address found</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => dispatch(setSelectedAddress(address))}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        checkoutState.selectedAddress?.id === address.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{address.full_name}</span>
                            {address.is_default && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {address.address_line_1}, {address.address_line_2}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {address.city}, {address.district}, {address.state} - {address.postal_code}
                          </p>
                          <p className="text-sm text-gray-700 font-medium flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {address.phone}
                          </p>
                        </div>
                        {checkoutState.selectedAddress?.id === address.id && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary (Mobile Only) */}
            <div className="block lg:hidden">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <img
                        src={item.image?.[0] || 'https://via.placeholder.com/80'}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-green-600">
                            ৳{Math.round(item.discount_price || item.price).toLocaleString('en-IN')}
                          </span>
                          {item.discount_price && item.original_price > item.discount_price && (
                            <span className="text-xs text-gray-400 line-through">
                              ৳{Math.round(item.original_price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.item_count} items)</span>
                    <span className="font-semibold">৳{orderSummary.subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {orderSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-৳{orderSummary.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">
                    {orderSummary.shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `৳${orderSummary.shippingCost.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {orderSummary.giftCharge > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Gift Wrapping
                    </span>
                    <span className="font-semibold">৳{orderSummary.giftCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {orderSummary.shippingCost === 0 && orderSummary.subtotal >= 5000 && (
                  <div className="bg-green-50 text-green-700 text-sm p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Free shipping on orders above ৳5000!
                  </div>
                )}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-lg font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-green-600">
                      ৳{orderSummary.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {orderSummary.savings > 0 && (
                    <p className="text-xs text-green-600 text-right">
                      You saved ৳{orderSummary.savings.toLocaleString('en-IN')}!
                    </p>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-green-600" />
                    <span>Easy returns & refunds</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>100% genuine products</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-green-600" />
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{profile?.reg_user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">{profile?.phone || checkoutState.selectedAddress?.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                Shipping Method
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => dispatch(setShippingMethod('standard'))}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    checkoutState.shippingMethod === 'standard'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Standard Delivery</p>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {orderSummary.shippingCost === 0 ? 'FREE' : `৳${orderSummary.shippingCost.toLocaleString('en-IN')}`}
                      </p>
                      {checkoutState.shippingMethod === 'standard' && (
                        <CheckCircle className="w-5 h-5 text-green-600 ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-green-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => dispatch(setPaymentMethod('cash_on_delivery'))}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    checkoutState.paymentMethod === 'cash_on_delivery'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        💵
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                    {checkoutState.paymentMethod === 'cash_on_delivery' && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                value={checkoutState.orderNotes}
                onChange={(e) => dispatch(setOrderNotes(e.target.value))}
                placeholder="Any special instructions for your order..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="4"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {checkoutState.orderNotes.length}/500 characters
              </p>
            </div>
          </div>

          {/* Right Section - Order Summary (Desktop Only) */}
          <div className="lg:block hidden">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image?.[0] || 'https://via.placeholder.com/80'}
                      alt={item.product_name}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                        {item.product_name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-green-600">
                          ৳{Math.round(item.discount_price || item.price).toLocaleString('en-IN')}
                        </span>
                        {item.discount_price && item.original_price > item.discount_price && (
                          <span className="text-xs text-gray-400 line-through">
                            ৳{Math.round(item.original_price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span className="font-semibold">৳{orderSummary.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-৳{orderSummary.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold">
                    {orderSummary.shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `৳${orderSummary.shippingCost.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                {orderSummary.giftCharge > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Gift Wrapping
                    </span>
                    <span className="font-semibold">৳{orderSummary.giftCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}

            

                {orderSummary.shippingCost === 0 && orderSummary.subtotal >= 5000 && (
                  <div className="bg-green-50 text-green-700 text-sm p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Free shipping on orders above ৳5000!
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{orderSummary.total.toLocaleString('en-IN')}
                  </span>
                </div>
                {orderSummary.savings > 0 && (
                  <p className="text-xs text-green-600 text-right">
                    You saved ৳{orderSummary.savings.toLocaleString('en-IN')}!
                  </p>
                )}
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!checkoutState.selectedAddress || checkoutState.isProcessing || creatingOrder}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutState.isProcessing || creatingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4 text-green-600" />
                  <span>Easy returns & refunds</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>100% genuine products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Order Summary - Outside container */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">৳{orderSummary.total.toLocaleString('en-IN')}</p>
              {orderSummary.savings > 0 && (
                <p className="text-xs text-green-600">Saved ৳{orderSummary.savings.toLocaleString('en-IN')}</p>
              )}
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={!checkoutState.selectedAddress || checkoutState.isProcessing || creatingOrder}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {checkoutState.isProcessing || creatingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  Place Order
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
