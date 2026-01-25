import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Check, X, Ban, RefreshCw, AlertCircle, AlertTriangle } from 'lucide-react';
import { useGetAllSellersQuery, useGetSellerStatsQuery, useApproveSellerMutation, useRejectSellerMutation, useSuspendSellerMutation, useReactivateSellerMutation } from '../../features/UsersManagement/usersManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import StatCard from '../../ui/StatCard';
import { Store, CheckCircle, Clock, Ban as BanIcon } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-[#10B981]' : type === 'error' ? 'bg-[#EF4444]' : 'bg-[#F59E0B]';
  const Icon = type === 'success' ? Check : type === 'error' ? AlertTriangle : AlertCircle;

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50`}>
      <Icon size={20} />
      <span>{message}</span>
    </div>
  );
};

export default function SellersListPage() {
  usePageTitle('Sellers List');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch data
  const { data: sellersData, isLoading, error, refetch } = useGetAllSellersQuery({ page, limit: 10 });
  const { data: statsData } = useGetSellerStatsQuery();

  // Mutations
  const [approveSeller, { isLoading: isApproving }] = useApproveSellerMutation();
  const [rejectSeller, { isLoading: isRejecting }] = useRejectSellerMutation();
  const [suspendSeller, { isLoading: isSuspending }] = useSuspendSellerMutation();
  const [reactivateSeller, { isLoading: isReactivating }] = useReactivateSellerMutation();

  const sellers = sellersData?.data || [];
  const pagination = sellersData?.pagination || {};

  // Tab counts from stats
  const tabs = [
    { id: 'all', label: 'All', count: statsData?.data?.total_sellers || 0 },
    { id: 'pending', label: 'Pending', count: statsData?.data?.pending_sellers || 0 },
    { id: 'approved', label: 'Approved', count: statsData?.data?.approved_sellers || 0 },
    { id: 'suspended', label: 'Suspended', count: statsData?.data?.suspended_sellers || 0 },
  ];

  // Filter sellers by tab
  const filteredSellers = sellers.filter(seller => {
    const matchesTab = activeTab === 'all' || seller.approval_status?.toLowerCase() === activeTab;
    const matchesSearch = seller.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.business_email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle seller actions
  const handleApprove = async (sellerId) => {
    try {
      await approveSeller({ sellerId, notes: 'Approved by admin' }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller approved successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to approve seller:', error);
      setToast({ message: error?.data?.message || 'Failed to approve seller', type: 'error' });
    }
  };

  const handleReject = async (sellerId, reason) => {
    try {
      await rejectSeller({ sellerId, reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller rejected successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to reject seller:', error);
      setToast({ message: error?.data?.message || 'Failed to reject seller', type: 'error' });
    }
  };

  const handleSuspend = async (sellerId, reason) => {
    try {
      await suspendSeller({ sellerId, reason }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller suspended successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to suspend seller:', error);
      setToast({ message: error?.data?.message || 'Failed to suspend seller', type: 'error' });
    }
  };

  const handleReactivate = async (sellerId) => {
    try {
      await reactivateSeller({ sellerId, notes: 'Reactivated by admin' }).unwrap();
      setActionModal(null);
      setToast({ message: 'Seller reactivated successfully!', type: 'success' });
      setTimeout(() => refetch(), 500);
    } catch (error) {
      console.error('Failed to reactivate seller:', error);
      setToast({ message: error?.data?.message || 'Failed to reactivate seller', type: 'error' });
    }
  };

  // Select/deselect sellers
  const toggleSelectSeller = (sellerId) => {
    setSelectedSellers(prev =>
      prev.includes(sellerId)
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSellers.length === filteredSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(filteredSellers.map(s => s.id));
    }
  };

  const renderStars = (rating) => {
    const ratingNum = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= ratingNum ? 'text-[#F59E0B]' : 'text-[#E5E5E5]'}>
            ★
          </span>
        ))}
        <span className="text-[#666666] text-sm ml-1">({ratingNum.toFixed(1)})</span>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load sellers</h3>
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
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Seller Management</h1>
          <p className="text-[#666666]">Manage and monitor all sellers on the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Button variant="secondary">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statsData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Total Sellers"
            value={statsData.data.total_sellers?.toString() || '0'}
            icon={Store}
            accentColor="sage"
          />
          <StatCard
            title="Pending Approval"
            value={statsData.data.pending_sellers?.toString() || '0'}
            icon={Clock}
            accentColor="orange"
          />
          <StatCard
            title="Approved"
            value={statsData.data.approved_sellers?.toString() || '0'}
            icon={CheckCircle}
            accentColor="green"
          />
          <StatCard
            title="Suspended"
            value={statsData.data.suspended_sellers?.toString() || '0'}
            icon={BanIcon}
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
            placeholder="Search by store name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-[#568F87]" size={32} />
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#666666]">No sellers found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#064232] text-white">
                  <tr>
                    <th className="text-left px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedSellers.length === filteredSellers.length && filteredSellers.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left px-6 py-4">Store</th>
                    <th className="text-left px-6 py-4">Owner Email</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Join Date</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((seller, index) => (
                    <tr
                      key={seller.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                      } hover:bg-[#F5BABB]/20 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedSellers.includes(seller.id)}
                          onChange={() => toggleSelectSeller(seller.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {seller.store_logo_url ? (
                            <img
                              src={seller.store_logo_url}
                              alt={seller.store_name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#064232] rounded-lg flex items-center justify-center text-white font-semibold">
                              {seller.store_name?.charAt(0) || 'S'}
                            </div>
                          )}
                          <span className="text-[#1A1A1A]">{seller.store_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#666666]">{seller.business_email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={seller.approval_status || 'pending'} type="approval" />
                      </td>
                      <td className="px-6 py-4 text-[#666666]">
                        {seller.created_at ? new Date(seller.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/sellers/${seller.id}`}>
                            <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                              <Eye size={18} />
                            </button>
                          </Link>
                          {seller.approval_status?.toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => setActionModal({ type: 'approve', seller })}
                                className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => setActionModal({ type: 'reject', seller })}
                                className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          {seller.approval_status?.toLowerCase() === 'approved' && (
                            <button
                              onClick={() => setActionModal({ type: 'suspend', seller })}
                              className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                            >
                              <Ban size={18} />
                            </button>
                          )}
                          {seller.approval_status?.toLowerCase() === 'suspended' && (
                            <button
                              onClick={() => setActionModal({ type: 'reactivate', seller })}
                              className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                            >
                              <RefreshCw size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
              <p className="text-[#666666]">
                Showing page {pagination.current_page || 1} of {pagination.total_pages || 1} ({pagination.total_items || 0} total sellers)
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(pagination.total_pages || 1, 5) }, (_, i) => {
                  const startPage = Math.max(1, page - 2);
                  return startPage + i;
                }).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded ${
                      page === p ? 'bg-[#064232] text-white' : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={page >= (pagination.total_pages || 1)}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (
        <ActionModal
          action={actionModal}
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
function ActionModal({ action, onClose, onApprove, onReject, onSuspend, onReactivate, isLoading }) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const { type, seller } = action;
    
    if ((type === 'reject' || type === 'suspend') && !reason.trim()) {
      setError('Please provide a reason');
      return;
    }

    switch (type) {
      case 'approve':
        onApprove(seller.id);
        break;
      case 'reject':
        onReject(seller.id, reason);
        break;
      case 'suspend':
        onSuspend(seller.id, reason);
        break;
      case 'reactivate':
        onReactivate(seller.id);
        break;
    }
  };

  const titles = {
    approve: 'Approve Seller',
    reject: 'Reject Seller',
    suspend: 'Suspend Seller',
    reactivate: 'Reactivate Seller'
  };

  const needsReason = action.type === 'reject' || action.type === 'suspend';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{titles[action.type]}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]" disabled={isLoading}>✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">
            Are you sure you want to {action.type} <span className="text-[#1A1A1A] font-semibold">{action.seller.store_name}</span>?
          </p>
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
          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `Confirm ${action.type}`}
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