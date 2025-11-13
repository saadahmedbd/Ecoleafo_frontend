import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  createProduct,
  uploadImageToCloudinary,
  uploadMultipleImagesToCloudinary,
  validateProductData,
} from "@/services/NewsellerProductService";

// Mock categories - Replace with actual API call
const CATEGORIES = [
  { id: 1, name: "Oak Trees" },
  { id: 2, name: "Pine Trees" },
  { id: 3, name: "Cherry Trees" },
  { id: 4, name: "Maple Trees" },
  { id: 5, name: "Palm Trees" },
  { id: 6, name: "Bonsai Trees" },
  { id: 7, name: "Fruit Trees" },
  { id: 8, name: "Flowering Trees" },
];

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    category_id: "",
    price: "",
    discount_price: "",
    discount_percent: "",
    height: "",
    age: "",
    tree_type: "",
    pot_size: "",
    scientific_name: "",
    common_names: "",
    quantity: "",
    min_quantity: "1",
    weight: "",
    meta_title: "",
    meta_description: "",
  });

  // Image state
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid type`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name}: Exceeds 5MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(", ")}`);
    }

    if (validFiles.length > 0) {
      // Create preview URLs
      const newPreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      setImageFiles((prev) => [...prev, ...validFiles]);
      setImages((prev) => [...prev, ...newPreviews]);
      
      // Clear error
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    }

    // Reset file input
    e.target.value = "";
  };

  // Remove image
  const handleRemoveImage = (index) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(images[index].preview);
    
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Adjust primary image index if needed
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex((prev) => prev - 1);
    }
  };

  // Set primary image
  const handleSetPrimary = (index) => {
    setPrimaryImageIndex(index);
  };

  // Auto-generate SKU from product name
  const generateSKU = () => {
    if (formData.name) {
      const sku = formData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .substring(0, 20) + "-" + Date.now().toString().slice(-4);
      setFormData((prev) => ({ ...prev, sku }));
    }
  };

  // Calculate discount percent from discount price
  const calculateDiscountPercent = () => {
    if (formData.price && formData.discount_price) {
      const price = parseFloat(formData.price);
      const discountPrice = parseFloat(formData.discount_price);
      if (price > 0 && discountPrice < price) {
        const percent = ((price - discountPrice) / price) * 100;
        setFormData((prev) => ({ ...prev, discount_percent: percent.toFixed(2) }));
      }
    }
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setLoading(true);

  try {
    if (imageFiles.length === 0) {
      toast.error("Please add at least one product image");
      setLoading(false);
      return;
    }

    // Step 1: Create product first (without images)
    const productData = {
      name: formData.name,
      description: formData.description || "",
      sku: formData.sku,
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : null,
      quantity: formData.quantity ? parseInt(formData.quantity) : 0,
      min_quantity: formData.min_quantity ? parseInt(formData.min_quantity) : 1,
      height: formData.height || null,
      age: formData.age || null,
      tree_type: formData.tree_type || null,
      pot_size: formData.pot_size || null,
      scientific_name: formData.scientific_name || null,
      common_names: formData.common_names || null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
    };

    console.log('Sending product data:', productData);
    toast.loading("Creating product...");
    const product = await createProduct(productData);
    const productId = product.product_id || product.id;
    toast.dismiss();

    if (!productId) throw new Error("Product created but ID not returned");

    // Step 2: Upload images to backend with product ID
    toast.loading("Uploading images...");
    setUploadingImages(true);

    const uploadedImages = await uploadMultipleImagesToCloudinary(imageFiles, productId);
    
    toast.dismiss();
    toast.success("Product created successfully!");
    navigate("/seller/products");
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response:', err.response?.data);
    toast.dismiss();
    toast.error(err.response?.data?.message || err.message || "Failed to create product");
  } finally {
    setLoading(false);
    setUploadingImages(false);
  }
};


  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/seller/products")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#374151]">Add New Product</h1>
              <p className="text-sm text-gray-500 mt-1">
                Create a new product listing for your store
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">Product Images</h2>
            
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                errors.images
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-[#FF9900] bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                disabled={loading}
              />
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP up to 5MB (max 10 images)
              </p>
            </div>

            {errors.images && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                {errors.images}
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-3">
                  {images.length} image(s) selected • Click to set as primary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        primaryImageIndex === index
                          ? "border-[#FF9900] ring-2 ring-[#FF9900] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSetPrimary(index)}
                    >
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Primary Badge */}
                      {primaryImageIndex === index && (
                        <div className="absolute top-2 left-2 bg-[#FF9900] text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Primary
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Image Name */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Oak Tree Sapling - Premium Quality"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  disabled={loading}
                  required
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="e.g., OAK-001"
                      className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] ${
                        errors.sku ? "border-red-300 bg-red-50" : "border-gray-200"
                      }`}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      disabled={loading || !formData.name}
                    >
                      Generate
                    </button>
                  </div>
                  {errors.sku && (
                    <p className="text-red-600 text-sm mt-1">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] ${
                      errors.category_id ? "border-red-300 bg-red-50" : "border-gray-200"
                    }`}
                    disabled={loading}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product in detail..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] ${
                    errors.price ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                  disabled={loading}
                  required
                />
                {errors.price && (
                  <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Discount Price ($)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    onBlur={calculateDiscountPercent}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    disabled={loading}
                  />
                  {formData.discount_percent && (
                    <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {formData.discount_percent}% off
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              {/* Min Quantity */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  name="min_quantity"
                  value={formData.min_quantity}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Height
                </label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 3-4 feet"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Age
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 2 years"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Tree Type
                </label>
                <input
                  type="text"
                  name="tree_type"
                  value={formData.tree_type}
                  onChange={handleChange}
                  placeholder="e.g., Deciduous"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Pot Size
                </label>
                <input
                  type="text"
                  name="pot_size"
                  value={formData.pot_size}
                  onChange={handleChange}
                  placeholder="e.g., 10 gallon"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Scientific Name
                </label>
                <input
                  type="text"
                  name="scientific_name"
                  value={formData.scientific_name}
                  onChange={handleChange}
                  placeholder="e.g., Quercus alba"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Common Names
                </label>
                <input
                  type="text"
                  name="common_names"
                  value={formData.common_names}
                  onChange={handleChange}
                  placeholder="e.g., White Oak, Eastern Oak"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* SEO (Optional) */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              SEO (Optional)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  placeholder="SEO title for search engines"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadingImages ? "Uploading Images..." : "Creating Product..."}
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}