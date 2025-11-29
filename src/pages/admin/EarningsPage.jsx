import React from 'react';
import { DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import StatCard from '../../ui/StatCard';
import Button from '../../ui/Button';

export default function EarningsPage() {
  const earningsData = [
    { month: 'Jan', commission: 4200, sellerEarnings: 38000 },
    { month: 'Feb', commission: 3800, sellerEarnings: 34200 },
    { month: 'Mar', commission: 5200, sellerEarnings: 46800 },
    { month: 'Apr', commission: 6100, sellerEarnings: 54900 },
    { month: 'May', commission: 5800, sellerEarnings: 52200 },
    { month: 'Jun', commission: 7200, sellerEarnings: 64800 },
  ];

  const topEarners = [
    { seller: 'Tech Store Pro', sales: '$45,230', commission: '$4,523', net: '$40,707' },
    { seller: 'Fashion Hub', sales: '$38,920', commission: '$3,892', net: '$35,028' },
    { seller: 'Home Essentials', sales: '$32,140', commission: '$3,214', net: '$28,926' },
    { seller: 'Sports Gear', sales: '$28,750', commission: '$2,875', net: '$25,875' },
    { seller: 'Beauty World', sales: '$25,600', commission: '$2,560', net: '$23,040' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] mb-2">Earnings & Commission</h1>
        <p className="text-[#666666]">Track platform earnings and seller payouts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Platform Earnings"
          value="$32,400"
          icon={DollarSign}
          change="+15.3%"
          changeType="up"
          accentColor="green"
        />
        <StatCard
          title="Seller Earnings"
          value="$291,600"
          icon={Users}
          change="+12.8%"
          changeType="up"
          accentColor="sage"
        />
        <StatCard
          title="Pending Payouts"
          value="$48,200"
          icon={Wallet}
          accentColor="pink"
        />
        <StatCard
          title="Avg Commission Rate"
          value="10%"
          icon={TrendingUp}
          accentColor="orange"
        />
      </div>

      {/* Commission Settings */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <h2 className="text-[#1A1A1A] mb-4">Commission Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#666666] mb-2">Default Commission Rate (%)</label>
            <input
              type="number"
              defaultValue="10"
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-[#666666] mb-2">Minimum Payout Amount ($)</label>
            <input
              type="number"
              defaultValue="100"
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>
          <div>
            <label className="block text-[#666666] mb-2">Payout Processing Days</label>
            <input
              type="number"
              defaultValue="7"
              className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button variant="primary">Save Settings</Button>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <div className="mb-6">
          <h2 className="text-[#1A1A1A] mb-1">Earnings Breakdown</h2>
          <p className="text-[#666666]">Platform commission vs seller earnings</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="month" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="commission" fill="#064232" name="Platform Commission" />
            <Bar dataKey="sellerEarnings" fill="#568F87" name="Seller Earnings" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Earners Table */}
      <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-6">
        <h2 className="text-[#1A1A1A] mb-4">Top Earning Sellers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#064232] text-white">
              <tr>
                <th className="text-left px-6 py-4">Seller</th>
                <th className="text-left px-6 py-4">Total Sales</th>
                <th className="text-left px-6 py-4">Commission</th>
                <th className="text-left px-6 py-4">Net Earnings</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topEarners.map((seller, index) => (
                <tr 
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#FFF5F2]/30'}
                >
                  <td className="px-6 py-4 text-[#1A1A1A]">{seller.seller}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{seller.sales}</td>
                  <td className="px-6 py-4 text-[#EF4444]">-{seller.commission}</td>
                  <td className="px-6 py-4 text-[#10B981]">{seller.net}</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
