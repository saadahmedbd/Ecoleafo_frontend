import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, CheckCircle, AlertCircle, Ban, UserX, UserCheck } from 'lucide-react';
import { useGetBuyerByIdQuery, useActivateBuyerMutation, useDeactivateBuyerMutation, useSuspendBuyerMutation } from '../../features/UsersManagement/usersManagementApi';
import Button from '../../ui/Button';
import StatusBadge from '../../ui/StatusBadge';

export default function BuyerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: buyerData, isLoading, error, refetch } = useGetBuyerByIdQuery(id);
  const [actionModal, setActionModal] = useState(null);

  // Mutations
  const [activateBuyer, { isLoading: isActivating }] = useActivateBuyerMutation();
  const [deactivateBuyer, { isLoading: isDeactivating }] = useDeactivateBuyerMutation();
  const [suspendBuyer, { isLoading: isSuspending }] = useSuspendBuyerMutation();

  const buyer = buyerData?.data;

  const handleActivate = async () => {
    try {
      await activateBuyer({ buyerId: id, notes: 'Activated by admin' }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to activate buyer:', error);
      alert('Failed to activate buyer');
    }
  };

  const handleDeactivate = async (reason) => {
    try {
      await deactivateBuyer({ buyerId: id, reason }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to deactivate buyer:', error);
      alert('Failed to deactivate buyer');
    }
  };

  const handleSuspend = async (reason) => {
    try {
      await suspendBuyer({ buyerId: id, reason }).unwrap();
      setActionModal(null);
      refetch();
    } catch (error) {
      console.error('Failed to suspend buyer:', error);
      alert('Failed to suspend buyer');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#064232]"></div>
      </div>
    );
  }

  if (error || !buyer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="text-[#EF4444] mb-4" size={48} />
        <h2 className="text-[#1A1A1A] text-xl font-semibold mb-2">Failed to load buyer details</h2>
        <p className="text-[#666666] mb-6">{error?.message || 'Buyer not found'}</p>
        <Button onClick={() => navigate('/admin/users')}>
          <ArrowLeft size={18} />
          Back to Buyers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-[#F5BABB]/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-[#568F87]" size={24} />
          </button>
          <div>
            <h1 className="text-[#1A1A1A] text-2xl font-bold">Buyer Details</h1>
            <p className="text-[#666666]">ID: {buyer.id}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {buyer.status?.toLowerCase() === 'active' && (
            <>
              <button
                onClick={() => setActionModal({ type: 'deactivate', buyer })}
                className="flex items-center gap-2 px-4 py-2 text-[#F59E0B] border border-[#F59E0B] rounded-lg hover:bg-[#F59E0B]/10 transition-colors"
              >
                <UserX size={18} />
                Deactivate
              </button>
              <button
                onClick={() => setActionModal({ type: 'suspend', buyer })}
                className="flex items-center gap-2 px-4 py-2 text-[#EF4444] border border-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors"
              >
                <Ban size={18} />
                Suspend
              </button>
            </>
          )}
          {(buyer.status?.toLowerCase() === 'inactive' || buyer.status?.toLowerCase() === 'suspended') && (
            <button
              onClick={() => setActionModal({ type: 'activate', buyer })}
              className="flex items-center gap-2 px-4 py-2 text-[#10B981] border border-[#10B981] rounded-lg hover:bg-[#10B981]/10 transition-colors"
            >
              <UserCheck size={18} />
              Activate
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] text-lg font-semibold mb-4">Status & Verification</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Account Status</span>
                <StatusBadge status={buyer.status} type="buyer" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Active Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  buyer.is_active
                    ? 'bg-[#10B981]/10 text-[#10B981]'
                    : 'bg-[#EF4444]/10 text-[#EF4444]'
                }`}>
                  {buyer.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#666666]">Email Verified</span>
                <div className="flex items-center gap-2">
                  {buyer.email_verified ? (
                    <>
                      <CheckCircle className="text-[#10B981]" size={20} />
                      <span className="text-[#10B981]">Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-[#F59E0B]" size={20} />
                      <span className="text-[#F59E0B]">Not Verified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="text-[#568F87] mt-1" size={20} />
                <div>
                  <p className="text-[#666666] text-sm">Phone Number</p>
                  <p className="text-[#1A1A1A] font-medium">{buyer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <h2 className="text-[#1A1A1A] text-lg font-semibold mb-4">Address Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-[#568F87] mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-[#666666] text-sm">Default Address</p>
                  <p className="text-[#1A1A1A] font-medium">{buyer.default_address}</p>
                </div>
              </div>
              {buyer.addresses && Array.isArray(buyer.addresses) && buyer.addresses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                  <p className="text-[#666666] text-sm mb-3">All Addresses ({buyer.addresses.length})</p>
                  <div className="space-y-2">
                    {buyer.addresses.map((address, index) => (
                      <div key={index} className="p-3 bg-[#FFF5F2] rounded-md">
                        <p className="text-[#1A1A1A] text-sm font-medium">
                          {address.full_name || 'Address ' + (index + 1)}
                        </p>
                        <p className="text-[#666666] text-sm mt-1">
                          {[address.address_line_1, address.address_line_2].filter(Boolean).join(', ')}
                        </p>
                        <p className="text-[#666666] text-sm">
                          {[address.city, address.state, address.postal_code, address.country].filter(Boolean).join(', ')}
                        </p>
                        <p className="text-[#666666] text-sm mt-1">{address.phone}</p>
                        {address.is_default && (
                          <span className="inline-block mt-2 px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Orders Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#064232]/10 rounded-lg">
                <ShoppingBag className="text-[#064232]" size={24} />
              </div>
              <div>
                <p className="text-[#666666] text-sm">Total Orders</p>
                <p className="text-[#1A1A1A] text-2xl font-bold">{buyer.total_orders}</p>
              </div>
            </div>
          </div>

          {/* Spending Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#10B981]/10 rounded-lg">
                <DollarSign className="text-[#10B981]" size={24} />
              </div>
              <div>
                <p className="text-[#666666] text-sm">Total Spent</p>
                <p className="text-[#1A1A1A] text-2xl font-bold">${parseFloat(buyer.total_spent || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Dates Card */}
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6 space-y-4">
            <div>
              <p className="text-[#666666] text-sm mb-1">Joined Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="text-[#568F87]" size={18} />
                <p className="text-[#1A1A1A] font-medium">
                  {buyer.created_at ? new Date(buyer.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="border-t border-[#E5E5E5] pt-4">
              <p className="text-[#666666] text-sm mb-1">Last Updated</p>
              <p className="text-[#1A1A1A] font-medium text-sm">
                {buyer.updated_at ? new Date(buyer.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
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
    const { type } = action;
    switch (type) {
      case 'activate':
        onActivate();
        break;
      case 'deactivate':
        onDeactivate(reason);
        break;
      case 'suspend':
        onSuspend(reason);
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
            Are you sure you want to {action.type} <span className="text-[#1A1A1A] font-semibold">{action.buyer.id}</span>?
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