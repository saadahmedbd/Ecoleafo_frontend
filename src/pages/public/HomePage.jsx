// src/pages/buyer/Homepage.jsx - COMPLETE & PRODUCTION READY (No Headers/Footers)
import React, { useState, useEffect } from 'react';
import { ChevronRight, Clock, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '@/features/BuyerProduct/buyerProductApi';
import { useGetFeaturedCategoriesQuery } from '@/features/categories/categoriesApi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/layouts/components/ProductCard';

const banners = [
  { id: 1, title: "Spring Sale", subtitle: "Up to 50% off on selected trees", color: "#10b981" },
  { id: 2, title: "New Arrivals", subtitle: "Exotic palm trees now available", color: "#f97316" },
  { id: 3, title: "Bonsai Special", subtitle: "Buy 2 Get 1 Free", color: "#8b5cf6" }
];

// Loading Skeleton Component
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-40 sm:h-56"></div>
      <div className="p-3 space-y-3">
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
        <div className="bg-gray-200 h-6 rounded w-24"></div>
        <div className="bg-gray-200 h-9 rounded"></div>
      </div>
    </div>
  );
}

// Toast Component
function Toast({ type, message, onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3 animate-slide-up`}>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Homepage() {
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toast, setToast] = useState(null);

  // Custom hooks for cart and wishlist
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, refetchWishlist, refetchCount } = useWishlist();

  // Fetch products from API
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts
  } = useGetProductsQuery({ 
    page: 1, 
    limit: 50, 
    sort: 'newest' 
  });

  // Fetch categories from API
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useGetFeaturedCategoriesQuery(6);

  // Extract data
  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  
  // Filter products - Fixed discount check
  const flashDeals = products.filter((p) => {
    const discountPrice = p.discount_price || p['discount price'];
    const regularPrice = p.price || 0;
    const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < regularPrice;
    return hasDiscount;
  }).slice(0, 6);
  
  const trending = products.filter((p) => p.is_featured || p.sale_count > 0).slice(0, 8);
  const allProducts = products.slice(0, 20);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Banner carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle add to cart
  const handleAddToCart = async (product) => {
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

  // Handle toggle wishlist - FIXED
  const handleToggleWishlist = async (product) => {
    const wasInWishlist = isInWishlist(product.id);
    
    const result = await toggleWishlist(product.id);
    
    if (result.success) {
      await Promise.all([refetchWishlist(), refetchCount()]);
      
      if (wasInWishlist) {
        setToast({ 
          type: 'success', 
          message: `${product.name} removed from wishlist!`
        });
      } else {
        setToast({ 
          type: 'success', 
          message: `${product.name} added to wishlist!`
        });
      }
    } else if (result.alreadyInWishlist) {
      setToast({ 
        type: 'info', 
        message: `${product.name} is already in your wishlist`
      });
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to update wishlist' });
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
  };

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4 text-lg font-medium">Failed to load products</p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="bg-gray-50 pb-20">
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

        {/* Mobile Greeting */}
        <div className="bg-white px-4 py-4 mb-2">
          <h1 className="text-xl font-semibold text-gray-800">Hi! 👋</h1>
          <p className="text-sm text-gray-600">Let's find your perfect tree</p>
        </div>

        {/* Mobile Banner */}
        <div className="px-4 mb-4">
          <div className="relative h-36 rounded-2xl overflow-hidden">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  opacity: currentBanner === index ? 1 : 0,
                  backgroundColor: banner.color,
                }}
              >
                <div className="p-6 text-white h-full flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-1">{banner.title}</h2>
                  <p className="text-sm opacity-90 mb-3">{banner.subtitle}</p>
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold self-start hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentBanner === index ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Categories */}
        {categories.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Categories</h2>
              <button 
                onClick={() => navigate('/categories')}
                className="text-green-600 text-sm flex items-center gap-1 font-medium hover:text-green-700"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-green-600 hover:shadow-md transition-all active:scale-95"
                >
                  {category.icon ? (
                    <span className="text-3xl">{category.icon}</span>
                  ) : (
                    <img 
                      src={category.image || 'https://via.placeholder.com/100'} 
                      alt={category.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  )}
                  <span className="text-xs font-medium text-center text-gray-700">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Flash Deals */}
        {flashDeals.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Flash Deals</h2>
              <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                <Clock className="w-4 h-4" />
                <span>
                  {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {flashDeals.map((product) => (
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

        {/* Mobile Trending */}
        {trending.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">Trending Now</h2>
              <button 
                onClick={() => navigate('/products')}
                className="text-green-600 text-sm flex items-center gap-1 font-medium hover:text-green-700"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trending.slice(0, 6).map((product) => (
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

        {/* Mobile All Products */}
        {allProducts.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">All Products</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {allProducts.map((product) => (
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

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-600 mb-4">No products available</p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="bg-gray-50 min-h-screen">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Banner */}
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: currentBanner === index ? 1 : 0,
                backgroundColor: banner.color,
              }}
            >
              <div className="h-full flex flex-col items-center justify-center text-white text-center px-6">
                <h2 className="text-4xl md:text-5xl font-bold mb-3">{banner.title}</h2>
                <p className="text-lg md:text-xl mb-6 max-w-2xl">{banner.subtitle}</p>
                <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`transition-all ${
                  currentBanner === index ? "bg-white w-8 h-3" : "bg-white/50 w-3 h-3"
                } rounded-full`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Categories */}
        {categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Shop by Category</h3>
              <button 
                onClick={() => navigate('/categories')}
                className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
              >
                View All <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center gap-3 hover:border-green-600 hover:shadow-lg transition-all group"
                >
                  {category.icon ? (
                    <span className="text-4xl group-hover:scale-110 transition-transform">{category.icon}</span>
                  ) : (
                    <img 
                      src={category.image || 'https://via.placeholder.com/100'} 
                      alt={category.name}
                      className="w-16 h-16 object-cover rounded-full group-hover:scale-110 transition-transform"
                    />
                  )}
                  <span className="text-sm font-medium text-center text-gray-700 group-hover:text-green-600">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Desktop Flash Deals */}
        {flashDeals.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Flash Deals</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                  <Clock className="w-5 h-5" />
                  <span>
                    Ends in {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {flashDeals.map((product) => (
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
          </section>
        )}

        {/* Desktop Trending */}
        {trending.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Trending Products</h3>
              <button 
                onClick={() => navigate('/products?filter=trending')}
                className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
              >
                View All <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {trending.map((product) => (
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
          </section>
        )}

        {/* Desktop All Products */}
        {allProducts.length > 0 && (
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">All Products</h3>
              <button 
                onClick={() => navigate('/products')}
                className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700"
              >
                View All <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {allProducts.map((product) => (
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
          </section>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-6">No products available</p>
            <button
              onClick={() => refetchProducts()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
            >
              Refresh Products
            </button>
          </div>
        )}
      </main>
    </div>
  );
}