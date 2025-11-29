import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Eye, Calendar } from 'lucide-react';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';

export default function OrdersListPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const orders = [
    {
      id: '#12345',
      customer: 'John Doe',
      seller: 'Tech Store Pro',
      amount: '$299.00',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      date: '2024-01-30',
      items: 3,
    },
    {
      id: '#12344',
      customer: 'Jane Smith',
      seller: 'Fashion Hub',
      amount: '$450.00',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      date: '2024-01-30',
      items: 5,
    },
    {
      id: '#12343',
      customer: 'Bob Johnson',
      seller: 'Home Essentials',
      amount: '$199.00',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      date: '2024-01-29',
      items: 2,
    },
    {
      id: '#12342',
      customer: 'Alice Williams',
      seller: 'Sports Gear',
      amount: '$599.00',
      paymentStatus: 'Paid',
      orderStatus: 'Shipped',
      date: '2024-01-29',
      items: 4,
    },
    {
      id: '#12341',
      customer: 'Charlie Brown',
      seller: 'Beauty World',
      amount: '$350.00',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      date: '2024-01-28',
      items: 6,
    },
    {
      id: '#12340',
      customer: 'Diana Prince',
      seller: 'Tech Store Pro',
      amount: '$125.00',
      paymentStatus: 'Failed',
      orderStatus: 'Cancelled',
      date: '2024-01-27',
      items: 1,
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'Processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'Shipped').length },
    { id: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'Delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'Cancelled').length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.orderStatus.toLowerCase() === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Order Management</h1>
          <p className="text-[#666666]">Track and manage all orders across the platform</p>
        </div>
        <div className="flex gap-2">
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            placeholder="Search by order ID, customer, or seller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] overflow-hidden">
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
                    <Link to={`/orders/${order.id.slice(1)}`} className="text-[#568F87] hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{order.customer}</td>
                  <td className="px-6 py-4 text-[#666666]">{order.seller}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{order.amount}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.paymentStatus} type="payment" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.orderStatus} type="order" />
                  </td>
                  <td className="px-6 py-4 text-[#666666]">{order.date}</td>
                  <td className="px-6 py-4">
                    <Link to={`/orders/${order.id.slice(1)}`}>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E5E5]">
          <p className="text-[#666666]">Showing {filteredOrders.length} of {orders.length} orders</p>
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
