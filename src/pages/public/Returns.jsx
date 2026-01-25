import React from 'react';
import { RotateCcw } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function Returns() {
  usePageTitle('Returns & Refunds');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RotateCcw className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Return & Refund Policy</h1>
          <p className="text-emerald-100">Last updated: January 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Policy</h2>
            <p className="text-gray-600 mb-4">
              We want you to be completely satisfied with your purchase. If you receive damaged or unhealthy plants, 
              we offer a 7-day return policy from the date of delivery.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Eligible Returns</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Plants that arrive dead or severely damaged</li>
              <li>Wrong items delivered</li>
              <li>Defective products or accessories</li>
              <li>Items significantly different from description</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Non-Returnable Items</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Plants damaged due to improper care after delivery</li>
              <li>Items without original packaging</li>
              <li>Customized or personalized products</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Return Process</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2">
              <li>Contact support within 7 days with photos of the issue</li>
              <li>Wait for return approval from our team</li>
              <li>Pack the item securely in original packaging</li>
              <li>Ship to provided return address</li>
              <li>Refund processed within 7-10 business days</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Refund Method</h3>
            <p className="text-gray-600">
              Refunds will be issued to the original payment method. For COD orders, 
              refunds will be processed via bank transfer or mobile wallet.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
