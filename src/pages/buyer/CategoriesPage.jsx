// src/pages/buyer/CategoriesPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Grid, List } from 'lucide-react';
import { useGetCategoryTreeQuery } from '@/features/categories/categoriesApi';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { data, isLoading } = useGetCategoryTreeQuery();

  const categories = data?.data || [];

  const filterCategories = (cats, term) => {
    if (!term) return cats;
    return cats.filter(cat => 
      cat.name.toLowerCase().includes(term.toLowerCase()) ||
      (cat.children && filterCategories(cat.children, term).length > 0)
    );
  };

  const filteredCategories = filterCategories(categories, searchTerm);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All Categories</h1>
          
          {/* Search & View Toggle */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCategories.map((category) => (
              <CategoryListItem key={category.id} category={category} navigate={navigate} />
            ))}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category, navigate }) {
  return (
    <button
      onClick={() => navigate(`/category/${category.slug}`)}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-600 hover:shadow-lg transition-all group"
    >
      {category.image ? (
        <img
          src={category.image}
          alt={category.name}
          className="w-16 h-16 object-cover rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform"
          onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
        />
      ) : category.icon && (category.icon.startsWith('http') || category.icon.startsWith('data:')) ? (
        <img
          src={category.icon}
          alt={category.name}
          className="w-16 h-16 object-contain mx-auto mb-3 group-hover:scale-110 transition-transform"
          onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Icon'}
        />
      ) : category.icon ? (
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
          <i className={`${category.icon} text-4xl text-green-600 group-hover:scale-110 transition-transform`}></i>
        </div>
      ) : (
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="text-2xl text-green-600">{category.name[0]}</span>
        </div>
      )}
      <h3 className="font-semibold text-gray-800 text-center mb-1">{category.name}</h3>
      {category.product_count > 0 && (
        <p className="text-sm text-gray-500 text-center">{category.product_count} items</p>
      )}
      {category.children?.length > 0 && (
        <p className="text-xs text-green-600 text-center mt-2">
          {category.children.length} subcategories
        </p>
      )}
    </button>
  );
}

function CategoryListItem({ category, navigate, level = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-green-600 transition-all">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/category/${category.slug}`)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            {category.image ? (
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Image'}
              />
            ) : category.icon && (category.icon.startsWith('http') || category.icon.startsWith('data:')) ? (
              <img 
                src={category.icon} 
                alt={category.name} 
                className="w-12 h-12 object-contain"
                onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Icon'}
              />
            ) : category.icon ? (
              <div className="w-12 h-12 flex items-center justify-center">
                <i className={`${category.icon} text-2xl text-green-600`}></i>
              </div>
            ) : (
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg text-green-600">{category.name[0]}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              {category.product_count > 0 && (
                <p className="text-sm text-gray-500">{category.product_count} items</p>
              )}
            </div>
          </button>
          {category.children?.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>
      </div>
      {expanded && category.children?.map((child) => (
        <CategoryListItem key={child.id} category={child} navigate={navigate} level={level + 1} />
      ))}
    </div>
  );
}
