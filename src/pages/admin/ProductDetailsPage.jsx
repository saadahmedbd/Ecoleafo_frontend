// src/pages/admin/ProductDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Store, RefreshCw, AlertCircle, Trash2, Package, DollarSign, Box } from 'lucide-react';
import { useGetProductByIdQuery, useApproveProductMutation, useRejectProductMutation, useDeleteProductMutation } from '../../features/ProductManagement/productManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [actionModal, setActionModal] = useState(null);

  // Fetch product data
  const { data: productData, isLoading, error, refetch } = useGetProductByIdQuery(id);
  
  // Mutations
  const [approveProduct, { isLoading: isApproving }] = useApproveProductMutation();
  const [rejectProduct, { isLoading: isRejecting }] = useRejectProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const product = productData || productData?.data;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'images', label: 'Images' },
    { id: 'seller', label: 'Seller Info' },
  ];

  // Handle actions
  const handleApprove = async () => {
    try {
      await approveProduct({ productId: id, notes: 'Approved by admin' }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectProduct({ productId: id, reason }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to reject:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(id).unwrap();
      // Redirect to products list after deletion
      window.location.href = '/admin/products';
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Get stock status
  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load product</h3>
          <p className="text-[#666666] mb-4">{error?.message || 'Product not found'}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()}>
              <RefreshCw size={18} />
              Retry
            </Button>
            <Link to="/admin/products">
              <Button variant="outline">
                <ArrowLeft size={18} />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const stockStatus = getStockStatus(product.quantity);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/admin/products" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Products
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[#1A1A1A]">{product.name}</h1>
              <StatusBadge status={product.approval_status} type="approval" />
            </div>
            <div className="flex items-center gap-2 text-[#666666] mb-2">
              <Store size={16} />
              <span>Sold by {product.seller?.store_name || 'Unknown'}</span>
            </div>
            <p className="text-sm text-[#666666]">SKU: {product.sku || 'N/A'}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.approval_status?.toLowerCase() === 'pending' && (
              <>
                <Button variant="primary" onClick={() => setActionModal({ type: 'approve' })}>
                  <CheckCircle size={18} />
                  Approve
                </Button>
                <Button variant="danger" onClick={() => setActionModal({ type: 'reject' })}>
                  <XCircle size={18} />
                  Reject
                </Button>
              </>
            )}
            <Button variant="danger" onClick={() => setActionModal({ type: 'delete' })}>
              <Trash2 size={18} />
              Delete
            </Button>
          </div>
        </div>
      </div>

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
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Images Gallery */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                <h2 className="text-[#1A1A1A] mb-4">Product Images</h2>
                {images.length > 0 ? (
                  <>
                    <div className="aspect-square bg-[#FFF5F2] rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={images[selectedImage]?.image_url}
                        alt={images[selectedImage]?.alt_text || product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img, index) => (
                        <div
                          key={img.id}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square bg-[#FFF5F2] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#F5BABB]/30 transition-colors overflow-hidden ${
                            selectedImage === index ? 'ring-2 ring-[#064232]' : ''
                          }`}
                        >
                          <img
                            src={img.image_url}
                            alt={img.alt_text || `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="aspect-square bg-[#FFF5F2] rounded-lg flex items-center justify-center">
                    <Package className="text-[#E5E5E5]" size={96} />
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                <h2 className="text-[#1A1A1A] mb-4">Description</h2>
                <p className="text-[#666666] whitespace-pre-wrap">
                  {product.description || 'No description provided'}
                </p>
              </div>
            </>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Product Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Height</p>
                  <p className="text-[#1A1A1A]">{product.height || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Age</p>
                  <p className="text-[#1A1A1A]">{product.age || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Tree Type</p>
                  <p className="text-[#1A1A1A]">{product.tree_type || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Pot Size</p>
                  <p className="text-[#1A1A1A]">{product.pot_size || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Scientific Name</p>
                  <p className="text-[#1A1A1A]">{product.scientific_name || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Common Names</p>
                  <p className="text-[#1A1A1A]">{product.common_names || 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Weight</p>
                  <p className="text-[#1A1A1A]">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                </div>
                <div className="bg-[#FFF5F2] p-4 rounded-lg">
                  <p className="text-sm text-[#666666] mb-1">Min Order Quantity</p>
                  <p className="text-[#1A1A1A]">{product.min_quantity || 1}</p>
                </div>
              </div>

              {/* SEO Information */}
              {(product.meta_title || product.meta_description) && (
                <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                  <h3 className="text-[#1A1A1A] mb-4">SEO Information</h3>
                  <div className="space-y-3">
                    {product.meta_title && (
                      <div>
                        <p className="text-sm text-[#666666] mb-1">Meta Title</p>
                        <p className="text-[#1A1A1A]">{product.meta_title}</p>
                      </div>
                    )}
                    {product.meta_description && (
                      <div>
                        <p className="text-sm text-[#666666] mb-1">Meta Description</p>
                        <p className="text-[#1A1A1A]">{product.meta_description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">All Product Images</h2>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, index) => (
                    <div key={img.id} className="space-y-2">
                      <div className="aspect-square bg-[#FFF5F2] rounded-lg overflow-hidden">
                        <img
                          src={img.image_url}
                          alt={img.alt_text || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[#666666]">
                            {img.is_primary && (
                              <span className="text-[#064232] font-medium">Primary • </span>
                            )}
                            Order: {img.sort_order}
                          </span>
                        </div>
                        <p className="text-[#666666] text-xs truncate">{img.alt_text || 'No alt text'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="mx-auto mb-4 text-[#E5E5E5]" size={48} />
                  <p className="text-[#666666]">No images uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* Seller Tab */}
          {activeTab === 'seller' && product.seller && (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
              <h2 className="text-[#1A1A1A] mb-4">Seller Information</h2>
              <div className="flex items-start gap-4 mb-6">
                {product.seller.store_logo ? (
                  <img
                    src={product.seller.store_logo}
                    alt={product.seller.store_name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-[#064232] rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    {product.seller.store_name?.charAt(0) || 'S'}
                  </div>
                )}
                <div>
                  <h3 className="text-[#1A1A1A] mb-1">{product.seller.store_name}</h3>
                  <StatusBadge status={product.seller.approval_status} type="approval" />
                  <p className="text-sm text-[#666666] mt-2">
                    {product.seller.store_description || 'No description'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#666666] mb-1">Email</p>
                  <p className="text-[#1A1A1A]">{product.seller.business_email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Phone</p>
                  <p className="text-[#1A1A1A]">{product.seller.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Business Type</p>
                  <p className="text-[#1A1A1A]">{product.seller.business_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666] mb-1">Commission</p>
                  <p className="text-[#1A1A1A]">{product.seller.commission}%</p>
                </div>
              </div>

              <div className="mt-6">
                <Link to={`/admin/sellers/${product.seller.id}`}>
                  <Button variant="outline" className="w-full">
                    View Full Seller Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Details */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Pricing Details</h2>
            <div className="space-y-4">
              {(() => {
                const discountPrice = product.discount_price || product["discount price"] || 0;
                const originalPrice = product.price || 0;
                const discountPercent = product.discount_percent || 0;
                const hasDiscount = discountPrice > 0 && discountPrice < originalPrice;

                return hasDiscount ? (
                  <>
                    <div>
                      <p className="text-sm text-[#666666] mb-1">Current Price</p>
                      <p className="text-[#064232] text-3xl font-bold">৳{parseFloat(discountPrice).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#666666] mb-1">Original Price</p>
                      <p className="text-[#666666] text-xl line-through">
                        ৳{parseFloat(originalPrice).toFixed(2)}
                      </p>
                    </div>
                    {discountPercent > 0 && (
                      <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg p-3">
                        <p className="text-[#10B981] font-semibold">
                          {discountPercent}% OFF
                        </p>
                        <p className="text-sm text-[#10B981]">
                          Save ৳{(parseFloat(originalPrice) - parseFloat(discountPrice)).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <p className="text-sm text-[#666666] mb-1">Current Price</p>
                    <p className="text-[#064232] text-3xl font-bold">৳{parseFloat(originalPrice).toFixed(2)}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Inventory Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#666666] mb-1">Stock Status</p>
                <StatusBadge status={stockStatus} type="stock" />
              </div>
              <div>
                <p className="text-sm text-[#666666] mb-1">Available Quantity</p>
                <p className="text-[#1A1A1A] text-2xl font-bold">{product.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-[#666666] mb-1">Minimum Order</p>
                <p className="text-[#1A1A1A]">{product.min_quantity || 1} units</p>
              </div>
            </div>
          </div>

          {/* Product Stats */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Product Statistics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Views</span>
                <span className="text-[#1A1A1A] font-semibold">{product.view_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Sales</span>
                <span className="text-[#1A1A1A] font-semibold">{product.sale_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Rating</span>
                <span className="text-[#1A1A1A] font-semibold">
                  {product.average_rating > 0 ? `${product.average_rating}/5` : 'No ratings'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Reviews</span>
                <span className="text-[#1A1A1A] font-semibold">{product.review_count || 0}</span>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Product Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Approval Status</span>
                <StatusBadge status={product.approval_status} type="approval" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Active</span>
                <span className={product.is_active ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                  {product.is_active ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Featured</span>
                <span className={product.is_featured ? 'text-[#10B981]' : 'text-[#666666]'}>
                  {product.is_featured ? 'Yes' : 'No'}
                </span>
              </div>
              {product.rejection_reason && (
                <div className="pt-3 border-t border-[#E5E5E5]">
                  <p className="text-sm text-[#666666] mb-1">Rejection Reason</p>
                  <p className="text-[#EF4444] text-sm">{product.rejection_reason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Timestamps</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[#666666] mb-1">Created</p>
                <p className="text-[#1A1A1A]">
                  {product.created_at ? new Date(product.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[#666666] mb-1">Last Updated</p>
                <p className="text-[#1A1A1A]">
                  {product.updated_at ? new Date(product.updated_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              {product.approved_at && (
                <div>
                  <p className="text-[#666666] mb-1">Approved</p>
                  <p className="text-[#1A1A1A]">
                    {new Date(product.approved_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          action={actionModal.type}
          product={product}
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
function ActionModal({ action, product, onClose, onApprove, onReject, onDelete, isLoading }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    switch (action) {
      case 'approve':
        onApprove();
        break;
      case 'reject':
        onReject(reason);
        break;
      case 'delete':
        onDelete();
        break;
    }
  };

  const config = {
    approve: {
      title: 'Approve Product',
      message: `Are you sure you want to approve "${product.name}"?`,
      needsReason: false,
      buttonText: 'Approve Product',
      buttonVariant: 'primary',
      warning: null
    },
    reject: {
      title: 'Reject Product',
      message: `Are you sure you want to reject "${product.name}"?`,
      needsReason: true,
      buttonText: 'Reject Product',
      buttonVariant: 'danger',
      warning: 'The seller will be notified about the rejection.'
    },
    delete: {
      title: 'Delete Product',
      message: `Are you sure you want to delete "${product.name}"?`,
      needsReason: false,
      buttonText: 'Delete Product',
      buttonVariant: 'danger',
      warning: '⚠️ This action cannot be undone. The product will be permanently deleted from the system.'
    }
  };

  const { title, message, needsReason, buttonText, buttonVariant, warning } = config[action];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{title}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">{message}</p>
          
          {warning && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3 mb-4">
              <p className="text-[#EF4444] text-sm">{warning}</p>
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
              variant={buttonVariant}
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading || (needsReason && !reason.trim())}
            >
              {isLoading ? 'Processing...' : buttonText}
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