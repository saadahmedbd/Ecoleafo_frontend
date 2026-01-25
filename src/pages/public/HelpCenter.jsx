import React, { useState } from 'react';
import { Search, ShoppingCart, Package, CreditCard, Users, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function HelpCenter() {
  usePageTitle('Help Center');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { icon: ShoppingCart, title: 'Orders & Shopping', count: 8 },
    { icon: Package, title: 'Shipping & Delivery', count: 6 },
    { icon: CreditCard, title: 'Payment & Refunds', count: 5 },
    { icon: Users, title: 'Account & Profile', count: 7 },
  ];

  const faqs = [
    {
      category: 'Orders & Shopping',
      question: 'How do I place an order?',
      answer: 'Browse products, add items to cart, proceed to checkout, enter shipping details, and complete payment. You\'ll receive an order confirmation email.'
    },
    {
      category: 'Orders & Shopping',
      question: 'Can I modify or cancel my order?',
      answer: 'You can cancel orders within 1 hour of placement. Contact support immediately for modifications. Once shipped, cancellation is not possible.'
    },
    {
      category: 'Orders & Shopping',
      question: 'How do I track my order?',
      answer: 'Go to "My Orders" in your account dashboard. Click on the order to view tracking details and delivery status.'
    },
    {
      category: 'Shipping & Delivery',
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary by location and order value. Free delivery on orders above ৳1000 within Dhaka. Check at checkout for exact charges.'
    },
    {
      category: 'Shipping & Delivery',
      question: 'How long does delivery take?',
      answer: 'Dhaka: 2-3 days, Other cities: 4-7 days. Plants require special handling and may take slightly longer.'
    },
    {
      category: 'Shipping & Delivery',
      question: 'Do you deliver nationwide?',
      answer: 'Yes, we deliver to all major cities across Bangladesh. Some remote areas may have limited delivery options.'
    },
    {
      category: 'Payment & Refunds',
      question: 'What payment methods do you accept?',
      answer: 'We accept bKash, Nagad, Rocket, bank transfers, and cash on delivery (COD) for eligible orders.'
    },
    {
      category: 'Payment & Refunds',
      question: 'Is my payment information secure?',
      answer: 'Yes, all transactions are encrypted and secure. We never store your payment card details.'
    },
    {
      category: 'Payment & Refunds',
      question: 'What is your refund policy?',
      answer: 'Full refund for damaged/dead plants within 7 days of delivery. Refunds processed within 7-10 business days.'
    },
    {
      category: 'Account & Profile',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up", enter your email, create a password, and verify your email. You can also sign up during checkout.'
    },
    {
      category: 'Account & Profile',
      question: 'I forgot my password. What should I do?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.'
    },
    {
      category: 'Account & Profile',
      question: 'How do I become a seller?',
      answer: 'Click "Become a Seller", complete the registration form with business details, and wait for admin approval (usually 2-3 days).'
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Find answers to your questions and get the help you need
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-emerald-300 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Category</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <category.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600">{category.count} articles</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {searchQuery ? 'Search Results' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="text-left">
                    <span className="text-xs text-emerald-600 font-medium">{faq.category}</span>
                    <h3 className="font-semibold text-gray-900 mt-1">{faq.question}</h3>
                  </div>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No results found. Try different keywords.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@ecoleafo.com"
              className="bg-white text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
