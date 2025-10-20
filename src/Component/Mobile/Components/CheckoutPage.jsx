import { ArrowLeft, MapPin, CheckCircle2, Edit2, Plus, ChevronRight, Truck, Calendar } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function CheckoutPage({ items, onBack, onPlaceOrder }) {
  const [selectedAddress, setSelectedAddress] = useState("home");
  const [selectedDelivery, setSelectedDelivery] = useState("standard");

  const addresses = [
    { id: "home", label: "Home", address: "123 Oak Street, Springfield, IL 62701" },
    { id: "work", label: "Work", address: "456 Pine Avenue, Chicago, IL 60601" },
  ];

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

  const selectedOption = deliveryOptions.find(opt => opt.id === selectedDelivery);
  const deliveryFee = selectedOption?.fee || 5;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Checkout</h1>
      </div>

      {/* Delivery Address */}
      <div className="bg-white mb-2 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#059669]" />
            <h2 className="font-medium">Delivery Address</h2>
          </div>
          <button className="text-[#059669] text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
        <div className="space-y-2">
          {addresses.map((addr) => (
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
                    {selectedAddress === addr.id && (
                      <span className="text-xs bg-[#059669] text-white px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{addr.address}</p>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Order Items */}
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

      {/* Delivery Options */}
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

      {/* Order Summary */}
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

      {/* Place Order Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Payment</span>
          <span className="text-lg font-bold text-[#059669]">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onPlaceOrder}
          className="w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium flex items-center justify-center gap-2"
        >
          Place Order
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
