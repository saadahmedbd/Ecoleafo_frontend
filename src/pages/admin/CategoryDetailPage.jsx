import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff, Star, Package, FolderTree } from 'lucide-react';
import { useGetCategoryByIdQuery, useDeleteCategoryMutation } from '../../features/CategoryManagement/categoryManagementApi';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CategoryDetailPage() {
  usePageTitle('Category Details');
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: categoryData, isLoading } = useGetCategoryByIdQuery(id);
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const category = categoryData?.data;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(id).unwrap();
        navigate('/admin/categories');
      } catch (error) {
        alert(error?.data?.message || 'Failed to delete category');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#568F87]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-[#666666] mb-4">Category not found</p>
        <Link to="/admin/categories">
          <Button variant="primary">Back to Categories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin/categories" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
          <ArrowLeft size={18} />
          Back to Categories
        </Link>
        <div className="flex gap-2">
          <Link to={`/admin/categories/${id}/edit`}>
            <Button variant="primary">
              <Edit size={18} />
              Edit Category
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 size={18} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Info */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] text-xl font-semibold mb-4">{category.name}</h2>
            
            {/* Image/Icon */}
            {category.image || category.icon ? (
              <div className="mb-6">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-64 object-cover rounded-lg" />
                ) : category.icon && (category.icon.startsWith('http') || category.icon.startsWith('data:')) ? (
                  <img src={category.icon} alt={category.name} className="w-32 h-32 object-contain mx-auto" />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-[#064232] rounded-lg flex items-center justify-center">
                    <i className={`${category.icon} text-white text-5xl`}></i>
                  </div>
                )}
              </div>
            ) : null}

            {/* Description */}
            {category.description && (
              <div className="mb-4">
                <h3 className="text-[#1A1A1A] font-medium mb-2">Description</h3>
                <p className="text-[#666666]">{category.description}</p>
              </div>
            )}

            {/* Slug */}
            <div className="mb-4">
              <h3 className="text-[#1A1A1A] font-medium mb-2">Slug</h3>
              <code className="bg-[#FFF5F2] px-3 py-1 rounded text-[#064232]">{category.slug}</code>
            </div>

            {/* SEO Info */}
            {(category.meta_title || category.meta_description || category.meta_keywords) && (
              <div className="border-t border-[#E5E5E5] pt-4 mt-4">
                <h3 className="text-[#1A1A1A] font-medium mb-3">SEO Information</h3>
                {category.meta_title && (
                  <div className="mb-3">
                    <p className="text-[#666666] text-sm mb-1">Meta Title</p>
                    <p className="text-[#1A1A1A]">{category.meta_title}</p>
                  </div>
                )}
                {category.meta_description && (
                  <div className="mb-3">
                    <p className="text-[#666666] text-sm mb-1">Meta Description</p>
                    <p className="text-[#1A1A1A]">{category.meta_description}</p>
                  </div>
                )}
                {category.meta_keywords && (
                  <div>
                    <p className="text-[#666666] text-sm mb-1">Meta Keywords</p>
                    <p className="text-[#1A1A1A]">{category.meta_keywords}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h3 className="text-[#1A1A1A] font-medium mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Active</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  category.is_active ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {category.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                  {category.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Featured</span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  category.is_featured ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#E5E5E5] text-[#666666]'
                }`}>
                  <Star size={12} fill={category.is_featured ? 'currentColor' : 'none'} />
                  {category.is_featured ? 'Featured' : 'Not Featured'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h3 className="text-[#1A1A1A] font-medium mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666] flex items-center gap-2">
                  <Package size={16} />
                  Products
                </span>
                <span className="text-[#1A1A1A] font-semibold">{category.product_count || 0}</span>
              </div>
              {category.children && category.children.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[#666666] flex items-center gap-2">
                    <FolderTree size={16} />
                    Subcategories
                  </span>
                  <span className="text-[#1A1A1A] font-semibold">{category.children.length}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Sort Order</span>
                <span className="text-[#1A1A1A] font-semibold">{category.sort_order || 0}</span>
              </div>
            </div>
          </div>

          {/* Hierarchy Card */}
          {category.parent_id && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h3 className="text-[#1A1A1A] font-medium mb-4">Hierarchy</h3>
              <div className="text-[#666666]">
                <p className="text-sm mb-1">Parent Category</p>
                <p className="text-[#1A1A1A]">ID: {category.parent_id}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h3 className="text-[#1A1A1A] font-medium mb-4">Timestamps</h3>
            <div className="space-y-2 text-sm">
              {category.created_at && (
                <div>
                  <p className="text-[#666666]">Created</p>
                  <p className="text-[#1A1A1A]">{new Date(category.created_at).toLocaleString()}</p>
                </div>
              )}
              {category.updated_at && (
                <div>
                  <p className="text-[#666666]">Updated</p>
                  <p className="text-[#1A1A1A]">{new Date(category.updated_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
