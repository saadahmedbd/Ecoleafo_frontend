import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AllSellerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const limit = 20;

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/sellers/earnings/all?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setEarnings(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [page]);

  const formatCurrency = (amount) => `৳${parseFloat(amount || 0).toFixed(2)}`;
  const totalPages = Math.ceil(total / limit);

  const filteredEarnings = earnings.filter(e => 
    e.seller_name?.toLowerCase().includes(search.toLowerCase()) || 
    e.store_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">All Seller Earnings</h1>
          <p className="text-[#666666]">View earnings for all sellers ({total} total)</p>
        </div>
        <button onClick={fetchEarnings} className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
          <input
            type="text"
            placeholder="Search by seller or store name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#568F87]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">Seller</th>
                <th className="text-left px-6 py-4">Store</th>
                <th className="text-left px-6 py-4">Commission</th>
                <th className="text-left px-6 py-4">Orders</th>
                <th className="text-left px-6 py-4">Gross Sales</th>
                <th className="text-left px-6 py-4">Commission</th>
                <th className="text-left px-6 py-4">Net Earnings</th>
                <th className="text-left px-6 py-4">Available</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEarnings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-[#666666]">
                    No sellers found
                  </td>
                </tr>
              ) : (
                filteredEarnings.map((seller, index) => (
                  <tr key={seller.seller_id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                    <td className="px-6 py-4 text-[#1A1A1A]">{seller.seller_name}</td>
                    <td className="px-6 py-4 text-[#666666]">{seller.store_name}</td>
                    <td className="px-6 py-4 text-[#EF4444] font-semibold">{seller.commission_rate}%</td>
                    <td className="px-6 py-4 text-[#1A1A1A]">
                      {seller.total_orders}
                      <span className="text-[#10B981] text-xs ml-1">({seller.completed_orders})</span>
                    </td>
                    <td className="px-6 py-4 text-[#064232] font-semibold">{formatCurrency(seller.gross_sales)}</td>
                    <td className="px-6 py-4 text-[#EF4444] font-semibold">-{formatCurrency(seller.total_commission)}</td>
                    <td className="px-6 py-4 text-[#10B981] font-semibold">{formatCurrency(seller.net_earnings)}</td>
                    <td className="px-6 py-4 text-[#568F87] font-semibold">{formatCurrency(seller.available_balance)}</td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/sellers/${seller.seller_id}/earnings`} className="inline-flex items-center gap-1 px-3 py-1 text-sm border border-[#E5E5E5] rounded-lg hover:bg-gray-50">
                        <Eye size={14} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
            <p className="text-[#666666] text-sm">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} sellers
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 rounded-lg ${page === pageNum ? 'bg-[#064232] text-white' : 'border border-[#E5E5E5] hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
