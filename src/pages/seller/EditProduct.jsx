import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Check,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getProductById,
  updateProduct,
  deleteProductImage,
  uploadImageToCloudinary,
} from "@/services/NewsellerProductService";
import { useGetSellerCategoriesQuery } from "@/features/categories/categoriesApi";

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { data: categories = [], isLoading: categoriesLoading } = useGetSellerCategoriesQuery();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState(null);

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
    is_active: true,
    meta_title: "",
    meta_description: "",
  });

  // Existing and new images
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [primaryImageId, setPrimaryImageId] = useState(null);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId);
        setProduct(data);

        // Set form data
        setFormData({
          name: data.name || "",
          description: data.description || "",
          sku: data.sku || "",
          category_id: data.category_id?.toString() || "",
          price: data.price?.toString() || "",
          discount_price: data.discount_price?.toString() || "",
          discount_percent: data.discount_percent?.toString() || "",
          height: data.height || "",
          age: data.age || "",
          tree_type: data.tree_type || "",
          pot_size: data.pot_size || "",
          scientific_name: data.scientific_name || "",
          common_names: data.common_names || "",
          quantity: data.quantity?.toString() || "",
          min_quantity: data.min_quantity?.toString() || "1",
          weight: data.weight?.toString() || "",
          is_active: data.is_active ?? true,
          meta_title: data.meta_title || "",
          meta_description: data.meta_description || "",
        });

        // Set existing images
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
          const primaryImg = data.images.find((img) => img.is_primary);
          setPrimaryImageId(primaryImg ? primaryImg.id : data.images[0].id);
        }
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle new image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024;

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
      const newPreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        isNew: true,
      }));

      setNewImageFiles((prev) => [...prev, ...validFiles]);
      setNewImages((prev) => [...prev, ...newPreviews]);
      toast.success(`${validFiles.length} image(s) added`);

      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    }

    e.target.value = "";
  };

  // Remove existing image (mark for deletion)
  const handleRemoveExistingImage = (imageId) => {
    const imageToDelete = existingImages.find((img) => img.id === imageId);
    if (imageToDelete) {
      setImagesToDelete((prev) => [...prev, imageToDelete]);
      toast.success("Image marked for deletion");
    }
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));

    // Update primary if needed
    if (primaryImageId === imageId) {
      const remaining = existingImages.filter((img) => img.id !== imageId);
      if (remaining.length > 0) {
        setPrimaryImageId(remaining[0].id);
      } else if (newImages.length > 0) {
        setPrimaryImageId("new-0");
      } else {
        setPrimaryImageId(null);
      }
    }
  };

  // Remove new image
  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(newImages[index].preview);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    toast.success("New image removed");

    if (primaryImageId === `new-${index}`) {
      if (existingImages.length > 0) {
        setPrimaryImageId(existingImages[0].id);
      } else if (newImages.length > 1) {
        setPrimaryImageId("new-0");
      } else {
        setPrimaryImageId(null);
      }
    }
  };

  // Set primary image
  const handleSetPrimary = (id) => {
    setPrimaryImageId(id);
  };

  // Calculate discount percent
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

    // Validate mandatory fields
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    try {
      setSaving(true);

      // Step 1: Delete marked images
      if (imagesToDelete.length > 0) {
        toast.loading("Deleting old images...");
        const validImages = imagesToDelete.filter(img => img && img.id);
        if (validImages.length > 0) {
          try {
            await Promise.all(
              validImages.map((img) => deleteProductImage(productId, img.id, img.public_id))
            );
            toast.dismiss();
            toast.success(`${validImages.length} image(s) deleted`);
          } catch (deleteError) {
            toast.dismiss();
            toast.error("Failed to delete some images");
          }
        } else {
          toast.dismiss();
        }
      }

      // Step 2: Upload new images if any
      if (newImageFiles.length > 0) {
        setUploadingImages(true);
        toast.loading("Uploading new images...");
        
        let uploadedCount = 0;
        let failedCount = 0;
        
        for (const file of newImageFiles) {
          try {
            await uploadImageToCloudinary(file, productId);
            uploadedCount++;
          } catch (uploadError) {
            console.error('Failed to upload image:', file.name, uploadError);
            failedCount++;
          }
        }

        setUploadingImages(false);
        toast.dismiss();
        
        if (failedCount > 0) {
          toast.warning(`${uploadedCount} image(s) uploaded, ${failedCount} failed`);
        } else if (uploadedCount > 0) {
          toast.success(`${uploadedCount} new image(s) uploaded`);
        }
      }

      // Step 3: Prepare update data
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : 0,
        discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : 0,
        height: formData.height.trim(),
        age: formData.age.trim(),
        tree_type: formData.tree_type.trim(),
        pot_size: formData.pot_size.trim(),
        scientific_name: formData.scientific_name.trim(),
        common_names: formData.common_names.trim(),
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        min_quantity: formData.min_quantity ? parseInt(formData.min_quantity) : 1,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        is_active: formData.is_active,
        meta_title: formData.meta_title.trim(),
        meta_description: formData.meta_description.trim(),
      };

      // Step 4: Update product
      toast.loading("Updating product...");
      try {
        await updateProduct(productId, updateData);
        toast.dismiss();
        toast.success("Product updated successfully!");

        setTimeout(() => {
          navigate(`/seller/products/${productId}`);
        }, 1000);
      } catch (updateError) {
        toast.dismiss();
        if (updateError.message.includes('name')) {
          toast.error("Product name is invalid or already exists");
        } else if (updateError.message.includes('price')) {
          toast.error("Invalid price value");
        } else {
          toast.error(updateError.message || "Failed to update product");
        }
        throw updateError;
      }

    } catch (error) {
      console.error("Update error:", error);
      toast.dismiss();
      toast.error(error.message || "Failed to update product");
      setSaving(false);
      setUploadingImages(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#FF9900] animate-spin" />
      </div>
    );
  }

  const allImages = [
    ...existingImages.map((img) => ({ ...img, isExisting: true })),
    ...newImages,
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/seller/products/${productId}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={saving}
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-[#374151]">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-1">
                Update product information and images
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
            <h2 className="text-lg font-semibold text-[#374151] mb-4">
              Product Images
            </h2>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#FF9900] transition-colors bg-gray-50 mb-6"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                disabled={saving}
              />
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                Click to add more images
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG, WEBP up to 5MB
              </p>
            </div>

            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  {allImages.length} image(s) • Click to set as primary
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        primaryImageId === img.id
                          ? "border-[#FF9900] ring-2 ring-[#FF9900] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSetPrimary(img.id)}
                    >
                      <img
                        src={img.image_url}
                        alt={img.alt_text || "Product"}
                        className="w-full h-full object-cover"
                      />

                      {primaryImageId === img.id && (
                        <div className="absolute top-2 left-2 bg-[#FF9900] text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Primary
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveExistingImage(img.id);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={saving}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Existing
                      </div>
                    </div>
                  ))}

                  {newImages.map((img, index) => (
                    <div
                      key={`new-${index}`}
                      className={`relative group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        primaryImageId === `new-${index}`
                          ? "border-[#FF9900] ring-2 ring-[#FF9900] ring-offset-2"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleSetPrimary(`new-${index}`)}
                    >
                      <img
                        src={img.preview}
                        alt={`New ${index + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {primaryImageId === `new-${index}` && (
                        <div className="absolute top-2 left-2 bg-[#FF9900] text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Primary
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNewImage(index);
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        disabled={saving}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        New Image
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
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={saving}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-gray-50"
                    disabled
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">SKU cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] bg-gray-50"
                    disabled
                  >
                    {categoriesLoading ? (
                      <option>Loading...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Category cannot be changed</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900] resize-none"
                  disabled={saving}
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
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Price (BDT) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={saving}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Discount Price (BDT)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price}
                    onChange={handleChange}
                    onBlur={calculateDiscountPercent}
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                    disabled={saving}
                  />
                  {formData.discount_percent && (
                    <div className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      {formData.discount_percent}% off
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Minimum Order Quantity
                </label>
                <input
                  type="number"
                  name="min_quantity"
                  value={formData.min_quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={saving}
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF9900] border-gray-300 rounded focus:ring-[#FF9900]"
                disabled={saving}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-[#374151]">
                Product is active and visible to customers
              </label>
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* SEO */}
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-white p-4 rounded-xl border border-gray-200 shadow-lg">
            <button
              type="button"
              onClick={() => navigate(`/seller/products/${productId}`)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImages}
              className="flex-1 px-6 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#E68A00] transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploadingImages ? "Uploading Images..." : "Saving Changes..."}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}