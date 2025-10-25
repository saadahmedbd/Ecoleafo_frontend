import { Heart } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/**
 * Wishlist page component displaying saved products
 * Backend integrated with API calls
 * 
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of wishlist products from backend
 * @param {Function} props.onAddToCart - Callback to move wishlist item to cart (calls backend API)
 * @param {Function} props.onRemoveFromWishlist - Callback to remove product from wishlist (calls backend API)
 * @param {Function} props.onProductClick - Callback when product is clicked
 */
export default function WishlistPage({
  products,
  onAddToCart,
  onRemoveFromWishlist,
  onProductClick,
}) {
  // Empty state when no wishlist items
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-xl mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 text-center">
          Save your favorite trees here for later!
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 mb-2">
        <h1 className="text-xl">My Wishlist</h1>
        <p className="text-sm text-gray-600">{products.length} items</p>
      </div>

      {/* Wishlist Items */}
      <div className="px-4 space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-border"
          >
            <div className="flex gap-3">
              {/* Product Image - Clickable */}
              <div onClick={() => onProductClick(product)} className="cursor-pointer">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>

              {/* Product Details - Clickable */}
              <div className="flex-1" onClick={() => onProductClick(product)}>
                <h3 className="text-sm mb-1 line-clamp-2 cursor-pointer">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#059669] font-medium">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {/* Stock Status */}
                {product.inStock !== false ? (
                  <span className="text-xs text-green-600 font-medium">In Stock</span>
                ) : (
                  <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Remove from Wishlist Button */}
              {/* Calls backend API: DELETE /api/wishlist/{productId} */}
              <button
                onClick={() => onRemoveFromWishlist(product.id)}
                className="p-2 hover:bg-red-50 rounded-lg self-start transition-colors"
                aria-label="Remove from wishlist"
              >
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              {/* Remove Button */}
              {/* Calls backend API: DELETE /api/wishlist/{productId} */}
              <button
                onClick={() => onRemoveFromWishlist(product.id)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                Remove
              </button>

              {/* Add to Cart Button */}
              {/* Calls backend API: POST /api/wishlist/{productId}/move-to-cart */}
              {/* This removes from wishlist and adds to cart in one atomic operation */}
              <button
                onClick={() => onAddToCart(product.id)}
                className="flex-1 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={product.inStock === false}
              >
                {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * BACKEND INTEGRATION NOTES:
 * 
 * This component works with the following backend APIs:
 * 
 * 1. GET /api/wishlist
 *    - Fetched in parent component (MobileApp.jsx)
 *    - Returns array of wishlist items
 *    - Transformed to match frontend format
 * 
 * 2. DELETE /api/wishlist/{productId}
 *    - Called via onRemoveFromWishlist(productId)
 *    - Removes item from wishlist
 *    - Parent component reloads wishlist data
 * 
 * 3. POST /api/wishlist/{productId}/move-to-cart
 *    - Called via onAddToCart(productId)
 *    - Atomically moves item from wishlist to cart
 *    - Parent component reloads both cart and wishlist
 * 
 * Data Flow:
 * - Parent component (MobileApp) maintains wishlist state
 * - Parent fetches data from backend on mount/login
 * - This component displays data and triggers actions
 * - Parent handles API calls and state updates
 * - Toast notifications shown for user feedback
 */