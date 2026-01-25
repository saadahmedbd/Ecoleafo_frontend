import { Heart } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * Wishlist page component displaying saved products
 * @param {Object} props - Component props
 * @param {Array} props.products - Array of wishlist products
 * @param {Function} props.onAddToCart - Callback to add product to cart
 * @param {Function} props.onRemoveFromWishlist - Callback to remove product from wishlist
 * @param {Function} props.onProductClick - Callback when product is clicked
 */
export default function WishlistPage({
  products,
  onAddToCart,
  onRemoveFromWishlist,
  onProductClick,
}) {
  usePageTitle('Wishlist');
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
              <div onClick={() => onProductClick(product)} className="cursor-pointer">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1" onClick={() => onProductClick(product)}>
                <h3 className="text-sm mb-1 line-clamp-2 cursor-pointer">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#059669]">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {product.inStock !== false ? (
                  <span className="text-xs text-green-600">In Stock</span>
                ) : (
                  <span className="text-xs text-red-600">Out of Stock</span>
                )}
              </div>
              <button
                onClick={() => onRemoveFromWishlist(product.id)}
                className="p-2 hover:bg-red-50 rounded-lg self-start"
              >
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => onRemoveFromWishlist(product.id)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Remove
              </button>
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 py-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] text-sm"
                disabled={product.inStock === false}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
