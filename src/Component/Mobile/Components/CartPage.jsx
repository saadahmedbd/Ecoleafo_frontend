import { Trash2, Plus, Minus, Tag } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function CartPage({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5 : 0;
  const total = subtotal + deliveryFee;

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
        <h1 className="text-xl">Shopping Cart</h1>
        <p className="text-sm text-gray-600">{items.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-border">
            <div className="flex gap-3">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-sm mb-1 line-clamp-2">{item.name}</h3>
                {item.size && <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-[#059669]">${item.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 hover:bg-red-50 rounded-lg self-start"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-[#f97316]" />
            <input
              type="text"
              placeholder="Enter coupon code"
              className="flex-1 outline-none"
            />
            <button className="text-[#059669] text-sm">Apply</button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border">
          <h3 className="mb-3">Order Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span>Total</span>
              <span className="text-[#059669]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border px-4 py-3">
        <button
          onClick={onCheckout}
          className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors"
        >
          Proceed to Checkout (${total.toFixed(2)})
        </button>
      </div>
    </div>
  );
}
