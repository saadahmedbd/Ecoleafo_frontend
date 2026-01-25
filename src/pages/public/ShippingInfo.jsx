import React from 'react';
import { Truck } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ShippingInfo() {
  usePageTitle('Shipping Information');
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Truck className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-emerald-100">Delivery details and policies</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-md p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Areas</h2>
            <p className="text-gray-600">
              We deliver to all major cities across Bangladesh including Dhaka, Chittagong, Sylhet, 
              Rajshahi, Khulna, and more.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Time</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Dhaka: 2-3 business days</li>
              <li>Major cities: 4-5 business days</li>
              <li>Other areas: 5-7 business days</li>
              <li>Plants may require additional 1-2 days for special handling</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Shipping Charges</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-gray-900">Location</th>
                    <th className="px-4 py-3 text-gray-900">Charge</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-t">
                    <td className="px-4 py-3">Inside Dhaka</td>
                    <td className="px-4 py-3">৳100</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Outside Dhaka</td>
                    <td className="px-4 py-3">৳150</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">Orders above ৳5000</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">FREE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Plant Care During Shipping</h3>
            <p className="text-gray-600 mb-3">
              We take special care to ensure your plants arrive healthy:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Secure packaging with proper ventilation</li>
              <li>Moisture retention for plant roots</li>
              <li>Protection from extreme temperatures</li>
              <li>Careful handling by trained delivery personnel</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Tracking</h3>
            <p className="text-gray-600">
              Track your order anytime from your account dashboard or use the tracking link 
              sent to your email after shipment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
