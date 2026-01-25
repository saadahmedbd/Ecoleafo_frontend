
import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Users, Wallet, RefreshCw, AlertCircle, Save, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import {
  useGetCommissionSettingsQuery,
  useUpdateCommissionSettingsMutation,
  useGetPlatformEarningsOverviewQuery,
  useGetMonthlyRevenueQuery,
  useGetTopSellersByRevenueQuery,
} from '../../features/EarningsCommission/earningsCommissionApi';
import StatCard from '../../ui/StatCard';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function EarningsPage() {
  usePageTitle('Earnings');
  const [commissionSettings, setCommissionSettings] = useState({
    default_rate: '',
    description: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data
  const { data: settingsData, isLoading: settingsLoading, refetch: refetchSettings } = useGetCommissionSettingsQuery();
  const { data: overviewData, isLoading: overviewLoading, refetch: refetchOverview } = useGetPlatformEarningsOverviewQuery();
  const { data: revenueData, isLoading: revenueLoading } = useGetMonthlyRevenueQuery(new Date().getFullYear());
  const { data: topSellersData, isLoading: sellersLoading } = useGetTopSellersByRevenueQuery(5);

  // Mutations
  const [updateSettings, { isLoading: isUpdating }] = useUpdateCommissionSettingsMutation();

  // Extract data
  const settings = settingsData?.data || {};
  const overview = overviewData?.data || {};
  const monthlyRevenue = revenueData?.data || [];
  const topSellers = topSellersData?.data || [];

  // Initialize settings when loaded
  React.useEffect(() => {
    if (settings.default_rate) {
      setCommissionSettings({
        default_rate: settings.default_rate,
        description: settings.description || '',
      });
    }
  }, [settings]);

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    return monthlyRevenue.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      commission: parseFloat(item.commission_earned || 0),
      sellerEarnings: parseFloat(item.gross_revenue || 0) - parseFloat(item.commission_earned || 0),
      orders: item.total_orders,
    }));
  }, [monthlyRevenue]);

  // Handle settings update
  const handleSaveSettings = async () => {
    try {
      await updateSettings(commissionSettings).unwrap();
      setIsEditing(false);
      refetchSettings();
      alert('Commission settings updated successfully');
    } catch (error) {
      alert(error?.data?.message || 'Failed to update settings');
    }
  };

  // Refresh all data
  const handleRefreshAll = () => {
    refetchSettings();
    refetchOverview();
  };

  // Calculate seller earnings from gross sales
  const calculateSellerEarnings = (grossSales, commission) => {
    return parseFloat(grossSales) - parseFloat(commission);
  };

  // Loading state
  if (settingsLoading && overviewLoading && revenueLoading && sellersLoading) {
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
          <h1 className="text-[#1A1A1A] mb-2">Earnings & Commission</h1>
          <p className="text-[#666666]">Track platform earnings and seller payouts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshAll}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Link to="/admin/payouts">
            <Button variant="primary">
              <Wallet size={18} />
              Manage Payouts
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Platform Earnings"
          value={formatCurrency(overview.total_commission_earned || 0)}
          icon={DollarSign}
          change="+15.3%"
          changeType="up"
          accentColor="green"
        />
        <StatCard
          title="Seller Earnings"
          value={formatCurrency(overview.total_seller_earnings || 0)}
          icon={Users}
          change="+12.8%"
          changeType="up"
          accentColor="sage"
        />
        <StatCard
          title="Pending Payouts"
          value={formatCurrency(overview.pending_payouts || 0)}
          icon={Wallet}
          accentColor="pink"
        />
        <StatCard
          title="Total Orders"
          value={overview.total_orders || 0}
          icon={TrendingUp}
          change={`${overview.completed_orders || 0} completed`}
          changeType="neutral"
          accentColor="orange"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Total Gross Sales</p>
          <p className="text-[#064232] text-2xl font-bold">{formatCurrency(overview.total_gross_sales || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Completed Payouts</p>
          <p className="text-[#10B981] text-2xl font-bold">{formatCurrency(overview.completed_payouts || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Avg Commission Rate</p>
          <p className="text-[#568F87] text-2xl font-bold">{settings.default_rate || 10}%</p>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A]">Commission Settings</h2>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Settings
            </Button>
          ) : null}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#666666] mb-2">Default Commission Rate (%)</label>
            <input
              type="number"
              value={commissionSettings.default_rate}
              onChange={(e) => setCommissionSettings(prev => ({ ...prev, default_rate: parseFloat(e.target.value) }))}
              disabled={!isEditing}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] ${
                !isEditing ? 'bg-[#F5F5F5] cursor-not-allowed' : 'bg-white'
              } text-[#1A1A1A]`}
            />
          </div>
          <div>
            <label className="block text-[#666666] mb-2">Description</label>
            <input
              type="text"
              value={commissionSettings.description}
              onChange={(e) => setCommissionSettings(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isEditing}
              placeholder="Platform commission description"
              className={`w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] ${
                !isEditing ? 'bg-[#F5F5F5] cursor-not-allowed' : 'bg-white'
              } text-[#1A1A1A]`}
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-4 flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleSaveSettings}
              disabled={isUpdating}
            >
              <Save size={18} />
              {isUpdating ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false);
                setCommissionSettings({
                  default_rate: settings.default_rate,
                  description: settings.description || '',
                });
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        )}
        
        {settings.updated_at && (
          <p className="text-[#666666] text-sm mt-3">
            Last updated: {new Date(settings.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      {/* Earnings Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="mb-6">
            <h2 className="text-[#1A1A1A] mb-1">Earnings Breakdown</h2>
            <p className="text-[#666666]">Platform commission vs seller earnings</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ color: '#1A1A1A' }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E5E5', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="commission" fill="#064232" name="Platform Commission" />
              <Bar dataKey="sellerEarnings" fill="#568F87" name="Seller Earnings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Earners Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#1A1A1A]">Top Earning Sellers</h2>
          <div className="flex gap-2">
            <Link to="/admin/sellers/earnings/all" className="text-[#568F87] text-sm hover:underline">
              View All Earnings →
            </Link>
            <span className="text-[#E5E5E5]">|</span>
            <Link to="/admin/sellers" className="text-[#568F87] text-sm hover:underline">
              View All Sellers →
            </Link>
          </div>
        </div>
        
        {sellersLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin text-[#568F87]" size={32} />
          </div>
        ) : topSellers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto mb-3 text-[#E5E5E5]" size={48} />
            <p className="text-[#666666]">No seller data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#064232] text-white">
                <tr>
                  <th className="text-left px-6 py-4">Seller</th>
                  <th className="text-left px-6 py-4">Store Name</th>
                  <th className="text-left px-6 py-4">Orders</th>
                  <th className="text-left px-6 py-4">Total Sales</th>
                  <th className="text-left px-6 py-4">Commission</th>
                  <th className="text-left px-6 py-4">Net Earnings</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr 
                    key={seller.seller_id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}
                  >
                    <td className="px-6 py-4 text-[#1A1A1A]">
                      {seller.seller_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-[#666666]">
                      {seller.store_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A] font-semibold">
                      {seller.total_orders || 0}
                    </td>
                    <td className="px-6 py-4 text-[#064232] font-semibold">
                      {formatCurrency(seller.gross_sales || 0)}
                    </td>
                    <td className="px-6 py-4 text-[#EF4444] font-semibold">
                      -{formatCurrency(seller.commission_generated || 0)}
                    </td>
                    <td className="px-6 py-4 text-[#10B981] font-semibold">
                      {formatCurrency(
                        calculateSellerEarnings(
                          seller.gross_sales || 0,
                          seller.commission_generated || 0
                        )
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/sellers/${seller.seller_id}/earnings`}>
                        <Button variant="outline" size="sm">
                          <Eye size={16} />
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}