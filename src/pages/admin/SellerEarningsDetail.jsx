import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Wallet, RefreshCw, Store, User, Calendar } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SellerEarningsDetail() {
  usePageTitle('Seller Earnings Details');
  const { id } = useParams();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/sellers/earnings?seller_id=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setEarnings(data.data);
      } else {
        setError(data.message || 'Failed to load earnings');
      }
    } catch (err) {
      setError('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  if (error || !earnings) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Earnings not found'}</p>
        <button onClick={() => navigate('/admin/earnings')} className="text-[#568F87] hover:underline">
          ← Back to Earnings
        </button>
      </div>
    );
  }

  const formatCurrency = (amount) => `৳${parseFloat(amount || 0).toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/earnings')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[#1A1A1A] mb-1">Seller Earnings Details</h1>
            <p className="text-[#666666]">{earnings.seller_name} - {earnings.store_name}</p>
          </div>
        </div>
        <button onClick={fetchEarnings} className="flex items-center gap-2 px-4 py-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50">
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Seller Info Card */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <h2 className="text-[#1A1A1A] mb-4">Seller Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#568F87]/10 rounded-lg">
              <User size={24} className="text-[#568F87]" />
            </div>
            <div>
              <p className="text-[#666666] text-sm">Seller Name</p>
              <p className="text-[#1A1A1A] font-semibold">{earnings.seller_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#064232]/10 rounded-lg">
              <Store size={24} className="text-[#064232]" />
            </div>
            <div>
              <p className="text-[#666666] text-sm">Store Name</p>
              <p className="text-[#1A1A1A] font-semibold">{earnings.store_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#EF4444]/10 rounded-lg">
              <TrendingUp size={24} className="text-[#EF4444]" />
            </div>
            <div>
              <p className="text-[#666666] text-sm">Commission Rate</p>
              <p className="text-[#1A1A1A] font-semibold">{earnings.commission_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Total Orders</p>
            <div className="p-2 bg-[#568F87]/10 rounded-lg">
              <TrendingUp size={20} className="text-[#568F87]" />
            </div>
          </div>
          <p className="text-[#1A1A1A] text-2xl font-bold">{earnings.total_orders}</p>
          <p className="text-[#10B981] text-sm mt-1">{earnings.completed_orders} completed</p>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Gross Sales</p>
            <div className="p-2 bg-[#064232]/10 rounded-lg">
              <DollarSign size={20} className="text-[#064232]" />
            </div>
          </div>
          <p className="text-[#064232] text-2xl font-bold">{formatCurrency(earnings.gross_sales)}</p>
          <p className="text-[#666666] text-sm mt-1">Total revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Platform Commission</p>
            <div className="p-2 bg-[#EF4444]/10 rounded-lg">
              <DollarSign size={20} className="text-[#EF4444]" />
            </div>
          </div>
          <p className="text-[#EF4444] text-2xl font-bold">{formatCurrency(earnings.total_commission)}</p>
          <p className="text-[#666666] text-sm mt-1">{earnings.commission_rate}% of sales</p>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[#666666]">Net Earnings</p>
            <div className="p-2 bg-[#10B981]/10 rounded-lg">
              <Wallet size={20} className="text-[#10B981]" />
            </div>
          </div>
          <p className="text-[#10B981] text-2xl font-bold">{formatCurrency(earnings.net_earnings)}</p>
          <p className="text-[#666666] text-sm mt-1">After commission</p>
        </div>
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Available Balance</p>
          <p className="text-[#10B981] text-3xl font-bold">{formatCurrency(earnings.available_balance)}</p>
          <p className="text-[#666666] text-sm mt-2">Ready for withdrawal</p>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Total Withdrawn</p>
          <p className="text-[#064232] text-3xl font-bold">{formatCurrency(earnings.total_withdrawn)}</p>
          <p className="text-[#666666] text-sm mt-2">Paid out to seller</p>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Pending Clearance</p>
          <p className="text-[#F59E0B] text-3xl font-bold">{formatCurrency(earnings.pending_clearance)}</p>
          <p className="text-[#666666] text-sm mt-2">Awaiting clearance</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-[#064232] to-[#568F87] rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Earnings Summary</h2>
          <Calendar size={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-white/80 mb-1">Total Revenue Generated</p>
            <p className="text-3xl font-bold">{formatCurrency(earnings.gross_sales)}</p>
          </div>
          <div>
            <p className="text-white/80 mb-1">Seller's Net Income</p>
            <p className="text-3xl font-bold">{formatCurrency(earnings.net_earnings)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-white/80 text-sm">Last Updated: {new Date(earnings.last_updated).toLocaleString()}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/admin/sellers/${id}`} className="px-4 py-2 bg-[#568F87] text-white rounded-lg hover:bg-[#064232] transition-colors">
          View Seller Profile
        </Link>
        <Link to={`/admin/payouts?seller_id=${id}`} className="px-4 py-2 border border-[#E5E5E5] rounded-lg hover:bg-gray-50 transition-colors">
          View Payout History
        </Link>
      </div>
    </div>
  );
}
