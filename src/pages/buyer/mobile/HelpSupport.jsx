import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HelpSupport({ onBack }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I track my order?",
      answer:
        'You can track your order from the "Orders" section. Click on any order to view its current status and tracking details.',
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of delivery. The trees must be in their original condition. Simply go to your order and select 'Return Item' to initiate the process.",
    },
    {
      id: 3,
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 3-5 business days. Express delivery is available for 1-2 business days at checkout.",
    },
    {
      id: 4,
      question: "Do you offer planting services?",
      answer:
        "Yes! We offer professional planting services in select areas. You can add this service during checkout or contact our support team.",
    },
    {
      id: 5,
      question: "How do I care for my trees?",
      answer:
        "Each tree comes with a detailed care guide. You can also find care instructions in the product details page and our blog section.",
    },
    {
      id: 6,
      question: "Can I change my delivery address?",
      answer:
        "Yes, you can change your delivery address before the order is shipped. Go to your order details and select 'Change Address'.",
    },
  ];

  const quickLinks = [
    { title: "Refunds & Returns", description: "Learn about our return process" },
    { title: "Shipping Information", description: "Delivery times and costs" },
    { title: "Payment Issues", description: "Help with payment problems" },
    { title: "Order Delays", description: "Track delayed orders" },
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl">Help & Support</h1>
      </div>

      {/* Contact Options */}
      <div className="p-4 space-y-3">
        <h2 className="text-lg mb-3">Contact Us</h2>
        <button className="w-full bg-white rounded-xl p-4 border border-border flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 rounded-full">
            <MessageCircle className="w-6 h-6 text-[#059669]" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm mb-1">Live Chat</h3>
            <p className="text-xs text-gray-600">Get instant support</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 border border-border flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="p-3 bg-green-50 rounded-full">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm mb-1">Call Us</h3>
            <p className="text-xs text-gray-600">+1 (800) 123-4567</p>
          </div>
        </button>

        <button className="w-full bg-white rounded-xl p-4 border border-border flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="p-3 bg-orange-50 rounded-full">
            <Mail className="w-6 h-6 text-[#f97316]" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="text-sm mb-1">Email Support</h3>
            <p className="text-xs text-gray-600">support@treeshop.com</p>
          </div>
        </button>
      </div>

      {/* Quick Links */}
      <div className="px-4 py-4">
        <h2 className="text-lg mb-3">Quick Help</h2>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              className={`w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                index < quickLinks.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="text-left">
                <h3 className="text-sm mb-0.5">{link.title}</h3>
                <p className="text-xs text-gray-600">{link.description}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 -rotate-90" />
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="px-4 py-4">
        <h2 className="text-lg mb-3">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-left pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedFaq === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 pt-3">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
