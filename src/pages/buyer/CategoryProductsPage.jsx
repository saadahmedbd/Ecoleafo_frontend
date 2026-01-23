// src/pages/buyer/CategoryProductsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { useGetCategoryBySlugQuery, useGetCategoryBreadcrumbQuery, useGetCategoryProductsQuery } from '@/features/categories/categoriesApi';
import { useGetProductsQuery } from '@/features/BuyerProduct/buyerProductApi';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ProductCard from '@/layouts/components/ProductCard';

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [toast, setToast] = useState(null);

  const { data: categoryData, isLoading: categoryLoading } = useGetCategoryBySlugQuery(slug);
  const category = categoryData?.data;

  const { data: breadcrumbData } = useGetCategoryBreadcrumbQuery(category?.id, {
    skip: !category?.id
  });

  const { data: productsData, isLoading: productsLoading, isFetching, error: productsError } = useGetCategoryProductsQuery(category?.id, { skip: !category?.id });

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist, refetchWishlist, refetchCount } = useWishlist();

  const products = productsData?.data || [];
  const hasMore = false;
  const total = productsData?.total || 0;

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddToCart = async (product) => {
    if (product.quantity === 0) {
      setToast({ type: 'error', message: 'Product is out of stock' });
      return;
    }
    const result = await addToCart(product, 1);
    if (result.success) {
      setToast({ type: 'success', message: `${product.name} added to cart!` });
    } else {
      setToast({ type: 'error', message: result.error || 'Failed to add to cart' });
    }
  };

  const handleToggleWishlist = async (product) => {
    const result = await toggleWishlist(product.id);
    if (result.success) {
      await Promise.all([refetchWishlist(), refetchCount()]);
      setToast({ 
        type: 'success', 
        message: isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist'
      });
    }
  };

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Category not found</h2>
          <button
            onClick={() => navigate('/categories')}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Browse all categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Breadcrumb */}
      {breadcrumbData?.data && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm overflow-x-auto">
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-green-600 whitespace-nowrap">
                Home
              </button>
              {breadcrumbData.data.map((crumb, idx) => (
                <div key={crumb.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => navigate(`/category/${crumb.slug}`)}
                    className={`whitespace-nowrap ${
                      idx === breadcrumbData.data.length - 1
                        ? 'text-green-600 font-medium'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            {category.image ? (
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : category.icon && (category.icon.startsWith('http') || category.icon.startsWith('data:')) ? (
              <img 
                src={category.icon} 
                alt={category.name} 
                className="w-20 h-20 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : category.icon ? (
              <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-lg">
                <i className={`${category.icon} text-4xl text-green-600`}></i>
              </div>
            ) : null}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">{total} products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      {category.children?.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {category.children.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => navigate(`/category/${sub.slug}`)}
                  className="flex-shrink-0 px-4 py-2 bg-gray-100 hover:bg-green-100 hover:text-green-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Sort */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {productsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">Error loading products: {productsError?.data?.message || productsError?.error || 'Unknown error'}</p>
            <p className="text-sm text-red-600 mt-1">Category ID: {category?.id}</p>
          </div>
        )}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onProductClick={(p) => navigate(`/products/${p.id}`)}
                  isInWishlist={isInWishlist(product.id)}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isFetching}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No products found in this category</p>
            <button
              onClick={() => navigate('/categories')}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Browse other categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Toast({ type, message, onClose }) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start gap-3`}>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
