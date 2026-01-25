// src/pages/admin/OrdersListPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Calendar, RefreshCw, AlertCircle, Package } from 'lucide-react';
import { useGetAllOrdersQuery, useGetOrderStatsQuery } from '../../features/OrderManagement/orderManagementApi';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OrdersListPage() {
  usePageTitle('Orders');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);

  // Fetch orders
  const { 
    data: ordersData, 
    isLoading, 
    error, 
    refetch 
  } = useGetAllOrdersQuery({ 
    page: currentPage, 
    limit, 
    status: activeTab 
  });

  // Fetch statistics
  const { data: statsData } = useGetOrderStatsQuery();

  const orders = ordersData?.data || [];
  const total = ordersData?.total || 0;
  const stats = statsData?.data || {};

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  // Tabs with counts from stats
  const tabs = [
    { id: 'all', label: 'All Orders', count: stats.total || 0 },
    { id: 'pending', label: 'Pending', count: stats.statuses?.pending || 0 },
    { id: 'confirmed', label: 'Confirmed', count: stats.statuses?.confirmed || 0 },
    { id: 'processing', label: 'Processing', count: stats.statuses?.processing || 0 },
    { id: 'shipped', label: 'Shipped', count: stats.statuses?.shipped || 0 },
    { id: 'delivered', label: 'Delivered', count: stats.statuses?.delivered || 0 },
    { id: 'cancelled', label: 'Cancelled', count: stats.statuses?.cancelled || 0 },
  ];

  // Filter orders by search query (client-side)
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.order_number?.toLowerCase().includes(query) ||
      order.customer_email?.toLowerCase().includes(query) ||
      order.buyer?.reg_user?.email?.toLowerCase().includes(query) ||
      order.buyer?.reg_user?.first_name?.toLowerCase().includes(query) ||
      order.buyer?.reg_user?.last_name?.toLowerCase().includes(query)
    );
  });

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

  // Get customer name
  const getCustomerName = (order) => {
    const buyer = order.buyer?.reg_user;
    if (!buyer) return 'Unknown';
    return `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || buyer.email || 'Unknown';
  };

  // Get seller name from first order item
  const getSellerName = (order) => {
    if (!order.order_items || order.order_items.length === 0) return 'N/A';
    return order.order_items[0]?.seller?.store_name || 'Unknown Seller';
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination component
  const Pagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
        <p className="text-[#666666]">
          Showing {Math.min((currentPage - 1) * limit + 1, total)} to {Math.min(currentPage * limit, total)} of {total} orders
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 py-1 text-[#666666]">...</span>}
            </>
          )}
          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-[#064232] text-white'
                  : 'border border-[#E5E5E5] text-[#666666] hover:bg-[#FFF5F2]'
              }`}
            >
              {page}
            </button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2 py-1 text-[#666666]">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2]"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-[#E5E5E5] rounded text-[#666666] hover:bg-[#FFF5F2] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-[#568F87]" size={48} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={48} />
          <h3 className="text-[#1A1A1A] mb-2">Failed to load orders</h3>
          <p className="text-[#666666] mb-4">{error?.data?.message || 'Something went wrong'}</p>
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Order Management</h1>
          <p className="text-[#666666]">Track and manage all orders across the platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw size={18} />
            Refresh
          </Button>
          <Button variant="outline">
            <Calendar size={18} />
            Date Range
          </Button>
          <Button variant="secondary">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Total Orders</p>
          <p className="text-[#064232] text-3xl font-bold">{stats.total || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Total Revenue</p>
          <p className="text-[#064232] text-3xl font-bold">{formatCurrency(stats.total_revenue || 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Pending Orders</p>
          <p className="text-[#F59E0B] text-3xl font-bold">{stats.statuses?.pending || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <p className="text-[#666666] mb-2">Delivered Orders</p>
          <p className="text-[#10B981] text-3xl font-bold">{stats.statuses?.delivered || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-md transition-colors text-sm md:text-base ${
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
            placeholder="Search by order ID, customer email, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto mb-4 text-[#E5E5E5]" size={64} />
            <h3 className="text-[#1A1A1A] mb-2">No orders found</h3>
            <p className="text-[#666666]">
              {searchQuery ? 'Try adjusting your search terms' : 'No orders match the selected filters'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#064232] text-white">
                  <tr>
                    <th className="text-left px-6 py-4">Order ID</th>
                    <th className="text-left px-6 py-4">Customer</th>
                    <th className="text-left px-6 py-4">Seller</th>
                    <th className="text-left px-6 py-4">Amount</th>
                    <th className="text-left px-6 py-4">Payment</th>
                    <th className="text-left px-6 py-4">Order Status</th>
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <tr 
                      key={order.id}
                      className={`${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'
                      } hover:bg-[#F5BABB]/20 transition-colors`}
                    >
                      <td className="px-6 py-4">
                        <Link 
                          to={`/admin/orders/${order.id}`} 
                          className="text-[#568F87] hover:underline font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[#1A1A1A] font-medium">{getCustomerName(order)}</p>
                          <p className="text-[#666666] text-sm">{order.customer_email || order.buyer?.reg_user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#666666]">{getSellerName(order)}</td>
                      <td className="px-6 py-4 text-[#1A1A1A] font-semibold">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.payment_status} type="payment" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} type="order" />
                      </td>
                      <td className="px-6 py-4 text-[#666666]">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/orders/${order.id}`}>
                          <button className="p-2 text-[#568F87] hover:bg-[#568F87]/10 rounded transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && <Pagination />}
          </>
        )}
      </div>
    </div>
  );
}