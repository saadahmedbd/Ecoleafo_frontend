import { useState } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  Package,
  Download,
  Edit,
  TrendingDown,
  TrendingUp,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetInventoryQuery,
  useGetInventoryStatsQuery,
  useUpdateStockMutation,
  useExportInventoryMutation,
} from "@/features/seller_inventory/InventoryApi";
import dashboardService from "@/services/DashboardService";

export default function SellerInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStock, setEditingStock] = useState(null);
  const [tempStock, setTempStock] = useState({});

  // Fetch inventory data
  const { data: inventoryData, isLoading, refetch } = useGetInventoryQuery({
    search: searchQuery,
    status: filterStatus === "all" ? "" : filterStatus,
    limit: 100,
  });

  const { data: statsData, isLoading: statsLoading } = useGetInventoryStatsQuery();
  const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();
  const [exportInventory, { isLoading: isExporting }] = useExportInventoryMutation();

  const inventory = inventoryData?.data?.items || [];
  const stats = statsData?.data || statsData || {
    total_stock: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
    total_value: 0,
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      await updateStock({ productId, quantity: parseInt(newStock) }).unwrap();
      toast.success("Stock updated successfully");
      setEditingStock(null);
      setTempStock({});
    } catch (error) {
      toast.error(error.data?.message || "Failed to update stock");
    }
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setTempStock({});
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportInventory().unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inventory_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Inventory exported successfully");
    } catch (error) {
      toast.error("Failed to export inventory");
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF9900]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Track and manage your product stock levels</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-xl font-semibold text-[#374151]">{stats.total_stock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-semibold text-yellow-600">{stats.low_stock_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-semibold text-red-600">{stats.out_of_stock_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-green-600">
                {dashboardService.formatCurrency(stats.total_value)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] cursor-pointer"
          >
            <option value="all">All Products</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="in-stock">In Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">SKU</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Value</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventory.map((item) => {
                const isLowStock = item.stock > 0 && item.stock <= item.low_stock_threshold;
                const isOutOfStock = item.stock === 0;
                const isEditing = editingStock === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url || "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100"}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#374151]">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category_name || "N/A"}</td>
                    <td className="px-6 py-4 font-medium text-[#374151]">
                      {dashboardService.formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={item.stock}
                            onChange={(e) => setTempStock({ ...tempStock, [item.id]: e.target.value })}
                            className="w-20 px-2 py-1 border border-[#FF9900] rounded focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateStock(item.id, tempStock[item.id] || item.stock)}
                            disabled={isUpdating}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`font-semibold ${
                            isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : "text-green-600"
                          }`}
                        >
                          {item.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium w-fit">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {dashboardService.formatCurrency(item.stock_value)}
                    </td>
                    <td className="px-6 py-4">
                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingStock(item.id);
                            setTempStock({ ...tempStock, [item.id]: item.stock });
                          }}
                          className="text-[#FF9900] hover:text-[#E68A00] flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {inventory.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}