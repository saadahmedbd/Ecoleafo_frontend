// src/pages/buyer/Wishlist.jsx - PROFESSIONAL WISHLIST PAGE
import React, { useState, useEffect } from 'react';
import {
  Heart, ShoppingCart, Trash2, ArrowRight,
  AlertCircle, X, Loader2, TrendingUp, ChevronRight,
  CheckCircle, Package, Filter, Grid, List, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useGetProductsQuery } from '@/features/BuyerProduct/buyerProductApi';
import ProductCard from '@/layouts/components/ProductCard';
import useDeviceDetection from '@/hooks/useDeviceDetection';
import DesktopHeader from '@/layouts/components/DesktopHeader';
import MobileHeader from '@/layouts/components/MobileHeader';

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

// Empty Wishlist Component
function EmptyWishlist({ onContinueShopping }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-8 mb-6">
        <Heart className="w-20 h-20 text-red-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Save your favorite products here so you can easily find them later!
      </p>
      <button
        onClick={onContinueShopping}
        className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
      >
        Start Shopping
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Wishlist Item Component - Grid View
function WishlistItemGrid({
  item,
  onAddToCart,
  onRemove,
  isAddingToCart,
  isRemoving
}) {
  const navigate = useNavigate();

  // Backend returns flat structure, not nested under 'product'
  const productId = item.product_id;
  const productName = item.product_name;
  const productSlug = item.product_slug;
  const price = item.price || 0;
  const originalPrice = item.original_price || 0;
  const discountPercent = item.discount_percent || 0;
  const stockQuantity = item.quantity || item.stock_quantity || 0;
  const isAvailable = item.in_stock === true; // Use in_stock for availability
  const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image || 'https://via.placeholder.com/400x300';

  // Calculate discount percentage - Check all possible fields
  const discountPercentage = discountPercent ? Math.round(discountPercent) : 0;

  // Check if discount price exists
  const discountPrice = item.discount_price || item['discount price'] || item.discountPrice;

  // Calculate discount price from percentage if not provided
  const calculatedDiscountPrice = discountPercentage > 0 ? price * (1 - discountPercentage / 100) : null;

  // Use provided discount price or calculated one
  const finalDiscountPrice = discountPrice || calculatedDiscountPrice;

  // Has valid discount if we have discount percentage > 0 OR discount price < regular price
  const hasValidDiscount = (discountPercentage > 0 && finalDiscountPrice && finalDiscountPrice < price) ||
                          (finalDiscountPrice && finalDiscountPrice > 0 && finalDiscountPrice < price);

  // Current price to display
  const currentPrice = hasValidDiscount ? finalDiscountPrice : price;

  // Display original price (only set if there's a valid discount)
  const displayOriginalPrice = hasValidDiscount ? price : null;

  // Stock status
  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity > 0 && stockQuantity < 10;
  const savings = hasValidDiscount ? (price - currentPrice) : 0;

  // Rating display
  const rating = item.average_rating || item.rating || 0;
  const reviewCount = item.review_count || item.reviews || 0;
  const saleCount = item.sale_count || 0;

  // Price display variables
  const hasDiscount = hasValidDiscount;
  const regularPrice = price;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group relative ${isAddingToCart || isRemoving ? 'opacity-50' : ''}`}>
      {/* Image Section */}
      <div 
        className="relative overflow-hidden bg-gray-50 cursor-pointer"
        onClick={() => navigate(`/products/${productId}`)}
      >
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300';
          }}
        />
        
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(productId);
          }}
          disabled={isRemoving}
          className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:scale-110 active:scale-95 transition-all z-10"
          title="Remove from wishlist"
        >
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
        </button>

        {/* Discount Badge */}
        {hasValidDiscount && !isOutOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg shadow-md">
              <div className="text-xs sm:text-sm">-{discountPercentage}%</div>
            </div>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="bg-white text-red-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm shadow-xl border-2 border-red-500">
              Out of Stock
            </div>
          </div>
        )}

        {/* Low Stock Badge */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Package className="w-3 h-3" />
              {stockQuantity} left
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        {/* Product Name */}
        <h3 
          className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2 leading-tight hover:text-green-600 transition-colors cursor-pointer"
          onClick={() => navigate(`/products/${productId}`)}
        >
          {productName}
        </h3>

        {/* Rating & Reviews Section - Compact */}
        <div className="flex items-center gap-1.5 mb-2 text-xs">
          <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-gray-700">
              {rating > 0 ? rating.toFixed(1) : '0.0'}
            </span>
          </div>

          {reviewCount > 0 && (
            <span className="text-[10px] text-gray-500">
              ({reviewCount})
            </span>
          )}

          {saleCount > 0 && (
            <>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-[10px] text-gray-500">
                {saleCount} sold
              </span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-bold text-green-600">
              ৳{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ৳{regularPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {hasDiscount && (
            <div className="mt-0.5">
              <span className="text-[10px] font-semibold text-red-600">
                Save ৳{(regularPrice - currentPrice).toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(item)}
          disabled={isOutOfStock || isAddingToCart}
          className={`w-full py-2 sm:py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white shadow-md hover:shadow-lg hover:bg-green-700 active:scale-95'
          }`}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Wishlist Item Component - List View
function WishlistItemList({ 
  item, 
  onAddToCart, 
  onRemove,
  isAddingToCart,
  isRemoving
}) {
  const navigate = useNavigate();
  
  // Backend returns flat structure
  const productId = item.product_id;
  const productName = item.product_name;
  const productSlug = item.product_slug;
  const price = item.price || 0;
  const originalPrice = item.original_price || 0;
  const discountPercent = item.discount_percent || 0;
  const stockQuantity = item.quantity || item.stock_quantity || 0;
  const isAvailable = item.in_stock === true; // Use in_stock for availability
  const imageUrl = Array.isArray(item.image) ? item.image[0] : item.image || 'https://via.placeholder.com/150';

  // Calculate discount percentage - Check all possible fields
  const discountPercentage = discountPercent ? Math.round(discountPercent) : 0;

  // Check if discount price exists
  const discountPrice = item.discount_price || item['discount price'] || item.discountPrice;

  // Calculate discount price from percentage if not provided
  const calculatedDiscountPrice = discountPercentage > 0 ? price * (1 - discountPercentage / 100) : null;

  // Use provided discount price or calculated one
  const finalDiscountPrice = discountPrice || calculatedDiscountPrice;

  // Has valid discount if we have discount percentage > 0 OR discount price < regular price
  const hasDiscount = (discountPercentage > 0 && finalDiscountPrice && finalDiscountPrice < price) ||
                      (finalDiscountPrice && finalDiscountPrice > 0 && finalDiscountPrice < price);

  // Current price to display
  const currentPrice = hasDiscount ? finalDiscountPrice : price;

  // Regular price for display
  const regularPrice = price;

  const isOutOfStock = stockQuantity <= 0;
  const isLowStock = stockQuantity > 0 && stockQuantity < 10;

  const rating = 0;
  const reviewCount = 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all ${isAddingToCart || isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div 
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/products/${productId}`)}
        >
          <div className="relative">
            <img
              src={imageUrl}
              alt={productName}
              className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
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
            <h3 
              className="font-bold text-gray-800 text-base sm:text-lg line-clamp-2 hover:text-green-600 transition-colors cursor-pointer"
              onClick={() => navigate(`/products/${productId}`)}
            >
              {productName}
            </h3>
            <button
              onClick={() => onRemove(productId)}
              disabled={isRemoving}
              className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              title="Remove from wishlist"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Rating - Hidden if no reviews */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                <span className="text-amber-400">★</span>
                <span className="text-sm font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
            </div>
          )}

          {/* Stock Warning */}
          {isLowStock && !isOutOfStock && (
            <div className="flex items-center gap-1 text-orange-600 text-xs mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Only {stockQuantity} left in stock</span>
            </div>
          )}

          {isOutOfStock && (
            <div className="flex items-center gap-1 text-red-600 text-xs mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Currently out of stock</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              ৳{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ৳{regularPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Save ৳{(regularPrice - currentPrice).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(item)}
            disabled={isOutOfStock || isAddingToCart}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white shadow-md hover:shadow-lg hover:bg-green-700 active:scale-95'
            }`}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Wishlist Page Component
export default function Wishlist() {
  const navigate = useNavigate();
  const { isDesktop } = useDeviceDetection();
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [addingToCart, setAddingToCart] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());

  // Wishlist hook
  const {
    wishlist,
    isLoading: wishlistLoading,
    error: wishlistError,
    removeFromWishlist,
    moveToCart,
    refetchWishlist,
    wishlistCount
  } = useWishlist();

  // Cart hook for adding items
  const { addToCart } = useCart();

  // Fetch recommended products
  const { 
    data: productsData, 
    isLoading: productsLoading 
  } = useGetProductsQuery({ 
    page: 1, 
    limit: 8,
    sort: 'trending'
  });

  const recommendedProducts = productsData?.data || [];
  const wishlistItems = wishlist || [];

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle add to cart
  const handleAddToCart = async (item) => {
    const productId = item.product_id;
    const isAvailable = item.in_stock === true;
    const stockQuantity = item.quantity || item.stock_quantity || 0;

    if (!isAvailable || stockQuantity <= 0) {
      setToast({ type: 'error', message: 'Product is out of stock' });
      return;
    }

    setAddingToCart(prev => new Set(prev).add(productId));

    try {
      // Move from wishlist to cart using API
      const result = await moveToCart(productId);
      
      if (result.success) {
        await refetchWishlist();
        setToast({ 
          type: 'success', 
          message: `${item.product_name} moved to cart successfully!` 
        });
      } else {
        setToast({ 
          type: 'error', 
          message: result.error || 'Failed to add to cart' 
        });
      }
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: 'An error occurred while adding to cart' 
      });
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle remove from wishlist
  const handleRemove = async (productId) => {
    setRemovingItems(prev => new Set(prev).add(productId));

    try {
      const result = await removeFromWishlist(productId);
      
      if (result.success) {
        await refetchWishlist();
        setToast({ 
          type: 'success', 
          message: 'Item removed from wishlist' 
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
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle add recommended product to cart
  const handleAddRecommendedToCart = async (product) => {
    if (product.quantity === 0) {
      setToast({ type: 'error', message: 'Product is out of stock' });
      return;
    }

    const result = await addToCart(product, 1);
    
    if (result.success) {
      setToast({ type: 'success', message: `${product.name} added to cart!` });
    } else if (result.alreadyInCart) {
      setToast({ type: 'info', message: `${product.name} is already in your cart` });
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  // Loading state
  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (wishlistError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Wishlist</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load your wishlist. Please try again.
          </p>
          <button
            onClick={() => refetchWishlist()}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty wishlist state
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        
        <div className="container mx-auto px-4 py-8">
          <EmptyWishlist onContinueShopping={() => navigate('/')} />

          {/* Recommendations when wishlist is empty */}
          {recommendedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Popular Products
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedProducts.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddRecommendedToCart}
                    onToggleWishlist={() => {}}
                    onProductClick={handleProductClick}
                    isInWishlist={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main wishlist view
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Header */}
      {isDesktop ? (
        <DesktopHeader />
      ) : (
        <MobileHeader
          title="My Wishlist"
          showBack={true}
          showCart={false}
        />
      )}

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Page Title and Controls - Only show on desktop */}
        {isDesktop && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500 fill-red-500" />
                  My Wishlist
                  <span className="text-lg sm:text-xl text-gray-500">
                    ({wishlistCount} {wishlistCount === 1 ? 'item' : 'items'})
                  </span>
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Save your favorite products for later
                </p>
              </div>

              {/* View Mode Toggle - Hidden on mobile */}
              <div className="hidden sm:flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
            {wishlistItems.map((item) => (
              <WishlistItemGrid
                key={item.product_id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
                isAddingToCart={addingToCart.has(item.product_id)}
                isRemoving={removingItems.has(item.product_id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {wishlistItems.map((item) => (
              <WishlistItemList
                key={item.product_id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
                isAddingToCart={addingToCart.has(item.product_id)}
                isRemoving={removingItems.has(item.product_id)}
              />
            ))}
          </div>
        )}

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
                  onAddToCart={handleAddRecommendedToCart}
                  onToggleWishlist={() => {}}
                  onProductClick={handleProductClick}
                  isInWishlist={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}