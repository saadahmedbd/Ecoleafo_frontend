
import React, { useState } from 'react';
import {
  Mail,
  Plus,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  Trash2,
  AlertCircle,
  Send
} from 'lucide-react';
import {
  useGetPendingInvitationsQuery,
  useCreateInvitationMutation,
  useCancelInvitationMutation,
} from '@/features/Admin/adminAPI';

export default function AdminInvitationsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'admin',
    department: '',
  });
  const [errors, setErrors] = useState({});

  // API hooks
  const { data: invitations = [], isLoading, error } = useGetPendingInvitationsQuery();
  const [createInvitation, { isLoading: isCreating }] = useCreateInvitationMutation();
  const [cancelInvitation, { isLoading: isCancelling }] = useCancelInvitationMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await createInvitation({
        email: formData.email.trim(),
        role: formData.role,
        department: formData.department.trim(),
      }).unwrap();

      alert('Invitation sent successfully!');
      setShowInviteModal(false);
      setFormData({ email: '', role: 'admin', department: '' });
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.data?.message || 'Failed to send invitation' });
    }
  };

  const handleCancelInvitation = async (id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this invitation?');
    if (!confirmCancel) return;

    try {
      await cancelInvitation(id).unwrap();
      alert('Invitation cancelled successfully');
    } catch (err) {
      alert(err.data?.message || 'Failed to cancel invitation');
    }
  };

  const copyInvitationLink = (token) => {
    const link = `${window.location.origin}/admin/register?token=${token}`;
    navigator.clipboard.writeText(link);
    alert('Invitation link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff < 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#064232] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invitations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold mb-1">Error Loading Invitations</h3>
            <p className="text-red-700 text-sm">{error.data?.message || 'Failed to load invitations'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Invitations</h1>
          <p className="text-sm text-gray-600 mt-1">Manage pending admin invitations</p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Send Invitation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Send className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
              <p className="text-sm text-gray-600">Pending Invitations</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {invitations.filter(inv => !inv.is_used).length}
              </p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {invitations.filter(inv => new Date(inv.expires_at) < new Date()).length}
              </p>
              <p className="text-sm text-gray-600">Expired</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {invitations.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Invitations</h3>
            <p className="text-gray-600 mb-6">Send your first invitation to invite a new admin</p>
            <button
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors"
            >
              <Plus size={20} />
              Send Invitation
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {invitations.map((invitation) => {
              const isExpired = new Date(invitation.expires_at) < new Date();
              
              return (
                <div key={invitation.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Mail className="text-blue-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900">{invitation.email}</p>
                            {isExpired ? (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                Expired
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <span>{invitation.department}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {getTimeRemaining(invitation.expires_at)}
                            </span>
                            <span>Sent {formatDate(invitation.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyInvitationLink(invitation.token)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                        title="Copy invitation link"
                      >
                        <Copy size={16} />
                        <span className="hidden sm:inline">Copy Link</span>
                      </button>
                      <button
                        onClick={() => handleCancelInvitation(invitation.id)}
                        disabled={isCancelling}
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm disabled:opacity-50"
                        title="Cancel invitation"
                      >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Send Admin Invitation</h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@example.com"
                  disabled={isCreating}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87] ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Sales, Marketing"
                  disabled={isCreating}
                />
                {errors.department && (
                  <p className="text-sm text-red-600 mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87]"
                  disabled={isCreating}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The invitation link will expire in 7 days. The invited user will receive an email with instructions.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors disabled:opacity-50 font-medium"
                >
                  {isCreating ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}