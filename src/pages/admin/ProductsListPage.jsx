// src/pages/admin/ProductsListPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Eye, Check, X, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { useGetAllProductsQuery, useGetProductStatsQuery, useApproveProductMutation, useRejectProductMutation, useDeleteProductMutation } from '../../features/ProductManagement/productManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import StatCard from '../../ui/StatCard';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ProductsListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [actionModal, setActionModal] = useState(null);

  // Fetch data
  const { data: productsData, isLoading, error, refetch } = useGetAllProductsQuery({ page, limit: 12 });
  const { data: statsData } = useGetProductStatsQuery();

  // Mutations
  const [approveProduct, { isLoading: isApproving }] = useApproveProductMutation();
  const [rejectProduct, { isLoading: isRejecting }] = useRejectProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {};

  // Tab counts from stats
  const tabs = [
    { id: 'all', label: 'All', count: statsData?.total || 0 },
    { id: 'pending', label: 'Pending', count: statsData?.pending || 0 },
    { id: 'approved', label: 'Approved', count: statsData?.approved || 0 },
    { id: 'rejected', label: 'Rejected', count: statsData?.rejected || 0 },
  ];

  // Filter products by tab
  const filteredProducts = products.filter(product => {
    const matchesTab = activeTab === 'all' || product.approval_status?.toLowerCase() === activeTab;
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller?.store_name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle product actions
  const handleApprove = async (productId) => {
    try {
      await approveProduct({ productId, notes: 'Approved by admin' }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async (productId, reason) => {
    try {
      await rejectProduct({ productId, reason }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  // Select/deselect products
  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  // Get primary image
  const getPrimaryImage = (images) => {
    if (!images || images.length === 0) return null;
    const primary = images.find(img => img.is_primary);
    return primary?.image_url || images[0]?.image_url;
  };

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load products</h3>
          <p className="text-[#666666] mb-4">{error.message || 'Something went wrong'}</p>
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
          <h1 className="text-[#1A1A1A] mb-2">Product Management</h1>
          <p className="text-[#666666]">Review and manage products from all sellers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <div className="flex gap-1 bg-white rounded-lg p-1 shadow-[0_2px_8px_rgba(6,66,50,0.08)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-[#064232] text-white' : 'text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-[#064232] text-white' : 'text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Products"
            value={statsData.total?.toString() || '0'}
            icon={Package}
            accentColor="sage"
          />
          <StatCard
            title="Pending Approval"
            value={statsData.pending?.toString() || '0'}
            icon={Clock}
            accentColor="orange"
          />
          <StatCard
            title="Approved"
            value={statsData.approved?.toString() || '0'}
            icon={CheckCircle}
            accentColor="green"
          />
          <StatCard
            title="Rejected"
            value={statsData.rejected?.toString() || '0'}
            icon={XCircle}
            accentColor="pink"
          />
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#064232] text-white'
                  : 'text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search products by name or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin text-[#568F87]" size={32} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-12 text-center">
          <Package className="mx-auto mb-4 text-[#E5E5E5]" size={48} />
          <p className="text-[#666666]">No products found</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map(product => {
                const primaryImage = getPrimaryImage(product.images);
                const stockStatus = getStockStatus(product.quantity);
                
                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-[#FFF5F2] flex items-center justify-center overflow-hidden">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="text-[#E5E5E5]" size={64} />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-[#1A1A1A] text-sm line-clamp-2 flex-1">{product.name}</h3>
                        <StatusBadge status={product.approval_status} type="approval" />
                      </div>
                      <p className="text-xs text-[#666666] mb-1">{product.seller?.store_name || 'N/A'}</p>
                      <p className="text-xs text-[#666666] mb-3">{product.category?.name || 'Uncategorized'}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          {(() => {
                            const discountPrice = product.discount_price || product["discount price"] || 0;
                            const hasDiscount = discountPrice > 0 && discountPrice < product.price;
                            return hasDiscount ? (
                              <>
                                <span className="text-[#064232] font-semibold">৳{parseFloat(discountPrice).toFixed(2)}</span>
                                <span className="text-xs text-[#666666] line-through ml-2">
                                  ৳{parseFloat(product.price).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-[#064232] font-semibold">৳{parseFloat(product.price).toFixed(2)}</span>
                            );
                          })()}
                        </div>
                        <StatusBadge status={stockStatus} type="stock" />
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/admin/products/${product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye size={16} />
                            View
                          </Button>
                        </Link>
                        {product.approval_status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => setActionModal({ type: 'approve', product })}
                              className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setActionModal({ type: 'reject', product })}
                              className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#064232] text-white">
                    <tr>
                      <th className="text-left px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th className="text-left px-6 py-4">Product</th>
                      <th className="text-left px-6 py-4">Seller</th>
                      <th className="text-left px-6 py-4">Price</th>
                      <th className="text-left px-6 py-4">Stock</th>
                      <th className="text-left px-6 py-4">Status</th>
                      <th className="text-left px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => {
                      const primaryImage = getPrimaryImage(product.images);
                      const stockStatus = getStockStatus(product.quantity);
                      
                      return (
                        <tr
                          key={product.id}
                          className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                          } hover:bg-[#F5BABB]/20 transition-colors`}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleSelectProduct(product.id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-[#FFF5F2] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                                {primaryImage ? (
                                  <img
                                    src={primaryImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Package className="text-[#E5E5E5]" size={24} />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[#1A1A1A] truncate">{product.name}</p>
                                <p className="text-xs text-[#666666]">SKU: {product.sku || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#666666]">{product.seller?.store_name || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <div>
                              {(() => {
                                const discountPrice = product.discount_price || product["discount price"] || 0;
                                const hasDiscount = discountPrice > 0 && discountPrice < product.price;
                                return hasDiscount ? (
                                  <>
                                    <p className="text-[#1A1A1A] font-semibold">৳{parseFloat(discountPrice).toFixed(2)}</p>
                                    <p className="text-xs text-[#666666] line-through">
                                      ৳{parseFloat(product.price).toFixed(2)}
                                    </p>
                                  </>
                                ) : (
                                  <p className="text-[#1A1A1A] font-semibold">৳{parseFloat(product.price).toFixed(2)}</p>
                                );
                              })()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={stockStatus} type="stock" />
                            <span className="text-xs text-[#666666] ml-2">({product.quantity})</span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={product.approval_status} type="approval" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link to={`/admin/products/${product.id}`}>
                                <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                                  <Eye size={18} />
                                </button>
                              </Link>
                              {product.approval_status?.toLowerCase() === 'pending' && (
                                <>
                                  <button
                                    onClick={() => setActionModal({ type: 'approve', product })}
                                    className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button
                                    onClick={() => setActionModal({ type: 'reject', product })}
                                    className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => setActionModal({ type: 'delete', product })}
                                className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
                <p className="text-[#666666]">
                  Showing page {page + 1} of {pagination.total_pages || 1}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(pagination.total_pages || 1, 5) }, (_, i) => i).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-3 py-1 rounded ${
                        page === p ? 'bg-[#064232] text-white' : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                      }`}
                    >
                      {p + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={page >= (pagination.total_pages || 1) - 1}
                    className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          action={actionModal}
          onClose={() => setActionModal(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          isLoading={isApproving || isRejecting || isDeleting}
        />
      )}
    </div>
  );
}

// Action Modal Component
function ActionModal({ action, onClose, onApprove, onReject, onDelete, isLoading }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    const { type, product } = action;
    switch (type) {
      case 'approve':
        onApprove(product.id);
        break;
      case 'reject':
        onReject(product.id, reason);
        break;
      case 'delete':
        onDelete(product.id);
        break;
    }
  };

  const titles = {
    approve: 'Approve Product',
    reject: 'Reject Product',
    delete: 'Delete Product'
  };

  const needsReason = action.type === 'reject';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{titles[action.type]}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">
            Are you sure you want to {action.type} <span className="text-[#1A1A1A] font-semibold">{action.product.name}</span>?
          </p>
          {action.type === 'delete' && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3 mb-4">
              <p className="text-[#EF4444] text-sm">⚠️ This action cannot be undone. The product will be permanently deleted.</p>
            </div>
          )}
          {needsReason && (
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                rows="3"
                placeholder="Provide a reason for rejection..."
              />
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant={action.type === 'delete' ? 'danger' : 'primary'}
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || (needsReason && !reason.trim())}
            >
              {isLoading ? 'Processing...' : `Confirm ${action.type}`}
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