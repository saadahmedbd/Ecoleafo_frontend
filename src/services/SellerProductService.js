// ==========================================
// SELLER PRODUCT SERVICE
// ==========================================
// Purpose: API service for product management (CRUD operations)
// Features: Get, Create, Update, Delete products, Image upload
// Backend Port: 3000
// ==========================================

import axios from 'axios';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * API Base URL - Backend runs on port 3000
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


/**
 * Product API Endpoints
 */
const ENDPOINTS = {
  // Update these endpoints to match your backend
  GET_SELLER_PRODUCTS: '/seller/products', // This should match your backend endpoint
  GET_PRODUCT_BY_ID: '/products',
  CREATE_PRODUCT: '/addproducts',
  UPDATE_PRODUCT: '/updateproducts',
  DELETE_PRODUCT: '/deleteproducts',
};

/**
 * Storage Keys
 */
const STORAGE_KEYS = {
  TOKEN: 'seller_token',
  PRODUCTS_CACHE: 'seller_products_cache',
};

// ==========================================
// AXIOS INSTANCE
// ==========================================

/**
 * Create axios instance with authentication
 */
const productClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Add token to all requests
 */
productClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Product API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle responses and errors
 */
productClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Product API Response:', response.data);
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Product API Error:', error.response?.data || error.message);
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      window.location.href = '/seller/login';
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// SELLER PRODUCT SERVICE
// ==========================================

class SellerProductService {
  /**
   * Get all seller's products with filters
   */
  static async getSellerProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add filters to query params
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      
      const queryString = params.toString();
      const url = `${ENDPOINTS.GET_SELLER_PRODUCTS}${queryString ? '?' + queryString : ''}`;
      
      console.log('Fetching products from:', url); // Debug log

      const response = await productClient.get(url);
      const responseData = response.data;

      // Handle different response structures
      let formattedData = {
        data: [],
        total: 0,
        total_pages: 1,
        current_page: filters.page || 1
      };

      if (Array.isArray(responseData)) {
        // If response is an array of products
        formattedData.data = responseData;
        formattedData.total = responseData.length;
      } else if (responseData.data) {
        // If response is paginated
        formattedData = responseData;
      } else if (typeof responseData === 'object') {
        // If response is a single object with products
        formattedData.data = responseData.products || [];
        formattedData.total = responseData.total || formattedData.data.length;
      }

      console.log('Formatted response:', formattedData); // Debug log
      
      return {
        success: true,
        data: formattedData
      };
    } catch (error) {
      console.error('Get products error:', error.response?.data || error);
      return {
        success: false,
        error: this._handleError(error)
      };
    }
  }

  /**
   * Get single product by ID
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  static async getProductById(productId) {
    try {
      const response = await productClient.get(`${ENDPOINTS.GET_PRODUCT_BY_ID}/${productId}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Create new product
   */
  static async createProduct(productData) {
    try {
      const response = await productClient.post(ENDPOINTS.CREATE_PRODUCT, productData);
      
      // Clear cache to force refresh
      this.clearCache();
      
      return {
        success: true,
        data: response.data,
        message: 'Product created successfully'
      };
    } catch (error) {
      console.error('Create product error:', error.response?.data || error);
      return {
        success: false,
        error: this._handleError(error)
      };
    }
  }

  /**
   * Update existing product
   */
  static async updateProduct(productId, productData) {
    try {
      console.log('Updating product:', { id: productId, data: productData }); // Debug log
      
      const response = await productClient.put(
        `${ENDPOINTS.UPDATE_PRODUCT}/${productId}`,
        productData // Send full product data
      );
      
      // Clear products cache
      this.clearCache();
      
      return {
        success: true,
        data: response.data,
        message: 'Product updated successfully'
      };
    } catch (error) {
      console.error('Update product error:', error.response?.data || error);
      return {
        success: false,
        error: this._handleError(error)
      };
    }
  }

  /**
   * Delete product
   * @param {number} productId - Product ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteProduct(productId) {
    try {
      const response = await productClient.delete(
        `${ENDPOINTS.DELETE_PRODUCT}/${productId}`
      );
      
      // Clear products cache
      this.clearCache();
      
      return {
        success: true,
        data: response.data,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Add product image by URL
   * @param {number} productId - Product ID
   * @param {Object} imageData - Image data
   * @returns {Promise<Object>} Result
   */
  static async addImageByURL(productId, imageData) {
    try {
      const response = await productClient.post(
        `${ENDPOINTS.ADD_IMAGE_BY_URL}/${productId}/images/url`,
        {
          image_url: imageData.image_url,
          alt_text: imageData.alt_text || '',
          is_primary: imageData.is_primary || false,
          sort_order: imageData.sort_order || 0,
        }
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Image added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Delete product image
   * @param {number} productId - Product ID
   * @param {number} imageId - Image ID
   * @returns {Promise<Object>} Delete result
   */
  static async deleteImage(productId, imageId) {
    try {
      const response = await productClient.post(
        `${ENDPOINTS.DELETE_IMAGE}/${productId}/images/${imageId}`
      );
      
      return {
        success: true,
        data: response.data,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Get cached products
   * @returns {Object|null} Cached products or null
   */
  static getCachedProducts() {
    const cached = localStorage.getItem(STORAGE_KEYS.PRODUCTS_CACHE);
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Clear products cache
   */
  static clearCache() {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS_CACHE);
  }

  /**
   * Handle API errors
   * @private
   * @param {Error} error - Axios error
   * @returns {Object} Formatted error
   */
  static _handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || error.response.data?.detail || 'An error occurred',
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // No response from server
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
      };
    } else {
      // Error in request setup
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
      };
    }
  }
}

// ==========================================
// EXPORTS
// ==========================================

export default SellerProductService;
export { productClient, ENDPOINTS, STORAGE_KEYS };

// ==========================================
// USAGE EXAMPLE
// ==========================================

/**
 * Example usage in components:
 * 
 * import SellerProductService from '@/services/SellerProductService';
 * 
 * // Get all products
 * const result = await SellerProductService.getSellerProducts({
 *   page: 1,
 *   limit: 20,
 *   status: 'active',
 *   search: 'oak tree'
 * });
 * 
 * // Create product
 * const result = await SellerProductService.createProduct({
 *   name: 'Oak Tree',
 *   sku: 'OAK-001',
 *   category_id: 1,
 *   price: 45.00,
 *   quantity: 10,
 *   description: 'Beautiful oak tree',
 *   images: [{
 *     image_url: 'https://...',
 *     is_primary: true
 *   }]
 * });
 * 
 * // Update product
 * const result = await SellerProductService.updateProduct(1, {
 *   name: 'Updated Oak Tree',
 *   price: 50.00
 * });
 * 
 * // Delete product
 * const result = await SellerProductService.deleteProduct(1);
 */