import React, { useState } from 'react';
import { 
  Store, Mail, Lock, User, Phone, Check, Building2, MapPin, 
  Eye, EyeOff, ChevronLeft, ArrowRight, AlertCircle
} from 'lucide-react';

export default function SellerRegister() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    store_name: '',
    agree_to_terms: false,
    store_description: '',
    business_type: '',
    business_email: '',
    tax_number: '',
    business_license: '',
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    postal_code: '',
    payment_type: '',
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    routing_number: ''
  });

  // Simplified handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.email || !formData.password || !formData.confirm_password) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!formData.first_name || !formData.last_name || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!formData.store_name) {
          setError('Store name is required');
          return false;
        }
        if (formData.password !== formData.confirm_password) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (!formData.agree_to_terms) {
          setError('You must agree to the terms and conditions');
          return false;
        }
        break;
      
      case 2:
        if (!formData.store_description || formData.store_description.length < 50) {
          setError('Store description must be at least 50 characters');
          return false;
        }
        if (!formData.business_type) {
          setError('Please select a business type');
          return false;
        }
        break;
      
      case 3:
        if (!formData.business_email || !formData.address || !formData.city) {
          setError('Please fill in all required address fields');
          return false;
        }
        if (!formData.state || !formData.postal_code) {
          setError('Please fill in all required address fields');
          return false;
        }
        break;
      
      case 4:
        if (!formData.payment_type) {
          setError('Please select a payment method');
          return false;
        }
        if (!formData.account_name || !formData.account_number) {
          setError('Please fill in all required payment fields');
          return false;
        }
        if (formData.payment_type === 'bank_transfer' && !formData.bank_name) {
          setError('Bank name is required for bank transfers');
          return false;
        }
        break;
    }
    
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Registration data:', formData);
      alert('Registration successful! Your account is pending admin approval.');
      // Instead of alert
       navigate('/seller/login');

    //   // Reset form
    //   setFormData({
    //     email: '',
    //     password: '',
    //     confirm_password: '',
    //     first_name: '',
    //     last_name: '',
    //     phone: '',
    //     store_name: '',
    //     agree_to_terms: false,
    //     store_description: '',
    //     business_type: '',
    //     business_email: '',
    //     tax_number: '',
    //     business_license: '',
    //     address: '',
    //     city: '',
    //     state: '',
    //     country: 'Bangladesh',
    //     postal_code: '',
    //     payment_type: '',
    //     account_name: '',
    //     account_number: '',
    //     bank_name: '',
    //     bank_code: '',
    //     routing_number: ''
    //   });
    //   setCurrentStep(1);
    //   // This line redirects to login page
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-emerald-600" />
          Seller Registration
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  step <= currentStep 
                    ? 'bg-emerald-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    step < currentStep ? 'bg-emerald-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-xs font-medium text-gray-600 px-1">
            <span className={currentStep === 1 ? 'text-emerald-600' : ''}>Account</span>
            <span className={currentStep === 2 ? 'text-emerald-600' : ''}>Store Info</span>
            <span className={currentStep === 3 ? 'text-emerald-600' : ''}>Business</span>
            <span className={currentStep === 4 ? 'text-emerald-600' : ''}>Payment</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg mb-5">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Step 1: Account Info */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="store_name"
                    value={formData.store_name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    placeholder="John's Plant Store"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">This will be visible to customers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    placeholder="seller@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    placeholder="+880123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2 mt-4">
                <input
                  type="checkbox"
                  name="agree_to_terms"
                  checked={formData.agree_to_terms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600"
                />
                <label className="text-sm text-gray-700">
                  I agree to the Terms & Conditions
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Store Info */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description *
                </label>
                <textarea
                  name="store_description"
                  value={formData.store_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="Describe your store, what products you sell, and your mission..."
                />
                <p className="text-xs text-gray-500 mt-1">
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
                >
                  <option value="">Select Business Type</option>
                  <option value="individual">Individual</option>
                  <option value="partnership">Partnership</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Business Details */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="business_email"
                    value={formData.business_email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                    placeholder="business@example.com"
                  />
                </div>
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                    placeholder="Street address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State *"
                  value={formData.state}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  name="postal_code"
                  placeholder="Postal Code *"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          {/* Step 4: Payment Method */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type *
                </label>
                <select
                  name="payment_type"
                  value={formData.payment_type}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="">Select Payment Type</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="mobile_banking">Mobile Banking (e.g., bKash, Nagad)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="account_name"
                  placeholder="Account Name *"
                  value={formData.account_name}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
                <input
                  type="text"
                  name="account_number"
                  placeholder="Account Number *"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {formData.payment_type === 'bank_transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="bank_name"
                    placeholder="Bank Name *"
                    value={formData.bank_name}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    name="bank_code"
                    placeholder="Bank Code"
                    value={formData.bank_code}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    name="routing_number"
                    placeholder="Routing Number"
                    value={formData.routing_number}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have a seller account?{' '}
          <a href="#" className="text-emerald-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}