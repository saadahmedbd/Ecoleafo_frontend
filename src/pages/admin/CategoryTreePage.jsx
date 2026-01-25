
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, ChevronDown, Plus, Edit, 
  Eye, Trash2, Star, Package, RefreshCw, AlertCircle, Grid
} from 'lucide-react';
import { useGetCategoryTreeQuery, useDeleteCategoryMutation } from '../../features/CategoryManagement/categoryManagementApi';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CategoryTreePage() {
  usePageTitle('Category Tree');
  const { data: treeData, isLoading, error, refetch } = useGetCategoryTreeQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState(null);

  const tree = treeData?.data || [];

  // Toggle node expansion
  const toggleNode = (id) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all nodes
  const expandAll = () => {
    const allIds = new Set();
    const collectIds = (nodes) => {
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(tree);
    setExpandedNodes(allIds);
  };

  // Collapse all nodes
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      setDeleteModal(null);
      refetch();
    } catch (error) {
      alert(error?.data?.message || 'Failed to delete category');
    }
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
          <h3 className="text-[#1A1A1A] mb-2">Failed to load category tree</h3>
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
          <Link to="/admin/categories" className="inline-flex items-center gap-2 text-[#568F87] hover:underline mb-2">
            <ArrowLeft size={18} />
            Back to Categories
          </Link>
          <h1 className="text-[#1A1A1A] mb-2">Category Tree View</h1>
          <p className="text-[#666666]">Hierarchical view of all categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            Collapse All
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Link to="/admin/categories">
            <Button variant="outline">
              <Grid size={18} />
              Grid View
            </Button>
          </Link>
        </div>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        {tree.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto mb-4 text-[#E5E5E5]" size={64} />
            <h3 className="text-[#1A1A1A] mb-2">No categories yet</h3>
            <p className="text-[#666666] mb-4">Create your first category to get started</p>
            <Link to="/admin/categories/create">
              <Button variant="primary">
                <Plus size={18} />
                Create Category
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {tree.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                expandedNodes={expandedNodes}
                onToggle={toggleNode}
                onDelete={setDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          category={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// Tree Node Component
function TreeNode({ node, level, expandedNodes, onToggle, onDelete }) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const indentation = level * 24;

  return (
    <div>
      {/* Node Row */}
      <div
        className="flex items-center gap-3 p-3 hover:bg-[#FFF5F2] rounded-lg transition-colors group"
        style={{ paddingLeft: `${indentation + 12}px` }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 hover:bg-[#568F87]/10 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="text-[#568F87]" size={20} />
            ) : (
              <ChevronRight className="text-[#666666]" size={20} />
            )}
          </button>
        ) : (
          <div className="w-7" />
        )}

        {/* Icon */}
        <div className="w-10 h-10 bg-[#064232] rounded-lg flex items-center justify-center flex-shrink-0">
          {node.icon ? (
            <i className={`${node.icon} text-white`}></i>
          ) : (
            <Package className="text-white" size={20} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[#1A1A1A] font-medium truncate">{node.name}</h3>
            {node.is_featured && (
              <Star className="text-[#F59E0B] flex-shrink-0" size={16} fill="currentColor" />
            )}
            {!node.is_active && (
              <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-xs rounded-full flex-shrink-0">
                Inactive
              </span>
            )}
          </div>
          <p className="text-[#666666] text-sm truncate">{node.slug}</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          {hasChildren && (
            <span className="text-[#568F87]">
              {node.children.length} {node.children.length === 1 ? 'child' : 'children'}
            </span>
          )}
          <span className="text-[#666666]">
            {node.product_count || 0} products
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/admin/categories/${node.id}`}>
            <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
              <Eye size={16} />
            </button>
          </Link>
          <Link to={`/admin/categories/${node.id}/edit`}>
            <button className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded transition-colors">
              <Edit size={16} />
            </button>
          </Link>
          <button
            onClick={() => onDelete(node)}
            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Delete Modal
function DeleteModal({ category, onClose, onConfirm }) {
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
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => onConfirm(category.id)}
            >
              Delete Category
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}