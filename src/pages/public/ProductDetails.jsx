// src/pages/buyer/ProductDetails.jsx - PREMIUM REDESIGN
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart, Package,
  MapPin, Truck, Shield, RotateCcw, Loader2, X, Store, ChevronRight,
  CheckCircle, Clock, Award, MessageCircle, Eye, StarHalf
} from 'lucide-react';
import { useGetProductByIdQuery } from '@/features/BuyerProduct/buyerProductApi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useGetProductReviewsQuery, useCreateReviewMutation, useCheckReviewEligibilityQuery } from '@/features/review/reviewApi';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [toast, setToast] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // API calls
  const { data: productData, isLoading, error } = useGetProductByIdQuery(id);
  const { addToCart, isLoading: addingToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();
  const { data: reviewsData, isLoading: reviewsLoading } = useGetProductReviewsQuery({ product_id: id, page: 1, per_page: 10 });
  const { data: eligibilityData } = useCheckReviewEligibilityQuery({ product_id: id }, { skip: !id });
  const [createReview, { isLoading: creatingReview }] = useCreateReviewMutation();
  
  // Try different response structures
  const product = productData?.data?.product || productData?.data || productData?.product || productData;
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setCurrentImage(0);
      setActiveTab('description');
      window.scrollTo(0, 0);
    }
  }, [product?.id]);

  // Handlers
  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      const result = await addToCart(product, quantity);
      
      if (result.success) {
        setToast({ type: 'success', message: `${product.name} added to cart!` });
      } else if (result.alreadyInCart) {
        setToast({ type: 'info', message: `${product.name} is already in your cart` });
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to add to cart' });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    try {
      const result = await addToCart(product, quantity);
      
      if (result.success || result.alreadyInCart) {
        navigate('/buyer/cart');
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to proceed to cart' });
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    const result = inWishlist 
      ? await removeFromWishlist(product.id)
      : await addToWishlist(product.id);
    
    if (result.success) {
      setToast({ 
        type: 'success', 
        message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist' 
      });
    } else {
      setToast({ type: 'error', message: result.error });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({ type: 'success', message: 'Link copied to clipboard!' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Prepare data
  const images = product?.images?.length > 0 
    ? [...product.images].sort((a, b) => b.is_primary - a.is_primary).map(img => img.image_url)
    : ['https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800'];

  const stockInfo = {
    available: product?.quantity || 0,
    status: (product?.quantity || 0) > 20 ? 'In Stock' : (product?.quantity || 0) > 0 ? 'Low Stock' : 'Out of Stock',
    color: (product?.quantity || 0) > 20 ? 'text-green-600 bg-green-50' : (product?.quantity || 0) > 0 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'
  };

  // Get discount data from backend (with space in field name)
  const discountPrice = product?.['discount price'] || 0;
  const regularPrice = product?.price || 0;
  const discountPercent = product?.discount_percent || 0;

  const hasValidDiscount = discountPrice > 0 && discountPrice < regularPrice;
  const currentPrice = hasValidDiscount ? discountPrice : regularPrice;
  const originalPrice = hasValidDiscount ? regularPrice : null;

  // Reviews data from API - handle nested data structure
  const reviewsList = reviewsData?.data?.data?.reviews || reviewsData?.data?.reviews || [];
  const reviewsPagination = reviewsData?.data?.data?.pagination || {};
  
  const reviews = {
    average: product?.average_rating || 0,
    total: product?.review_count || reviewsPagination?.total || 0,
    breakdown: reviewsList.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }),
    list: reviewsList
  };

  const canReview = eligibilityData?.data?.can_review || false;

  // Enhanced Toast Component with animations and auto-hide
  const Toast = ({ type, message, onClose }) => {
    const colors = {
      success: 'bg-green-50 border-green-500 text-green-800',
      error: 'bg-red-50 border-red-500 text-red-800',
      info: 'bg-blue-50 border-blue-500 text-blue-800',
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className={`fixed ${isMobile ? 'bottom-24' : 'top-20'} right-4 z-[100] max-w-md p-4 rounded-xl border-l-4 shadow-2xl ${colors[type]} flex items-start gap-3 animate-slide-in backdrop-blur-sm`}>
        <div className="flex-shrink-0 mt-0.5">
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : type === 'info' ? (
            <MessageCircle className="w-5 h-5 text-blue-600" />
          ) : (
            <X className="w-5 h-5 text-red-600" />
          )}
        </div>
        <p className="text-sm font-semibold flex-1">{message}</p>
        <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 transition-opacity" aria-label="Close notification">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#16a34a] mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
        {error && <p className="text-red-600 text-sm mb-4">{error?.data?.message || 'Error loading product'}</p>}
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] font-medium"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="pb-24 bg-white min-h-screen">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

        {/* Enhanced Floating Header with better UX */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <span className="text-sm font-semibold text-gray-700 truncate max-w-[50%]">{product.name}</span>
            <div className="flex gap-2">
              <button 
                onClick={handleShare} 
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95 disabled:opacity-50 relative"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${inWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery with Enhanced UI */}
        <div className="relative bg-gray-50 mt-16">
          <div className="relative aspect-square">
            <img
              src={images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800';
              }}
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold">-{discountPercent}% OFF</span>
              </div>
            )}
            {stockInfo.available > 0 && stockInfo.available < 10 && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-semibold text-orange-600">Only {stockInfo.available} left</span>
              </div>
            )}
          </div>

          {/* Enhanced Image Indicators with counter */}
          {images.length > 1 && (
            <>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentImage === index ? 'bg-white w-6' : 'bg-white/50 w-1.5'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                {currentImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Product Info Card */}
        <div className="px-4 py-5 bg-white">
          {/* Category & Stock Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {product.category?.name || 'Trees'}
            </span>
            <div className={`px-3 py-1 rounded-full ${stockInfo.color}`}>
              <span className="text-xs font-bold">{stockInfo.status}</span>
            </div>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(reviews.average)
                      ? 'fill-yellow-400 text-yellow-400'
                      : i < reviews.average
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{reviews.average}</span>
            <span className="text-sm text-gray-500">({reviews.total} reviews)</span>
          </div>

          {/* Enhanced Price Section with better visual hierarchy */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-green-100 shadow-sm">
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <span className="text-4xl font-bold text-[#16a34a]">৳{currentPrice?.toLocaleString('en-IN')}</span>
              {hasValidDiscount && originalPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">৳{originalPrice?.toLocaleString('en-IN')}</span>
                  <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    -{discountPercent}%
                  </div>
                </>
              )}
            </div>
            {hasValidDiscount && (
              <p className="text-sm font-semibold text-green-700 mb-1">You save ৳{(originalPrice - currentPrice)?.toLocaleString('en-IN')}</p>
            )}
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Inclusive of all taxes • Free shipping over 5000
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-[#16a34a]" />
                <span className="text-xs font-semibold text-gray-500">Height</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{product.height || 'N/A'} feet</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#16a34a]" />
                <span className="text-xs font-semibold text-gray-500">Age</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{product.age || 'N/A'} days</p>
            </div>
          </div>

          {/* Seller Card */}
          {product.seller && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{product.seller.store_name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Delivery Info with better visual design */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-5 border border-blue-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              Delivery & Returns
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">Free delivery on orders over BDT 5000</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">Delivery in 3-5 business days</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">7-day hassle-free returns</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">100% secure payments</span>
              </div>
            </div>
          </div>

          {/* Enhanced Quantity Selector with better UX */}
          <div className="mb-5">
            <label className="block font-bold text-gray-900 mb-3 text-base">Select Quantity</label>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 flex items-center justify-center hover:border-[#16a34a] hover:bg-green-50 transition-all active:scale-95 shadow-sm"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <span className="text-3xl font-bold text-gray-900">{quantity}</span>
                {stockInfo.available > 0 && stockInfo.available < 10 && (
                  <p className="text-xs text-orange-600 font-semibold mt-1">Only {stockInfo.available} left</p>
                )}
              </div>
              <button
                onClick={() => setQuantity(Math.min(stockInfo.available, quantity + 1))}
                disabled={quantity >= stockInfo.available}
                className="w-12 h-12 rounded-xl bg-white border-2 border-gray-300 flex items-center justify-center hover:border-[#16a34a] hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-5">
            <div className="flex gap-2 mb-4 border-b border-gray-200">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#16a34a] text-[#16a34a]'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-3">
                {[
                  ['SKU', product.sku],
                  ['Category', product.category?.name],
                  ['Tree Type', product.tree_type],
                  ['Height', product.height ? `${product.height} feet` : null],
                  ['Age', product.age ? `${product.age} days` : null],
                  ['Weight', product.weight ? `${product.weight} kg` : null],
                ].map(([label, value]) => value && (
                  <div key={label} className="flex justify-between py-2.5 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#16a34a] mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.list.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.list.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3">
                            {review.buyer?.profile_picture ? (
                              <img src={review.buyer.profile_picture} alt={`${review.buyer.first_name} ${review.buyer.last_name}`} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                {review.buyer?.first_name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">{review.buyer?.first_name} {review.buyer?.last_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                {review.is_verified_purchase && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Verified</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        {review.title && <p className="font-semibold text-sm text-gray-900 mb-1">{review.title}</p>}
                        <p className="text-sm text-gray-700">{review.comment}</p>
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {review.images.map((img, idx) => (
                              <img key={idx} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover" />
                            ))}
                          </div>
                        )}
                        {(review.seller_response || review.response || review.seller_reply) && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-700 mb-1">Seller Response:</p>
                            <p className="text-sm text-gray-700">{review.seller_response || review.response || review.seller_reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-600 mb-3">No reviews yet</p>
                    {canReview && <button className="text-[#16a34a] font-medium text-sm">Be the first to review</button>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Sticky Bottom Actions - No Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl">
          {stockInfo.available === 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 font-bold">Out of Stock</p>
              <p className="text-sm text-red-500 mt-1">This product is currently unavailable</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/buyer/messages?seller_id=${product.seller_id}&product_id=${product.id}`)}
                  className="w-12 h-12 bg-white border-2 border-[#16a34a] text-[#16a34a] rounded-xl flex items-center justify-center hover:bg-green-50 transition-all active:scale-95 shadow-sm"
                  aria-label="Chat with seller"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 py-3.5 bg-white border-2 border-[#16a34a] text-[#16a34a] rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-green-50 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  aria-label="Add to cart"
                >
                  {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-xl font-bold text-base hover:shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                  aria-label="Buy now"
                >
                  Buy Now
                </button>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">Total: ৳{(currentPrice * quantity)?.toLocaleString('en-IN')}</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-[#16a34a] font-medium">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          {product.category && (
            <>
              <button className="hover:text-[#16a34a] font-medium">
                {product.category.name}
              </button>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
          <span className="text-gray-900 font-semibold line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Premium Image Gallery */}
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg group">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={images[currentImage]}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-500 cursor-zoom-in ${isImageZoomed ? 'scale-125' : 'scale-100'}`}
                    onMouseEnter={() => setIsImageZoomed(true)}
                    onMouseLeave={() => setIsImageZoomed(false)}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800';
                    }}
                  />
                  {discountPercent > 0 && (
                    <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-5 py-2.5 rounded-full shadow-xl animate-pulse">
                      <span className="font-bold text-lg">-{discountPercent}% OFF</span>
                    </div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                      {currentImage + 1} / {images.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Thumbnail Grid */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`aspect-square rounded-xl border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-md ${
                        currentImage === index ? 'border-[#16a34a] shadow-lg ring-2 ring-green-100' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Premium Product Info */}
          <div className="space-y-6">
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                {product.category?.name || 'Trees'}
              </span>
              <div className={`px-4 py-2 rounded-full ${stockInfo.color}`}>
                <span className="text-sm font-bold">{stockInfo.status}</span>
              </div>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
              
              {/* Enhanced Rating */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(reviews.average)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{reviews.average}</span>
                  <span className="text-gray-500">({reviews.total} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  {/* <Eye className="w-4 h-4" /> */}
                  {/* <span className="text-sm">1.2k views</span> */}
                </div>
              </div>
            </div>

            {/* Enhanced Premium Price Card */}
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-100 shadow-sm">
              <div className="flex items-baseline gap-4 mb-2 flex-wrap">
                <span className="text-5xl font-bold text-[#16a34a]">৳{currentPrice?.toLocaleString('en-IN')}</span>
                {hasValidDiscount && originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">৳{originalPrice?.toLocaleString('en-IN')}</span>
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full shadow-md">
                      <span className="text-sm font-bold">-{discountPercent}% OFF</span>
                    </div>
                  </>
                )}
              </div>
              {hasValidDiscount && (
                <p className="text-base font-semibold text-green-700 mb-2">You save ৳{(originalPrice - currentPrice)?.toLocaleString('en-IN')} on this purchase!</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Inclusive of all taxes • Free shipping over BDT 5000 </span>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Package, label: 'Height', value: product.height },
                { icon: Clock, label: 'Age', value: product.age },
                { icon: Award, label: 'Type', value: product.tree_type },
              ].map(({ icon: Icon, label, value }) => value && (
                <div key={label} className="bg-white rounded-xl p-4 border border-gray-200">
                  <Icon className="w-5 h-5 text-[#16a34a] mb-2" />
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="text-sm font-bold text-gray-900">{value} </p>
                </div>
              ))}
            </div>

            {/* Enhanced Seller Premium Card */}
            {product.seller && (
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{product.seller.store_name}</p>
                    <div className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-600">Verified</span>
                      </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Delivery & Returns Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                Delivery & Returns
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Truck, text: 'Free delivery over BDT 5000', color: 'blue' },
                  { icon: Clock, text: 'Delivers in 3-5 days', color: 'green' },
                  { icon: RotateCcw, text: '7-day hassle-free returns', color: 'purple' },
                  { icon: Shield, text: '100% secure payments', color: 'emerald' },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <div className={`w-8 h-8 bg-${color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 text-${color}-600`} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Quantity & Actions */}
            <div className="space-y-5">
              <div>
                <label className="block font-bold text-gray-900 mb-3 text-lg">Select Quantity</label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-gray-300 flex items-center justify-center hover:border-[#16a34a] hover:bg-green-50 transition-all active:scale-95 shadow-sm"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-6 h-6" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-4xl font-bold text-gray-900">{quantity}</span>
                      {stockInfo.available > 0 && stockInfo.available < 50 && (
                        <p className="text-sm text-orange-600 font-semibold mt-1">
                          Only {stockInfo.available} left!
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setQuantity(Math.min(stockInfo.available, quantity + 1))}
                      disabled={quantity >= stockInfo.available}
                      className="w-14 h-14 rounded-xl bg-white border-2 border-gray-300 flex items-center justify-center hover:border-[#16a34a] hover:bg-green-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <span className="text-2xl font-bold text-[#16a34a]">৳{(currentPrice * quantity)?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Premium Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={stockInfo.available === 0 || addingToCart}
                  className="py-5 bg-white border-2 border-[#16a34a] text-[#16a34a] rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-50 transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Add to cart"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={stockInfo.available === 0 || addingToCart}
                  className="py-5 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                  aria-label="Buy now"
                >
                  <span className="relative z-10">Buy Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#15803d] to-[#16a34a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>

              {/* Enhanced Secondary Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleToggleWishlist}
                  disabled={wishlistLoading}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95"
                  aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-5 h-5 transition-all ${inWishlist ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 py-6 bg-gray-50 rounded-xl">
              <div className="text-center">
                <Shield className="w-8 h-8 text-[#16a34a] mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600">Secure Payment</p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-[#16a34a] mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600">Quality Assured</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-[#16a34a] mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-600">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Tabs Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { id: 'description', label: 'Description', icon: MessageCircle },
              { id: 'specifications', label: 'Specifications', icon: Package },
              { id: 'reviews', label: `Reviews (${reviews.total})`, icon: Star },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 px-8 py-5 font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  activeTab === id
                    ? 'bg-white text-[#16a34a] border-b-4 border-[#16a34a]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    ['Product ID', product.id],
                    ['SKU', product.sku],
                    ['Category', product.category?.name],
                    ['Tree Type', product.tree_type],
                    ['Height', product.height ? `${product.height} feet` : null],
                    ['Age', product.age ? `${product.age} days` : null],
                    ['Weight', product.weight ? `${product.weight} kg` : null],
                    ['Stock Quantity', product.quantity],
                    ['Seller', product.seller?.store_name],
                  ].map(([label, value]) => value && (
                    <div key={label} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1 font-semibold">{label}</p>
                      <p className="text-lg font-bold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h3>
                    <p className="text-gray-600">Based on {reviews.total} verified reviews</p>
                  </div>
                  {canReview && (
                    <button className="px-6 py-3 bg-[#16a34a] text-white rounded-xl font-semibold hover:bg-[#15803d] transition-colors">
                      Write a Review
                    </button>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 animate-spin text-[#16a34a] mx-auto mb-4" />
                    <p className="text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviews.total > 0 ? (
                  <>
                    {/* Rating Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mb-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col items-center justify-center border-r border-gray-300">
                          <div className="text-6xl font-bold text-[#16a34a] mb-2">{reviews.average.toFixed(1)}</div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-6 h-6 ${i < Math.floor(reviews.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <p className="text-gray-600 font-semibold">{reviews.total} reviews</p>
                        </div>
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviews.breakdown[star] || 0;
                            const percentage = reviews.total > 0 ? (count / reviews.total) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-700 w-12">{star} star</span>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 w-12">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.list.map((review) => (
                        <div key={review.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-4">
                              {review.buyer?.profile_picture ? (
                                <img src={review.buyer.profile_picture} alt={`${review.buyer.first_name} ${review.buyer.last_name}`} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                  {review.buyer?.first_name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-gray-900">{review.buyer?.first_name} {review.buyer?.last_name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                  </div>
                                  {review.is_verified_purchase && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                          {review.title && <h4 className="font-bold text-lg text-gray-900 mb-2">{review.title}</h4>}
                          <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                          {review.images?.length > 0 && (
                            <div className="flex gap-3 mt-4">
                              {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="Review" className="w-24 h-24 rounded-xl object-cover border border-gray-200 hover:scale-105 transition-transform cursor-pointer" />
                              ))}
                            </div>
                          )}
                          {(review.seller_response || review.response || review.seller_reply) && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm font-semibold text-blue-700 mb-1">Seller Response:</p>
                              <p className="text-gray-700">{review.seller_response || review.response || review.seller_reply}</p>
                            </div>
                          )}
                          {review.helpful_count > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <span className="text-sm text-gray-600">{review.helpful_count} people found this helpful</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h4>
                    <p className="text-gray-600 mb-6">Be the first to share your experience with this product</p>
                    {canReview && (
                      <button className="px-8 py-4 bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                        Write the First Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}