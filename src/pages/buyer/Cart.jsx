// src/pages/buyer/Cart.jsx - PROFESSIONAL CART PAGE WITH 15+ YEARS UI/UX EXPERTISE
import React, { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import {
  ShoppingCart, Trash2, Plus, Minus, Heart, ArrowRight,
  Package, AlertCircle, X, Loader2, Gift, ChevronRight,
  CheckCircle, Tag, TrendingUp, Store,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useGetProductsQuery } from '@/features/BuyerProduct/buyerProductApi';
import { useGetCartQuery } from '@/features/cart/cartApi';
import ProductCard from '@/layouts/components/ProductCard';
import useDeviceDetection from '@/hooks/useDeviceDetection';

// Toast Notification Component
function Toast({ type, message, onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'warning' && <AlertCircle className="w-5 h-5" />}
        {type === 'info' && <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Empty Cart Component
function EmptyCart({ onContinueShopping }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-100 rounded-full p-8 mb-6">
        <ShoppingCart className="w-20 h-20 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
      </p>
      <button
        onClick={onContinueShopping}
        className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
      >
        Continue Shopping
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Cart Item Component
function CartItem({
  item,
  onUpdateQuantity,
  onIncrementQuantity,
  onDecrementQuantity,
  onRemove,
  onMoveToWishlist,
  onToggleGift,
  isUpdating,
  isSelected,
  onToggleSelect,
  localGiftStates,
  setLocalGiftStates
}) {
  const [showGiftOptions, setShowGiftOptions] = useState(item.is_gift || false);
  const [giftMessage, setGiftMessage] = useState(item.gift_message || '');

  const product = item.product;
  const itemId = item.id || item.product_id;
  const quantity = item.quantity; // Use item.quantity directly from props
  const discountPrice = Math.round(product?.discount_price || product?.price || 0);
  const regularPrice = Math.round(product?.price || 0);
  const hasDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const currentPrice = hasDiscount ? discountPrice : regularPrice;
  const sellerName = item.seller_name || 'Unknown Seller';
  
  const isOutOfStock = product?.quantity === 0;
  const isLowStock = product?.quantity > 0 && product?.quantity < 10;
  const maxQuantity = product?.quantity || 0;

  const primaryImage = product?.images?.find(img => img.is_primary)?.image_url 
    || product?.images?.[0]?.image_url 
    || product?.image_url 
    || 'https://via.placeholder.com/150';

  // Handle quantity increment with validation
  const handleIncrement = () => {
    if (quantity >= maxQuantity) {
      return; // Don't increment beyond available stock
    }
    onIncrementQuantity(product.id);
  };

  // Handle quantity decrement with validation
  const handleDecrement = () => {
    if (quantity <= 1) return; // Don't go below 1
    onDecrementQuantity(product.id);
  };

  // Handle gift toggle
  const handleGiftToggle = () => {
    const newGiftStatus = !showGiftOptions;
    setShowGiftOptions(newGiftStatus);
    // Update local state immediately
    setLocalGiftStates(prev => ({
      ...prev,
      [product.id]: newGiftStatus
    }));
    // Call API immediately for both enable and disable
    onToggleGift(product.id, newGiftStatus, newGiftStatus ? '' : '');
  };

  // Handle gift message change
  const handleGiftMessageChange = (e) => {
    const message = e.target.value;
    setGiftMessage(message);
  };

  // Handle gift message blur (save when user finishes typing)
  const handleGiftMessageBlur = () => {
    if (showGiftOptions) {
      // Save with or without message
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/cart/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          quantity: quantity,
          gift: true,
          gift_message: giftMessage || ''
        })
      }).catch(() => {}); // Ignore errors silently
    }
  };

  return (
    <div className={`bg-white rounded-xl border ${isOutOfStock ? 'border-red-200 bg-red-50/30' : isSelected ? 'border-green-500 border-2' : 'border-gray-200'} p-4 sm:p-6 transition-all ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="flex gap-4">
        {/* Checkbox for Selection */}
        <div className="flex-shrink-0 pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(itemId)}
            disabled={isOutOfStock || isUpdating}
            className="w-5 h-5 accent-black focus:ring-green-500 cursor-pointer disabled:opacity-50 rounded"
          />
        </div>
        
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={primaryImage}
              alt={product?.name}
              className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
              }}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2">
                {product?.name || item.product_name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                <Store className="w-3.5 h-3.5" />
                <span>{sellerName}</span>
              </div>
            </div>
            <button
              onClick={() => onRemove(product.id)}
              disabled={isUpdating}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              title="Remove from cart"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Stock Warning */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-1 text-orange-600 text-xs mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Only {product?.quantity} left in stock</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>This item is currently out of stock</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3 flex-wrap">
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              ৳{(currentPrice * quantity).toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm sm:text-base text-gray-500 line-through">
                  ৳{(regularPrice * quantity).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-white bg-red-500 px-2 py-1 rounded">
                  {Math.round(item.discount_percent || ((regularPrice - currentPrice) / regularPrice * 100))}% OFF
                </span>
              </>
            )}
          </div>

          {/* Quantity Controls & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isUpdating}
                  className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= maxQuantity || isUpdating}
                  className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {!isOutOfStock && (
                <button
                  onClick={handleGiftToggle}
                  disabled={isUpdating}
                  className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    showGiftOptions
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  Gift
                </button>
              )}
              
              <button
                onClick={() => onMoveToWishlist(product.id)}
                disabled={isUpdating}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Heart className="w-3.5 h-3.5" />
                Wishlist
              </button>
            </div>
          </div>

          {/* Gift Message Input */}
          {showGiftOptions && !isOutOfStock && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Gift Message (Optional)
              </label>
              <textarea
                value={giftMessage}
                onChange={handleGiftMessageChange}
                onBlur={handleGiftMessageBlur}
                data-product-id={product.id}
                placeholder="Add a personal message..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="2"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {giftMessage.length}/200 characters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Cart Page Component
export default function Cart() {
  usePageTitle('Shopping Cart');
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());
  const [pendingGiftMessages, setPendingGiftMessages] = useState(new Map());
  const [localGiftStates, setLocalGiftStates] = useState({});

  // Cart hook with all operations
  const {
    cart,
    isLoading: cartLoading,
    cartLoading: cartQueryLoading,
    cartError,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    moveToWishlist: moveCartToWishlist,
    updateCartItem,
    refetch: refetchCart,
    addToCart,
  } = useCart();

  // Transform cart items to match frontend expectations
  const transformedCart = cart ? {
    ...cart,
    items: cart.items?.map(item => ({
      ...item,
      product: {
        id: item.product_id,
        name: item.product_name,
        slug: item.product_slug,
        price: item.original_price,
        discount_price: item.discount_price,
        quantity: item.stock_quantity,
        image_url: item.image?.[0] || item.image,
        images: item.image ? (Array.isArray(item.image) ? item.image.map(url => ({ image_url: url, is_primary: true })) : [{ image_url: item.image, is_primary: true }]) : [],
        seller_name: item.seller_name,
        seller_id: item.seller_id,
        in_stock: item.in_stock,
        is_available: item.is_available,
        availability_message: item.availability_message
      }
    })) || []
  } : null;

  // Auto-select all available items on load and sync with backend
  useEffect(() => {
    if (transformedCart?.items?.length > 0 && selectedItemIds.size === 0) {
      const availableItems = transformedCart.items.filter(item => item.in_stock && item.is_available);
      const availableIds = availableItems.map(item => item.id || item.product_id);
      
      setSelectedItemIds(new Set(availableIds));
      
      // Call select-all API to sync with backend
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/cart/select-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ is_selected: true })
      });
    }
  }, [transformedCart?.items]);

  // Wishlist hook
  const { toggleWishlist, isInWishlist, refetchWishlist } = useWishlist();

  // Fetch recommended products (trending/featured)
  const { 
    data: productsData, 
    isLoading: productsLoading 
  } = useGetProductsQuery({ 
    page: 1, 
    limit: 8,
    sort: 'trending' // Fetch trending products as recommendations
  });
  
  // Auto-refetch cart data when component mounts or window gains focus
  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  const recommendedProducts = productsData?.data || [];

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle quantity update
  const handleUpdateQuantity = async (productId, newQuantity) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const result = await updateQuantity(productId, newQuantity);

      if (result.success) {
        await refetchCart();
        setToast({
          type: 'success',
          message: 'Quantity updated successfully'
        });
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to update quantity'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'An error occurred while updating quantity'
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle increment quantity
  const handleIncrementQuantity = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const result = await incrementQuantity(productId);

      if (result.success) {
        await refetchCart();
        setToast({
          type: 'success',
          message: 'Quantity increased successfully'
        });
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to increase quantity'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'An error occurred while increasing quantity'
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle decrement quantity
  const handleDecrementQuantity = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));

    try {
      const result = await decrementQuantity(productId);

      if (result.success) {
        await refetchCart();
        setToast({
          type: 'success',
          message: 'Quantity decreased successfully'
        });
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to decrease quantity'
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: 'An error occurred while decreasing quantity'
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle remove from cart
  const handleRemove = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      const result = await removeFromCart(productId);
      
      if (result.success) {
        await refetchCart();
        setToast({ 
          type: 'success', 
          message: 'Item removed from cart' 
        });
      } else {
        setToast({ 
          type: 'error', 
          message: result.error || 'Failed to remove item' 
        });
      }
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: 'An error occurred while removing item' 
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle move to wishlist
  const handleMoveToWishlist = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      const result = await moveCartToWishlist(productId);
      
      if (result.success) {
        await refetchCart();
        setToast({ 
          type: 'success', 
          message: 'Item moved to wishlist' 
        });
      } else {
        setToast({ 
          type: 'error', 
          message: result.error || 'Failed to move item to wishlist' 
        });
      }
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: 'An error occurred while moving item' 
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle gift toggle
  const handleToggleGift = async (productId, isGift, giftMessage, skipToast = false) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      // Get current item to preserve quantity
      const currentItem = transformedCart?.items?.find(item => item.product.id === productId);
      
      const result = await updateCartItem(productId, {
        quantity: currentItem?.quantity || 1,
        gift: isGift,
        gift_message: giftMessage || ''
      });
      
      if (result.success) {
        // Always refetch to update gift charge display
        await refetchCart();
        if (!skipToast) {
          setToast({ 
            type: 'success', 
            message: isGift ? 'Gift option enabled' : 'Gift option disabled'
          });
        }
      } else if (!skipToast) {
        setToast({ 
          type: 'error', 
          message: result.error || 'Failed to update gift options' 
        });
      }
    } catch (error) {
      if (!skipToast) {
        setToast({ 
          type: 'error', 
          message: 'Failed to update gift options'
        });
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle add recommended product to cart
  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
      setToast({ type: 'error', message: 'Product is out of stock' });
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(product.id));
    
    try {
      const result = await addToCart(product, 1);
      
      if (result.success) {
        await refetchCart();
        setToast({ type: 'success', message: `${product.name} added to cart!` });
      } else if (result.alreadyInCart) {
        setToast({ type: 'info', message: 'Product is already in cart' });
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to add to cart' });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  // Handle toggle wishlist for recommended products
  const handleToggleWishlist = async (product) => {
    const wasInWishlist = isInWishlist(product.id);
    
    const result = await toggleWishlist(product.id);
    
    if (result.success) {
      await refetchWishlist();
      if (wasInWishlist) {
        setToast({ type: 'success', message: `${product.name} removed from wishlist` });
      } else {
        setToast({ type: 'success', message: `${product.name} added to wishlist` });
      }
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to update wishlist' });
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  // Handle checkout - just navigate, let onBlur save messages
  const handleCheckout = () => {
    if (selectedItemIds.size === 0) return;
    navigate('/buyer/checkout');
  };

  // Handle item selection toggle
  const handleToggleSelect = async (itemId) => {
    const isCurrentlySelected = selectedItemIds.has(itemId);
    const newIsSelected = !isCurrentlySelected;
    
    // Update UI immediately
    setSelectedItemIds(prev => {
      const newSet = new Set(prev);
      if (newIsSelected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/cart/${itemId}/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ is_selected: newIsSelected })
      });
      
      if (!response.ok) {
        const data = await response.json();
        // Revert on error
        setSelectedItemIds(prev => {
          const newSet = new Set(prev);
          if (isCurrentlySelected) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
        setToast({ type: 'error', message: data.message || 'Failed to update selection' });
      }
    } catch (error) {
      // Revert on error
      setSelectedItemIds(prev => {
        const newSet = new Set(prev);
        if (isCurrentlySelected) {
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }
        return newSet;
      });
      setToast({ type: 'error', message: 'Failed to update selection' });
    }
  };

  // Calculate totals for selected items only
  const cartItems = transformedCart?.items || [];
  
  // Handle select all
  const handleSelectAll = async () => {
    const availableIds = cartItems
      .filter(item => item.in_stock && item.is_available)
      .map(item => item.id || item.product_id);
    const allSelected = availableIds.every(id => selectedItemIds.has(id));
    const newIsSelected = !allSelected;
    
    // Update UI immediately
    const previousState = new Set(selectedItemIds);
    setSelectedItemIds(newIsSelected ? new Set(availableIds) : new Set());
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}/cart/select-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ is_selected: newIsSelected })
      });
      
      if (!response.ok) {
        const data = await response.json();
        // Revert on error
        setSelectedItemIds(previousState);
        setToast({ type: 'error', message: data.message || 'Failed to select all items' });
      }
    } catch (error) {
      // Revert on error
      setSelectedItemIds(previousState);
      setToast({ type: 'error', message: 'Failed to select all items' });
    }
  };

  // Check if all items are selected
  const allSelected = cartItems.length > 0 && 
    cartItems.filter(item => item.in_stock && item.is_available).every(item => 
      selectedItemIds.has(item.id || item.product_id)
    );
  const selectedItems = cartItems.filter(item => selectedItemIds.has(item.id || item.product_id));
  
  const selectedSubtotal = selectedItems.reduce((sum, item) => {
    const hasDiscount = item.discount_price > 0 && item.discount_price < item.original_price;
    const price = Math.round(hasDiscount ? item.discount_price : item.original_price);
    return sum + (price * item.quantity);
  }, 0);

  const selectedDiscount = selectedItems.reduce((sum, item) => {
    const hasDiscount = item.discount_price > 0 && item.discount_price < item.original_price;
    const discount = hasDiscount ? Math.round((item.original_price - item.discount_price) * item.quantity) : 0;
    return sum + discount;
  }, 0);
  
  const shippingCost = selectedItems.length > 0 ? Math.round(transformedCart?.shipping_cost || 0) : 0;
  
  // Debug gift items - check both backend data and local state
  console.log('Selected Items:', selectedItems.map(item => ({
    id: item.id,
    product_id: item.product_id,
    name: item.product_name,
    is_gift: item.is_gift,
    gift: item.gift,
    gift_message: item.gift_message,
    localGiftState: localGiftStates[item.product_id]
  })));
  
  // Check gift charge using both backend data and local state
  const giftCharge = selectedItems.some(item => 
    item.is_gift || item.gift || localGiftStates[item.product_id]
  ) ? 50 : 0;
  console.log('Gift Charge:', giftCharge);
  console.log('Local Gift States:', localGiftStates);
  
  const selectedTotal = selectedSubtotal + shippingCost + giftCharge;
  const selectedCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = Math.round(transformedCart?.subtotal || 0);
  const discount = Math.round(transformedCart?.discount || 0);
  const total = Math.round(transformedCart?.total_amount || transformedCart?.total || 0);
  const itemCount = transformedCart?.item_count || 0;
  const totalSavings = Math.round(transformedCart?.total_savings || discount);

  // Loading state
  if (cartLoading || cartQueryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Cart</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load your cart. Please try again.
          </p>
          <button
            onClick={() => refetchCart()}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        
        <div className="container mx-auto px-4 py-8">
          <EmptyCart onContinueShopping={() => navigate('/')} />

          {/* Recommendations even when cart is empty */}
          {recommendedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Start Shopping
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    onProductClick={handleProductClick}
                    isInWishlist={isInWishlist(product.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="min-h-screen bg-gray-50 pb-32 md:pb-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
            Shopping Cart
            <span className="text-lg sm:text-xl text-gray-500">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All Button */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 accent-black focus:ring-green-500 cursor-pointer rounded"
                />
                <span className="font-semibold text-gray-800">Select All ({cartItems.filter(item => item.in_stock && item.is_available).length} items)</span>
              </div>
              <span className="text-sm text-gray-600">{selectedCount} selected</span>
            </div>
            
            {cartItems.map((item) => (
              <CartItem
                key={item.id || item.product_id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onIncrementQuantity={handleIncrementQuantity}
                onDecrementQuantity={handleDecrementQuantity}
                onRemove={handleRemove}
                onMoveToWishlist={handleMoveToWishlist}
                onToggleGift={handleToggleGift}
                isUpdating={updatingItems.has(item.product?.id || item.product_id)}
                isSelected={selectedItemIds.has(item.id || item.product_id)}
                onToggleSelect={handleToggleSelect}
                localGiftStates={localGiftStates}
                setLocalGiftStates={setLocalGiftStates}
              />
            ))}
          </div>

          {/* Order Summary - Sticky on desktop, bottom on mobile */}
          <div className="lg:col-span-1">
            <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({selectedCount} items)</span>
                  <span className="font-semibold">৳{selectedSubtotal.toLocaleString('en-IN')}</span>
                </div>
                
                {selectedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      Discount
                    </span>
                    <span className="font-semibold">-৳{selectedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">{shippingCost > 0 ? `৳${shippingCost.toLocaleString('en-IN')}` : 'FREE'}</span>
                </div>
                
                {giftCharge > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span className="flex items-center gap-1">
                      <Gift className="w-4 h-4" />
                      Gift Wrapping
                    </span>
                    <span className="font-semibold">৳{giftCharge.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{selectedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {selectedDiscount > 0 && (
                  <p className="text-sm text-green-600 text-right mt-1 font-medium">
                    You saved ৳{selectedDiscount.toLocaleString('en-IN')}!
                  </p>
                )}
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItemIds.size === 0}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 mb-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Checkout ({selectedCount})
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Continue Shopping
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <Package className="w-4 h-4 text-green-600" />
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4 text-green-600" />
                  <span>7-day return policy</span>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Order Summary */}
            <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600">Total ({selectedCount} items)</p>
                  <p className="text-2xl font-bold text-green-600">৳{selectedTotal.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-green-600">Delivery: ৳{shippingCost.toLocaleString('en-IN')}</p>
                  {giftCharge > 0 && (
                    <p className="text-xs text-purple-600">Gift Wrapping: ৳{giftCharge}</p>
                  )}

                  {selectedDiscount > 0 && (
                    <p className="text-xs text-green-600">Saved ৳{selectedDiscount.toLocaleString('en-IN')}</p>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={selectedItemIds.size === 0}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                You May Also Like
              </h2>
              <button
                onClick={() => navigate('/products')}
                className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
              >
                View All
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {recommendedProducts.slice(0, 5).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onProductClick={handleProductClick}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}