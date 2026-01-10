import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { useSearchProductsQuery } from '@/features/search/searchApi';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const { data, isLoading, error } = useSearchProductsQuery({
    q: searchParams.get('q') || '',
    page: 1,
    limit: 20
  }, {
    skip: !searchParams.get('q')
  });

  // Debug: Log the response
  useEffect(() => {
    console.log('Search API Response:', data);
    console.log('Search Query:', searchParams.get('q'));
  }, [data, searchParams]);

  const products = data?.data?.products || data?.products || data?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Results */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-600">Error loading results</p>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && searchParams.get('q') && (
          <div className="text-center py-16">
            <p className="text-gray-600">No products found for "{searchParams.get('q')}"</p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div>
            <p className="text-gray-600 mb-4">
              Found {products.length} results for "{searchParams.get('q')}"
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <img
                    src={product.images?.[0]?.image_url || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-bold">
                      ৳{product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
