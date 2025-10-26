import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 6890 },
  { name: "Sat", sales: 7390 },
  { name: "Sun", sales: 5490 },
];

const monthlyData = [
  { name: "Jan", sales: 12000 },
  { name: "Feb", sales: 19000 },
  { name: "Mar", sales: 15000 },
  { name: "Apr", sales: 22000 },
  { name: "May", sales: 28000 },
  { name: "Jun", sales: 32000 },
];

export default function SellerDashboard() {
  const [chartView, setChartView] = useState("weekly");

  const stats = [
    {
      label: "Total Sales",
      value: "$45,231",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      label: "Total Orders",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      label: "Revenue (This Month)",
      value: "$28,450",
      change: "+23.1%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-[#FF9900]",
    },
    {
      label: "Pending Orders",
      value: "23",
      change: "-3.2%",
      trend: "down",
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  const lowStockProducts = [
    { id: 1, name: "Oak Tree Sapling", stock: 3, image: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100" },
    { id: 2, name: "Pine Tree", stock: 5, image: "https://images.unsplash.com/photo-1681614942597-4fe49f824d6c?w=100" },
    { id: 3, name: "Cherry Blossom", stock: 2, image: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=100" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back, John! Here's what's happening with your store.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Eye className="w-4 h-4" />
            View Store
          </button>
          <button className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-semibold text-[#374151] mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#374151]">Sales Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Track your sales performance</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartView("weekly")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                chartView === "weekly"
                  ? "bg-[#FF9900] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                chartView === "monthly"
                  ? "bg-[#FF9900] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "weekly" ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#FF9900" strokeWidth={2} dot={{ fill: "#FF9900" }} />
              </LineChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="sales" fill="#FF9900" radius={[8, 8, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout - Alerts & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-[#374151]">Low Stock Alerts</h2>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-[#374151]">{product.name}</p>
                  <p className="text-sm text-red-600">Only {product.stock} left in stock</p>
                </div>
                <button className="px-3 py-1 bg-[#FF9900] text-white text-sm rounded-lg hover:bg-[#E68A00] transition-colors">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-[#374151] mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: "Oak Tree Sapling", sales: 234, revenue: "$10,530", image: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100" },
              { name: "Cherry Blossom", sales: 189, revenue: "$16,065", image: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=100" },
              { name: "Maple Tree", sales: 156, revenue: "$8,580", image: "https://images.unsplash.com/photo-1622901641231-a570d784e5e3?w=100" },
            ].map((product, index) => (
              <div key={index} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-[#374151]">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} sales</p>
                </div>
                <p className="font-semibold text-[#FF9900]">{product.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#374151]">Recent Orders</h2>
          <button className="text-[#FF9900] text-sm hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 text-sm font-medium text-gray-500">Order ID</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Customer</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Product</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: "#ORD-12345", customer: "John Smith", product: "Oak Tree", date: "Oct 24, 2025", status: "Delivered", amount: "$45" },
                { id: "#ORD-12344", customer: "Sarah Johnson", product: "Pine Tree", date: "Oct 23, 2025", status: "Shipped", amount: "$65" },
                { id: "#ORD-12343", customer: "Mike Wilson", product: "Cherry Blossom", date: "Oct 23, 2025", status: "Processing", amount: "$85" },
                { id: "#ORD-12342", customer: "Emily Brown", product: "Maple Tree", date: "Oct 22, 2025", status: "Pending", amount: "$55" },
              ].map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-4 font-medium text-[#374151]">{order.id}</td>
                  <td className="py-4 text-gray-600">{order.customer}</td>
                  <td className="py-4 text-gray-600">{order.product}</td>
                  <td className="py-4 text-gray-500">{order.date}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      order.status === "Delivered" ? "bg-green-100 text-green-700" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                      order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right font-semibold text-[#374151]">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
