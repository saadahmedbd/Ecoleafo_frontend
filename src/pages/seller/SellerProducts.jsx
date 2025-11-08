import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Image as ImageIcon,
  Package,
  DollarSign,
  Tag,
  AlertCircle,
  Check,
  Loader2,
  ChevronDown,
  Grid3x3,
  List,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetSellerProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadMultipleProductImagesMutation,
  useDeleteProductImageMutation,
} from "@/features/product/productApi";
import productService from "@/services/SellerProductService";

export default function SellerProducts() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    status: "all",
    search: "",
    sort_by: "created_at",
    order: "desc",
  });
  const [viewType, setViewType] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const { data: productsData, isLoading, refetch } = useGetSellerProductsQuery(filters);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Handle different API response structures
  const products = Array.isArray(productsData) 
    ? productsData 
    : (productsData?.products || productsData?.data || []);
  const totalProducts = productsData?.pagination?.total || productsData?.total || productsData?.count || products.length;

  const handleSearch = (value) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
      setShowDeleteConfirm(null);
    } catch (error) {
      productService.handleError(error);
    }
  };

  const getStatusBadge = (product) => {
    const status = productService.getStatusBadge(product);
    const colors = {
      green: "bg-green-100 text-green-700",
      yellow: "bg-yellow-100 text-yellow-700",
      red: "bg-red-100 text-red-700",
      orange: "bg-orange-100 text-orange-700",
      gray: "bg-gray-100 text-gray-700",
    };
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors[status.color]}`}>
        {status.label}
      </span>
    );
  };

  if (isLoading) {
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
          <h1 className="text-2xl font-semibold text-[#374151]">Products</h1>
          <p className="text-gray-500 mt-1">{totalProducts} total products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-[#FF9900] text-white rounded-xl hover:bg-[#E68A00] transition-colors flex items-center gap-2 justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => setViewType(viewType === "grid" ? "list" : "grid")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {viewType === "grid" ? <List className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-[#374151] mb-2">No products found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first product</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className={viewType === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
        }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewType={viewType}
              onEdit={handleEdit}
              onDelete={() => setShowDeleteConfirm(product)}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingProduct(null);
            refetch();
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          product={showDeleteConfirm}
          onConfirm={() => handleDelete(showDeleteConfirm.id)}
          onCancel={() => setShowDeleteConfirm(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

function ProductCard({ product, viewType, onEdit, onDelete, getStatusBadge }) {
  const [showMenu, setShowMenu] = useState(false);
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url;

  if (viewType === "list") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-4">
          <img
            src={primaryImage || "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=200"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="font-medium text-[#374151] truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              {getStatusBadge(product)}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-lg font-semibold text-[#FF9900]">${product.price}</span>
              <span className="text-gray-500">Stock: {product.quantity}</span>
              <span className="text-gray-500">Category: {product.category?.name}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <img
          src={primaryImage || "https://images.unsplash.com/photo-1542486823-63b97bbff8a9?w=400"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 left-2 flex justify-between">
          {getStatusBadge(product)}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit(product);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-[#374151] line-clamp-2 mb-2 min-h-[3rem]">{product.name}</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-semibold text-[#FF9900]">${product.price}</span>
            {product.discount_price && (
              <span className="text-sm text-gray-400 line-through ml-2">${product.discount_price}</span>
            )}
          </div>
          <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
        </div>
        <div className="text-xs text-gray-500 mb-3">SKU: {product.sku}</div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductFormModal({ product, onClose, onSuccess }) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [uploadImages] = useUploadMultipleProductImagesMutation();
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    sku: product?.sku || "",
    category_id: product?.category_id || "",
    price: product?.price || "",
    discount_price: product?.discount_price || "",
    discount_percent: product?.discount_percent || "",
    quantity: product?.quantity || "",
    min_quantity: product?.min_quantity || "",
    height: product?.height || "",
    age: product?.age || "",
    tree_type: product?.tree_type || "",
    pot_size: product?.pot_size || "",
    scientific_name: product?.scientific_name || "",
    common_names: product?.common_names || "",
    weight: product?.weight || "",
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => productService.validateImageFile(file));
    setSelectedImages([...selectedImages, ...validFiles]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only submit if on final step
    if (currentStep !== 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    const validation = productService.validateProductData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const productData = productService.formatProductData(formData);
      
      let result;
      if (product) {
        result = await updateProduct({ productId: product.id, ...productData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        result = await createProduct(productData).unwrap();
        toast.success("Product created successfully");
        
        // Upload images if product was created
        if (selectedImages.length > 0 && result.product?.id) {
          const formData = productService.createMultipleImagesFormData(selectedImages);
          await uploadImages({ productId: result.product.id, formData });
          toast.success("Images uploaded successfully");
        }
      }
      
      onSuccess();
    } catch (error) {
      productService.handleError(error);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-semibold text-[#374151]">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step ? "bg-[#FF9900] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${currentStep > step ? "bg-[#FF9900]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="Enter product name"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="e.g., OAK-001"
                  />
                  {errors.sku && <p className="text-sm text-red-500 mt-1">{errors.sku}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  >
                    <option value="">Select category</option>
                    <option value="1">Oak</option>
                    <option value="2">Pine</option>
                    <option value="3">Cherry</option>
                    <option value="4">Maple</option>
                    <option value="5">Palm</option>
                    <option value="6">Bonsai</option>
                  </select>
                  {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Discount Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_price}
                    onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Product Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="e.g., 6-8 feet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="e.g., 2-3 years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Tree Type</label>
                  <input
                    type="text"
                    value={formData.tree_type}
                    onChange={(e) => setFormData({ ...formData, tree_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="e.g., Deciduous"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Pot Size</label>
                  <input
                    type="text"
                    value={formData.pot_size}
                    onChange={(e) => setFormData({ ...formData, pot_size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="e.g., 15 gallon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Scientific Name</label>
                <input
                  type="text"
                  value={formData.scientific_name}
                  onChange={(e) => setFormData({ ...formData, scientific_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="e.g., Quercus robur"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Common Names</label>
                <input
                  type="text"
                  value={formData.common_names}
                  onChange={(e) => setFormData({ ...formData, common_names: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="e.g., English Oak, Common Oak"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Minimum Quantity</label>
                  <input
                    type="number"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images & SEO */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FF9900] transition-colors cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="product-images"
                  />
                  <label htmlFor="product-images" className="cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, WebP up to 10MB</p>
                  </label>
                </div>

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  placeholder="SEO title for search engines"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                  placeholder="SEO description for search engines"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentStep < 3 ? "Next Step" : (product ? "Update Product" : "Create Product")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ product, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-[#374151] text-center mb-2">Delete Product</h3>
        <p className="text-gray-500 text-center mb-6">
          Are you sure you want to delete <span className="font-medium">{product.name}</span>? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}