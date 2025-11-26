import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('auth_token');

// Create axios instance with auth header
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

/* ==========================================================
   IMAGE UPLOADS (handled by your backend with Cloudinary)
   ========================================================== */

/**
 * ✅ Upload single image via your BACKEND (Cloudinary handled server-side)
 * @param {File} file - Image file to upload
 * @param {number|string} productId - Product ID
 * @returns {Promise<{url: string, publicId?: string}>}
 */
export const uploadImageToCloudinary = async (file, productId) => {
  try {
    if (!file) throw new Error('No file provided');
    if (!productId) throw new Error('Product ID is required');

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 5MB limit');
    }

    const formData = new FormData();
    formData.append('image', file);

    const api = createAuthAxios();
    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; // Expect { url, publicId }
  } catch (error) {
    console.error('Backend upload error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload image');
  }
};

/**
 * ✅ Upload multiple images via your BACKEND (Cloudinary handled server-side)
 * @param {File[]} files - Array of image files
 * @param {number|string} productId - Product ID
 * @returns {Promise<Array<{url: string, publicId?: string}>>}
 */
export const uploadMultipleImagesToCloudinary = async (files, productId) => {
  try {
    if (!files || files.length === 0) throw new Error('No files provided');
    if (!productId) throw new Error('Product ID is required');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const api = createAuthAxios();
    const response = await api.post(`/products/${productId}/images/multiple`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data; // Expect array of {url, publicId}
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload multiple images');
  }
};

/* ==========================================================
   PRODUCT CRUD OPERATIONS
   ========================================================== */

/**
 * Create a new product
 * @param {Object} productData - Product information
 * @returns {Promise<Object>}
 */
export const createProduct = async (productData) => {
  try {
    const api = createAuthAxios();
    console.log('API Base URL:', API_BASE_URL);
    console.log('Sending to /addproducts:', productData);
    const response = await api.post('/addproducts', productData);
    return response.data;
  } catch (error) {
    console.error('Create product error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Get all seller's products with filters
 * @param {Object} filters - Pagination and filter options
 * @returns {Promise<Object>}
 */
export const getSellerProducts = async (filters = {}) => {
  try {
    const api = createAuthAxios();
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sort_by) queryParams.append('sort_by', filters.sort_by);
    if (filters.order) queryParams.append('order', filters.order);

    const response = await api.get(`/seller/products?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Get seller products error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

/**
 * Get single product by ID
 * @param {number} productId - Product ID
 * @returns {Promise<Object>}
 */
export const getProductById = async (productId) => {
  try {
    const api = createAuthAxios();
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Get product error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

/**
 * Update product
 * @param {number} productId - Product ID
 * @param {Object} updateData - Updated product data
 * @returns {Promise<Object>}
 */
export const updateProduct = async (productId, updateData) => {
  try {
    const api = createAuthAxios();
    const response = await api.put(`/updateproducts/${productId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Update product error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

/**
 * Delete product
 * @param {number} productId - Product ID
 * @returns {Promise<Object>}
 */
export const deleteProduct = async (productId) => {
  try {
    const api = createAuthAxios();
    const response = await api.delete(`/deleteproducts/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Delete product error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

/**
 * Upload product images after product creation
 * @param {number} productId - Product ID
 * @param {Array} images - Array of {url, alt_text, is_primary, sort_order}
 * @returns {Promise<Object>}
 */
export const uploadProductImages = async (productId, images) => {
  try {
    if (!productId) throw new Error('Product ID missing for image upload');
    const api = createAuthAxios();
    const response = await api.post(`/products/${productId}/images/multiple`, { images });
    return response.data;
  } catch (error) {
    console.error('Upload product images error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to upload product images');
  }
};


/**
 * Add product image by URL
 * @param {number} productId - Product ID
 * @param {Object} imageData - {image_url, alt_text, is_primary, sort_order}
 * @returns {Promise<Object>}
 */
export const addProductImageByURL = async (productId, imageData) => {
  try {
    const api = createAuthAxios();
    const response = await api.post(`/products/${productId}/images/url`, imageData);
    return response.data;
  } catch (error) {
    console.error('Add image by URL error:', error);
    throw new Error(error.response?.data?.message || 'Failed to add product image');
  }
};

/**
 * Delete product image
 * @param {number} productId - Product ID
 * @param {number} imageId - Image ID
 * @returns {Promise<Object>}
 */
export const deleteProductImage = async (productId, imageId, public_id) => {
  try {
    const api = createAuthAxios();
    const response = await api.delete(`/products/${productId}/images/${imageId}`, {
      data: { public_id }, //  this sends the body
    });
    return response.data;
  } catch (error) {
    console.error('Delete product image error:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete product image');
  }
};

/* ==========================================================
   VALIDATION
   ========================================================== */

/**
 * Validate product data before submission
 * @param {Object} productData - Product data to validate
 * @returns {Object} - {isValid: boolean, errors: Object}
 */
export const validateProductData = (productData) => {
  const errors = {};

  if (!productData.name || productData.name.trim().length < 1) {
    errors.name = 'Product name is required';
  } else if (productData.name.length > 255) {
    errors.name = 'Product name must be less than 255 characters';
  }

  if (!productData.sku || productData.sku.trim().length < 1) {
    errors.sku = 'SKU is required';
  } else if (productData.sku.length > 100) {
    errors.sku = 'SKU must be less than 100 characters';
  }

  if (!productData.category_id) {
    errors.category_id = 'Category is required';
  }

  if (!productData.price || productData.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (productData.discount_price && productData.discount_price < 0) {
    errors.discount_price = 'Discount price cannot be negative';
  }

  if (productData.discount_percent && (productData.discount_percent < 0 || productData.discount_percent > 100)) {
    errors.discount_percent = 'Discount percent must be between 0 and 100';
  }

  if (productData.quantity && productData.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }

  if (productData.min_quantity && productData.min_quantity < 1) {
    errors.min_quantity = 'Minimum quantity must be at least 1';
  }

  if (productData.weight && productData.weight < 0) {
    errors.weight = 'Weight cannot be negative';
  }

  if (!productData.images || productData.images.length === 0) {
    errors.images = 'At least one product image is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
