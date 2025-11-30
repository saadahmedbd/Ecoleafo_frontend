// src/pages/admin/SellerDetailPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, RefreshCw, AlertCircle, Globe, FileText, Check, AlertTriangle } from 'lucide-react';
import { useGetSellerByIdQuery, useApproveSellerMutation, useRejectSellerMutation, useSuspendSellerMutation, useReactivateSellerMutation } from '../../features/UsersManagement/usersManagementApi';
import StatCard from '../../ui/StatCard';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { DollarSign, Package, ShoppingCart, Star } from 'lucide-react';

// Simple Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-[#10B981]' : type === 'error' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]';
  const Icon = type === 'success' ? Check : type === 'error' ? AlertTriangle : AlertCircle;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slideIn`}>
      <Icon size={20} />
      <span>{message}</span>
    </div>
  );
};

export default function SellerDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch seller data
  const { data: sellerData, isLoading, error, refetch } = useGetSellerByIdQuery(id);
  
  // Mutations
  const [approveSeller, { isLoading: isApproving }] = useApproveSellerMutation();
  const [rejectSeller, { isLoading: isRejecting }] = useRejectSellerMutation();
  const [suspendSeller, { isLoading: isSuspending }] = useSuspendSellerMutation();
  const [reactivateSeller, { isLoading: isReactivating }] = useReactivateSellerMutation();

  const seller = sellerData?.data;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'business', label: 'Business Info' },
    { id: 'payment', label: 'Payment Methods' },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Activity' },
  ];

  // Handle actions
  const handleApprove = async (reason) => {
    try {
      const result = await approveSeller({ sellerId: id, notes: reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller approved successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to approve:', error);
      setToast({ message: error?.data?.message || 'Failed to approve seller', type: 'error' });
    }
  };

  const handleReject = async (reason) => {
    try {
      await rejectSeller({ sellerId: id, reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller rejected successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to reject:', error);
      setToast({ message: error?.data?.message || 'Failed to reject seller', type: 'error' });
    }
  };

  const handleSuspend = async (reason) => {
    try {
      await suspendSeller({ sellerId: id, reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller suspended successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to suspend:', error);
      setToast({ message: error?.data?.message || 'Failed to suspend seller', type: 'error' });
    }
  };

  const handleReactivate = async (reason) => {
    try {
      await reactivateSeller({ sellerId: id, notes: reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller reactivated successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to reactivate:', error);
      setToast({ message: error?.data?.message || 'Failed to reactivate seller', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load seller</h3>
          <p className="text-[#666666] mb-4">{error?.message || 'Seller not found'}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refetch()}>
              <RefreshCw size={18} />
              Retry
            </Button>
            <Link to="/admin/sellers">
              <Button variant="outline">
                <ArrowLeft size={18} />
                Back to Sellers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back Button */}
      <Link to="/admin/sellers" className="inline-flex items-center gap-2 text-[#568F87] hover:underline">
        <ArrowLeft size={18} />
        Back to Sellers
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            {seller.store_logo_url ? (
              <img
                src={seller.store_logo_url}
                alt={seller.store_name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 bg-[#064232] rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {seller.store_name?.charAt(0) || 'S'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[#1A1A1A]">{seller.store_name || 'N/A'}</h1>
                <StatusBadge status={seller.approval_status} type="approval" />
              </div>
              <p className="text-[#666666] mb-2">{seller.store_description || 'No description provided'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[#666666]">
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  Joined {seller.created_at ? new Date(seller.created_at).toLocaleDateString() : 'N/A'}
                </span>
                {seller.store_website && (
                  <a
                    href={seller.store_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#568F87] hover:underline"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {seller.approval_status?.toLowerCase() === 'pending' && (
              <>
                <Button variant="primary" onClick={() => setActionModal({ type: 'approve' })} disabled={isApproving}>
                  <CheckCircle size={18} />
                  {isApproving ? 'Approving...' : 'Approve'}
                </Button>
                <Button variant="danger" onClick={() => setActionModal({ type: 'reject' })} disabled={isRejecting}>
                  <XCircle size={18} />
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
              </>
            )}
            {seller.approval_status?.toLowerCase() === 'approved' && (
              <Button variant="danger" onClick={() => setActionModal({ type: 'suspend' })} disabled={isSuspending}>
                <XCircle size={18} />
                {isSuspending ? 'Suspending...' : 'Suspend'}
              </Button>
            )}
            {seller.approval_status?.toLowerCase() === 'suspended' && (
              <Button variant="primary" onClick={() => setActionModal({ type: 'reactivate' })} disabled={isReactivating}>
                <CheckCircle size={18} />
                {isReactivating ? 'Reactivating...' : 'Reactivate'}
              </Button>
            )}
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Store Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-[#666666] text-sm mb-1">Store Name</p>
                <p className="text-[#1A1A1A]">{seller.store_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Business Type</p>
                <p className="text-[#1A1A1A]">{seller.business_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Phone</p>
                <p className="text-[#1A1A1A]">{seller.business_phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Status</p>
                <StatusBadge status={seller.approval_status} type="approval" />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#568F87]" />
                <p className="text-[#1A1A1A]">{seller.business_email || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#568F87]" />
                <p className="text-[#1A1A1A]">{seller.business_phone || 'N/A'}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-[#568F87] mt-1" />
                <p className="text-[#1A1A1A]">
                  {[
                    seller.business_address,
                    seller.business_city,
                    seller.business_state,
                    seller.business_zip
                  ].filter(Boolean).join(', ') || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#666666] text-sm mb-1">Business Type</p>
                <p className="text-[#1A1A1A]">{seller.business_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Tax ID</p>
                <p className="text-[#1A1A1A]">{seller.tax_id || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Business License</p>
                <p className="text-[#1A1A1A]">{seller.business_registration_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Commission Rate</p>
                <p className="text-[#1A1A1A]">{seller.commission || 0}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-[#666666] text-sm mb-1">Store Description</p>
                <p className="text-[#1A1A1A]">{seller.store_description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] mb-4">Business Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#666666] text-sm mb-1">Address</p>
                <p className="text-[#1A1A1A]">{seller.business_address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">City</p>
                <p className="text-[#1A1A1A]">{seller.business_city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">State/Province</p>
                <p className="text-[#1A1A1A]">{seller.business_state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#666666] text-sm mb-1">Postal Code</p>
                <p className="text-[#1A1A1A]">{seller.business_zip || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          {seller?.payment_methods && seller.payment_methods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seller.payment_methods.map((method) => (
                <div key={method.id} className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[#1A1A1A] font-semibold capitalize">{method.type || 'Payment Method'}</h3>
                      <p className="text-[#666666] text-sm">ID: {method.id}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {method.is_default && (
                        <span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-semibold rounded whitespace-nowrap">
                          Default
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                        method.is_active 
                          ? 'bg-[#10B981]/10 text-[#10B981]'
                          : 'bg-[#EF4444]/10 text-[#EF4444]'
                      }`}>
                        {method.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[#666666] text-sm mb-1">Account Name</p>
                      <p className="text-[#1A1A1A] font-medium">{method.account_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[#666666] text-sm mb-1">Account Number</p>
                      <p className="text-[#1A1A1A] font-mono bg-[#F5F5F5] px-3 py-2 rounded">{method.account_number || 'N/A'}</p>
                    </div>

                    {method.type?.toLowerCase() === 'bank' && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[#666666] text-sm mb-1">Bank Name</p>
                            <p className="text-[#1A1A1A]">{method.bank_name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-[#666666] text-sm mb-1">Bank Code</p>
                            <p className="text-[#1A1A1A]">{method.bank_code || 'N/A'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[#666666] text-sm mb-1">Routing Number</p>
                          <p className="text-[#1A1A1A]">{method.routing_number || 'N/A'}</p>
                        </div>
                      </>
                    )}

                    <div className="pt-3 border-t border-[#E5E5E5] mt-4">
                      <p className="text-[#666666] text-xs">
                        Added {method.created_at ? new Date(method.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-12 text-center">
              <p className="text-[#666666] mb-2">No payment methods added</p>
              <p className="text-[#999999] text-sm">This seller hasn't set up any payment methods yet</p>
            </div>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-4">Verification Documents</h2>
          <div className="space-y-4">
            {seller.store_logo_url && (
              <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#568F87]" size={24} />
                  <div>
                    <p className="text-[#1A1A1A]">Store Logo</p>
                    <p className="text-[#666666] text-sm">Image file</p>
                  </div>
                </div>
                <a href={seller.store_logo_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">View</Button>
                </a>
              </div>
            )}
            {seller.store_banner_url && (
              <div className="flex items-center justify-between p-4 border border-[#E5E5E5] rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-[#568F87]" size={24} />
                  <div>
                    <p className="text-[#1A1A1A]">Store Banner</p>
                    <p className="text-[#666666] text-sm">Image file</p>
                  </div>
                </div>
                <a href={seller.store_banner_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">View</Button>
                </a>
              </div>
            )}
            {!seller.store_logo_url && !seller.store_banner_url && (
              <p className="text-[#666666] text-center py-8">No documents uploaded</p>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border-l-2 border-[#568F87]">
              <Calendar className="text-[#568F87] mt-1" size={16} />
              <div>
                <p className="text-[#1A1A1A]">Account Created</p>
                <p className="text-[#666666] text-sm">
                  {seller.created_at ? new Date(seller.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            {seller.updated_at && (
              <div className="flex items-start gap-3 p-3 border-l-2 border-[#F59E0B]">
                <Calendar className="text-[#F59E0B] mt-1" size={16} />
                <div>
                  <p className="text-[#1A1A1A]">Last Updated</p>
                  <p className="text-[#666666] text-sm">
                    {new Date(seller.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          action={actionModal.type}
          seller={seller}
          onClose={() => setActionModal(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          isLoading={isApproving || isRejecting || isSuspending || isReactivating}
        />
      )}
    </div>
  );
}

// Action Modal Component
function ActionModal({ action, seller, onClose, onApprove, onReject, onSuspend, onReactivate, isLoading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('Please provide a reason');
      return;
    }
    
    switch (action) {
      case 'approve':
        onApprove(reason || 'Approved by admin');
        break;
      case 'reject':
        onReject(reason);
        break;
      case 'suspend':
        onSuspend(reason);
        break;
      case 'reactivate':
        onReactivate(reason || 'Reactivated by admin');
        break;
    }
  };

  const config = {
    approve: {
      title: 'Approve Seller',
      message: `Are you sure you want to approve ${seller.store_name}?`,
      needsReason: false,
      buttonText: 'Approve Seller',
      buttonVariant: 'primary'
    },
    reject: {
      title: 'Reject Seller',
      message: `Are you sure you want to reject ${seller.store_name}?`,
      needsReason: true,
      buttonText: 'Reject Seller',
      buttonVariant: 'danger'
    },
    suspend: {
      title: 'Suspend Seller',
      message: `Are you sure you want to suspend ${seller.store_name}?`,
      needsReason: true,
      buttonText: 'Suspend Seller',
      buttonVariant: 'danger'
    },
    reactivate: {
      title: 'Reactivate Seller',
      message: `Are you sure you want to reactivate ${seller.store_name}?`,
      needsReason: false,
      buttonText: 'Reactivate Seller',
      buttonVariant: 'primary'
    }
  };

  const { title, message, needsReason, buttonText, buttonVariant } = config[action];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{title}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]" disabled={isLoading}>✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">{message}</p>
          {error && (
            <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444] rounded text-[#EF4444] text-sm">
              {error}
            </div>
          )}
          {needsReason && (
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                rows="3"
                placeholder="Provide a reason..."
                disabled={isLoading}
              />
            </div>
          )}
          {!needsReason && (
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Notes (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                rows="3"
                placeholder="Add any notes..."
                disabled={isLoading}
              />
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant={buttonVariant}
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
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