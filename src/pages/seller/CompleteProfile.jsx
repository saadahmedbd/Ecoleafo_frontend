// ==========================================
// SELLER PROFILE COMPLETION PAGE
// ==========================================
// Purpose: Complete business profile and address for sellers who registered but didn't finish
// Backend: POST /api/seller/profile/complete
// Redirects: To add-payment page after completion
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, MapPin, Building2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useCompleteProfileMutation } from '../../features/auth/sellerAuthApi';
import SellerAuthService from '../../services/SellerAuthService';
export default function CompleteProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get missing fields from navigation state
  const missingFields = location.state?.missingFields || [];

  // RTK Query mutation
  const [completeProfile, { isLoading }] = useCompleteProfileMutation();

  // Local state
  const [formData, setFormData] = useState({
    business_email: '',
    phone: '',
    store_description: '',
    business_type: '',
    tax_number: '',
    business_license: '',
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    postal_code: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // ==========================================
  // LOAD EXISTING USER DATA
  // ==========================================
  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Pre-fill phone if available
        if (user.phone) {
          setFormData(prev => ({ ...prev, phone: user.phone }));
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    }
  }, []);

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
   * Validate email
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate Bangladesh phone
   */
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  /**
   * Validate form
   */
  const validateForm = () => {
    // Business Email
    if (!validateEmail(formData.business_email)) {
      setError('Please enter a valid business email');
      return false;
    }

    // Phone
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid Bangladesh phone number');
      return false;
    }

    // Store Description
    if (!formData.store_description.trim() || formData.store_description.length < 50) {
      setError('Store description must be at least 50 characters');
      return false;
    }

    // Business Type
    if (!formData.business_type) {
      setError('Please select a business type');
      return false;
    }

    // Address
    if (!formData.address.trim() || formData.address.length < 10) {
      setError('Please enter a complete address (minimum 10 characters)');
      return false;
    }

    // City, State, Postal Code
    if (!formData.city.trim() || !formData.state.trim() || !formData.postal_code.trim()) {
      setError('Please fill in all required address fields');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  

    if (!validateForm()) return;

    try {
      const response =await SellerAuthService.completeProfile({
        business_email: formData.business_email,
        phone: formData.phone,
        store_description: formData.store_description,
        business_type: formData.business_type,
        tax_number: formData.tax_number || '',
        business_license: formData.business_license || '',
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postal_code: formData.postal_code
      });

      if (response.success){
        setSuccess(true);
        // Redirect to payment method page after 2 seconds
      setTimeout(() => {
        navigate('/seller/add-payment', {
          state: { 
            message: 'Profile completed! Now add a payment method to start selling.' 
          }
        });
      }, 2000);
      }else{
        setError(response.error)
      }

    } catch (err) {
      setError(err?.data?.message || 'Failed to complete profile. Please try again.');
      console.error('Profile completion error:', err);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <Building2 className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <p className="text-sm text-gray-600 mt-1">
                Please complete your business profile to continue
              </p>
            </div>
          </div>

          {/* Missing Fields Info */}
          {missingFields.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Missing Information</p>
                  <p>Please provide: {missingFields.join(', ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 flex items-start">
              <CheckCircle className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-emerald-800">
                <p className="font-medium">Profile completed successfully!</p>
                <p className="mt-1">Redirecting to payment setup...</p>
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
            {/* Business Contact Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Contact</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="business_email"
                      value={formData.business_email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                      placeholder="business@yourstore.com"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For official business communications</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="+8801712345678"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Store Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Description *
                  </label>
                  <textarea
                    name="store_description"
                    value={formData.store_description}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                    placeholder="Describe your store, products, and what makes you unique..."
                    required
                  />
                  <p className={`text-xs mt-1 ${formData.store_description.length >= 50 ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {formData.store_description.length}/50 characters minimum
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                    required
                  >
                    <option value="">Select Business Type</option>
                    <option value="individual">Individual Seller</option>
                    <option value="nursery">Plant Nursery</option>
                    <option value="company">Registered Company</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Number
                    </label>
                    <input
                      type="text"
                      name="tax_number"
                      value={formData.tax_number}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business License
                    </label>
                    <input
                      type="text"
                      name="business_license"
                      value={formData.business_license}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Address Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                      placeholder="Street address, building name, floor, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Dhaka"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Division *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Dhaka Division"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="1200"
                      required
                    />
                  </div>
                </div>
              </div>
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
                    Completing Profile...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </>
                ) : (
                  <>
                    Continue
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