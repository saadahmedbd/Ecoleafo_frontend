import React, { useState } from 'react';
import { Search, UserPlus, Eye, Edit, Trash2, Shield } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AdminManagementPage() {
  usePageTitle('Admin Management');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const admins = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@admin.com',
      role: 'Super Admin',
      department: 'Management',
      status: 'Active',
      lastLogin: '2024-01-30 10:45 AM',
      permissions: ['All Access'],
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@admin.com',
      role: 'Admin',
      department: 'Operations',
      status: 'Active',
      lastLogin: '2024-01-30 09:30 AM',
      permissions: ['Products', 'Orders', 'Reports'],
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@admin.com',
      role: 'Admin',
      department: 'Customer Support',
      status: 'Active',
      lastLogin: '2024-01-29 05:20 PM',
      permissions: ['Orders', 'Reviews', 'Support'],
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@admin.com',
      role: 'Admin',
      department: 'Finance',
      status: 'Active',
      lastLogin: '2024-01-29 03:15 PM',
      permissions: ['Earnings', 'Payouts', 'Reports'],
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david.w@admin.com',
      role: 'Admin',
      department: 'Marketing',
      status: 'Inactive',
      lastLogin: '2024-01-25 11:00 AM',
      permissions: ['Products', 'Reports', 'SEO'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Admin Management</h1>
          <p className="text-[#666666]">Manage admin users and their permissions</p>
        </div>
        <Button variant="primary" onClick={() => setShowInviteModal(true)}>
          <UserPlus size={18} />
          Invite Admin
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Department</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Last Login</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr 
                  key={admin.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                  } hover:bg-[#F5BABB]/20 transition-colors`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#064232] rounded-full flex items-center justify-center text-white">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-[#1A1A1A]">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{admin.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {admin.role === 'Super Admin' && <Shield size={16} className="text-[#F59E0B]" />}
                      <span className="text-[#1A1A1A]">{admin.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{admin.department}</td>
                  <td className="px-6 py-4">
                    <StatusBadge 
                      status={admin.status} 
                      type="approval" 
                    />
                  </td>
                  <td className="px-6 py-4 text-[#666666] text-sm">{admin.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-[#064232] hover:bg-[#064232]/10 rounded transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Admin Modal */}
      {showInviteModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="bg-[#064232] text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h3>Invite New Admin</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-white hover:text-[#F5BABB]">
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#666666] mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="admin@example.com"
                      className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Role</label>
                    <select className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]">
                      <option>Admin</option>
                      <option>Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Department</label>
                    <select className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]">
                      <option>Operations</option>
                      <option>Customer Support</option>
                      <option>Finance</option>
                      <option>Marketing</option>
                      <option>Management</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#666666] mb-2">Permissions</label>
                    <div className="space-y-2 p-4 border border-[#E5E5E5] rounded-md max-h-48 overflow-y-auto">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">Manage Users</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">Manage Products</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">Manage Orders</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">Manage Reviews</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">View Reports</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-[#1A1A1A]">Manage Settings</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="primary" className="flex-1">
                    Send Invitation
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
