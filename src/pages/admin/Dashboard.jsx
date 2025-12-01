// src/pages/admin/DashboardHome.jsx
import React, { useMemo } from 'react';
import { DollarSign, ShoppingCart, Store, Clock, Package, Users, TrendingUp, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import {
  useGetDashboardStatsQuery,
  useGetTopProductsQuery,
  useGetTopSellersQuery,
  useGetRecentOrdersQuery,
} from '../../features/DashboardManagement/dashboardManagementApi';
import StatCard from '../../ui/StatCard';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function DashboardHome() {
  // Fetch all dashboard data
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useGetDashboardStatsQuery();
  const { data: topProductsData, isLoading: productsLoading, refetch: refetchProducts } = useGetTopProductsQuery(5);
  const { data: topSellersData, isLoading: sellersLoading, refetch: refetchSellers } = useGetTopSellersQuery(5);
  const { data: recentOrdersData, isLoading: ordersLoading, refetch: refetchOrders } = useGetRecentOrdersQuery(5);

  // Extract data from responses
  const stats = statsData?.data || {};
  const topProducts = topProductsData?.data || [];
  const topSellers = topSellersData?.data || [];
  const recentOrders = recentOrdersData?.data || [];

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00Z') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Prepare revenue chart data from monthly report
  const revenueChartData = useMemo(() => {
    if (!stats.orders?.monthly_report) return [];
    
    return stats.orders.monthly_report.map(item => ({
      month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      revenue: parseFloat(item.revenue || 0),
      orders: item.orders || 0,
    }));
  }, [stats.orders?.monthly_report]);

  // Calculate percentage changes (simplified - you can enhance this)
  const getChangePercentage = (current, previous) => {
    if (!previous || previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Get customer name
  const getCustomerName = (order) => {
    const buyer = order.buyer?.reg_user;
    if (!buyer) return 'Unknown';
    return `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || buyer.email || 'Unknown';
  };

  // Refresh all data
  const handleRefreshAll = () => {
    refetchStats();
    refetchProducts();
    refetchSellers();
    refetchOrders();
  };

  // Loading state
  if (statsLoading && productsLoading && sellersLoading && ordersLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load dashboard</h3>
          <p className="text-[#666666] mb-4">{statsError?.data?.message || 'Something went wrong'}</p>
          <Button onClick={handleRefreshAll}>
            <RefreshCw size={18} />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Dashboard</h1>
          <p className="text-[#666666]">Welcome back! Here's what's happening today.</p>
        </div>
        <Button variant="outline" onClick={handleRefreshAll}>
          <RefreshCw size={18} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.orders?.total_revenue || 0)}
          icon={DollarSign}
          change="+12.5%"
          changeType="up"
          accentColor="green"
        />
        <StatCard
          title="Total Orders"
          value={stats.orders?.total || 0}
          icon={ShoppingCart}
          change="+8.2%"
          changeType="up"
          accentColor="sage"
        />
        <StatCard
          title="Total Sellers"
          value={stats.sellers?.total || 0}
          icon={Store}
          change={`${stats.sellers?.approved || 0} approved`}
          changeType="neutral"
          accentColor="pink"
        />
        <StatCard
          title="Total Products"
          value={stats.products?.total || 0}
          icon={Package}
          change={`${stats.products?.pending || 0} pending`}
          changeType="neutral"
          accentColor="orange"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#666666]">Users</h3>
            <Users className="text-[#568F87]" size={20} />
          </div>
          <p className="text-[#064232] text-2xl font-bold mb-2">{stats.users?.total || 0}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#10B981]">Active: {stats.users?.active || 0}</span>
            <span className="text-[#6B7280]">Inactive: {stats.users?.inactive || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#666666]">Pending Approvals</h3>
            <Clock className="text-[#F59E0B]" size={20} />
          </div>
          <p className="text-[#F59E0B] text-2xl font-bold mb-2">
            {(stats.sellers?.pending || 0) + (stats.products?.pending || 0)}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#666666]">Sellers: {stats.sellers?.pending || 0}</span>
            <span className="text-[#666666]">Products: {stats.products?.pending || 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#666666]">Order Status</h3>
            <TrendingUp className="text-[#064232]" size={20} />
          </div>
          <p className="text-[#064232] text-2xl font-bold mb-2">{stats.orders?.statuses?.delivered || 0}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#F59E0B]">Pending: {stats.orders?.statuses?.pending || 0}</span>
            <span className="text-[#06B6D4]">Shipped: {stats.orders?.statuses?.shipped || 0}</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {revenueChartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#1A1A1A] mb-1">Revenue Overview</h2>
              <p className="text-[#666666]">Monthly performance trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064232" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#064232" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
                labelStyle={{ color: '#1A1A1A' }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E5E5', borderRadius: '8px' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#064232" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1A1A1A]">Recent Orders</h2>
            <Link to="/admin/orders" className="text-[#568F87] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-[#568F87]" size={32} />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto mb-3 text-[#E5E5E5]" size={48} />
              <p className="text-[#666666]">No recent orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5]">
                    <th className="text-left py-3 text-[#666666] text-sm">Order ID</th>
                    <th className="text-left py-3 text-[#666666] text-sm">Customer</th>
                    <th className="text-left py-3 text-[#666666] text-sm">Amount</th>
                    <th className="text-left py-3 text-[#666666] text-sm">Status</th>
                    <th className="text-left py-3 text-[#666666] text-sm">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                      <td className="py-3">
                        <Link to={`/admin/orders/${order.id}`} className="text-[#568F87] hover:underline text-sm">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 text-[#1A1A1A] text-sm">{getCustomerName(order)}</td>
                      <td className="py-3 text-[#1A1A1A] text-sm font-semibold">{formatCurrency(order.total)}</td>
                      <td className="py-3">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="py-3 text-[#666666] text-sm">{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A] text-sm">Pending Sellers</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm font-semibold">
                  {stats.sellers?.pending || 0}
                </span>
              </div>
              <Link to="/admin/sellers?status=pending">
                <Button variant="primary" size="sm" className="w-full">
                  Review Sellers
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A] text-sm">Pending Products</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm font-semibold">
                  {stats.products?.pending || 0}
                </span>
              </div>
              <Link to="/admin/products?status=pending">
                <Button variant="primary" size="sm" className="w-full">
                  Review Products
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A] text-sm">Pending Orders</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm font-semibold">
                  {stats.orders?.statuses?.pending || 0}
                </span>
              </div>
              <Link to="/admin/orders?status=pending">
                <Button variant="primary" size="sm" className="w-full">
                  Process Orders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sellers */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1A1A1A]">Top Sellers</h2>
            <Link to="/admin/sellers" className="text-[#568F87] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {sellersLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-[#568F87]" size={32} />
            </div>
          ) : topSellers.length === 0 ? (
            <div className="text-center py-8">
              <Store className="mx-auto mb-3 text-[#E5E5E5]" size={48} />
              <p className="text-[#666666]">No sellers yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div 
                  key={seller.id} 
                  className="flex items-center justify-between p-3 hover:bg-[#FFF5F2] rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {seller.store_logo ? (
                      <img
                        src={seller.store_logo}
                        alt={seller.store_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#064232] rounded-full flex items-center justify-center text-white font-semibold">
                        {seller.store_name?.charAt(0) || 'S'}
                      </div>
                    )}
                    <div>
                      <Link to={`/admin/sellers/${seller.id}`} className="text-[#1A1A1A] hover:text-[#568F87]">
                        {seller.store_name}
                      </Link>
                      <p className="text-sm text-[#666666]">Rank #{index + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#064232] font-semibold">{formatCurrency(seller.total_earnings || 0)}</p>
                    <p className="text-sm text-[#666666]">{seller.total_orders || 0} orders</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1A1A1A]">Top Products</h2>
            <Link to="/admin/products" className="text-[#568F87] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {productsLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-[#568F87]" size={32} />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto mb-3 text-[#E5E5E5]" size={48} />
              <p className="text-[#666666]">No products yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex items-center justify-between p-3 hover:bg-[#FFF5F2] rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-[#568F87] rounded-lg flex items-center justify-center text-white font-bold">
                        #{index + 1}
                      </div>
                    )}
                    <div>
                      <Link to={`/admin/products/${product.id}`} className="text-[#1A1A1A] hover:text-[#568F87]">
                        {product.name}
                      </Link>
                      <p className="text-sm text-[#666666]">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#064232] font-semibold">{product.sale_count || 0} sales</p>
                    <p className="text-sm text-[#666666]">{product.view_count || 0} views</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}