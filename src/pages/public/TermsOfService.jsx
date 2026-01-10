import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-emerald-100">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using Ecoleafo, you accept and agree to be bound by these Terms of Service. 
              If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">User Accounts</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>You must be 18 years or older to create an account</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>You are responsible for all activities under your account</li>
              <li>Notify us immediately of unauthorized access</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Buyer Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate delivery information</li>
              <li>Inspect products upon delivery</li>
              <li>Report issues within specified timeframes</li>
              <li>Follow plant care instructions provided</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seller Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate product descriptions and images</li>
              <li>Ensure product quality and proper packaging</li>
              <li>Process orders within specified timeframes</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain minimum 15% commission rate</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Fraudulent transactions or misrepresentation</li>
              <li>Selling prohibited or illegal items</li>
              <li>Harassment or abusive behavior</li>
              <li>Unauthorized use of platform features</li>
              <li>Violation of intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <p className="text-gray-600 mb-3">
              All prices are in Bangladeshi Taka (BDT). Payment must be completed before order processing. 
              We accept multiple payment methods as listed on our platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
            <p className="text-gray-600">
              Ecoleafo acts as a marketplace platform. We are not responsible for the quality, 
              safety, or legality of products listed by sellers. Our liability is limited to 
              the amount paid for the specific transaction.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination</h3>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate accounts that violate these terms 
              or engage in fraudulent activities.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
            <p className="text-gray-600">
              We may update these terms periodically. Continued use of the platform constitutes 
              acceptance of updated terms.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact</h3>
            <p className="text-gray-600">
              For questions about these terms, contact us at legal@ecoleafo.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
