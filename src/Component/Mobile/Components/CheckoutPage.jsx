import { ArrowLeft, MapPin, CheckCircle2, Edit2, Plus, ChevronRight, Truck, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

/**
 * CheckoutPage Component - Backend Integrated
 * Displays checkout page with address selection and delivery options
 * 
 * Backend APIs used:
 * - GET /api/cart/validate - Validate cart before checkout
 * - GET /api/cart - Get cart items for checkout
 * - Address APIs (if available)
 * 
 * @param {Array} items - Cart items from backend
 * @param {Function} onBack - Navigate back to cart
 * @param {Function} onPlaceOrder - Proceed to payment
 * @param {Array} addresses - User's delivery addresses
 * @param {Function} onAddAddress - Navigate to add address page
 */
export default function CheckoutPage({ 
  items, 
  onBack, 
  onPlaceOrder, 
  addresses = [], 
  onAddAddress 
}) {
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || null);
  const [selectedDelivery, setSelectedDelivery] = useState("standard");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);

  // Delivery options
  const deliveryOptions = [
    { 
      id: "standard", 
      label: "Standard Delivery", 
      duration: "3-5 Business Days",
      date: "Dec 28 - Dec 30",
      fee: 5,
      icon: Truck 
    },
    { 
      id: "express", 
      label: "Express Delivery", 
      duration: "1-2 Business Days",
      date: "Dec 25 - Dec 26",
      fee: 15,
      icon: Truck 
    },
  ];

  // Calculate totals
  const selectedOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
  const deliveryFee = selectedOption?.fee || 5;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  /**
   * Validate cart before checkout
   * Calls backend API: GET /api/cart/validate
   */
  useEffect(() => {
    const validateCartItems = async () => {
      try {
        setIsValidating(true);
        setValidationError(null);
        
        // Call backend to validate cart
        const validationResult = await validateCart();
        
        // Check if any items are unavailable
        if (validationResult.items) {
          const unavailableItems = validationResult.items.filter(
            item => !item.in_stock || item.quantity > item.available_stock
          );
          
          if (unavailableItems.length > 0) {
            setValidationError(
              `Some items are out of stock or have insufficient quantity. Please review your cart.`
            );
          }
        }
      } catch (error) {
        console.error('Cart validation error:', error);
        setValidationError('Unable to validate cart. Please try again.');
      } finally {
        setIsValidating(false);
      }
    };

    if (items.length > 0) {
      validateCartItems();
    }
  }, [items]);

  /**
   * Handle place order
   * Validates all required fields before proceeding
   */
  const handlePlaceOrder = () => {
    // Check if address is selected
    if (!selectedAddress && addresses.length > 0) {
      alert('Please select a delivery address');
      return;
    }

    // Check for validation errors
    if (validationError) {
      alert(validationError);
      return;
    }

    // Proceed to payment
    onPlaceOrder({
      items,
      address: addresses.find(addr => addr.id === selectedAddress),
      delivery: selectedOption,
      subtotal,
      deliveryFee,
      total
    });
  };

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Checkout</h1>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Address Section */}
      <div className="bg-white mb-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#059669]" />
            <h2 className="font-medium">Delivery Address</h2>
          </div>
          <button
            onClick={onAddAddress}
            className="text-[#059669] text-sm flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        
        <div className="space-y-2">
          {addresses.length === 0 ? (
            // No addresses available
            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">No delivery address added</p>
              <button
                onClick={onAddAddress}
                className="text-[#059669] text-sm font-medium hover:underline"
              >
                Add your first address
              </button>
            </div>
          ) : (
            // Display addresses
            addresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedAddress === addr.id
                    ? "border-[#059669] bg-[#059669]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium">{addr.label}</h3>
                      {addr.is_default && (
                        <span className="text-xs bg-[#059669] text-white px-2 py-0.5 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{addr.fullName} - {addr.phone}</p>
                    <p className="text-xs text-gray-600">{addr.address_line1}, {addr.address_line2}</p>
                    <p className="text-xs text-gray-600">{addr.street}, {addr.city}</p>
                    <p className="text-xs text-gray-600">{addr.district}, {addr.state} - {addr.postal_code}</p>
                  </div>
                  {selectedAddress === addr.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#059669] flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Order Items Section */}
      <div className="bg-white mb-2 p-4">
        <h2 className="font-medium mb-3">Order Items ({items.length})</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                  <span className="text-sm font-medium text-[#059669]">${item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Options Section */}
      <div className="bg-white mb-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Truck className="w-5 h-5 text-[#059669]" />
          <h2 className="font-medium">Delivery Options</h2>
        </div>
        <div className="space-y-2">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedDelivery(option.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedDelivery === option.id
                    ? "border-[#059669] bg-[#059669]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    selectedDelivery === option.id ? "bg-[#059669]/10" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      selectedDelivery === option.id ? "text-[#059669]" : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium">{option.label}</h3>
                      <span className="text-sm font-medium text-[#059669]">${option.fee}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{option.duration}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Estimated: {option.date}</span>
                    </div>
                  </div>
                  {selectedDelivery === option.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#059669] flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white mb-20 p-4">
        <h2 className="font-medium mb-3">Payment Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({items.length} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-base">
            <span>Total Amount</span>
            <span className="text-[#059669]">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Place Order Button - Fixed at Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Payment</span>
          <span className="text-lg font-bold text-[#059669]">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isValidating || !!validationError || (addresses.length > 0 && !selectedAddress)}
          className="w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Validating...
            </>
          ) : (
            <>
              Place Order
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * BACKEND INTEGRATION DETAILS:
 * 
 * 1. Cart Validation:
 *    - Calls: GET /api/cart/validate
 *    - Checks stock availability
 *    - Validates quantities
 *    - Shows error if items unavailable
 * 
 * 2. Address Management:
 *    - Addresses passed from parent component
 *    - Parent should fetch from address API
 *    - Selected address passed to payment
 * 
 * 3. Order Creation Flow:
 *    - User selects address and delivery option
 *    - System validates cart
 *    - Proceeds to payment page
 *    - Payment page creates order in backend
 * 
 * 4. Data Flow:
 *    - Cart items from parent (already fetched)
 *    - Validates cart on mount
 *    - Collects delivery preferences
 *    - Passes all data to payment page
 * 
 * Note: Actual order creation happens after payment
 * confirmation in the payment page
 */