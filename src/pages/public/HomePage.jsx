import React, { useState, useEffect } from 'react';
import { Search, Mic, ChevronRight, Clock, Heart, ShoppingCart, Star, Menu, Bell, User, ShoppingBag, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '@/features/BuyerProduct/buyerProductApi';
import { useGetFeaturedCategoriesQuery } from '@/features/categories/categoriesApi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const banners = [
  { id: 1, title: "Spring Sale", subtitle: "Up to 50% off on selected trees", color: "#10b981" },
  { id: 2, title: "New Arrivals", subtitle: "Exotic palm trees now available", color: "#f97316" },
  { id: 3, title: "Bonsai Special", subtitle: "Buy 2 Get 1 Free", color: "#8b5cf6" }
];

// Unified Product Card (Desktop Design for All Devices)
function ProductCard({ product, onAddToCart, onToggleWishlist, onProductClick, isInWishlist }) {
  const discountPercentage = product.discount_price 
    ? Math.round(((product.discount_price - product.price) / product.discount_price) * 100)
    : 0;

  // Get primary image or first image from images array
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url 
    || product.images?.[0]?.image_url 
    || product.image_url 
    || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group flex flex-col border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-44 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          onClick={() => onProductClick(product)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={product.quantity === 0}
            className="bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:text-[#16a34a] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="bg-white/80 backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:text-red-500 transition-colors shadow-md"
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h4 
          className="font-semibold text-sm sm:text-lg text-gray-800 cursor-pointer hover:text-[#16a34a] line-clamp-2 min-h-[40px] sm:min-h-[56px]"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h4>
        <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 fill-amber-400" />
          <span className="ml-1 font-semibold text-gray-700">{product.average_rating?.toFixed(1) || '0.0'}</span>
          <span className="ml-1">({product.review_count || 0} reviews)</span>
        </div>
        {product.quantity !== undefined && product.quantity < 10 && product.quantity > 0 ? (
          <p className="text-red-600 text-xs sm:text-sm font-medium mt-2">Only {product.quantity} left in stock</p>
        ) : product.quantity === 0 ? (
          <p className="text-red-600 text-xs sm:text-sm font-medium mt-2">Out of stock</p>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm font-medium mt-2">In stock</p>
        )}
        <div className="mt-auto pt-3 sm:pt-4 flex items-baseline space-x-2">
          <span className="text-lg sm:text-2xl font-bold text-[#16a34a]">${product.price?.toFixed(2)}</span>
          {product.discount_price && (
            <span className="text-sm sm:text-base text-gray-400 line-through">${product.discount_price?.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-44 sm:h-56"></div>
      <div className="p-3 sm:p-4">
        <div className="bg-gray-200 h-4 rounded mb-2"></div>
        <div className="bg-gray-200 h-3 rounded w-3/4 mb-2"></div>
        <div className="bg-gray-200 h-3 rounded w-1/2 mb-4"></div>
        <div className="bg-gray-200 h-6 rounded w-20"></div>
      </div>
    </div>
  );
}

// Main Homepage Component
export default function Homepage() {
  const navigate = useNavigate();
  
  // Use custom hooks for cart and wishlist
  const { addToCart, cartCount, isLoading: cartLoading } = useCart();
  const { toggleWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlist();

  const [currentBanner, setCurrentBanner] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [toast, setToast] = useState(null);

  // **BACKEND INTEGRATION** - Fetch products from API
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts
  } = useGetProductsQuery({ 
    page: 1, 
    limit: 20, 
    sort: 'newest' 
  });

  // **BACKEND INTEGRATION** - Fetch categories from API
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useGetFeaturedCategoriesQuery(6);

  // Extract data from API responses
  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];
  
  // Filter flash deals and trending from real API data
  const flashDeals = products.filter((p) => p.discount_price).slice(0, 4);
  const trending = products.slice(0, 8);

  // Detect mobile/desktop
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

  const handleAddToCart = async (product) => {
    if (product.quantity > 0) {
      const result = await addToCart(product, 1);
      if (result.success) {
        setToast({ type: 'success', message: `${product.name} added to cart!` });
      } else {
        setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
      }
      // Auto-hide toast after 3 seconds
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast({ type: 'error', message: 'Product is out of stock' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggleWishlist = async (product) => {
    const result = await toggleWishlist(product.id);
    if (result.success) {
      const isNowInWishlist = isInWishlist(product.id);
      setToast({ 
        type: 'success', 
        message: isNowInWishlist 
          ? `${product.name} added to wishlist!` 
          : `${product.name} removed from wishlist!`
      });
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to update wishlist' });
    }
    setTimeout(() => setToast(null), 3000);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
  };

  // Toast Component
  const Toast = ({ type, message }) => {
    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
    };

    return (
      <div className={`fixed bottom-20 md:bottom-4 right-4 z-50 max-w-md w-full p-4 rounded-lg border shadow-lg ${colors[type]} animate-slide-up`}>
        <p className="text-sm font-medium">{message}</p>
      </div>
    );
  };

  // **LOADING STATE**
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && (
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#16a34a] p-2 rounded-lg">
                    <span className="text-white text-2xl">🌳</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">TreeShop</h1>
                </div>
              </div>
            </div>
          </header>
        )}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#16a34a] mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // **ERROR STATE**
  if (productsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        {!isMobile && (
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#16a34a] p-2 rounded-lg">
                    <span className="text-white text-2xl">🌳</span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">TreeShop</h1>
                </div>
              </div>
            </div>
          </header>
        )}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load products</p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"
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
      <div className="pb-20 bg-gray-50">
        {/* Toast Notification */}
        {toast && <Toast type={toast.type} message={toast.message} />}
        
        {/* Mobile Greeting */}
        <div className="bg-white px-4 py-4">
          <h1 className="text-xl font-semibold">Hi Saad 👋</h1>
          <p className="text-sm text-gray-600">Let's find your perfect tree</p>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 py-4 bg-white mb-2">
          <div 
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3 cursor-pointer"
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search trees..."
              className="flex-1 bg-transparent outline-none text-sm pointer-events-none"
              readOnly
            />
            <Mic className="w-5 h-5 text-[#059669]" />
          </div>
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
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold self-start">
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
              <h2 className="text-lg font-bold">Categories</h2>
              <button 
                onClick={() => navigate('/categories')}
                className="text-[#059669] text-sm flex items-center gap-1 font-medium"
              >
                See All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-[#059669] hover:shadow-md transition-all"
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
                  <span className="text-sm font-medium text-center">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Flash Deals */}
        {flashDeals.length > 0 && (
          <div className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Flash Deals</h2>
              <div className="flex items-center gap-2 text-[#f97316] text-sm font-medium">
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
              <h2 className="text-lg font-bold">Trending Now</h2>
              <button 
                onClick={() => navigate('/products')}
                className="text-[#059669] text-sm flex items-center gap-1 font-medium"
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

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-gray-600 mb-4">No products available</p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around items-center py-2">
            <button 
              onClick={() => navigate('/buyer/dashboard')}
              className="flex flex-col items-center gap-1 px-4 py-2 text-[#059669]"
            >
              <span className="text-2xl">🏠</span>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button 
              onClick={() => navigate('/categories')}
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600"
            >
              <Menu className="w-6 h-6" />
              <span className="text-xs">Categories</span>
            </button>
            <button 
              onClick={() => navigate('/buyer/orders')}
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xs">Orders</span>
            </button>
            <button 
              onClick={() => navigate('/buyer/profile')}
              className="flex flex-col items-center gap-1 px-4 py-2 text-gray-600"
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Account</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast && <Toast type={toast.type} message={toast.message} />}
      
      {/* Desktop Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div 
              onClick={() => navigate('/buyer/dashboard')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="bg-[#16a34a] p-2 rounded-lg">
                <span className="text-white text-2xl">🌳</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">TreeShop</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => navigate('/buyer/orders')}
                className="text-gray-600 hover:text-[#16a34a] transition-colors"
              >
                Orders
              </button>
              <button 
                onClick={() => navigate('/buyer/wishlist')}
                className="text-gray-600 hover:text-[#16a34a] transition-colors"
              >
                Wishlist
              </button>
              <button 
                onClick={() => navigate('/buyer/cart')}
                className="text-gray-600 hover:text-[#16a34a] transition-colors relative"
              >
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => navigate('/buyer/profile')}
                className="text-gray-600 hover:text-[#16a34a] transition-colors"
              >
                Account
              </button>
              <button className="relative text-gray-600 hover:text-[#16a34a] transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Search Bar */}
        <div className="max-w-2xl mx-auto my-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full text-gray-700 focus:ring-2 focus:ring-[#16a34a] focus:border-transparent transition"
              placeholder="Search trees..."
              type="text"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                }
              }}
            />
          </div>
        </div>

        {/* Desktop Banner */}
        <div className="bg-[#16a34a] rounded-lg p-8 md:p-12 my-8 text-white flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-2">Spring Sale</h2>
          <p className="text-lg mb-6 max-w-md">Up to 50% off on selected trees. Find your new leafy friend today!</p>
          <button className="bg-white text-[#16a34a] font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>

        {/* Desktop Categories - By Environment */}
        {categories.length > 0 && (
          <section className="my-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">By Environment</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => (
                <div 
                  key={category.id} 
                  onClick={() => handleCategoryClick(category)}
                  className="relative rounded-lg overflow-hidden group h-32 cursor-pointer"
                >
                  <img
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={category.image || 'https://via.placeholder.com/300x200?text=Category'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Category';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <h4 className="text-white text-lg font-semibold">{category.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Desktop Popular Deals */}
        {flashDeals.length > 0 && (
          <section className="my-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Popular Deals</h3>
              <button 
                onClick={() => navigate('/products?filter=deals')}
                className="text-[#16a34a] font-medium flex items-center space-x-1 hover:underline"
              >
                <span>See All</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Desktop Explore All Trees */}
        {trending.length > 0 && (
          <section className="my-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Explore All Trees</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products available at the moment</p>
            <button
              onClick={() => refetchProducts()}
              className="px-6 py-3 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d]"
            >
              Refresh
            </button>
          </div>
        )}
      </main>
    </div>
  );
}