// src/pages/buyer/Wishlist.jsx - FULLY RESPONSIVE WITH BACKEND
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Loader2, X, ChevronRight, Star } from 'lucide-react';
import { useGetWishlistQuery } from '@/features/wishlist/wishlistApi';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import DesktopHeader from '@/layouts/components/DesktopHeader';
import MobileHeader from '@/layouts/components/MobileHeader';

export default function Wishlist() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toast, setToast] = useState(null);

  const { data: wishlistData, isLoading, error, refetch } = useGetWishlistQuery();
  const { removeFromWishlist, isLoading: isRemoving } = useWishlist();
  const { addToCart, isLoading: isAddingToCart } = useCart();

  const wishlistItems = wishlistData?.data || [];

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRemoveItem = async (productId, productName) => {
    const result = await removeFromWishlist(productId);
    if (result.success) {
      setToast({ type: 'success', message: `${productName} removed from wishlist` });
    } else {
      setToast({ type: 'error', message: result.error });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async (item) => {
    const product = item.product || item;
    const result = await addToCart(product, 1);
    if (result.success) {
      setToast({ type: 'success', message: `${product.name} added to cart` });
    } else {
      setToast({ type: 'error', message: result.error });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleMoveAllToCart = async () => {
    let successCount = 0;
    for (const item of wishlistItems) {
      const result = await addToCart(item.product || item, 1);
      if (result.success) successCount++;
    }
    if (successCount > 0) {
      setToast({ type: 'success', message: `${successCount} items added to cart` });
      setTimeout(() => {
        setToast(null);
        navigate('/buyer/cart');
      }, 1500);
    }
  };

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
            <p className="text-red-600 mb-4">Failed to load wishlist</p>
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && <DesktopHeader />}
        {isMobile && <MobileHeader title="My Wishlist" showBack onBack={() => navigate('/buyer/dashboard')} />}
        
        <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4">
          <Heart className="w-24 h-24 text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 text-center mb-6">
            Save your favorite trees here for later!
          </p>
          <button
            onClick={() => navigate('/buyer/dashboard')}
            className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="pb-20 bg-gray-50 min-h-screen">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
        
        <MobileHeader 
          title="My Wishlist" 
          subtitle={`${wishlistItems.length} items`}
          showBack 
          onBack={() => navigate('/buyer/dashboard')} 
        />

        {/* Move All to Cart Button */}
        <div className="px-4 py-3 bg-white mb-2">
          <button
            onClick={handleMoveAllToCart}
            disabled={isAddingToCart}
            className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-semibold hover:bg-[#15803d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Move All to Cart
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="px-4 space-y-3">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const isOutOfStock = product.quantity === 0 || product.in_stock === false;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex gap-3 mb-3">
                  <div onClick={() => navigate(`/product/${product.slug}`)} className="cursor-pointer flex-shrink-0">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/150'}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/product/${product.slug}`)}>
                    <h3 className="text-sm font-medium mb-1 line-clamp-2 cursor-pointer hover:text-[#16a34a]">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    {product.average_rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-600">
                          {product.average_rating.toFixed(1)} ({product.review_count || 0})
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base font-bold text-[#16a34a]">
                        ${product.price?.toFixed(2)}
                      </span>
                      {product.discount_price && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.discount_price?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {isOutOfStock ? (
                      <span className="text-xs font-medium text-red-600">Out of Stock</span>
                    ) : (
                      <span className="text-xs font-medium text-green-600">In Stock</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(product.id, product.name)}
                    disabled={isRemoving}
                    className="p-2 hover:bg-red-50 rounded-lg self-start disabled:opacity-50 transition-colors flex-shrink-0"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
                
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleRemoveItem(product.id, product.name)}
                    disabled={isRemoving}
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isAddingToCart || isOutOfStock}
                    className="flex-1 py-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] text-sm font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
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
          <span className="text-gray-900 font-medium">My Wishlist</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
            <p className="text-gray-600">{wishlistItems.length} items saved</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleMoveAllToCart}
              disabled={isAddingToCart}
              className="px-6 py-3 bg-[#16a34a] text-white rounded-lg font-semibold hover:bg-[#15803d] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              Move All to Cart
            </button>
            <button
              onClick={() => navigate('/buyer/dashboard')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product || item;
            const isOutOfStock = product.quantity === 0 || product.in_stock === false;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x300'}
                    alt={product.name}
                    className="w-full h-56 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() => navigate(`/product/${product.slug}`)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  {product.discount_price && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(((product.discount_price - product.price) / product.discount_price) * 100)}%
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveItem(product.id, product.name)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 
                    className="font-semibold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-[#16a34a] transition-colors min-h-[48px]"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-3">
                    by {product.seller?.store_name || 'TreeShop'}
                  </p>

                  {/* Rating */}
                  {product.average_rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.average_rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({product.review_count || 0})
                      </span>
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#16a34a]">
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.discount_price?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {isOutOfStock ? (
                    <div className="mb-3">
                      <span className="inline-block text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        In Stock
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={isAddingToCart || isOutOfStock}
                    className="w-full py-3 bg-[#16a34a] text-white rounded-lg font-semibold hover:bg-[#15803d] transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}