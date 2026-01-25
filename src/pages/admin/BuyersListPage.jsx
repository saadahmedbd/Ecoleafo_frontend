import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Ban, RefreshCw, AlertCircle, UserCheck, UserX, CheckCircle, X } from 'lucide-react';
import { useGetAllBuyersQuery, useGetBuyerStatsQuery, useActivateBuyerMutation, useDeactivateBuyerMutation, useSuspendBuyerMutation } from '../../features/UsersManagement/usersManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import StatCard from '../../ui/StatCard';
import { Users, UserCheck as ActiveIcon, UserX as InactiveIcon, Ban as BanIcon } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const ITEMS_PER_PAGE = 10;

export default function BuyersListPage() {
  usePageTitle('Buyers List');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  const [actionModal, setActionModal] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch data
  const { data: buyersData, isLoading, error, refetch } = useGetAllBuyersQuery();
  const { data: statsData } = useGetBuyerStatsQuery();

  // Mutations
  const [activateBuyer, { isLoading: isActivating }] = useActivateBuyerMutation();
  const [deactivateBuyer, { isLoading: isDeactivating }] = useDeactivateBuyerMutation();
  const [suspendBuyer, { isLoading: isSuspending }] = useSuspendBuyerMutation();

  const allBuyers = buyersData?.data || [];

  // Memoize filtered buyers
  const filteredBuyers = useMemo(() => {
    return allBuyers.filter(buyer => {
      const matchesTab = activeTab === 'all' || buyer.status?.toLowerCase() === activeTab;
      const matchesSearch = buyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           buyer.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [allBuyers, activeTab, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBuyers.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBuyers = filteredBuyers.slice(startIndex, endIndex);

  // Tab counts
  const tabs = [
    { id: 'all', label: 'All', count: allBuyers.length },
    { id: 'active', label: 'Active', count: allBuyers.filter(b => b.status?.toLowerCase() === 'active').length },
    { id: 'inactive', label: 'Inactive', count: allBuyers.filter(b => b.status?.toLowerCase() === 'inactive').length },
    { id: 'suspended', label: 'Suspended', count: allBuyers.filter(b => b.status?.toLowerCase() === 'suspended').length },
  ];

  // Reset to page 1 when tab or search changes
  React.useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle buyer actions
  const handleActivate = async (buyerId) => {
    try {
      await activateBuyer({ buyerId, notes: 'Activated by admin' }).unwrap();
      setActionModal(null);
      refetch();
      showToast('Buyer activated successfully', 'success');
    } catch (error) {
      console.error('Failed to activate buyer:', error);
      const errorMsg = error?.data?.message || 'Failed to activate buyer';
      showToast(errorMsg, 'error');
    }
  };

  const handleDeactivate = async (buyerId, reason) => {
    try {
      await deactivateBuyer({ buyerId, reason }).unwrap();
      setActionModal(null);
      refetch();
      showToast('Buyer deactivated successfully', 'success');
    } catch (error) {
      console.error('Failed to deactivate buyer:', error);
      const errorMsg = error?.data?.message || 'Failed to deactivate buyer';
      showToast(errorMsg, 'error');
    }
  };

  const handleSuspend = async (buyerId, reason) => {
    try {
      await suspendBuyer({ buyerId, reason }).unwrap();
      setActionModal(null);
      refetch();
      showToast('Buyer suspended successfully', 'success');
    } catch (error) {
      console.error('Failed to suspend buyer:', error);
      const errorMsg = error?.data?.message || 'Failed to suspend buyer';
      showToast(errorMsg, 'error');
    }
  };

  // Select/deselect buyers
  const toggleSelectBuyer = (buyerId) => {
    setSelectedBuyers(prev =>
      prev.includes(buyerId)
        ? prev.filter(id => id !== buyerId)
        : [...prev, buyerId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBuyers.length === paginatedBuyers.length) {
      setSelectedBuyers([]);
    } else {
      setSelectedBuyers(paginatedBuyers.map(b => b.id));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load buyers</h3>
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
        <div className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success'
            ? 'bg-[#10B981] text-white'
            : 'bg-[#EF4444] text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Buyer Management</h1>
          <p className="text-[#666666]">Manage and monitor all buyers on the platform</p>
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
            title="Total Buyers"
            value={statsData.data.total_buyers?.toString() || '0'}
            icon={Users}
            accentColor="sage"
          />
          <StatCard
            title="Active Buyers"
            value={statsData.data.active_buyers?.toString() || '0'}
            icon={ActiveIcon}
            accentColor="green"
          />
          <StatCard
            title="Inactive Buyers"
            value={statsData.data.inactive_buyers?.toString() || '0'}
            icon={InactiveIcon}
            accentColor="orange"
          />
          <StatCard
            title="Suspended"
            value={statsData.data.suspended_buyers?.toString() || '0'}
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
            placeholder="Search by name or email..."
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
        ) : filteredBuyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#666666]">No buyers found</p>
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
                        checked={selectedBuyers.length === paginatedBuyers.length && paginatedBuyers.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left px-6 py-4">Buyer</th>
                    <th className="text-left px-6 py-4">Email</th>
                    <th className="text-left px-6 py-4">Status</th>
                    <th className="text-left px-6 py-4">Total Orders</th>
                    <th className="text-left px-6 py-4">Total Spent</th>
                    <th className="text-left px-6 py-4">Join Date</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBuyers.map((buyer, index) => (
                    <tr
                      key={buyer.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                      } hover:bg-[#F5BABB]/20 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedBuyers.includes(buyer.id)}
                          onChange={() => toggleSelectBuyer(buyer.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {buyer.avatar_url ? (
                            <img
                              src={buyer.avatar_url}
                              alt={buyer.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#064232] rounded-full flex items-center justify-center text-white font-semibold">
                              {buyer.name?.charAt(0) || 'B'}
                            </div>
                          )}
                          <span className="text-[#1A1A1A]">{buyer.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#666666]">{buyer.email || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={buyer.status || 'active'} type="buyer" />
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A]">{buyer.total_orders || 0}</td>
                      <td className="px-6 py-4 text-[#1A1A1A]">
                        ${parseFloat(buyer.total_spent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-[#666666]">
                        {buyer.created_at ? new Date(buyer.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/buyers/${buyer.id}`}>
                            <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                              <Eye size={18} />
                            </button>
                          </Link>
                          {buyer.status?.toLowerCase() === 'active' && (
                            <>
                              <button
                                onClick={() => setActionModal({ type: 'deactivate', buyer })}
                                className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded transition-colors"
                              >
                                <UserX size={18} />
                              </button>
                              <button
                                onClick={() => setActionModal({ type: 'suspend', buyer })}
                                className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors"
                              >
                                <Ban size={18} />
                              </button>
                            </>
                          )}
                          {(buyer.status?.toLowerCase() === 'inactive' || buyer.status?.toLowerCase() === 'suspended') && (
                            <button
                              onClick={() => setActionModal({ type: 'activate', buyer })}
                              className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors"
                            >
                              <UserCheck size={18} />
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
              <p className="text-[#666666] text-sm">
                Showing {filteredBuyers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredBuyers.length)} of {filteredBuyers.length} buyers
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || totalPages === 0}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {totalPages <= 5 
                  ? Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded text-sm ${
                          page === p ? 'bg-[#064232] text-white' : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                        }`}
                      >
                        {p}
                      </button>
                    ))
                  : (
                    <>
                      {page > 2 && (
                        <button onClick={() => setPage(1)} className="px-3 py-1 rounded text-sm border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]">1</button>
                      )}
                      {page > 3 && <span className="px-2">...</span>}
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => Math.max(1, page - 1 + i)).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 rounded text-sm ${
                            page === p ? 'bg-[#064232] text-white' : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      {page < totalPages - 2 && <span className="px-2">...</span>}
                      {page < totalPages - 1 && (
                        <button onClick={() => setPage(totalPages)} className="px-3 py-1 rounded text-sm border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]">{totalPages}</button>
                      )}
                    </>
                  )
                }
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
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
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
          onSuspend={handleSuspend}
          isLoading={isActivating || isDeactivating || isSuspending}
        />
      )}
    </div>
  );
}

// Action Modal Component
function ActionModal({ action, onClose, onActivate, onDeactivate, onSuspend, isLoading }) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    const { type, buyer } = action;
    switch (type) {
      case 'activate':
        onActivate(buyer.id);
        break;
      case 'deactivate':
        onDeactivate(buyer.id, reason);
        break;
      case 'suspend':
        onSuspend(buyer.id, reason);
        break;
      default:
        break;
    }
  };

  const titles = {
    activate: 'Activate Buyer',
    deactivate: 'Deactivate Buyer',
    suspend: 'Suspend Buyer'
  };

  const needsReason = action.type === 'deactivate' || action.type === 'suspend';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3>{titles[action.type]}</h3>
          <button onClick={onClose} className="text-white hover:text-[#F5BABB]">✕</button>
        </div>
        <div className="p-6">
          <p className="text-[#666666] mb-4">
            Are you sure you want to {action.type} <span className="text-[#1A1A1A] font-semibold">{action.buyer.name}</span>?
          </p>
          {needsReason && (
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Reason *</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87]"
                rows="3"
                placeholder="Provide a reason..."
              />
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="primary"
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