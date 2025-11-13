// src/pages/buyer/Cart.jsx - FULLY RESPONSIVE WITH BACKEND
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, Store, ChevronRight, Loader2, X } from 'lucide-react';
import { useGetCartQuery } from '@/features/cart/cartApi';
import { useCart } from '@/hooks/useCart';
import DesktopHeader from '@/layouts/components/DesktopHeader';
import MobileHeader from '@/layouts/components/MobileHeader';

export default function Cart() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [couponCode, setCouponCode] = useState('');
  const [toast, setToast] = useState(null);

  const { data: cartData, isLoading, error, refetch } = useGetCartQuery();
  const { removeFromCart, updateQuantity, isLoading: isUpdating } = useCart();

  const items = cartData?.data?.items || [];
  const totalItems = cartData?.data?.item_count || 0;

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Select all items by default
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  }, [items]);

  const toggleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleUpdateQuantity = async (cartItemId, productId, newQuantity) => {
    if (newQuantity > 0) {
      const result = await updateQuantity(productId, newQuantity);
      if (!result.success) {
        setToast({ type: 'error', message: result.error });
        setTimeout(() => setToast(null), 3000);
      }
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      setToast({ type: 'success', message: `${productName} removed from cart` });
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    } else {
      setToast({ type: 'error', message: result.error });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      setToast({ type: 'error', message: 'Please select at least one item' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    navigate('/buyer/checkout', { state: { selectedItems: Array.from(selectedItems) } });
  };

  // Calculate totals for selected items
  const selectedCartItems = items.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  // Toast Component
  const Toast = ({ type, message, onClose }) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
    };
    return (
      <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-4'} right-4 z-50 max-w-md p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3 animate-slide-up`}>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && <DesktopHeader />}
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#16a34a]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && <DesktopHeader />}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load cart</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && <DesktopHeader />}
        {isMobile && <MobileHeader title="Shopping Cart" showBack onBack={() => navigate('/buyer/dashboard')} />}
        
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4">
          <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 text-center mb-6">
            Add some trees to your cart to get started!
          </p>
          <button
            onClick={() => navigate('/buyer/dashboard')}
            className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="pb-32 bg-gray-50 min-h-screen">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        
        <MobileHeader 
          title="Shopping Cart" 
          subtitle={`${totalItems} items`}
          showBack 
          onBack={() => navigate('/buyer/dashboard')} 
        />

        {/* Select All */}
        <div className="bg-white px-4 py-3 mb-2 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.size === items.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 accent-[#16a34a] cursor-pointer"
            />
            <span className="text-sm font-medium">Select All ({items.length})</span>
          </label>
          <span className="text-sm text-gray-600">
            {selectedItems.size} selected
          </span>
        </div>

        {/* Cart Items */}
        <div className="px-4 space-y-3 mb-4">
          {items.map((item) => {
            const product = item.product || item;
            const seller = product.seller?.store_name || 'TreeStore Official';
            
            return (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                {/* Seller Store Link */}
                <button 
                  onClick={() => navigate(`/seller/${product.seller?.id || 1}/products`)}
                  className="flex items-center gap-2 mb-3 text-sm text-gray-700 hover:text-[#059669] transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>{seller}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-5 h-5 mt-1 accent-[#16a34a] cursor-pointer flex-shrink-0"
                  />

                  {/* Product Image */}
                  <img
                    src={product.image_url || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug}`)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                    }}
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-sm font-medium mb-1 line-clamp-2 cursor-pointer hover:text-[#16a34a]"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {product.name}
                    </h3>
                    {item.is_gift && (
                      <p className="text-xs text-purple-600 mb-1">
                        🎁 {item.gift_message}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-bold text-[#16a34a]">
                        ${product.price?.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(product.id, product.name)}
                    disabled={isUpdating}
                    className="p-2 hover:bg-red-50 rounded-lg self-start disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon Code */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-[#f97316] flex-shrink-0" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 outline-none text-sm"
              />
              <button 
                className="text-[#059669] text-sm font-medium hover:text-[#047857] transition-colors"
                disabled={!couponCode.trim()}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-[#16a34a] text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Checkout Button */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-gray-600">{selectedItems.size} item(s) selected</span>
            <span className="font-semibold">Total: <span className="text-[#16a34a]">${total.toFixed(2)}</span></span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={selectedItems.size === 0 || isUpdating}
            className="w-full bg-[#16a34a] text-white py-3 rounded-xl font-semibold hover:bg-[#15803d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <DesktopHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/buyer/dashboard')} className="hover:text-[#16a34a]">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Shopping Cart ({totalItems} items)
          </h1>
          <button
            onClick={() => navigate('/buyer/dashboard')}
            className="text-[#16a34a] hover:text-[#15803d] font-medium"
          >
            Continue Shopping
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.size === items.length}
                  onChange={toggleSelectAll}
                  className="w-5 h-5 accent-[#16a34a] cursor-pointer"
                />
                <span className="font-medium">Select All ({items.length} items)</span>
              </label>
              <span className="text-sm text-gray-600">
                {selectedItems.size} items selected
              </span>
            </div>

            {/* Cart Items */}
            {items.map((item) => {
              const product = item.product || item;
              const seller = product.seller?.store_name || 'TreeStore Official';
              
              return (
                <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Seller Store Link */}
                  <button 
                    onClick={() => navigate(`/seller/${product.seller?.id || 1}/products`)}
                    className="flex items-center gap-2 mb-4 text-sm text-gray-700 hover:text-[#16a34a] transition-colors"
                  >
                    <Store className="w-4 h-4" />
                    <span className="font-medium">{seller}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <div className="flex gap-6">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 mt-1 accent-[#16a34a] cursor-pointer flex-shrink-0"
                    />

                    {/* Product Image */}
                    <img
                      src={product.image_url || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => navigate(`/product/${product.slug}`)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                      }}
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-[#16a34a] transition-colors line-clamp-2"
                        onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        {product.name}
                      </h3>
                      {item.is_gift && (
                        <div className="flex items-center gap-2 mb-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-flex">
                          🎁 Gift: {item.gift_message}
                        </div>
                      )}
                      <p className="text-2xl font-bold text-[#16a34a] mb-4">
                        ${product.price?.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating}
                              className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, product.id, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 transition-all"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(product.id, product.name)}
                          disabled={isUpdating}
                          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors font-medium"
                        >
                          <Trash2 className="w-5 h-5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Right Side (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-24 space-y-6">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a coupon code?
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none"
                    />
                  </div>
                  <button 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors disabled:opacity-50"
                    disabled={!couponCode.trim()}
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({selectedItems.size} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                      {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-[#16a34a]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0 || isUpdating}
                  className="w-full py-4 bg-[#16a34a] text-white rounded-lg font-semibold text-lg hover:bg-[#15803d] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by TreeShop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}