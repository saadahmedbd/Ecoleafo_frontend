import { ArrowLeft, Wallet, CreditCard, CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function PaymentMethod({ total, onBack, onConfirmPayment }) {
  const [selectedPayment, setSelectedPayment] = useState("cod");

  // Payment methods with Bangladesh mobile banking options
  const paymentMethods = [
    {
      id: "cod",
      label: "Cash on Delivery",
      detail: "Pay when you receive",
      icon: Wallet,
      color: "#059669",
    },
    {
      id: "bkash",
      label: "bKash",
      detail: "Mobile payment",
      icon: CreditCard,
      color: "#E2136E",
      logo: "💳",
    },
    {
      id: "nagad",
      label: "Nagad",
      detail: "Mobile payment",
      icon: CreditCard,
      color: "#F15B2A",
      logo: "💳",
    },
    {
      id: "rocket",
      label: "Rocket",
      detail: "Mobile payment",
      icon: CreditCard,
      color: "#8B3A9C",
      logo: "💳",
    },
  ];

  const handleConfirm = () => {
    onConfirmPayment(selectedPayment);
  };

  return (
    <div className="pb-32 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Payment Method</h1>
      </div>

      {/* Payment Methods */}
      <div className="p-4">
        <h2 className="text-sm text-gray-600 mb-3">Select your payment method</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedPayment === method.id
                    ? "border-[#059669] bg-[#059669]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedPayment === method.id ? "bg-[#059669]/10" : "bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        selectedPayment === method.id
                          ? `${method.color}15`
                          : "#f3f4f6",
                    }}
                  >
                    {method.logo ? (
                      <span className="text-2xl">{method.logo}</span>
                    ) : (
                      <Icon
                        className="w-6 h-6"
                        style={{
                          color:
                            selectedPayment === method.id
                              ? method.color
                              : "#6b7280",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-0.5">{method.label}</h3>
                    <p className="text-xs text-white-500">{method.detail}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <CheckCircle2 className="w-6 h-6 text-[#059669]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Instructions */}
        {selectedPayment !== "cod" && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> You will be redirected to{" "}
              {paymentMethods.find((m) => m.id === selectedPayment)?.label} payment
              gateway to complete your payment.
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="px-4 mb-24">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h3 className="font-medium mb-3">Payment Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-medium text-base">
              <span>You Pay</span>
              <span className="text-[#059669]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Payment Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg max-w-md mx-auto">
        <button
          onClick={handleConfirm}
          className="w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium flex items-center justify-center gap-2"
        >
          Confirm Payment
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
