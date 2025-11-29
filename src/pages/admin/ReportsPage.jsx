import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../../ui/StatCard';
import Button from '../../ui/Button';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const salesData = [
    { date: 'Week 1', revenue: 12000, orders: 145 },
    { date: 'Week 2', revenue: 15000, orders: 178 },
    { date: 'Week 3', revenue: 13500, orders: 162 },
    { date: 'Week 4', revenue: 18000, orders: 215 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#064232' },
    { name: 'Fashion', value: 25, color: '#568F87' },
    { name: 'Home & Living', value: 15, color: '#F5BABB' },
    { name: 'Sports', value: 10, color: '#F59E0B' },
    { name: 'Beauty', value: 5, color: '#10B981' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 234, revenue: '$30,420' },
    { name: 'Smart Watch', sales: 189, revenue: '$56,511' },
    { name: 'Laptop Stand', sales: 156, revenue: '$7,800' },
    { name: 'Phone Case', sales: 143, revenue: '$4,290' },
    { name: 'USB-C Cable', sales: 128, revenue: '$1,664' },
  ];

  const topSellers = [
    { name: 'Tech Store Pro', orders: 234, revenue: '$45,230' },
    { name: 'Fashion Hub', orders: 189, revenue: '$38,920' },
    { name: 'Home Essentials', orders: 156, revenue: '$32,140' },
    { name: 'Sports Gear', orders: 143, revenue: '$28,750' },
    { name: 'Beauty World', orders: 128, revenue: '$25,600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] mb-2">Reports & Analytics</h1>
          <p className="text-[#666666]">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <Button variant="secondary">
            <Download size={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Orders"
          value="1,245"
          icon={ShoppingCart}
          change="+18.2%"
          changeType="up"
          accentColor="green"
        />
        <StatCard
          title="Total Revenue"
          value="$125,430"
          icon={DollarSign}
          change="+23.5%"
          changeType="up"
          accentColor="sage"
        />
        <StatCard
          title="Avg Order Value"
          value="$100.74"
          icon={TrendingUp}
          change="+5.1%"
          changeType="up"
          accentColor="pink"
        />
        <StatCard
          title="Total Customers"
          value="3,842"
          icon={Users}
          change="+12.3%"
          changeType="up"
          accentColor="orange"
        />
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <h2 className="text-[#1A1A1A] mb-6">Sales Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="date" stroke="#666666" />
            <YAxis yAxisId="left" stroke="#666666" />
            <YAxis yAxisId="right" orientation="right" stroke="#666666" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#064232" strokeWidth={2} name="Revenue ($)" />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#568F87" strokeWidth={2} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-6">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="name" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip />
              <Bar dataKey="value" fill="#064232" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products & Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-4">Top Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#E5E5E5]">
                <tr>
                  <th className="text-left py-3 text-[#666666]">Product</th>
                  <th className="text-left py-3 text-[#666666]">Sales</th>
                  <th className="text-left py-3 text-[#666666]">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                    <td className="py-3 text-[#1A1A1A]">{product.name}</td>
                    <td className="py-3 text-[#666666]">{product.sales}</td>
                    <td className="py-3 text-[#064232]">{product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
          <h2 className="text-[#1A1A1A] mb-4">Top Sellers</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#E5E5E5]">
                <tr>
                  <th className="text-left py-3 text-[#666666]">Seller</th>
                  <th className="text-left py-3 text-[#666666]">Orders</th>
                  <th className="text-left py-3 text-[#666666]">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((seller, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}>
                    <td className="py-3 text-[#1A1A1A]">{seller.name}</td>
                    <td className="py-3 text-[#666666]">{seller.orders}</td>
                    <td className="py-3 text-[#064232]">{seller.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
