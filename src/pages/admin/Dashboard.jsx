import React from 'react';
import { DollarSign, ShoppingCart, Store, Clock, Eye, ArrowRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../ui/StatCard';
import StatusBadge from '../../ui/StatusBadge';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';

export default function DashboardHome() {
  const revenueData = [
    { date: 'Jan 1', revenue: 4000, orders: 24 },
    { date: 'Jan 5', revenue: 3000, orders: 18 },
    { date: 'Jan 10', revenue: 5000, orders: 32 },
    { date: 'Jan 15', revenue: 7000, orders: 45 },
    { date: 'Jan 20', revenue: 6000, orders: 38 },
    { date: 'Jan 25', revenue: 8000, orders: 52 },
    { date: 'Jan 30', revenue: 9500, orders: 61 },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'John Doe', amount: '$299.00', status: 'Delivered', date: '2024-01-30' },
    { id: '#12344', customer: 'Jane Smith', amount: '$450.00', status: 'Processing', date: '2024-01-30' },
    { id: '#12343', customer: 'Bob Johnson', amount: '$199.00', status: 'Pending', date: '2024-01-29' },
    { id: '#12342', customer: 'Alice Williams', amount: '$599.00', status: 'Shipped', date: '2024-01-29' },
    { id: '#12341', customer: 'Charlie Brown', amount: '$350.00', status: 'Delivered', date: '2024-01-28' },
  ];

  const topSellers = [
    { name: 'Tech Store Pro', avatar: '🏪', revenue: '$45,230' },
    { name: 'Fashion Hub', avatar: '👗', revenue: '$38,920' },
    { name: 'Home Essentials', avatar: '🏠', revenue: '$32,140' },
    { name: 'Sports Gear', avatar: '⚽', revenue: '$28,750' },
    { name: 'Beauty World', avatar: '💄', revenue: '$25,600' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234 },
    { name: 'Smart Watch', sales: 189 },
    { name: 'Laptop Stand', sales: 156 },
    { name: 'Phone Case', sales: 143 },
    { name: 'USB-C Cable', sales: 128 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-[#1A1A1A] mb-2">Dashboard</h1>
        <p className="text-[#666666]">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Revenue"
          value="$125,430"
          icon={DollarSign}
          change="+12.5%"
          changeType="up"
          accentColor="green"
        />
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={ShoppingCart}
          change="+8.2%"
          changeType="up"
          accentColor="sage"
        />
        <StatCard
          title="Active Sellers"
          value="342"
          icon={Store}
          change="+5.1%"
          changeType="up"
          accentColor="pink"
        />
        <StatCard
          title="Pending Approvals"
          value="28"
          icon={Clock}
          change="-3.4%"
          changeType="down"
          accentColor="orange"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#1A1A1A] mb-1">Revenue Overview</h2>
            <p className="text-[#666666]">Last 30 days performance</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-md bg-[#064232] text-white">Month</button>
            <button className="px-3 py-1 text-sm rounded-md text-[#666666] hover:bg-[#FFF5F2]">Week</button>
            <button className="px-3 py-1 text-sm rounded-md text-[#666666] hover:bg-[#FFF5F2]">Year</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#064232" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#064232" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="date" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#064232" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#1A1A1A]">Recent Orders</h2>
            <Link to="/orders" className="text-[#568F87] text-sm hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5]">
                  <th className="text-left py-3 text-[#666666]">Order ID</th>
                  <th className="text-left py-3 text-[#666666]">Customer</th>
                  <th className="text-left py-3 text-[#666666]">Amount</th>
                  <th className="text-left py-3 text-[#666666]">Status</th>
                  <th className="text-left py-3 text-[#666666]">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                    <td className="py-3 text-[#1A1A1A]">{order.id}</td>
                    <td className="py-3 text-[#1A1A1A]">{order.customer}</td>
                    <td className="py-3 text-[#1A1A1A]">{order.amount}</td>
                    <td className="py-3">
                      <StatusBadge status={order.status} type="order" />
                    </td>
                    <td className="py-3 text-[#666666]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A]">Pending Sellers</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm">12</span>
              </div>
              <Link to="/sellers">
                <Button variant="primary" size="sm" className="w-full">
                  Review
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A]">Pending Products</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm">24</span>
              </div>
              <Link to="/products">
                <Button variant="primary" size="sm" className="w-full">
                  Review
                </Button>
              </Link>
            </div>
            <div className="p-4 bg-[#FFF5F2] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#1A1A1A]">Pending Payouts</span>
                <span className="bg-[#F5BABB] text-[#064232] px-2 py-1 rounded-full text-sm">8</span>
              </div>
              <Link to="/payouts">
                <Button variant="primary" size="sm" className="w-full">
                  Process
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
          <h2 className="text-[#1A1A1A] mb-6">Top Sellers</h2>
          <div className="space-y-4">
            {topSellers.map((seller, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-[#FFF5F2] rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#064232] rounded-full flex items-center justify-center text-xl">
                    {seller.avatar}
                  </div>
                  <div>
                    <p className="text-[#1A1A1A]">{seller.name}</p>
                    <p className="text-sm text-[#666666]">Rank #{index + 1}</p>
                  </div>
                </div>
                <p className="text-[#064232]">{seller.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-[#FFF5F2] rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#568F87] rounded-lg flex items-center justify-center text-white">
                    #{index + 1}
                  </div>
                  <p className="text-[#1A1A1A]">{product.name}</p>
                </div>
                <p className="text-[#666666]">{product.sales} sales</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
