
// src/components/MobileCategoryDrawer.jsx
import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetCategoryTreeQuery } from '@/features/categories/categoriesApi';

export default function MobileCategoryDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const { data, isLoading } = useGetCategoryTreeQuery();

  const categories = data?.data || [];

  const toggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (slug) => {
    navigate(`/buyer/category/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories List */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  expanded={expandedCategories.has(category.id)}
                  onToggle={() => toggleExpand(category.id)}
                  onClick={handleCategoryClick}
                  level={0}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={() => {
              navigate('/buyer/categories');
              onClose();
            }}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            View All Categories
          </button>
        </div>
      </div>
    </>
  );
}

function CategoryItem({ category, expanded, onToggle, onClick, level }) {
  const hasChildren = category.children?.length > 0;
  const indent = level * 16;

  return (
    <div>
      <div
        style={{ paddingLeft: `${indent}px` }}
        className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <button
          onClick={() => onClick(category.slug)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          {category.icon && <span className="text-xl">{category.icon}</span>}
          {category.image && !category.icon && (
            <img
              src={category.image}
              alt={category.name}
              className="w-8 h-8 object-cover rounded-lg"
            />
          )}
          <div>
            <p className="font-medium text-gray-800">{category.name}</p>
            {category.product_count > 0 && (
              <p className="text-xs text-gray-500">{category.product_count} items</p>
            )}
          </div>
        </button>
        {hasChildren && (
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronRight
              className={`w-5 h-5 text-gray-600 transition-transform ${
                expanded ? 'rotate-90' : ''
              }`}
            />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="space-y-1">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              expanded={false}
              onToggle={() => {}}
              onClick={onClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
