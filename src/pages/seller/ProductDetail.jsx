import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Check,
  X,
  AlertCircle,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { usePageTitle } from '@/hooks/usePageTitle';
import { 
getProductById,
  deleteProduct,
} from "@/services/NewsellerProductService";

export default function ProductDetails() {
  usePageTitle('Product Details');
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        console.error("Fetch product error:", error);
        toast.error(error.message || "Failed to load product");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${product?.name}"?`)) {
      return;
    }

    try {
      setDeleting(true);
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      navigate("/seller/products");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete product");
      setDeleting(false);
    }
  };

  // Handle image navigation
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Get status
  const getStatus = () => {
    if (!product.is_active) return { label: "Inactive", color: "gray" };
    if (!product.is_approved) return { label: "Pending Approval", color: "yellow" };
    if (product.quantity === 0) return { label: "Out of Stock", color: "red" };
    if (product.quantity <= 5) return { label: "Low Stock", color: "orange" };
    return { label: "Active", color: "green" };
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#FF9900] animate-spin" />
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-[#374151] mb-2">
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The product you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/seller/products")}
          className="px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const status = getStatus();
  const images = product.images || [];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/seller/products")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-[#374151]">
                  Product Details
                </h1>
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/seller/products/${productId}/edit`)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                {images.length > 0 ? (
                  <>
                    <img
                      src={currentImage?.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/600?text=No+Image";
                      }}
                    />

                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}

                    {/* Primary Badge */}
                    {currentImage?.is_primary && (
                      <div className="absolute top-4 left-4 px-2 py-1 bg-[#FF9900] text-white text-xs rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Primary
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-[#FF9900] ring-2 ring-[#FF9900] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Status Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-medium text-[#374151] mb-3">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      status.color === "green"
                        ? "bg-green-100 text-green-700"
                        : status.color === "yellow"
                        ? "bg-yellow-100 text-yellow-700"
                        : status.color === "orange"
                        ? "bg-orange-100 text-orange-700"
                        : status.color === "red"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  {product.is_active ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Approved</span>
                  {product.is_approved ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-yellow-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  {product.is_featured ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-[#374151] mb-4">
                {product.name}
              </h2>

              {/* Pricing */}
              <div className="mb-6">
                {(() => {
                  const price = parseFloat(product.price);
                  const discountPercent = product.discount_percent || 0;
                  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : (discountPercent > 0 ? price * (1 - discountPercent / 100) : null);
                  const hasDiscount = discountPrice && discountPrice > 0 && discountPrice < price;
                  
                  return hasDiscount ? (
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-4xl font-bold text-[#FE691E]">
                          ৳{discountPrice.toLocaleString('en-BD', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ৳{price.toLocaleString('en-BD', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                        <span className="px-3 py-1.5 bg-[#FE691E] text-white rounded-md text-sm font-bold">
                          -{discountPercent}% OFF
                        </span>
                      </div>
                      <p className="text-sm text-green-700 font-medium">
                        You save ৳{(price - discountPrice).toLocaleString('en-BD', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </p>
                    </div>
                  ) : (
                    <span className="text-4xl font-bold text-[#374151]">
                      ৳{price.toLocaleString('en-BD', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                  );
                })()}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-medium text-[#374151] mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-900">
                    {product.quantity}
                  </div>
                  <div className="text-sm text-blue-700">In Stock</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-900">
                    {product.sold_count || 0}
                  </div>
                  <div className="text-sm text-green-700">Sold</div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-900">
                    {product.view_count || 0}
                  </div>
                  <div className="text-sm text-purple-700">Views</div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-orange-900">
                    {product.min_quantity}
                  </div>
                  <div className="text-sm text-orange-700">Min Order</div>
                </div>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.height && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Height</span>
                    <span className="font-medium text-[#374151]">{product.height}</span>
                  </div>
                )}
                {product.age && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Age</span>
                    <span className="font-medium text-[#374151]">{product.age}</span>
                  </div>
                )}
                {product.tree_type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Tree Type</span>
                    <span className="font-medium text-[#374151]">{product.tree_type}</span>
                  </div>
                )}
                {product.pot_size && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Pot Size</span>
                    <span className="font-medium text-[#374151]">{product.pot_size}</span>
                  </div>
                )}
                {product.scientific_name && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Scientific Name</span>
                    <span className="font-medium text-[#374151] italic">
                      {product.scientific_name}
                    </span>
                  </div>
                )}
                {product.common_names && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Common Names</span>
                    <span className="font-medium text-[#374151]">
                      {product.common_names}
                    </span>
                  </div>
                )}
                {product.weight > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium text-[#374151]">
                      {product.weight} kg
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-[#374151]">
                    {product.category?.name || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO Information */}
            {(product.meta_title || product.meta_description) && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-[#374151] mb-4">
                  SEO Information
                </h3>
                {product.meta_title && (
                  <div className="mb-4">
                    <label className="text-sm text-gray-600 mb-1 block">
                      Meta Title
                    </label>
                    <p className="text-[#374151]">{product.meta_title}</p>
                  </div>
                )}
                {product.meta_description && (
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Meta Description
                    </label>
                    <p className="text-[#374151]">{product.meta_description}</p>
                  </div>
                )}
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#374151] mb-4">
                Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium text-[#374151]">
                    {new Date(product.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium text-[#374151]">
                    {new Date(product.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}