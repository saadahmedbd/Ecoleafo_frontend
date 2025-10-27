// ==========================================
// SELLER PRODUCTS COMPONENT (CONNECTED TO BACKEND)
// ==========================================
// Purpose: Manage seller products (list, create, edit, delete)
// API: GET/POST/PUT/DELETE /api/products endpoints
// Color Theme: #ff7000 (Primary Orange)
// ==========================================

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
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import SellerProductService from "../../../services/SellerProductService";

export default function SellerProducts() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination settings
  const itemsPerPage = 12;

  // ==========================================
  // LIFECYCLE - LOAD PRODUCTS ON MOUNT
  // ==========================================
  
  useEffect(() => {
    console.log('Loading products with filters:', {
      page: currentPage,
      status: filterStatus,
      search: searchQuery
    });
    loadProducts();
  }, [currentPage, filterStatus, searchQuery]);

  /**
   * Load products from backend with filters
   */
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const filters = {
        page: currentPage,
        limit: itemsPerPage,
        status: filterStatus === 'all' ? '' : filterStatus,
        search: searchQuery,
      };

      const result = await SellerProductService.getSellerProducts(filters);
      console.log('API Response:', result); // Debug log
      
      if (result.success && result.data) {
        const { data, total, total_pages } = result.data;
        
        // Ensure data is always an array
        const productsArray = Array.isArray(data) ? data : [];
        console.log('Setting products:', productsArray); // Debug log
        
        setProducts(productsArray);
        setTotalProducts(total || productsArray.length);
        setTotalPages(total_pages || Math.ceil(productsArray.length / itemsPerPage));
      } else {
        console.error('Failed to load products:', result.error);
        toast.error(result.error?.message || 'Failed to load products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Load products error:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Force reload when component mounts and after cache is cleared
  useEffect(() => {
    loadProducts();
  }, [currentPage, filterStatus, searchQuery]);

  useEffect(() => {
    const checkCacheAndReload = () => {
      const cached = SellerProductService.getCachedProducts();
      if (!cached) {
        loadProducts();
      }
    };

    window.addEventListener('focus', checkCacheAndReload);
    return () => window.removeEventListener('focus', checkCacheAndReload);
  }, []);

  // ==========================================
  // PRODUCT ACTIONS
  // ==========================================

  /**
   * Handle add new product
   */
  const handleAddProduct = () => {
    navigate('/seller/products/new');
  };

  /**
   * Handle edit product
   */
  const handleEditProduct = (productId) => {
    navigate(`/seller/products/edit/${productId}`);
  };

  /**
   * Handle view product details
   */
  const handleViewProduct = (productId) => {
    navigate(`/seller/products/${productId}`);
  };

  /**
   * Show delete confirmation modal
   */
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  /**
   * Handle delete product
   */
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await SellerProductService.deleteProduct(productToDelete.id);
      
      if (result.success) {
        toast.success('Product deleted successfully');
        setShowDeleteModal(false);
        setProductToDelete(null);
        
        // Reload products
        loadProducts();
      } else {
        toast.error(result.error.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete product error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // FILTER & SEARCH HANDLERS
  // ==========================================

  /**
   * Handle search input change with debounce
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  /**
   * Handle filter status change
   */
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page on filter
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  /**
   * Get status badge color
   */
  const getStatusBadge = (product) => {
    if (!product.is_active) {
      return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Inactive' };
    }
    if (!product.is_approved) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' };
    }
    if (product.quantity === 0) {
      return { bg: 'bg-red-100', text: 'text-red-700', label: 'Out of Stock' };
    }
    return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
  };

  /**
   * Get primary image URL
   */
  const getPrimaryImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primary = product.images.find(img => img.is_primary);
      return primary ? primary.image_url : product.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=200';
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  
  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff7000] mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER
  // ==========================================
  
  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
          ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">Products</h1>
          <p className="text-gray-500 mt-1">
            {totalProducts} total product{totalProducts !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-[#ff7000] text-white rounded-xl hover:bg-[#e66300] transition-colors flex items-center gap-2 justify-center shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* ==========================================
          SEARCH & FILTERS
          ========================================== */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] focus:border-transparent"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending Approval</option>
              <option value="inactive">Inactive</option>
            </select>

            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          PRODUCTS GRID
          ========================================== */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => {
              const status = getStatusBadge(product);
              
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square group">
                    <img
                      src={getPrimaryImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=200';
                      }}
                    />
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {product.is_featured && (
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-[#ff7000] text-white rounded-lg text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-[#374151] line-clamp-2 mb-2 min-h-[48px]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        {product.discount_price > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-[#ff7000]">
                              ${product.discount_price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-semibold text-[#ff7000]">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${product.quantity > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                        Stock: {product.quantity}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      SKU: {product.sku}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==========================================
              PAGINATION
              ========================================== */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    const pageNum = currentPage <= 3 ? idx + 1 : currentPage - 2 + idx;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#ff7000] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ==========================================
            EMPTY STATE
            ========================================== */
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No products found' : 'No products yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first product'}
          </p>
          {searchQuery || filterStatus !== 'all' ? (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors"
            >
              Clear Filters
            </button>
          ) : (
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* ==========================================
          DELETE CONFIRMATION MODAL
          ========================================== */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#374151] mb-2">
                  Delete Product
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete "{productToDelete.name}"? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// USAGE NOTES
// ==========================================
/**
 * This component requires:
 * 1. SellerProductService from services
 * 2. React Router for navigation
 * 3. Sonner for toast notifications
 * 4. Backend running on port 3000
 * 
 * File location: src/components/Seller/SellerProducts.jsx
 * Service location: src/services/SellerProductService.js
 * 
 * Environment variables (.env):
 * REACT_APP_API_URL=http://localhost:3000/api
 * 
 * Features:
 * - Load products with pagination
 * - Search and filter products
 * - View product details
 * - Edit product (navigate to edit page)
 * - Delete product with confirmation
 * - Status badges (Active, Pending, Inactive, Out of Stock)
 * - Featured badge
 * - Responsive grid layout
 * - Loading states
 * - Empty state handling
 * - Error handling with toasts
 * 
 * Routes:
 * - /seller/products - Product list (this component)
 * - /seller/products/new - Add new product
 * - /seller/products/edit/:id - Edit product
 * - /seller/products/:id - View product details
 */