// src/components/CategoryFilter.jsx
import { useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useGetCategoryTreeQuery } from '@/features/categories/categoriesApi';

export default function CategoryFilter({ selectedCategoryId, onCategorySelect, onClose }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set([selectedCategoryId]));
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Filter by Category</h3>
        {selectedCategoryId && (
          <button
            onClick={() => onCategorySelect(null)}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-1 max-h-96 overflow-y-auto">
        {categories.map((category) => (
          <CategoryFilterItem
            key={category.id}
            category={category}
            selectedId={selectedCategoryId}
            expanded={expandedCategories.has(category.id)}
            onToggle={() => toggleExpand(category.id)}
            onSelect={onCategorySelect}
            level={0}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryFilterItem({ category, selectedId, expanded, onToggle, onSelect, level }) {
  const hasChildren = category.children?.length > 0;
  const isSelected = category.id === selectedId;
  const indent = level * 16;

  return (
    <div>
      <div
        style={{ paddingLeft: `${indent}px` }}
        className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
          isSelected
            ? 'bg-green-100 text-green-700 font-medium'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <button
          onClick={() => onSelect(category.id)}
          className="flex items-center gap-2 flex-1 text-left text-sm"
        >
          {category.icon && <span className="text-base">{category.icon}</span>}
          <span>{category.name}</span>
          {category.product_count > 0 && (
            <span className="text-xs text-gray-500">({category.product_count})</span>
          )}
        </button>
        {hasChildren && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        )}
      </div>
      {expanded && hasChildren && (
        <div className="space-y-1">
          {category.children.map((child) => (
            <CategoryFilterItem
              key={child.id}
              category={child}
              selectedId={selectedId}
              expanded={false}
              onToggle={() => {}}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
