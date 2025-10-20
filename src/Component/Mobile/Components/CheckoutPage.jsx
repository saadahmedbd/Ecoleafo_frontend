import { ArrowLeft, MapPin, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CheckoutPage({ items, total, onBack, onPlaceOrder }) {
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedPayment, setSelectedPayment] = useState("card");

  const addresses = [
    { id: "home", label: "Home", address: "123 Oak Street, Springfield, IL 62701" },
    { id: "work", label: "Work", address: "456 Pine Avenue, Chicago, IL 60601" },
  ];

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: CreditCard, detail: "**** 4242" },
    { id: "cod", label: "Cash on Delivery", icon: Wallet, detail: "Pay when you receive" },
  ];

  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">Checkout</h1>
      </div>

      {/* Delivery Address */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Delivery Address</h2>
          <button className="text-[#059669] text-sm">Add New</button>
        </div>
        <div className="space-y-3">
          {addresses.map((addr) => (
            <button
              key={addr.id}
              onClick={() => setSelectedAddress(addr.id)}
              className={`w-full text-left bg-white rounded-xl p-4 border-2 transition-all ${
                selectedAddress === addr.id
                  ? "border-[#059669] bg-[#059669]/5"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#059669] mt-1" />
                <div className="flex-1">
                  <h3 className="text-sm mb-1">{addr.label}</h3>
                  <p className="text-sm text-gray-600">{addr.address}</p>
                </div>
                {selectedAddress === addr.id && (
                  <CheckCircle2 className="w-6 h-6 text-[#059669]" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-4 py-4">
        <h2 className="text-lg mb-3">Payment Method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full text-left bg-white rounded-xl p-4 border-2 transition-all ${
                  selectedPayment === method.id
                    ? "border-[#059669] bg-[#059669]/5"
                    : "border-border hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#059669]" />
                  <div className="flex-1">
                    <h3 className="text-sm mb-0.5">{method.label}</h3>
                    <p className="text-xs text-gray-600">{method.detail}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#059669]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 py-4">
        <h2 className="text-lg mb-3">Order Summary</h2>
        <div className="bg-white rounded-xl p-4 border border-border">
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${(total - 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-[#059669]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-border px-4 py-3">
        <button
          onClick={onPlaceOrder}
          className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors"
        >
          Place Order (${total.toFixed(2)})
        </button>
      </div>
    </div>
  );
}
