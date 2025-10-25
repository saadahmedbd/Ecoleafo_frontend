import { Trash2, Plus, Minus, Tag, Store, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/**
 * CartPage Component - Backend Integrated
 * Displays shopping cart items with full backend integration
 * 
 * Backend APIs used:
 * - GET /api/get/cart - Load cart items
 * - PUT /api/cart/{productId} - Update cart item
 * - DELETE /api/cart/{productId} - Remove from cart
 * - POST /api/cart/{productId}/increment - Increase quantity
 * - POST /api/cart/{productId}/decrement - Decrease quantity
 * 
 * @param {Array} items - Cart items from backend
 * @param {Function} onUpdateQuantity - Update item quantity (calls backend API)
 * @param {Function} onRemoveItem - Remove item from cart (calls backend API)
 * @param {Function} onCheckout - Proceed to checkout
 * @param {Boolean} isLoggedIn - User login status
 */
export default function CartPage({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isLoggedIn = false,
}) {
  // Track selected items for checkout
  const [selectedItems, setSelectedItems] = useState(new Set(items.map(item => item.id)));

  /**
   * Toggle item selection for checkout
   */
  const toggleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  /**
   * Select or deselect all items
   */
  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  // Calculate totals for selected items only
  const selectedCartItems = items.filter(item => selectedItems.has(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-140px)] px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl mb-2">Your cart is empty</h2>
        <p className="text-gray-600 text-center">
          Add some trees to your cart to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-4 mb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl">Shopping Cart</h1>
            <p className="text-sm text-gray-600">{items.length} items</p>
          </div>
          <button
            onClick={toggleSelectAll}
            className="text-sm text-[#059669] font-medium"
          >
            {selectedItems.size === items.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="px-4 space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-border">
            {/* Seller Store Link */}
            <button className="flex items-center gap-2 mb-3 text-sm text-gray-700 hover:text-[#059669]">
              <Store className="w-4 h-4" />
              <span>{item.seller || "TreeStore Official"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              {/* Checkbox for item selection */}
              <input
                type="checkbox"
                checked={selectedItems.has(item.id)}
                onChange={() => toggleSelectItem(item.id)}
                className="w-5 h-5 mt-1 accent-[#059669] cursor-pointer"
                aria-label={`Select ${item.name}`}
              />

              {/* Product Image */}
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                {item.size && <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>}
                
                <div className="flex items-center justify-between">
                  {/* Price */}
                  <span className="text-[#059669] font-medium">${item.price}</span>
                  
                  {/* Quantity Controls */}
                  {/* These buttons call backend API: POST /api/cart/{productId}/increment or /decrement */}
                  <div className="flex items-center gap-2">
                    {/* Decrement Button */}
                    {/* Calls: POST /api/cart/{productId}/decrement */}
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Current Quantity */}
                    <span className="w-8 text-center font-medium">{item.quantity}</span>

                    {/* Increment Button */}
                    {/* Calls: POST /api/cart/{productId}/increment */}
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove Item Button */}
              {/* Calls backend API: DELETE /api/cart/{productId} */}
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 hover:bg-red-50 rounded-lg self-start transition-colors"
                aria-label="Remove item from cart"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code Section */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#f97316]" />
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 outline-none text-sm"
            />
            <button className="text-[#059669] text-sm font-medium hover:underline">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <h3 className="mb-3 font-medium">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Subtotal ({selectedItems.size} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="text-[#059669] text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button - Fixed at Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border px-4 py-3 max-w-md mx-auto shadow-lg">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600">{selectedItems.size} item(s) selected</span>
          <span className="font-medium">Total: <span className="text-[#059669]">${total.toFixed(2)}</span></span>
        </div>
        <button
          onClick={onCheckout}
          disabled={selectedItems.size === 0}
          className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
        </button>
      </div>
    </div>
  );
}

/**
 * BACKEND INTEGRATION DETAILS:
 * 
 * 1. Loading Cart Data:
 *    - Parent component calls: GET /api/get/cart
 *    - Returns cart items with product details
 *    - Transformed to frontend format in parent
 * 
 * 2. Update Quantity (onUpdateQuantity):
 *    - Option A: PUT /api/cart/{productId} with new quantity
 *    - Option B: POST /api/cart/{productId}/increment
 *    - Option C: POST /api/cart/{productId}/decrement
 *    - Parent component handles API call and reloads cart
 * 
 * 3. Remove Item (onRemoveItem):
 *    - Calls: DELETE /api/cart/{productId}
 *    - Parent component reloads cart after deletion
 * 
 * 4. Checkout (onCheckout):
 *    - Validates user is logged in
 *    - Navigates to checkout page
 *    - Selected items passed to checkout
 * 
 * Data Flow:
 * - Parent (MobileApp) fetches cart from backend
 * - This component displays and allows interactions
 * - All modifications go through parent to backend
 * - Parent reloads cart data after changes
 * - Toast notifications shown for feedback
 * 
 * Note: Cart data is stored in backend database
 * associated with buyer's JWT token
 */