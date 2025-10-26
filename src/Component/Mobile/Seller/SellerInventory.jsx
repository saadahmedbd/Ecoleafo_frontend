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
} from "lucide-react";
import { toast } from "sonner";

const mockInventory = [
  {
    id: 1,
    name: "Oak Tree Sapling - Premium Quality",
    sku: "OAK-001",
    stock: 23,
    lowStockThreshold: 10,
    price: 45,
    category: "Oak",
    image: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=100",
    lastUpdated: "2 days ago",
  },
  {
    id: 2,
    name: "Pine Tree - Evergreen Beauty",
    sku: "PINE-002",
    stock: 5,
    lowStockThreshold: 10,
    price: 65,
    category: "Pine",
    image: "https://images.unsplash.com/photo-1681614942597-4fe49f824d6c?w=100",
    lastUpdated: "3 days ago",
  },
  {
    id: 3,
    name: "Cherry Blossom Tree - Spring Special",
    sku: "CHER-003",
    stock: 0,
    lowStockThreshold: 10,
    price: 85,
    category: "Cherry",
    image: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=100",
    lastUpdated: "1 week ago",
  },
  {
    id: 4,
    name: "Maple Tree - Autumn Colors",
    sku: "MAPL-004",
    stock: 12,
    lowStockThreshold: 10,
    price: 55,
    category: "Maple",
    image: "https://images.unsplash.com/photo-1622901641231-a570d784e5e3?w=100",
    lastUpdated: "1 day ago",
  },
  {
    id: 5,
    name: "Tropical Palm Tree",
    sku: "PALM-005",
    stock: 18,
    lowStockThreshold: 10,
    price: 120,
    category: "Palm",
    image: "https://images.unsplash.com/photo-1678393834156-f8aed69b05f2?w=100",
    lastUpdated: "5 days ago",
  },
  {
    id: 6,
    name: "Bonsai Tree Collection - Indoor",
    sku: "BONS-006",
    stock: 30,
    lowStockThreshold: 10,
    price: 75,
    category: "Bonsai",
    image: "https://images.unsplash.com/photo-1677897466760-ba23e614aa7f?w=100",
    lastUpdated: "2 days ago",
  },
];

export default function SellerInventory() {
  const [inventory, setInventory] = useState(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingStock, setEditingStock] = useState(null);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filterStatus === "low-stock") {
      matchesFilter = item.stock > 0 && item.stock <= item.lowStockThreshold;
    } else if (filterStatus === "out-of-stock") {
      matchesFilter = item.stock === 0;
    }

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: inventory.reduce((sum, item) => sum + item.stock, 0),
    lowStock: inventory.filter((item) => item.stock > 0 && item.stock <= item.lowStockThreshold).length,
    outOfStock: inventory.filter((item) => item.stock === 0).length,
    value: inventory.reduce((sum, item) => sum + item.stock * item.price, 0),
  };

  const handleUpdateStock = (id, newStock) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, stock: newStock } : item)));
    toast.success("Stock updated successfully");
    setEditingStock(null);
  };

  const handleBulkUpdate = () => {
    toast.success("Bulk update feature coming soon");
  };

  const handleExportCSV = () => {
    toast.success("Inventory exported as CSV");
  };

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
            onClick={handleBulkUpdate}
            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Bulk Update
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Stock</p>
              <p className="text-xl font-semibold text-[#374151]">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-semibold text-yellow-600">{stats.lowStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-semibold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-green-600">${stats.value.toLocaleString()}</p>
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
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Last Updated</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInventory.map((item) => {
                const isLowStock = item.stock > 0 && item.stock <= item.lowStockThreshold;
                const isOutOfStock = item.stock === 0;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-[#374151]">{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 font-medium text-[#374151]">${item.price}</td>
                    <td className="px-6 py-4">
                      {editingStock === item.id ? (
                        <input
                          type="number"
                          defaultValue={item.stock}
                          onBlur={(e) => handleUpdateStock(item.id, parseInt(e.target.value) || 0)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateStock(item.id, parseInt(e.target.value) || 0);
                            }
                          }}
                          className="w-20 px-2 py-1 border border-[#FF9900] rounded focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                          autoFocus
                        />
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
                    <td className="px-6 py-4 text-sm text-gray-500">{item.lastUpdated}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setEditingStock(item.id)}
                        className="text-[#FF9900] hover:text-[#E68A00] flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#374151] mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-3">
        {filteredInventory.map((item) => {
          const isLowStock = item.stock > 0 && item.stock <= item.lowStockThreshold;
          const isOutOfStock = item.stock === 0;

          return (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3 mb-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-[#374151] mb-1">{item.name}</p>
                  <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  <p className="text-sm font-medium text-[#FF9900] mt-1">${item.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Stock</p>
                  <p
                    className={`text-xl font-semibold ${
                      isOutOfStock ? "text-red-600" : isLowStock ? "text-yellow-600" : "text-green-600"
                    }`}
                  >
                    {item.stock}
                  </p>
                </div>
                <button
                  onClick={() => setEditingStock(item.id)}
                  className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update
                </button>
              </div>

              {(isLowStock || isOutOfStock) && (
                <div
                  className={`mt-3 p-2 rounded-lg flex items-center gap-2 ${
                    isOutOfStock ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{isOutOfStock ? "Out of Stock" : "Low Stock Alert"}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
