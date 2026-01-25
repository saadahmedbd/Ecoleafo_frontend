import { ArrowLeft, Package, Truck, CheckCircle2, MapPin, Clock } from "lucide-react";
import { usePageTitle } from '@/hooks/usePageTitle';

export default function TrackOrder({ orderId, onBack }) {
  usePageTitle('Track Order');
  // Mock tracking data
  const orderStatus = {
    orderId: orderId || "ORD12347",
    status: "in-transit",
    estimatedDelivery: "Dec 28, 2024",
    currentLocation: "Distribution Center, New York",
  };

  const trackingSteps = [
    {
      id: 1,
      label: "Order Placed",
      description: "Your order has been confirmed",
      date: "Dec 23, 2024 - 10:30 AM",
      completed: true,
      icon: CheckCircle2,
    },
    {
      id: 2,
      label: "Processing",
      description: "Your order is being prepared",
      date: "Dec 23, 2024 - 2:15 PM",
      completed: true,
      icon: Package,
    },
    {
      id: 3,
      label: "Shipped",
      description: "Your order is on the way",
      date: "Dec 24, 2024 - 9:00 AM",
      completed: true,
      icon: Truck,
      active: true,
    },
    {
      id: 4,
      label: "Out for Delivery",
      description: "Your order is out for delivery",
      date: "Pending",
      completed: false,
      icon: Truck,
    },
    {
      id: 5,
      label: "Delivered",
      description: "Your order has been delivered",
      date: "Pending",
      completed: false,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Track Order</h1>
      </div>

      {/* Order Info Card */}
      <div className="p-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-medium font-mono">#{orderStatus.orderId}</p>
            </div>
            <div className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-medium">
              In Transit
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              Estimated Delivery: <span className="font-medium text-gray-900">{orderStatus.estimatedDelivery}</span>
            </span>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-gradient-to-r from-[#059669] to-[#047857] rounded-xl p-4 mb-4 text-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Current Location</p>
              <p className="font-medium">{orderStatus.currentLocation}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h2 className="font-medium mb-4">Order Timeline</h2>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === trackingSteps.length - 1;
              
              return (
                <div key={step.id} className="flex gap-3">
                  {/* Icon and Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-[#059669] text-white"
                          : "bg-gray-200 text-gray-400"
                      } ${step.active ? "ring-4 ring-[#059669]/20" : ""}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {!isLast && (
                      <div
                        className={`w-0.5 h-12 ${
                          step.completed ? "bg-[#059669]" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <h3
                      className={`text-sm font-medium mb-1 ${
                        step.completed ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p
                      className={`text-xs mb-1 ${
                        step.completed ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                    <p
                      className={`text-xs ${
                        step.completed ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {step.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Need Help?</strong>
          </p>
          <p className="text-xs text-blue-700">
            Contact our support team if you have any questions about your order.
          </p>
          <button className="mt-3 text-sm text-blue-600 font-medium hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
