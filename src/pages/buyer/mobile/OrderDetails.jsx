import { ArrowLeft, Package, MapPin, CheckCircle2, Clock, Truck, Download, RotateCcw } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { usePageTitle } from '@/hooks/usePageTitle';

export default function OrderDetails({ order, onBack, onReorder, onProductClick }) {
  usePageTitle('Order Details');
  // Order status timeline
  const getStatusSteps = () => {
    const steps = [
      { label: "Order Placed", icon: CheckCircle2, completed: true },
      { label: "Processing", icon: Package, completed: order.status !== "cancelled" },
      { label: "Shipped", icon: Truck, completed: order.status === "delivered" },
      { label: "Delivered", icon: CheckCircle2, completed: order.status === "delivered" },
    ];
    return steps;
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-medium">Order Details</h1>
          <p className="text-xs text-gray-600">#{order.id}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white p-4 mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Order Status</h2>
          <span className={`text-sm px-3 py-1 rounded-full ${
            order.status === "delivered" ? "bg-green-50 text-green-600" :
            order.status === "in-progress" ? "bg-orange-50 text-orange-600" :
            "bg-red-50 text-red-600"
          }`}>
            {order.status === "delivered" ? "Delivered" : 
             order.status === "in-progress" ? "In Progress" : "Cancelled"}
          </span>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4">
          {getStatusSteps().map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed ? "bg-[#059669] text-white" : "bg-gray-200 text-gray-400"
              }`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                  {step.label}
                </p>
                {step.completed && index === 0 && (
                  <p className="text-xs text-gray-500">{order.date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white p-4 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#059669]" />
          <h2 className="font-medium">Delivery Address</h2>
        </div>
        <p className="text-sm text-gray-600">
          123 Main Street, Apt 4B<br />
          New York, NY 10001<br />
          United States
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-white p-4 mb-2">
        <h2 className="font-medium mb-3">Order Items ({order.items.length})</h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div
              key={index}
              onClick={() => onProductClick(item)}
              className="flex gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                <p className="text-xs text-gray-600 mb-2">Qty: 1</p>
                <p className="text-[#059669] font-medium">${item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 mb-2">
        <h2 className="font-medium mb-3">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
            <span>Total</span>
            <span className="text-[#059669]">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {order.status === "delivered" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 max-w-md mx-auto">
          <button
            onClick={() => onReorder(order)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#059669] text-white rounded-xl hover:bg-[#047857] font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            Reorder All Items
          </button>
        </div>
      )}
    </div>
  );
}
