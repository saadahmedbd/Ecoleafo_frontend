//sub amdin of application
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  useGetAllAdminsQuery,
  useDeactivateAdminMutation,
  useActivateAdminMutation,
} from '@/features/Admin/adminAPI';
import { useSelector } from 'react-redux';
import { selectUser } from '@/features/auth/authSlice';
import { Link } from 'react-router-dom';

export default function AdminUsersPage() {
  const currentUser = useSelector(selectUser);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  const { data, isLoading, error } = useGetAllAdminsQuery({ page, limit });
  const [deactivateAdmin, { isLoading: isDeactivating }] = useDeactivateAdminMutation();
  const [activateAdmin, { isLoading: isActivating }] = useActivateAdminMutation();

  const admins = data?.admins || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDeactivate = async (adminId) => {
    if (adminId === currentUser?.id) {
      alert('You cannot deactivate your own account');
      return;
    }

    const confirmDeactivate = window.confirm('Are you sure you want to deactivate this admin?');
    if (!confirmDeactivate) return;

    try {
      await deactivateAdmin(adminId).unwrap();
      alert('Admin deactivated successfully');
      setIsMenuOpen(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to deactivate admin');
    }
  };

  const handleActivate = async (adminId) => {
    try {
      await activateAdmin(adminId).unwrap();
      alert('Admin activated successfully');
      setIsMenuOpen(null);
    } catch (err) {
      alert(err.data?.message || 'Failed to activate admin');
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && admin.is_active) ||
                         (filterStatus === 'inactive' && !admin.is_active);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#064232] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admins...</p>
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
            <h3 className="text-red-800 font-semibold mb-1">Error Loading Admins</h3>
            <p className="text-red-700 text-sm">{error.data?.message || 'Failed to load admins'}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-sm text-gray-600 mt-1">Manage admin accounts and permissions</p>
        </div>

        <Link to ="/admin/invitations">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#064232] text-white rounded-lg hover:bg-[#053828] transition-colors font-medium">
          <UserPlus size={20} />
          <span>Invite Admin</span>
        </button>
        </Link>
      </div>
        
        
      

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#568F87]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-gray-500">No admins found</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#064232] rounded-full flex items-center justify-center text-white font-semibold">
                          {admin.full_name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{admin.full_name}</p>
                          <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{admin.department || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Shield size={14} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-600">{admin.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {admin.is_active ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={16} />
                          <span className="text-sm">Active</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <XCircle size={16} />
                          <span className="text-sm">Inactive</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setIsMenuOpen(isMenuOpen === admin.id ? null : admin.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {isMenuOpen === admin.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsMenuOpen(null)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                <Edit size={16} />
                                Edit Profile
                              </button>
                              <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">
                                <Shield size={16} />
                                Manage Permissions
                              </button>
                              <hr className="my-1" />
                              {admin.is_active ? (
                                <button
                                  onClick={() => handleDeactivate(admin.id)}
                                  disabled={isDeactivating}
                                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-sm text-red-600 disabled:opacity-50"
                                >
                                  <XCircle size={16} />
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleActivate(admin.id)}
                                  disabled={isActivating}
                                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-green-50 text-sm text-green-600 disabled:opacity-50"
                                >
                                  <CheckCircle size={16} />
                                  Activate
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredAdmins.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500">No admins found</p>
            </div>
          ) : (
            filteredAdmins.map((admin) => (
              <div key={admin.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#064232] rounded-full flex items-center justify-center text-white font-semibold">
                      {admin.full_name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{admin.full_name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(isMenuOpen === admin.id ? null : admin.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="text-gray-900">{admin.department || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="flex items-center gap-1 text-purple-600 font-medium">
                      <Shield size={14} />
                      {admin.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    {admin.is_active ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle size={14} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} admins
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}