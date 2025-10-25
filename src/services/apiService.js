/**
 * API Service for Cart and Wishlist Operations
 * Base URL: http://localhost:3000
 * All endpoints require JWT Bearer token authentication
 */

const API_BASE_URL = 'http://localhost:3000';

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Create headers with authentication
 * @returns {Object} Headers object with auth token
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

/**
 * Handle API response and errors
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed JSON response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// ============================================================================
//                           CART API METHODS
// ============================================================================

/**
 * Add product to cart
 * POST /api/cart
 * @param {number} productId - Product ID to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @param {boolean} isGift - Whether item is a gift (default: false)
 * @param {string} giftMessage - Gift message if applicable
 * @returns {Promise<Object>} Cart summary
 */
export const addToCart = async (productId, quantity = 1, isGift = false, giftMessage = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
        is_gift: isGift,
        gift_message: giftMessage,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

/**
 * Get cart items
 * GET /api/get/cart
 * @returns {Promise<Object>} Cart summary with items
 */
export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/get/cart`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

/**
 * Get cart summary (alias for getCart)
 * GET /api/cart/summary
 * @returns {Promise<Object>} Cart summary
 */
export const getCartSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get cart summary error:', error);
    throw error;
  }
};

/**
 * Update cart item
 * PUT /api/cart/{productId}
 * @param {number} productId - Product ID to update
 * @param {number} quantity - New quantity
 * @param {boolean} gift - Whether item is a gift
 * @param {string} giftMessage - Gift message
 * @returns {Promise<string>} Success message
 */
export const updateCartItem = async (productId, quantity, gift = false, giftMessage = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        quantity: quantity,
        gift: gift,
        gift_message: giftMessage,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/{productId}
 * @param {number} productId - Product ID to remove
 * @returns {Promise<string>} Success message
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 * @returns {Promise<string>} Success message
 */
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

/**
 * Increment product quantity in cart
 * POST /api/cart/{productId}/increment
 * @param {number} productId - Product ID to increment
 * @returns {Promise<string>} Success message
 */
export const incrementQuantity = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/increment`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Increment quantity error:', error);
    throw error;
  }
};

/**
 * Decrement product quantity in cart
 * POST /api/cart/{productId}/decrement
 * @param {number} productId - Product ID to decrement
 * @returns {Promise<string>} Success message
 */
export const decrementQuantity = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/decrement`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Decrement quantity error:', error);
    throw error;
  }
};

/**
 * Bulk update cart items
 * POST /api/cart/bulk-update
 * @param {Array} items - Array of {product_id, quantity} objects
 * @returns {Promise<string>} Success message
 */
export const bulkUpdateCart = async (items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/bulk-update`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Bulk update cart error:', error);
    throw error;
  }
};

// ============================================================================
//                      SAVE FOR LATER API METHODS
// ============================================================================

/**
 * Save cart item for later
 * POST /api/cart/{productId}/save-later
 * @param {number} productId - Product ID to save for later
 * @returns {Promise<string>} Success message
 */
export const saveForLater = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/save-later`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Save for later error:', error);
    throw error;
  }
};

/**
 * Get saved for later items
 * GET /api/cart/saved-for-later
 * @returns {Promise<Array>} Array of saved items
 */
export const getSavedForLater = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/saved-for-later`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get saved for later error:', error);
    throw error;
  }
};

/**
 * Move saved item back to cart
 * POST /api/cart/{productId}/move-to-cart
 * @param {number} productId - Product ID to move to cart
 * @returns {Promise<string>} Success message
 */
export const moveToCart = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/move-to-cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Move to cart error:', error);
    throw error;
  }
};

// ============================================================================
//                         WISHLIST API METHODS
// ============================================================================

/**
 * Add product to wishlist
 * POST /api/wishlist
 * @param {number} productId - Product ID to add to wishlist
 * @returns {Promise<string>} Success message
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ product_id: productId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    throw error;
  }
};

/**
 * Get wishlist items
 * GET /api/wishlist
 * @returns {Promise<Array>} Array of wishlist items
 */
export const getWishlist = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get wishlist error:', error);
    throw error;
  }
};

/**
 * Move cart item to wishlist
 * POST /api/cart/{productId}/move-to-wishlist
 * @param {number} productId - Product ID to move to wishlist
 * @returns {Promise<string>} Success message
 */
export const moveCartToWishlist = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}/move-to-wishlist`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Move cart to wishlist error:', error);
    throw error;
  }
};

/**
 * Move wishlist item to cart
 * POST /api/wishlist/{productId}/move-to-cart
 * @param {number} productId - Product ID to move to cart
 * @returns {Promise<string>} Success message
 */
export const moveWishlistToCart = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}/move-to-cart`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Move wishlist to cart error:', error);
    throw error;
  }
};

/**
 * Remove item from wishlist
 * DELETE /api/wishlist/{productId}
 * @param {number} productId - Product ID to remove from wishlist
 * @returns {Promise<string>} Success message
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wishlist/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    throw error;
  }
};

// ============================================================================
//                         UTILITY API METHODS
// ============================================================================

/**
 * Validate cart items (check stock availability)
 * GET /api/cart/validate
 * @returns {Promise<Object>} Cart summary with validation status
 */
export const validateCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/validate`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Validate cart error:', error);
    throw error;
  }
};

/**
 * Get cart item count
 * GET /api/cart/count
 * @returns {Promise<Object>} Object with count property
 */
export const getCartCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/count`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get cart count error:', error);
    throw error;
  }
};

/**
 * Get cart total
 * GET /api/cart/total
 * @returns {Promise<Object>} Object with total property
 */
export const getCartTotal = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cart/total`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Get cart total error:', error);
    throw error;
  }
};

// Export all methods as default object
export default {
  // Cart operations
  addToCart,
  getCart,
  getCartSummary,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  bulkUpdateCart,
  
  // Save for later
  saveForLater,
  getSavedForLater,
  moveToCart,
  
  // Wishlist operations
  addToWishlist,
  getWishlist,
  moveCartToWishlist,
  moveWishlistToCart,
  removeFromWishlist,
  
  // Utilities
  validateCart,
  getCartCount,
  getCartTotal,
};