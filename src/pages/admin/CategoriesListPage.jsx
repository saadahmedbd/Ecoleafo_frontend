
import React, { useState } from 'react';
import { 
  Plus, Search, Grid, List, Eye, Edit, Trash2, RefreshCw, 
  AlertCircle, FolderTree, Star, CheckCircle, XCircle, 
  Image as ImageIcon, Tag, ArrowUpDown
} from 'lucide-react';
import { 
  useGetAllCategoriesQuery, 
  useDeleteCategoryMutation,
  useUpdateCategoryMutation 
} from '../../features/CategoryManagement/categoryManagementApi';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';

export default function CategoriesListPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    is_featured: undefined,
    is_active: undefined,
  });
  const [deleteModal, setDeleteModal] = useState(null);
  const [limit] = useState(12);

  // Fetch categories
  const { 
    data: categoriesData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllCategoriesQuery({ 
    page: currentPage, 
    limit,
    search: searchQuery,
    ...filters
  });

  // Mutations
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const categories = categoriesData?.data?.categories || [];
  const pagination = categoriesData?.data?.pagination || {};

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      setDeleteModal(null);
      refetch();
    } catch (error) {
      alert(error?.data?.message || 'Failed to delete category. It may have subcategories or products.');
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = async (category) => {
    try {
      await updateCategory({
        id: category.id,
        is_featured: !category.is_featured
      }).unwrap();
      refetch();
    } catch (error) {
      alert(error?.data?.message || 'Failed to update category');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (category) => {
    try {
      await updateCategory({
        id: category.id,
        is_active: !category.is_active
      }).unwrap();
      refetch();
    } catch (error) {
      alert(error?.data?.message || 'Failed to update category');
    }
  };

  // Filter options
  const filterButtons = [
    { label: 'All', value: 'all', filter: {} },
    { label: 'Featured', value: 'featured', filter: { is_featured: true } },
    { label: 'Active', value: 'active', filter: { is_active: true } },
    { label: 'Inactive', value: 'inactive', filter: { is_active: false } },
  ];

  const activeFilter = filterButtons.find(f => 
    JSON.stringify(f.filter) === JSON.stringify(filters)
  )?.value || 'all';

  // Pagination
  const totalPages = pagination.total_pages || 1;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load categories</h3>
          <p className="text-[#666666] mb-4">{error?.data?.message || 'Something went wrong'}</p>
          <Button onClick={() => refetch()}>
            <RefreshCw size={18} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Category Management</h1>
          <p className="text-[#666666]">Organize and manage product categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Link to="/admin/categories/tree">
            <Button variant="outline">
              <FolderTree size={18} />
              Tree View
            </Button>
          </Link>
          <Link to="/admin/categories/create">
            <Button variant="primary">
              <Plus size={18} />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Total Categories</p>
          <p className="text-[#064232] text-3xl font-bold">{pagination.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Root Categories</p>
          <p className="text-[#568F87] text-3xl font-bold">
            {categories.filter(c => !c.parent_id).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Featured</p>
          <p className="text-[#F59E0B] text-3xl font-bold">
            {categories.filter(c => c.is_featured).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Active</p>
          <p className="text-[#10B981] text-3xl font-bold">
            {categories.filter(c => c.is_active).length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
            <input
              type="text"
              placeholder="Search categories by name or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {filterButtons.map(btn => (
              <button
                key={btn.value}
                onClick={() => {
                  setFilters(btn.filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-md transition-colors text-sm ${
                  activeFilter === btn.value
                    ? 'bg-[#064232] text-white'
                    : 'bg-[#FFF5F2] text-[#666666] hover:bg-[#F5BABB]/30'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#064232] text-white'
                  : 'bg-[#FFF5F2] text-[#666666] hover:bg-[#F5BABB]/30'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#064232] text-white'
                  : 'bg-[#FFF5F2] text-[#666666] hover:bg-[#F5BABB]/30'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Display */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-12">
          <div className="text-center">
            <Tag className="mx-auto mb-4 text-[#E5E5E5]" size={64} />
            <h3 className="text-[#1A1A1A] mb-2">No categories found</h3>
            <p className="text-[#666666] mb-4">
              {searchQuery ? 'Try adjusting your search terms' : 'Start by creating your first category'}
            </p>
            {!searchQuery && (
              <Link to="/admin/categories/create">
                <Button variant="primary">
                  <Plus size={18} />
                  Create Category
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onDelete={() => setDeleteModal(category)}
              onToggleFeatured={() => handleToggleFeatured(category)}
              onToggleActive={() => handleToggleActive(category)}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#064232] text-white">
                <tr>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Parent</th>
                  <th className="text-left px-6 py-4">Products</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Featured</th>
                  <th className="text-left px-6 py-4">Order</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr 
                    key={category.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                    } hover:bg-[#F5BABB]/20 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#064232] rounded-lg flex items-center justify-center">
                            {category.icon ? (
                              <i className={`${category.icon} text-white`}></i>
                            ) : (
                              <Tag className="text-white" size={20} />
                            )}
                          </div>
                        )}
                        <div>
                          <p className="text-[#1A1A1A] font-medium">{category.name}</p>
                          <p className="text-[#666666] text-sm">{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#666666]">
                      {category.parent_id ? 'Subcategory' : 'Root'}
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A] font-semibold">
                      {category.product_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(category)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          category.is_active
                            ? 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            : 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                        }`}
                      >
                        {category.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {category.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(category)}
                        disabled={isUpdating}
                        className={`p-2 rounded-lg transition-colors ${
                          category.is_featured
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                            : 'bg-[#E5E5E5] text-[#666666] hover:bg-[#E5E5E5]/50'
                        }`}
                      >
                        <Star size={16} fill={category.is_featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-[#666666]">
                      {category.sort_order || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/categories/${category.id}`}>
                          <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                        <Link to={`/admin/categories/${category.id}/edit`}>
                          <button className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded transition-colors">
                            <Edit size={18} />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteModal(category)}
                          className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
              <p className="text-[#666666]">
                Showing {Math.min((currentPage - 1) * limit + 1, pagination.total)} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} categories
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-[#064232] text-white'
                          : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          category={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

// Category Card Component (Grid View)
function CategoryCard({ category, onDelete, onToggleFeatured, onToggleActive, isUpdating }) {
  return (
    <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden hover:shadow-[0_4px_16px_rgba(6,66,50,0.12)] transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-[#064232] to-[#568F87]">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {category.icon ? (
              <i className={`${category.icon} text-white text-4xl`}></i>
            ) : (
              <Tag className="text-white" size={48} />
            )}
          </div>
        )}
        
        {/* Featured Badge */}
        <button
          onClick={onToggleFeatured}
          disabled={isUpdating}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-colors ${
            category.is_featured
              ? 'bg-[#F59E0B]/90 text-white'
              : 'bg-white/50 text-[#666666] hover:bg-white/70'
          }`}
        >
          <Star size={16} fill={category.is_featured ? 'currentColor' : 'none'} />
        </button>

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          <button
            onClick={onToggleActive}
            disabled={isUpdating}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              category.is_active
                ? 'bg-[#10B981]/90 text-white'
                : 'bg-[#EF4444]/90 text-white'
            }`}
          >
            {category.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {category.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-[#1A1A1A] font-semibold mb-1">{category.name}</h3>
          <p className="text-[#666666] text-sm truncate">{category.slug}</p>
        </div>

        {category.description && (
          <p className="text-[#666666] text-sm mb-3 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-[#666666]">
            {category.product_count || 0} products
          </span>
          {category.children && category.children.length > 0 && (
            <span className="text-[#568F87]">
              {category.children.length} subcategories
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to={`/admin/categories/${category.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye size={16} />
              View
            </Button>
          </Link>
          <Link to={`/admin/categories/${category.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit size={16} />
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({ category, onClose, onConfirm, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>Delete Category</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <AlertCircle className="mx-auto mb-3 text-[#EF4444]" size={48} />
            <p className="text-[#666666] text-center">
              Are you sure you want to delete <strong className="text-[#1A1A1A]">"{category.name}"</strong>?
            </p>
          </div>

          {(category.product_count > 0 || (category.children && category.children.length > 0)) && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3 mb-4">
              <p className="text-[#EF4444] text-sm">
                ⚠️ This category has {category.product_count || 0} products
                {category.children && category.children.length > 0 && ` and ${category.children.length} subcategories`}.
                Deletion may fail if products or subcategories exist.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => onConfirm(category.id)}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Category'}
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}