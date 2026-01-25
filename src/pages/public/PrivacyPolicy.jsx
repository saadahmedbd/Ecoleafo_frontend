import React from 'react';
import { Shield } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PrivacyPolicy() {
  usePageTitle('Privacy Policy');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-emerald-100">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-3">We collect information to provide better services:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Personal information (name, email, phone, address)</li>
              <li>Payment information (processed securely)</li>
              <li>Order history and preferences</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and updates</li>
              <li>Improve our services and user experience</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h3>
            <p className="text-gray-600 mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Delivery partners for order fulfillment</li>
              <li>Payment processors for transactions</li>
              <li>Service providers who assist our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h3>
            <p className="text-gray-600">
              We implement industry-standard security measures to protect your data including 
              encryption, secure servers, and regular security audits.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h3>
            <p className="text-gray-600">
              We use cookies to enhance your browsing experience, analyze site traffic, 
              and personalize content. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h3>
            <p className="text-gray-600">
              For privacy concerns or questions, contact us at privacy@ecoleafo.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
