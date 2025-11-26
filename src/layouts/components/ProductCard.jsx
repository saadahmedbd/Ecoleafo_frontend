
import React from 'react';
import { Heart, ShoppingCart, Star, Package, TrendingUp } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onProductClick, 
  isInWishlist 
}) {
  
  // Calculate discount percentage - Check all possible fields
  const discountPercentage = product.discount_percent 
    ? Math.round(product.discount_percent)
    : product['discount_percent'] 
      ? Math.round(product['discount_percent'])
      : 0;

  // Check if discount price exists
  const discountPrice = product.discount_price || product['discount price'] || product.discountPrice;
  const regularPrice = product.price || 0;

  // Has valid discount only if discount price exists AND is less than regular price AND > 0
  const hasValidDiscount = discountPrice && discountPrice > 0 && discountPrice < regularPrice && discountPercentage > 0;
  
  // Current price to display
  const currentPrice = hasValidDiscount ? discountPrice : regularPrice;

  // Original price (only set if there's a valid discount)
  const originalPrice = hasValidDiscount ? regularPrice : null; 

  // Stock status
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity < 10;
  const savings = hasValidDiscount ? (originalPrice - currentPrice) : 0;

  // Image handling
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url 
    || product.images?.[0]?.image_url 
    || product.image_url 
    || 'https://via.placeholder.com/400x300?text=No+Image';

  // Rating display
  const rating = product.average_rating || 0;
  const reviewCount = product.review_count || 0;
  const saleCount = product.sale_count || 0;

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden group flex flex-col border border-gray-100 hover:shadow-xl hover:border-green-500/20 transition-all duration-300 relative h-full"
      onClick={() => onProductClick(product)}
    >
      {/* Image Section - Compact for mobile */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-40 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        
        {/* Wishlist Button - Smaller on mobile */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:scale-110 active:scale-95 transition-all z-20"
          aria-label="Add to wishlist"
        >
          <Heart 
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
              isInWishlist 
                ? "fill-red-500 text-red-500" 
                : "text-gray-600 hover:text-red-500"
            }`} 
          />
        </button>

        {/* Discount Badge - Compact */}
        {hasValidDiscount && !isOutOfStock && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
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

        {/* Low Stock Badge - Bottom left */}
        {isLowStock && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10">
            <div className="bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md flex items-center gap-1">
              <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {product.quantity} left
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Optimized padding */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-grow">
        {/* Product Name - Bold and compact */}
        <h4 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2 leading-tight hover:text-green-600 transition-colors">
          {product.name}
        </h4>

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

        {/* Spacer to push price section to bottom */}
        <div className="flex-grow"></div>

        {/* Price Section - Mobile optimized */}
        <div className="mt-auto">
          {/* Prices - Cleaner layout */}
          <div className="mb-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                ৳{currentPrice?.toLocaleString('en-IN')}
              </span>
              {hasValidDiscount && originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {/* Savings text - Only show if has valid discount */}
            {hasValidDiscount && savings > 0 && (
              <div className="mt-0.5">
                <span className="text-[10px] font-semibold text-red-600">
                  Save ৳{savings?.toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button - Compact */}
          <button
            onClick={handleCartClick}
            disabled={isOutOfStock}
            className={`w-full py-2 sm:py-2.5 px-3 rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white shadow-md hover:shadow-lg hover:bg-green-700 active:scale-95'
            }`}
          >
            <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Stock Info - Minimal - Only show if > 10 */}
          {!isOutOfStock && product.quantity !== undefined && product.quantity > 10 && (
            <div className="mt-1 text-center">
              <span className="text-[10px] text-gray-400">
                {product.quantity} in stock
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}