// src/components/QuickCategories.jsx
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useGetFeaturedCategoriesQuery } from '@/features/categories/categoriesApi';

export default function QuickCategories({ limit = 8, onViewAll }) {
  const navigate = useNavigate();
  const { data, isLoading } = useGetFeaturedCategoriesQuery(limit);

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2" />
            <div className="h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">Categories</h2>
        <button
          onClick={onViewAll}
          className="text-green-600 text-sm flex items-center gap-1 font-medium hover:text-green-700"
        >
          See All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => navigate(`/buyer/category/${category.slug}`)}
            className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col items-center gap-2 hover:border-green-600 hover:shadow-md transition-all active:scale-95"
          >
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-12 h-12 object-cover rounded-full"
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
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg text-green-600 font-bold">
                  {category.name[0]}
                </span>
              </div>
            )}
            <span className="text-xs font-medium text-center text-gray-700 line-clamp-2">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
