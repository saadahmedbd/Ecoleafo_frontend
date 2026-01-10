// src/layouts/components/CategoryNav.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Menu } from 'lucide-react';
import { useGetRootCategoriesQuery } from '@/features/categories/categoriesApi';

export default function CategoryNav() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { data } = useGetRootCategoriesQuery();
  
  const categories = data?.data || [];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 py-3 overflow-x-auto">
          <button
            onClick={() => navigate('/buyer/categories')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 font-medium"
          >
            <Menu className="w-4 h-4" />
            All Categories
          </button>

          {categories.slice(0, 8).map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => navigate(`/buyer/category/${category.slug}`)}
                className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors whitespace-nowrap font-medium"
              >
                {category.icon && <span className="text-lg">{category.icon}</span>}
                {category.name}
                {category.children?.length > 0 && (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Dropdown for subcategories */}
              {hoveredCategory === category.id && category.children?.length > 0 && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                  {category.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => navigate(`/buyer/category/${sub.slug}`)}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
