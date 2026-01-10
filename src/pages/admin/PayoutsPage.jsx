
import React, { useState } from 'react';
import {
  Wallet, CheckCircle, XCircle, Clock, Search, RefreshCw,
  AlertCircle, Eye, DollarSign, TrendingUp, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useGetPendingPayoutsQuery,
  useGetPayoutHistoryQuery,
  useProcessPayoutMutation,
  useRejectPayoutMutation,
} from '../../features/EarningsCommission/earningsCommissionApi';
import Button from '../../ui/Button';
import StatusBadge from '../../ui/StatusBadge';

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModal, setActionModal] = useState(null);
  const [limit] = useState(10);

  // Fetch payouts based on tab
  const { data: pendingData, isLoading: pendingLoading, refetch: refetchPending } = useGetPendingPayoutsQuery(
    { page: currentPage, limit },
    { skip: activeTab !== 'pending' }
  );

  const { data: historyData, isLoading: historyLoading, refetch: refetchHistory } = useGetPayoutHistoryQuery(
    { page: currentPage, limit },
    { skip: activeTab !== 'history' }
  );

  // Mutations
  const [processPayout, { isLoading: isProcessing }] = useProcessPayoutMutation();
  const [rejectPayout, { isLoading: isRejecting }] = useRejectPayoutMutation();

  // Extract data
  const payouts = activeTab === 'pending' 
    ? pendingData?.data || []
    : historyData?.data || [];
  
  const pagination = activeTab === 'pending'
    ? pendingData?.pagination || {}
    : historyData?.pagination || {};

  const isLoading = activeTab === 'pending' ? pendingLoading : historyLoading;

  // Filter payouts by search
  const filteredPayouts = payouts.filter(payout => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      payout.seller_name?.toLowerCase().includes(query) ||
      payout.id?.toString().includes(query) ||
      payout.transaction_id?.toLowerCase().includes(query)
    );
  });

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle process payout
  const handleProcessPayout = async (payout) => {
    const transactionId = prompt('Enter transaction ID:');
    if (!transactionId) return;

    const adminNote = prompt('Enter admin note (optional):') || '';

    try {
      await processPayout({
        id: payout.id,
        transaction_id: transactionId,
        admin_note: adminNote,
      }).unwrap();
      setActionModal(null);
      refetchPending();
      refetchHistory();
      alert('Payout processed successfully');
    } catch (error) {
      alert(error?.data?.message || 'Failed to process payout');
    }
  };

  // Handle reject payout
  const handleRejectPayout = async (payout) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await rejectPayout({
        id: payout.id,
        rejection_reason: reason,
      }).unwrap();
      setActionModal(null);
      refetchPending();
      refetchHistory();
      alert('Payout rejected');
    } catch (error) {
      alert(error?.data?.message || 'Failed to reject payout');
    }
  };

  // Tabs
  const tabs = [
    { id: 'pending', label: 'Pending', icon: Clock, count: pendingData?.pagination?.total || 0 },
    { id: 'history', label: 'History', icon: Calendar, count: historyData?.pagination?.total || 0 },
  ];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination
  const totalPages = pagination.total_pages || 1;

  // Loading state
  if (isLoading && payouts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Payout Management</h1>
          <p className="text-[#666666]">Process seller payout requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            refetchPending();
            refetchHistory();
          }}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Link to="/admin/earnings">
            <Button variant="outline">
              <DollarSign size={18} />
              View Earnings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Pending Payouts</p>
            <Clock className="text-[#F59E0B]" size={20} />
          </div>
          <p className="text-[#F59E0B] text-3xl font-bold">
            {pendingData?.pagination?.total || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Total Amount</p>
            <Wallet className="text-[#568F87]" size={20} />
          </div>
          <p className="text-[#568F87] text-3xl font-bold">
            {formatCurrency(
              pendingData?.data?.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0) || 0
            )}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Processed Today</p>
            <CheckCircle className="text-[#10B981]" size={20} />
          </div>
          <p className="text-[#10B981] text-3xl font-bold">
            {historyData?.data?.filter(p => {
              if (!p.processed_at) return false;
              const today = new Date().toDateString();
              return new Date(p.processed_at).toDateString() === today;
            }).length || 0}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#064232] text-white'
                    : 'text-[#666666] hover:bg-[#FFF5F2]'
                }`}
              >
                <Icon size={18} />
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search by seller name, payout ID, or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="mx-auto mb-4 text-[#E5E5E5]" size={64} />
            <h3 className="text-[#1A1A1A] mb-2">No payouts found</h3>
            <p className="text-[#666666]">
              {searchQuery ? 'Try adjusting your search terms' : 'No payout requests at the moment'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#064232] text-white">
                  <tr>
                    <th className="text-left px-6 py-4">ID</th>
                    <th className="text-left px-6 py-4">Seller</th>
                    <th className="text-left px-6 py-4">Amount</th>
                    <th className="text-left px-6 py-4">Payment Method</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Requested</th>
                    {activeTab === 'history' && (
                      <>
                        <th className="text-left px-6 py-4">Processed</th>
                        <th className="text-left px-6 py-4">Transaction ID</th>
                      </>
                    )}
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayouts.map((payout, index) => (
                    <tr 
                      key={payout.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                      } hover:bg-[#F5BABB]/20 transition-colors`}
                    >
                      <td className="px-6 py-4 text-[#1A1A1A] font-medium">
                        #{payout.id}
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/sellers/${payout.seller_id}`}
                          className="text-[#568F87] hover:underline"
                        >
                          {payout.seller_name || 'Unknown'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-[#064232] font-bold">
                        {formatCurrency(payout.amount)}
                      </td>
                      <td className="px-6 py-4 text-[#666666]">
                        {payout.payment_method?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={payout.status} type="payment" />
                      </td>
                      <td className="px-6 py-4 text-[#666666]">
                        {formatDate(payout.requested_at)}
                      </td>
                      {activeTab === 'history' && (
                        <>
                          <td className="px-6 py-4 text-[#666666]">
                            {formatDate(payout.processed_at || payout.completed_at)}
                          </td>
                          <td className="px-6 py-4 text-[#1A1A1A] font-mono text-sm">
                            {payout.transaction_id || 'N/A'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActionModal({ type: 'view', payout })}
                            className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                          {activeTab === 'pending' && (
                            <>
                              <button
                                onClick={() => handleProcessPayout(payout)}
                                disabled={isProcessing}
                                className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors disabled:opacity-50"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleRejectPayout(payout)}
                                disabled={isRejecting}
                                className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors disabled:opacity-50"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
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
                  Showing {Math.min((currentPage - 1) * limit + 1, pagination.total)} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} payouts
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
          </>
        )}
      </div>

      {/* View Modal */}
      {actionModal?.type === 'view' && (
        <PayoutDetailsModal
          payout={actionModal.payout}
          onClose={() => setActionModal(null)}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

// Payout Details Modal
function PayoutDetailsModal({ payout, onClose, formatCurrency, formatDate }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0">
          <h3>Payout Details #{payout.id}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-[#FFF5F2] rounded-lg">
            <span className="text-[#666666]">Status</span>
            <StatusBadge status={payout.status} type="payment" />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <p className="text-[#666666] mb-1">Amount</p>
              <p className="text-[#064232] text-2xl font-bold">{formatCurrency(payout.amount)}</p>
            </div>
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <p className="text-[#666666] mb-1">Payment Method</p>
              <p className="text-[#1A1A1A]">{payout.payment_method?.replace(/_/g, ' ').toUpperCase()}</p>
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <h4 className="text-[#1A1A1A] mb-3">Seller Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Seller Name:</span>
                <span className="text-[#1A1A1A]">{payout.seller_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Seller ID:</span>
                <span className="text-[#1A1A1A]">#{payout.seller_id}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {payout.bank_name && (
            <div>
              <h4 className="text-[#1A1A1A] mb-3">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Bank Name:</span>
                  <span className="text-[#1A1A1A]">{payout.bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Account Number:</span>
                  <span className="text-[#1A1A1A] font-mono">{payout.account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Account Name:</span>
                  <span className="text-[#1A1A1A]">{payout.account_name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="text-[#1A1A1A] mb-3">Timeline</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#666666]">Requested:</span>
                <span className="text-[#1A1A1A]">{formatDate(payout.requested_at)}</span>
              </div>
              {payout.processed_at && (
                <div className="flex justify-between">
                  <span className="text-[#666666]">Processed:</span>
                  <span className="text-[#1A1A1A]">{formatDate(payout.processed_at)}</span>
                </div>
              )}
              {payout.completed_at && (
                <div className="flex justify-between">
                  <span className="text-[#666666]">Completed:</span>
                  <span className="text-[#1A1A1A]">{formatDate(payout.completed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction ID */}
          {payout.transaction_id && (
            <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg">
              <p className="text-[#666666] mb-1">Transaction ID</p>
              <p className="text-[#10B981] font-mono">{payout.transaction_id}</p>
            </div>
          )}

          {/* Notes */}
          {(payout.request_note || payout.admin_note || payout.rejection_reason) && (
            <div>
              <h4 className="text-[#1A1A1A] mb-3">Notes</h4>
              <div className="space-y-2">
                {payout.request_note && (
                  <div className="p-3 bg-[#FFF5F2] rounded-lg">
                    <p className="text-[#666666] text-sm mb-1">Seller Note:</p>
                    <p className="text-[#1A1A1A]">{payout.request_note}</p>
                  </div>
                )}
                {payout.admin_note && (
                  <div className="p-3 bg-[#10B981]/10 rounded-lg">
                    <p className="text-[#666666] text-sm mb-1">Admin Note:</p>
                    <p className="text-[#1A1A1A]">{payout.admin_note}</p>
                  </div>
                )}
                {payout.rejection_reason && (
                  <div className="p-3 bg-[#EF4444]/10 rounded-lg">
                    <p className="text-[#666666] text-sm mb-1">Rejection Reason:</p>
                    <p className="text-[#EF4444]">{payout.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close Button */}
          <Button variant="outline" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}