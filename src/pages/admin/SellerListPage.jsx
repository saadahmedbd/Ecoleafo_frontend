import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Check, X, Ban } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function SellersListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sellers = [
    {
      id: 1,
      storeName: 'Tech Store Pro',
      logo: '🏪',
      ownerEmail: 'owner@techstore.com',
      status: 'Approved',
      totalSales: '$45,230',
      rating: 4.8,
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      storeName: 'Fashion Hub',
      logo: '👗',
      ownerEmail: 'contact@fashionhub.com',
      status: 'Pending',
      totalSales: '$0',
      rating: 0,
      joinDate: '2024-01-28',
    },
    {
      id: 3,
      storeName: 'Home Essentials',
      logo: '🏠',
      ownerEmail: 'info@homeessentials.com',
      status: 'Approved',
      totalSales: '$32,140',
      rating: 4.6,
      joinDate: '2024-01-10',
    },
    {
      id: 4,
      storeName: 'Sports Gear',
      logo: '⚽',
      ownerEmail: 'hello@sportsgear.com',
      status: 'Suspended',
      totalSales: '$28,750',
      rating: 3.9,
      joinDate: '2024-01-05',
    },
    {
      id: 5,
      storeName: 'Beauty World',
      logo: '💄',
      ownerEmail: 'support@beautyworld.com',
      status: 'Approved',
      totalSales: '$25,600',
      rating: 4.7,
      joinDate: '2024-01-20',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All', count: sellers.length },
    { id: 'pending', label: 'Pending', count: sellers.filter(s => s.status === 'Pending').length },
    { id: 'approved', label: 'Approved', count: sellers.filter(s => s.status === 'Approved').length },
    { id: 'suspended', label: 'Suspended', count: sellers.filter(s => s.status === 'Suspended').length },
  ];

  const filteredSellers = sellers.filter(seller => {
    const matchesTab = activeTab === 'all' || seller.status.toLowerCase() === activeTab;
    const matchesSearch = seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-[#F59E0B]' : 'text-[#E5E5E5]'}>
            ★
          </span>
        ))}
        <span className="text-[#666666] text-sm ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Seller Management</h1>
          <p className="text-[#666666]">Manage and monitor all sellers on the platform</p>
        </div>
        <Button variant="secondary">
          <Download size={18} />
          Export
        </Button>
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-6 py-4">Store</th>
                <th className="text-left px-6 py-4">Owner Email</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Total Sales</th>
                <th className="text-left px-6 py-4">Rating</th>
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
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#064232] rounded-lg flex items-center justify-center text-xl">
                        {seller.logo}
                      </div>
                      <span className="text-[#1A1A1A]">{seller.storeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{seller.ownerEmail}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={seller.status} type="approval" />
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{seller.totalSales}</td>
                  <td className="px-6 py-4">
                    {seller.rating > 0 ? renderStars(seller.rating) : (
                      <span className="text-[#666666]">No ratings</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{seller.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/sellers/${seller.id}`}>
                        <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                          <Eye size={18} />
                        </button>
                      </Link>
                      {seller.status === 'Pending' && (
                        <>
                          <button className="p-2 text-[#10B981] hover:bg-[#10B981]/10 rounded transition-colors">
                            <Check size={18} />
                          </button>
                          <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      )}
                      {seller.status === 'Approved' && (
                        <button className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded transition-colors">
                          <Ban size={18} />
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
          <p className="text-[#666666]">Showing {filteredSellers.length} of {sellers.length} sellers</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">
              Previous
            </button>
            <button className="px-3 py-1 bg-[#064232] text-white rounded">1</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">2</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">3</button>
            <button className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
