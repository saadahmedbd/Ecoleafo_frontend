import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

const mockProducts = [
  {
    id: 1,
    name: "Oak Tree Sapling - Premium Quality",
    price: 45,
    stock: 23,
    status: "active",
    category: "Oak",
    sku: "OAK-001",
    image: "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=200",
  },
  {
    id: 2,
    name: "Pine Tree - Evergreen Beauty",
    price: 65,
    stock: 5,
    status: "active",
    category: "Pine",
    sku: "PINE-002",
    image: "https://images.unsplash.com/photo-1681614942597-4fe49f824d6c?w=200",
  },
  {
    id: 3,
    name: "Cherry Blossom Tree - Spring Special",
    price: 85,
    stock: 0,
    status: "out-of-stock",
    category: "Cherry",
    sku: "CHER-003",
    image: "https://images.unsplash.com/photo-1526344966-89049886b28d?w=200",
  },
  {
    id: 4,
    name: "Maple Tree - Autumn Colors",
    price: 55,
    stock: 12,
    status: "draft",
    category: "Maple",
    sku: "MAPL-004",
    image: "https://images.unsplash.com/photo-1622901641231-a570d784e5e3?w=200",
  },
  {
    id: 5,
    name: "Tropical Palm Tree",
    price: 120,
    stock: 18,
    status: "active",
    category: "Palm",
    sku: "PALM-005",
    image: "https://images.unsplash.com/photo-1678393834156-f8aed69b05f2?w=200",
  },
  {
    id: 6,
    name: "Bonsai Tree Collection - Indoor",
    price: 75,
    stock: 30,
    status: "active",
    category: "Bonsai",
    sku: "BONS-006",
    image: "https://images.unsplash.com/photo-1677897466760-ba23e614aa7f?w=200",
  },
];

export default function SellerProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewType, setViewType] = useState("grid"); // grid or table

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Products</h1>
          <p className="text-gray-500 mt-1">{products.length} total products</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    product.status === "active"
                      ? "bg-green-100 text-green-700"
                      : product.status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status === "active" ? "Active" : product.status === "draft" ? "Draft" : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-medium text-[#374151] line-clamp-2 mb-2">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-[#FF9900]">${product.price}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3">SKU: {product.sku}</div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm">
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
            }}
            className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <ProductFormModal onClose={() => setShowAddModal(false)} product={editingProduct} />
      )}
    </div>
  );
}

function ProductFormModal({ onClose, product }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || "",
    stock: product?.stock || "",
    sku: product?.sku || "",
    description: "",
    images: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(product ? "Product updated successfully" : "Product added successfully");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#374151]">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF9900] transition-colors cursor-pointer">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              required
            />
          </div>

          {/* Category & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              >
                <option value="">Select category</option>
                <option value="Oak">Oak</option>
                <option value="Pine">Pine</option>
                <option value="Cherry">Cherry</option>
                <option value="Maple">Maple</option>
                <option value="Palm">Palm</option>
                <option value="Bonsai">Bonsai</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., OAK-001"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your product..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
