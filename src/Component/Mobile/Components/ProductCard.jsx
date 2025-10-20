import { Heart, ShoppingCart, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  isInWishlist,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="relative" onClick={() => onProductClick(product)}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </button>
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-[#f97316] text-white px-2 py-1 rounded-lg">
            <span className="text-xs">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>
      <div className="p-3" onClick={() => onProductClick(product)}>
        <h3 className="text-sm mb-1 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-700">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#059669]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="p-2 bg-[#059669] text-white rounded-lg hover:bg-[#047857] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
