import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import {
  getSellerProducts,
  deleteProduct,
} from "@/services/NewsellerProductService";

export default function SellerProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit,
        status: filterStatus === "all" ? "" : filterStatus,
        search: searchQuery,
        sort_by: sortBy,
        order: sortOrder,
      };

      const response = await getSellerProducts(filters);
      
      setProducts(response.products || []);
      setPagination(response.pagination || pagination);
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error(error.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filterStatus, sortBy, sortOrder]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination((prev) => ({ ...prev, page: 1 }));
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle delete
  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      setDeleting(productId);
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      
      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  // Get status badge style
  const getStatusBadge = (product) => {
    if (!product.is_active) {
      return { label: "Inactive", className: "bg-gray-100 text-gray-700" };
    }
    if (!product.is_approved) {
      return { label: "Pending", className: "bg-yellow-100 text-yellow-700" };
    }
    if (product.quantity === 0) {
      return { label: "Out of Stock", className: "bg-red-100 text-red-700" };
    }
    if (product.quantity <= 5) {
      return { label: "Low Stock", className: "bg-orange-100 text-orange-700" };
    }
    return { label: "Active", className: "bg-green-100 text-green-700" };
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Products</h1>
          <p className="text-gray-500 mt-1">
            {pagination.total} total product{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => navigate("/seller/products/add")}
          className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Approval</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] cursor-pointer"
            >
              <option value="created_at">Newest First</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Stock</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#FF9900] animate-spin" />
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const status = getStatusBadge(product);
              const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {primaryImage ? (
                      <img
                        src={primaryImage.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2">
                      <div className="relative group">
                        <button className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        <div className="hidden group-hover:block absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={() => navigate(`/seller/products/${product.id}`)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button
                            onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            disabled={deleting === product.id}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 disabled:opacity-50"
                          >
                            {deleting === product.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-[#374151] line-clamp-2 mb-2 min-h-[3rem]">
                      {product.name}
                    </h3>

                    <div className="mb-3">
                      {(() => {
                        const price = parseFloat(product.price);
                        const discountPercent = product.discount_percent || 0;
                        const discountPrice = product.discount_price ? parseFloat(product.discount_price) : (discountPercent > 0 ? price * (1 - discountPercent / 100) : null);
                        const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
                        
                        return hasDiscount ? (
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-[#FE691E]">
                                ৳{discountPrice.toLocaleString('en-BD', {minimumFractionDigits: 2})}
                              </span>
                              <span className="text-xs px-1.5 py-0.5 bg-[#FE691E] text-white rounded font-semibold">
                                -{discountPercent}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">
                                ৳{price.toLocaleString('en-BD', {minimumFractionDigits: 2})}
                              </span>
                              <span className="text-xs text-gray-500">
                                Stock: {product.quantity}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-[#374151]">
                              ৳{price.toLocaleString('en-BD', {minimumFractionDigits: 2})}
                            </span>
                            <span className="text-sm text-gray-500">
                              Stock: {product.quantity}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="text-xs text-gray-500 mb-3">SKU: {product.sku}</div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/seller/products/${product.id}`)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.total_pages}
                </span>
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery || filterStatus !== "all" ? (
              <Filter className="w-8 h-8 text-gray-400" />
            ) : (
              <Package className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">
            {searchQuery || filterStatus !== "all"
              ? "No products found"
              : "No products yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Start by adding your first product"}
          </p>
          {searchQuery || filterStatus !== "all" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={() => navigate("/seller/products/add")}
              className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Error State */}
      {!loading && products.length === 0 && !searchQuery && filterStatus === "all" && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900">Unable to load products</h3>
            <p className="text-sm text-red-700 mt-1">
              There was an error loading your products. Please try again.
            </p>
            <button
              onClick={fetchProducts}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}