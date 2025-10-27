// ==========================================
// SELLER PRODUCT FORM COMPONENT (ADD/EDIT)
// ==========================================
// Purpose: Add new product or edit existing product
// API: POST /api/addproducts, PUT /api/updateproducts/{id}
// Color Theme: #ff7000 (Primary Orange)
// ==========================================

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  X,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import SellerProductService from "../../../services/SellerProductService";
import { generateSKU } from '../../../utils/skuGenerator';

export default function SellerProductForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get product ID from URL for edit mode
  const isEditMode = Boolean(id);

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEditMode);

  // Form data matching backend CreateProductRequest
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category_id: '',
    price: '',
    discount_price: '',
    discount_percent: '',
    height: '',
    age: '',
    tree_type: '',
    pot_size: '',
    scientific_name: '',
    common_names: '',
    quantity: '',
    min_quantity: '1',
    weight: '',
    meta_title: '',
    meta_description: '',
    images: [],
    attributes: [],
  });

  // Image management
  const [imageURL, setImageURL] = useState('');
  const [imageAltText, setImageAltText] = useState('');

  // Attribute management
  const [attributeName, setAttributeName] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Add file input ref
  const fileInputRef = useRef(null);

  // ==========================================
  // LIFECYCLE - LOAD PRODUCT IN EDIT MODE
  // ==========================================
  
  useEffect(() => {
    if (isEditMode) {
      loadProduct();
    }
  }, [id]);

  /**
   * Load product data for editing
   */
  const loadProduct = async () => {
    setLoadingProduct(true);
    try {
      const result = await SellerProductService.getProductById(id);
      
      if (result.success) {
        const product = result.data;
        
        // Populate form with product data
        setFormData({
          name: product.name || '',
          description: product.description || '',
          sku: product.sku || '',
          category_id: product.category_id || '',
          price: product.price || '',
          discount_price: product.discount_price || '',
          discount_percent: product.discount_percent || '',
          height: product.height || '',
          age: product.age || '',
          tree_type: product.tree_type || '',
          pot_size: product.pot_size || '',
          scientific_name: product.scientific_name || '',
          common_names: product.common_names || '',
          quantity: product.quantity || '',
          min_quantity: product.min_quantity || '1',
          weight: product.weight || '',
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          images: product.images || [],
          attributes: product.attributes || [],
        });
      } else {
        toast.error('Failed to load product');
        navigate('/seller/products');
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/seller/products');
    } finally {
      setLoadingProduct(false);
    }
  };

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = { [name]: value };
      
      // Generate SKU when name changes and SKU is empty
      if (name === 'name' && !prev.sku) {
        updates.sku = generateSKU(value);
      }
      
      return { ...prev, ...updates };
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Calculate discount percent when discount price changes
   */
  const handleDiscountPriceChange = (e) => {
    const discountPrice = parseFloat(e.target.value) || 0;
    const price = parseFloat(formData.price) || 0;
    
    if (price > 0 && discountPrice > 0) {
      const percent = ((price - discountPrice) / price) * 100;
      setFormData(prev => ({
        ...prev,
        discount_price: e.target.value,
        discount_percent: percent.toFixed(2)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        discount_price: e.target.value,
        discount_percent: ''
      }));
    }
  };

  // ==========================================
  // IMAGE MANAGEMENT
  // ==========================================

  /**
   * Add image to product
   */
  const handleAddImage = () => {
    if (!imageURL.trim()) {
      toast.error('Please enter a valid image URL');
      return;
    }

    // Validate image URL
    const img = new Image();
    img.onerror = () => {
      toast.error('Invalid image URL. Please provide a valid image link.');
    };
    img.onload = () => {
      const newImage = {
        image_url: imageURL,
        alt_text: imageAltText || formData.name,
        is_primary: formData.images.length === 0,
        sort_order: formData.images.length
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));

      // Clear inputs
      setImageURL('');
      setImageAltText('');
      toast.success('Image added successfully');
    };
    img.src = imageURL;
  };

  /**
   * Remove image from product
   */
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    toast.success('Image removed');
  };

  /**
   * Set image as primary
   */
  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index
      }))
    }));
  };

  // ==========================================
  // ATTRIBUTE MANAGEMENT
  // ==========================================

  /**
   * Add custom attribute
   */
  const handleAddAttribute = () => {
    if (!attributeName.trim() || !attributeValue.trim()) {
      toast.error('Please enter attribute name and value');
      return;
    }

    const newAttribute = {
      name: attributeName,
      value: attributeValue
    };

    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute]
    }));

    // Clear inputs
    setAttributeName('');
    setAttributeValue('');
    toast.success('Attribute added');
  };

  /**
   * Remove attribute
   */
  const handleRemoveAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  /**
   * Validate form before submission
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================================
  // FORM SUBMISSION
  // ==========================================

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsLoading(true);
    try {
      // Create a FormData instance
      const formData = new FormData();
      formData.append('image', file);

      // Upload to your image hosting service
      // Replace this with your actual image upload endpoint
      const response = await fetch('YOUR_IMAGE_UPLOAD_ENDPOINT', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      const imageUrl = data.url; // Adjust based on your response structure

      // Add the uploaded image to the form
      const newImage = {
        image_url: imageUrl,
        alt_text: file.name,
        is_primary: formData.images.length === 0,
        sort_order: formData.images.length
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim(),
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : 0,
        discount_percent: formData.discount_percent ? parseFloat(formData.discount_percent) : 0,
        height: formData.height.trim(),
        age: formData.age.trim(),
        tree_type: formData.tree_type.trim(),
        pot_size: formData.pot_size.trim(),
        scientific_name: formData.scientific_name.trim(),
        common_names: formData.common_names.trim(),
        quantity: parseInt(formData.quantity) || 0,
        min_quantity: parseInt(formData.min_quantity) || 1,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        meta_title: formData.meta_title.trim(),
        meta_description: formData.meta_description.trim(),
        images: formData.images,
        attributes: formData.attributes
      };

      let result;
      
      if (isEditMode) {
        result = await SellerProductService.updateProduct(id, productData);
      } else {
        result = await SellerProductService.createProduct(productData);
      }

      if (result.success) {
        // Force cache clear
        SellerProductService.clearCache();
        
        // Show success toast
        toast.success(result.message || `Product ${isEditMode ? 'updated' : 'created'} successfully`);
        
        // Wait for cache clear and toast
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate with replace to prevent going back to form
        navigate('/seller/products', { replace: true });
      } else {
        toast.error(result.error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setIsSaving(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  
  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#ff7000] mx-auto mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/seller/products')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#374151]">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditMode ? 'Update product information' : 'Fill in the details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Basic Information</h2>

          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]`}
                placeholder="e.g., Oak Tree Sapling - Premium Quality"
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
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
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] resize-none"
                placeholder="Describe your product in detail..."
              />
            </div>

            {/* Category and SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Category *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.category_id ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]`}
                  required
                >
                  <option value="">Select category</option>
                  <option value="1">Oak Trees</option>
                  <option value="2">Pine Trees</option>
                  <option value="3">Cherry Trees</option>
                  <option value="4">Maple Trees</option>
                  <option value="5">Palm Trees</option>
                  <option value="6">Bonsai</option>
                </select>
                {errors.category_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.category_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  SKU *
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${errors.sku ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]`}
                  placeholder="e.g., OAK-001"
                  required
                />
                {errors.sku && (
                  <p className="text-sm text-red-600 mt-1">{errors.sku}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PRICING & INVENTORY
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Pricing & Inventory</h2>

          <div className="space-y-4">
            {/* Price and Discount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]`}
                  placeholder="0.00"
                  required
                />
                {errors.price && (
                  <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Discount Price ($)
                </label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleDiscountPriceChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  placeholder="Auto-calculated"
                />
              </div>
            </div>

            {/* Quantity and Min Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border ${errors.quantity ? 'border-red-300' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]`}
                  placeholder="0"
                  required
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Minimum Order Qty
                </label>
                <input
                  type="number"
                  name="min_quantity"
                  value={formData.min_quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                  placeholder="1"
                />
              </div>

              <div>
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
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            PRODUCT SPECIFICATIONS
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Product Specifications</h2>

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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., 3-4 feet"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., 2 years"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., Deciduous"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., 10 gallon"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., Quercus alba"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="e.g., White Oak, American Oak"
              />
            </div>
          </div>
        </div>

        {/* ==========================================
            PRODUCT IMAGES
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Product Images</h2>
          
          {/* Add Image Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Or Add Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors"
                  >
                    Add URL
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image List */}
          {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg border border-gray-200 overflow-hidden"
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200?text=Invalid+URL';
                    }}
                  />
                  
                  {/* Primary Badge */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-[#ff7000] text-white text-xs font-medium rounded">
                        Primary
                      </span>
                    </div>
                  )}

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_primary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(index)}
                        className="px-3 py-1.5 bg-white text-gray-700 rounded text-xs font-medium hover:bg-gray-100"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No images added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add at least one image using the form above</p>
            </div>
          )}
        </div>

        {/* ==========================================
            CUSTOM ATTRIBUTES
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">Custom Attributes</h2>
          
          {/* Add Attribute Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Attribute Name
                </label>
                <input
                  type="text"
                  value={attributeName}
                  onChange={(e) => setAttributeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                  placeholder="e.g., Color"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  Attribute Value
                </label>
                <input
                  type="text"
                  value={attributeValue}
                  onChange={(e) => setAttributeValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                  placeholder="e.g., Green"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAttribute}
              className="px-4 py-2 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Attribute
            </button>
          </div>

          {/* Attribute List */}
          {formData.attributes.length > 0 ? (
            <div className="space-y-2">
              {formData.attributes.map((attr, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-medium text-[#374151]">{attr.name}:</span>
                    <span className="text-gray-600 ml-2">{attr.value}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(index)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No custom attributes added
            </div>
          )}
        </div>

        {/* ==========================================
            SEO SETTINGS
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#374151] mb-6">SEO Settings</h2>
          
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000]"
                placeholder="SEO title for search engines"
                maxLength="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.meta_title.length}/60 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7000] resize-none"
                placeholder="SEO description for search engines"
                maxLength="160"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.meta_description.length}/160 characters
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            FORM ACTIONS
            ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              disabled={isSaving}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-[#ff7000] text-white rounded-lg hover:bg-[#e66300] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
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
 * File location: src/components/Seller/SellerProductForm.jsx
 * Service location: src/services/SellerProductService.js
 * 
 * Environment variables (.env):
 * REACT_APP_API_URL=http://localhost:3000/api
 * 
 * Features:
 * - Add new product (POST /api/addproducts)
 * - Edit existing product (PUT /api/updateproducts/{id})
 * - Form validation
 * - Image management (add/remove/set primary)
 * - Custom attributes management
 * - Auto-calculate discount percentage
 * - SEO settings
 * - Loading states
 * - Error handling
 * - Responsive design
 * 
 * Routes:
 * - /seller/products/new - Add new product
 * - /seller/products/edit/:id - Edit product
 * 
 * Backend Integration:
 * - Matches CreateProductRequest struct
 * - Matches UpdateProductRequest struct
 * - Handles product images array
 * - Handles custom attributes array
 * - Validates required fields
 */