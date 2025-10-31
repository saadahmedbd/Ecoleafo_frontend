// ==========================================
// ADD PAYMENT METHOD PAGE
// ==========================================
// Purpose: Add payment method for sellers before they can start selling
// Backend: POST /api/seller/payment-methods
// Redirects: To pending-approval page after completion
// ==========================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAddPaymentMethodMutation } from '../../features/auth/sellerAuthApi';
import SellerAuthService from '../../services/SellerAuthService';
export default function AddPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get message from navigation state
  const infoMessage = location.state?.message;

  // RTK Query mutation
  const [addPaymentMethod, { isLoading }] = useAddPaymentMethodMutation();

  // Local state
  const [formData, setFormData] = useState({
    payment_type: '',
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    routing_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    if (!formData.payment_type) {
      setError('Please select a payment method');
      return false;
    }

    if (!formData.account_name.trim()) {
      setError('Account name is required');
      return false;
    }

    if (!formData.account_number.trim()) {
      setError('Account number is required');
      return false;
    }

    if (formData.payment_type === 'bank_transfer' && !formData.bank_name.trim()) {
      setError('Bank name is required for bank transfers');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await SellerAuthService.addPaymentMethod ({
        type: formData.payment_type,
        account_name: formData.account_name,
        account_number: formData.account_number,
        is_default: true,
        ...(formData.payment_type === 'bank_transfer' && {
          bank_name: formData.bank_name,
          bank_code: formData.bank_code || '',
          routing_number: formData.routing_number || ''
        })
      });

      
      
      if (response.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/pending-approval');
      }, 2000);
    } else {
      setError(response.error);
    }

    } catch (err) {
      setError(err?.data?.message || 'Failed to add payment method. Please try again.');
      console.error('Payment method error:', err);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Payment Method</h1>
              <p className="text-sm text-gray-600 mt-1">
                Add at least one payment method to receive your earnings
              </p>
            </div>
          </div>

          {/* Info Message */}
          {infoMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">{infoMessage}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-emerald-800">
                <p className="font-medium">Payment method added successfully!</p>
                <p className="mt-1">Redirecting to approval status...</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="rocket">Rocket</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Where you'll receive payments from customers
              </p>
            </div>

            {/* Account Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="Account holder name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="account_number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder={formData.payment_type === 'bank_transfer' ? 'Bank account number' : 'Mobile number'}
                  required
                />
              </div>
            </div>

            {/* Bank-specific fields */}
            {formData.payment_type === 'bank_transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bank Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Bank Name *"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="bank_code"
                      value={formData.bank_code}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Bank Code (Optional)"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="routing_number"
                      value={formData.routing_number}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Routing Number (Optional)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Important Information</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• This will be your default payment method</li>
                <li>• You can add more payment methods later from your dashboard</li>
                <li>• Ensure all information is accurate to avoid payment delays</li>
                <li>• Your payment information is securely encrypted</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={isLoading || success}
                className="flex items-center bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Adding Payment Method...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Added Successfully
                  </>
                ) : (
                  <>
                    Add Payment Method
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}