import { useState, useMemo } from "react";
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
  RefreshCw,
  Download,
  Star,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  useGetSellerStatisticsQuery,
  useGetSellerProfileQuery,
  useGetSalesAnalyticsQuery,
  useGetTopProductsQuery,
  useGetLowStockProductsQuery,
  useGetOrderDistributionQuery,
  useGetPerformanceMetricsQuery,
  useGetPendingActionsQuery,
} from "@/features/seller_dashboard/dashboardApi";
import dashboardService from "@/services/dashboardService";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [chartView, setChartView] = useState("week");
  
  // Fetch real data from backend
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useGetSellerStatisticsQuery();
  const { data: profileData, isLoading: profileLoading } = useGetSellerProfileQuery();
  const { data: salesData, isLoading: salesLoading } = useGetSalesAnalyticsQuery({ period: chartView });
  const { data: topProductsData } = useGetTopProductsQuery({ limit: 3 });
  const { data: lowStockData } = useGetLowStockProductsQuery({ threshold: 10 });
  const { data: orderDistData } = useGetOrderDistributionQuery();
  const { data: performanceData } = useGetPerformanceMetricsQuery();
  const { data: pendingData } = useGetPendingActionsQuery();

  const stats = statsData || {};
  const profile = profileData || {};
  const topProducts = topProductsData?.products || [];
  const lowStockProducts = lowStockData?.products || [];
  const orderDistribution = orderDistData?.distribution || [];
  const performance = performanceData || {};
  const pending = pendingData || {};

  // Format chart data
  const chartData = useMemo(() => {
    if (!salesData?.data) return [];
    const dataArray = Array.isArray(salesData.data) ? salesData.data : [];
    return dashboardService.formatChartData(dataArray, chartView);
  }, [salesData, chartView]);

  const mainStats = [
    {
      label: "Total Revenue",
      value: dashboardService.formatCurrency(stats.total_sales || 0),
      rawValue: stats.total_sales || 0,
      change: salesData?.change ? dashboardService.formatPercentage(salesData.change) : "+0.0%",
      trend: salesData?.change > 0 ? "up" : salesData?.change < 0 ? "down" : "neutral",
      icon: DollarSign,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      description: "vs last period",
    },
    {
      label: "Total Orders",
      value: stats.total_orders || 0,
      rawValue: stats.total_orders || 0,
      change: "+8.2%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      description: "vs last month",
    },
    {
      label: "Active Products",
      value: stats.active_products || 0,
      rawValue: stats.active_products || 0,
      change: stats.inactive_products ? `${stats.inactive_products} inactive` : "All active",
      trend: "up",
      icon: Package,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      description: "approved products",
    },
    {
      label: "Store Rating",
      value: (stats.average_rating || 0).toFixed(1),
      rawValue: stats.average_rating || 0,
      change: stats.total_reviews ? `${stats.total_reviews} reviews` : "No reviews",
      trend: "up",
      icon: Star,
      color: "bg-gradient-to-br from-yellow-500 to-orange-500",
      description: "customer rating",
    },
  ];

  const quickActions = [
    { label: "Add Product", icon: Plus, action: () => navigate("/seller/products"), color: "bg-[#FF9900]" },
    { label: "View Orders", icon: ShoppingBag, action: () => navigate("/seller/orders"), color: "bg-blue-600" },
    { label: "Analytics", icon: Activity, action: () => navigate("/seller/analytics"), color: "bg-purple-600" },
    { label: "View Store", icon: Eye, action: () => window.open(`/store/${profile.store_slug}`, '_blank'), color: "bg-green-600" },
  ];

  const handleRefresh = async () => {
    try {
      await refetchStats();
      toast.success("Dashboard refreshed");
    } catch (error) {
      toast.error("Failed to refresh");
    }
  };

  if (statsLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9900]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#FF9900] to-[#FF7700] rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Welcome back, {profile.first_name || "Seller"}! 👋</h1>
            <p className="text-white/90">Here's what's happening with your store today</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleRefresh} className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="px-4 py-2 bg-white text-[#FF9900] rounded-xl hover:bg-white/90 transition-all flex items-center gap-2 font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button key={idx} onClick={action.action} className={`${action.color} text-white rounded-xl p-4 hover:opacity-90 transition-all transform hover:scale-105 shadow-lg`}>
              <Icon className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">{action.label}</p>
            </button>
          );
        })}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all transform hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <ArrowUp className="w-4 h-4 text-green-500" />}
                  {stat.trend === "down" && <ArrowDown className="w-4 h-4 text-red-500" />}
                  <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"}`}>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-[#374151] mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-[#374151]">Sales Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Track your sales performance</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setChartView("week")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${chartView === "week" ? "bg-[#FF9900] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Week</button>
              <button onClick={() => setChartView("month")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${chartView === "month" ? "bg-[#FF9900] text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Month</button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            {salesLoading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-[#FF9900]" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 12px' }} formatter={(value) => [`$${value}`, 'Sales']} />
                  <Line type="monotone" dataKey="sales" stroke="#FF9900" strokeWidth={3} dot={{ fill: '#FF9900', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Order Status</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {orderDistribution.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {orderDistribution.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-gray-600 capitalize">{status.status}</span>
                </div>
                <span className="font-medium text-[#374151]">{status.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {lowStockProducts.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#374151]">Low Stock Alerts</h2>
                <p className="text-sm text-red-600">{stats.low_stock_products || lowStockProducts.length} products need restocking</p>
              </div>
            </div>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100 hover:shadow-md transition-all">
                  <img src={product.image_url || "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100"} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#374151] truncate">{product.name}</p>
                    <p className="text-sm text-red-600">Only {product.quantity} left</p>
                  </div>
                  <button onClick={() => navigate(`/seller/products`)} className="px-3 py-1.5 bg-[#FF9900] text-white text-sm rounded-lg hover:bg-[#E68A00] transition-colors whitespace-nowrap">Restock</button>
                </div>
              ))}
            </div>
            {lowStockProducts.length > 3 && (
              <button onClick={() => navigate("/seller/products?filter=low-stock")} className="w-full mt-3 py-2 text-sm text-[#FF9900] hover:text-[#E68A00] font-medium">
                View all {lowStockProducts.length} products →
              </button>
            )}
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#374151]">Pending Actions</h2>
              <p className="text-sm text-blue-600">Items requiring attention</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-[#374151]">Pending Orders</p>
                  <p className="text-sm text-gray-500">Need processing</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">{pending.pending_orders || stats.pending_orders || 0}</p>
                <button onClick={() => navigate("/seller/orders?status=pending")} className="text-xs text-blue-600 hover:underline">View →</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-[#374151]">Pending Products</p>
                  <p className="text-sm text-gray-500">Awaiting approval</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-600">{pending.pending_products || 0}</p>
                <button onClick={() => navigate("/seller/products?status=pending")} className="text-xs text-purple-600 hover:underline">View →</button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-[#374151]">Out of Stock</p>
                  <p className="text-sm text-gray-500">Needs restocking</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-600">{pending.out_of_stock || stats.out_of_stock || 0}</p>
                <button onClick={() => navigate("/seller/products?filter=out-of-stock")} className="text-xs text-red-600 hover:underline">View →</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#374151]">Top Products</h2>
            <button onClick={() => navigate("/seller/products")} className="text-sm text-[#FF9900] hover:underline font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF9900] to-[#FF7700] rounded-lg flex items-center justify-center text-white font-bold">{idx + 1}</div>
                  <img src={product.image_url || "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100"} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#374151] truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.total_sold || 0} sold • {dashboardService.formatCurrency(product.price)}</p>
                  </div>
                  <p className="text-lg font-semibold text-[#FF9900]">{dashboardService.formatCurrency(product.revenue || 0)}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No sales data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-xl font-bold text-green-600">{(performance.success_rate || 0).toFixed(1)}%</p>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <p className="text-xl font-bold text-blue-600">{(performance.customer_satisfaction || stats.average_rating || 0).toFixed(1)}/5.0</p>
                </div>
              </div>
              <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Order Value</p>
                  <p className="text-xl font-bold text-purple-600">
                    {dashboardService.formatCurrency(performance.average_order_value || dashboardService.calculateAOV(stats.total_sales || 0, stats.total_orders || 1))}
                  </p>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}