import { ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart, ChevronDown, ChevronUp, MapPin, Truck, Shield, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("specifications"); // specifications, reviews, qa
  const [expandedSpecs, setExpandedSpecs] = useState(true);
  const [expandedSeller, setExpandedSeller] = useState(true);

  // Mock data - In real app, this would come from props or API
  const specifications = {
    "Brand": product.brand || "TreeStore Premium",
    "Plant Type": product.plantType || "Ornamental",
    "Height": product.height || "12-18 inches",
    "Pot Size": selectedSize,
    "Sunlight": product.sunlight || "Partial to Full Sun",
    "Water Requirements": product.water || "Moderate",
    "Growth Rate": product.growthRate || "Medium",
    "Suitable For": product.suitableFor || "Indoor & Outdoor",
  };

  const reviews = [
    { id: 1, user: "John D.", rating: 5, date: "2 days ago", comment: "Excellent quality! Plant arrived healthy and well-packaged.", verified: true },
    { id: 2, user: "Sarah M.", rating: 4, date: "1 week ago", comment: "Good product, but smaller than expected. Still happy with purchase.", verified: true },
    { id: 3, user: "Mike R.", rating: 5, date: "2 weeks ago", comment: "Amazing! Growing beautifully in my garden.", verified: true },
  ];

  const questions = [
    { id: 1, question: "Is this suitable for indoor planting?", answer: "Yes, this plant thrives both indoors and outdoors with proper care.", askedBy: "Emma L.", answeredBy: "TreeStore Team", date: "3 days ago" },
    { id: 2, question: "How often should I water this plant?", answer: "Water when the top inch of soil feels dry, typically 2-3 times per week.", askedBy: "David K.", answeredBy: "TreeStore Team", date: "1 week ago" },
  ];

  const stockInfo = {
    available: product.stock || 47,
    status: (product.stock || 47) > 20 ? "In Stock" : (product.stock || 47) > 0 ? "Limited Stock" : "Out of Stock",
    statusColor: (product.stock || 47) > 20 ? "text-[#059669]" : (product.stock || 47) > 0 ? "text-orange-600" : "text-red-600"
  };

  const sellerInfo = {
    name: product.seller || "TreeStore Official",
    rating: product.sellerRating || 4.8,
    totalRatings: product.sellerTotalRatings || "12.5k",
    joinedDate: product.sellerJoined || "2020",
    responseTime: product.sellerResponseTime || "within 24 hours"
  };

  const images = [product.image, product.image, product.image];

  // Reset state when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedSize(product.sizes?.[0] || "Medium");
    setShowFullDescription(false);
    setCurrentImage(0);
    setActiveTab("specifications");
    window.scrollTo(0, 0);
  }, [product.id]);

  return (
    <div className="pb-32 bg-white min-h-screen">
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

        {/* Stock & Delivery Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className={`font-medium ${stockInfo.statusColor}`}>{stockInfo.status}</span>
            <span className="text-gray-600 text-sm">Only {stockInfo.available} left</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Truck className="w-4 h-4" />
              <span>Free delivery on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>Delivers to your location in 3-5 days</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <RotateCcw className="w-4 h-4" />
              <span>7-day return policy</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-4 h-4" />
              <span>100% Secure payments</span>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="mb-6 border border-gray-200 rounded-lg">
          <button
            onClick={() => setExpandedSeller(!expandedSeller)}
            className="w-full p-4 flex items-center justify-between"
          >
            <h3 className="font-medium">Sold by {sellerInfo.name}</h3>
            {expandedSeller ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedSeller && (
            <div className="px-4 pb-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{sellerInfo.rating}</span>
                <span className="text-gray-600">({sellerInfo.totalRatings} ratings)</span>
              </div>
              <p className="text-gray-600">Seller since {sellerInfo.joinedDate}</p>
              <p className="text-gray-600">Responds {sellerInfo.responseTime}</p>
              <button className="mt-2 text-[#059669] font-medium">Visit Store</button>
            </div>
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
            <span className="text-xl w-12 text-center leading-10">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs: Specifications, Reviews, Q&A */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "specifications"
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-gray-600"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "reviews"
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-gray-600"
              }`}
            >
              Reviews ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab("qa")}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "qa"
                  ? "border-[#059669] text-[#059669]"
                  : "border-transparent text-gray-600"
              }`}
            >
              Q&A
            </button>
          </div>

          {/* Specifications Tab */}
          {activeTab === "specifications" && (
            <div className="space-y-3">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{key}</span>
                  <span className="font-medium text-sm">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Rating Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{product.reviews} ratings</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-8">{star} ★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                          />
                        </div>
                        <span className="w-8 text-gray-600">{star === 5 ? "70%" : star === 4 ? "20%" : "10%"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.user}</span>
                      {review.verified && (
                        <span className="text-xs bg-[#059669] text-white px-2 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
              <button className="w-full py-2 text-[#059669] font-medium text-sm">See All Reviews</button>
            </div>
          )}

          {/* Q&A Tab */}
          {activeTab === "qa" && (
            <div className="space-y-4">
              <button className="w-full py-3 border-2 border-[#059669] text-[#059669] rounded-lg font-medium">
                Ask a Question
              </button>
              {questions.map((qa) => (
                <div key={qa.id} className="border-b border-gray-100 pb-4">
                  <div className="mb-3">
                    <p className="font-medium text-sm mb-1">Q: {qa.question}</p>
                    <span className="text-xs text-gray-500">Asked by {qa.askedBy} • {qa.date}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-1">A: {qa.answer}</p>
                    <span className="text-xs text-gray-500">Answered by {qa.answeredBy}</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 text-[#059669] font-medium text-sm">See All Questions</button>
            </div>
          )}
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

      {/* Bottom Actions - Sticky Add to Cart & Buy Now Buttons */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg max-w-md mx-auto">
        <button
          onClick={() => onAddToCart(product, quantity, selectedSize)}
          className="flex-1 bg-white border-2 border-[#059669] text-[#059669] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium"
          disabled={stockInfo.available === 0}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
        <button
          onClick={() => {
            onAddToCart(product, quantity, selectedSize);
            // Navigate to checkout in real app
          }}
          className="flex-1 bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={stockInfo.available === 0}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
