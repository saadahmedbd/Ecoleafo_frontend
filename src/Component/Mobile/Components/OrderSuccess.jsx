import { CheckCircle2, Package, Home } from "lucide-react";

export default function OrderSuccess({ orderId, onBackToHome, onViewOrders }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-2xl mb-2 text-green-900">Order Placed Successfully! 🎉</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and will be delivered soon.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-lg text-[#059669] font-mono">{orderId}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onViewOrders}
            className="w-full bg-[#059669] text-white py-3 rounded-xl hover:bg-[#047857] transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Track Your Order
          </button>
          <button
            onClick={onBackToHome}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            You will receive an email confirmation shortly with your order details.
          </p>
        </div>
      </div>
    </div>
  );
}
