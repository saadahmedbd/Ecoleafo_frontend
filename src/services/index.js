/**
 * Services Index - Central export point for all API services
 * 
 * Import examples:
 * import { addToCart, getCart } from './services';
 * import { addToWishlist } from './services';
 * import cartService from './services';
 */

// Import Cart Service
import {
  addToCart,
  getCart,
  getCartSummary,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  bulkUpdateCart,
  getCartCount,
  getCartTotal,
  validateCart,
} from './cartService';

// Import Wishlist Service
import {
  addToWishlist,
  getWishlist,
  moveCartToWishlist,
  moveWishlistToCart,
  removeFromWishlist,
} from './wishlistService';

// Import Save For Later Service
import {
  saveForLater,
  getSavedForLater,
  moveToCart,
} from './saveForLaterService';

// ============================================================================
//                    NAMED EXPORTS (Recommended)
// ============================================================================

// Cart Operations
export {
  addToCart,
  getCart,
  getCartSummary,
  updateCartItem,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  bulkUpdateCart,
  getCartCount,
  getCartTotal,
  validateCart,
};

// Wishlist Operations
export {
  addToWishlist,
  getWishlist,
  moveCartToWishlist,
  moveWishlistToCart,
  removeFromWishlist,
};

// Save For Later Operations
export {
  saveForLater,
  getSavedForLater,
  moveToCart,
};

// ============================================================================
//                    DEFAULT EXPORT (All Services)
// ============================================================================

export default {
  // Cart
  cart: {
    add: addToCart,
    get: getCart,
    getSummary: getCartSummary,
    update: updateCartItem,
    remove: removeFromCart,
    clear: clearCart,
    increment: incrementQuantity,
    decrement: decrementQuantity,
    bulkUpdate: bulkUpdateCart,
    getCount: getCartCount,
    getTotal: getCartTotal,
    validate: validateCart,
  },
  
  // Wishlist
  wishlist: {
    add: addToWishlist,
    get: getWishlist,
    moveFromCart: moveCartToWishlist,
    moveToCart: moveWishlistToCart,
    remove: removeFromWishlist,
  },
  
  // Save For Later
  savedForLater: {
    save: saveForLater,
    get: getSavedForLater,
    moveToCart: moveToCart,
  },
};

/**
 * USAGE EXAMPLES:
 * 
 * // Option 1: Named imports (Recommended)
 * import { addToCart, getCart, removeFromCart } from './services';
 * 
 * await addToCart(productId, quantity);
 * const cart = await getCart();
 * await removeFromCart(productId);
 * 
 * // Option 2: Default import
 * import api from './services';
 * 
 * await api.cart.add(productId, quantity);
 * const cart = await api.cart.get();
 * await api.cart.remove(productId);
 * 
 * // Option 3: Namespace import
 * import * as services from './services';
 * 
 * await services.addToCart(productId, quantity);
 * const cart = await services.getCart();
 */