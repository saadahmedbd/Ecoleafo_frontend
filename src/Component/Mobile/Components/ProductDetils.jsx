import { ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function ProductDetails({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  relatedProducts,
  onProductClick,
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Medium");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [product.image, product.image, product.image];

  return (
    <div className="pb-24 bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Share2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart
              className={`w-6 h-6 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative bg-gray-100">
        <ImageWithFallback
          src={images[currentImage]}
          alt={product.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="flex-1 pr-4">{product.name}</h1>
          {product.originalPrice && (
            <div className="bg-[#f97316] text-white px-3 py-1 rounded-lg text-sm">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-gray-500">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl text-[#059669]">${product.price}</span>
          {product.originalPrice && (
            <span className="text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="mb-2">Description</h3>
          <p className={`text-gray-600 ${!showFullDescription ? "line-clamp-3" : ""}`}>
            {product.description ||
              `Premium quality ${product.name.toLowerCase()}. Perfect for gardens, parks, or indoor decoration. Healthy, well-maintained, and ready to plant. Comes with care instructions and planting guide. Suitable for all climates and soil types.`}
          </p>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-[#059669] text-sm mt-2"
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        </div>

        {/* Size Selection */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3">Select Size</h3>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 rounded-lg border-2 transition-all ${
                    selectedSize === size
                      ? "border-[#059669] bg-[#059669]/10 text-[#059669]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-6">
          <h3 className="mb-3">Quantity</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-6">
          <h3 className="mb-3">You May Also Like</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => onProductClick(relatedProduct)}
                className="flex-shrink-0 w-36 bg-white border border-border rounded-xl overflow-hidden cursor-pointer"
              >
                <ImageWithFallback
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2">
                  <p className="text-sm line-clamp-2 mb-1">{relatedProduct.name}</p>
                  <span className="text-[#059669] text-sm">${relatedProduct.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 flex gap-3">
        <button
          onClick={() => onAddToCart(product, quantity, selectedSize)}
          className="flex-1 bg-white border-2 border-[#059669] text-[#059669] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
        <button
          onClick={() => {
            onAddToCart(product, quantity, selectedSize);
            // In a real app, this would navigate to checkout
          }}
          className="flex-1 bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
