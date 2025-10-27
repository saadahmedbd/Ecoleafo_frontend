// ==========================================
// SELLER REGISTRATION COMPONENT
// ==========================================
// Purpose: Multi-step seller registration form
// Steps: 1. Account Info, 2. Store Info, 3. Business Details, 4. Payment Method
// API Endpoint: POST /api/seller/register (to be connected)
// ==========================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, Mail, Lock, User, Phone, Check, Building2, MapPin, 
  CreditCard, Eye, EyeOff, ChevronLeft, ArrowRight, AlertCircle, Info 
} from 'lucide-react';
import SellerAuthService from '../../../services/SellerAuthService';


export default function SellerRegister() {
  const navigate = useNavigate();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [currentStep, setCurrentStep] = useState(1); // Current registration step (1-4)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data state matching API requirements
  const [formData, setFormData] = useState({
    // Step 1: Account Creation (required for registration)
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    store_name: '',
    agree_to_terms: false,
    
    // Step 2: Store Information (for profile completion)
    store_description: '',
    business_type: '',
    
    // Step 3: Business Details (for profile completion)
    business_email: '',
    tax_number: '',
    business_license: '',
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    postal_code: '',
    
    // Step 4: Payment Method (for profile completion)
    payment_type: '',
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    routing_number: ''
  });

  // ==========================================
  // FORM HANDLERS
  // ==========================================

  /**
   * Update form field value
   */
  // ...existing code...

/**
 * Update form field value
 */
const updateField = (field, value) => {
  setFormData((prevData) => {
    const newData = {
      ...prevData,
      [field]: value
    };
    return newData;
  });
  if (error) setError('');
};
 // Simplified handleChange function
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };



  /**
   * Validate current step before proceeding
   */
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        // Validate required fields for account creation
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
        // Validate store information
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
        // Validate business details
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
        // Validate payment method
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

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Navigate to previous step
   */
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Submit registration form
   * Calls backend API through SellerAuthService
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate current step
    if (!validateStep()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Call register API using SellerAuthService
      // This will handle all 3 steps: registration, profile completion, payment method
      const result = await SellerAuthService.register(formData);
      
      // Check if registration was successful
      if (result.success) {
        console.log('Registration successful:', result.data);
        
        // Show success message
        alert(
          'Registration Successful!\n\n' +
          'Your seller account has been created and is now pending admin approval. ' +
          'You will receive an email notification once your account is approved.\n\n' +
          'You can now log in to check your approval status.'
        );
        
        // Navigate to login page
        navigate('/seller/login');
        
      } else {
        // Registration failed, show error message
        const errorMessage = result.error.message || 'Registration failed. Please try again.';
        setError(errorMessage);
        
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Registration error details:', result.error);
        }
        
        // Handle specific error cases
        if (result.error.status === 409) {
          // Email already exists
          setError('This email is already registered. Please use a different email or try logging in.');
        } else if (result.error.status === 422) {
          // Validation error
          setError('Please check your information and try again. ' + errorMessage);
        }
      }
      
    } catch (err) {
      // Catch unexpected errors
      console.error('Unexpected registration error:', err);
      setError('An unexpected error occurred. Please try again later.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };



  // ==========================================
  // PROGRESS BAR COMPONENT
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-emerald-600" />
              Seller Registration
            </h2>
            {/* //progres bar */}
          <div className="mb-8">
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  {/* Step circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step <= currentStep 
                      ? 'bg-[#059669] text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  
                  {/* Connecting line */}
                  {step < 4 && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-[#059669]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Step labels */}
            <div className="flex justify-between text-xs font-medium text-gray-600 px-1">
              <span className={currentStep === 1 ? 'text-[#059669]' : ''}>Account</span>
              <span className={currentStep === 2 ? 'text-[#059669]' : ''}>Store Info</span>
              <span className={currentStep === 3 ? 'text-[#059669]' : ''}>Business</span>
              <span className={currentStep === 4 ? 'text-[#059669]' : ''}>Payment</span>
            </div>
          </div>
          {error && (
                   
         <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg mb-5">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
          </div>
                  )}
        
{/* 
        // ==========================================
        // STEP 1: ACCOUNT CREATION
        ========================================== */}
        {currentStep === 1 && (
          <div className="space-y-5">
            {/* Name fields */}
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                    placeholder=""
                    required
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
                  
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="store_name"
                  type="text"
                  value={formData.store_name}
                  onChange={handleChange}
                  
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder=""
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">This will be visible to customers</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder=""
                  required
                  autoComplete=""
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder="+880123456789"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder="Minimum 8 characters"
                  required
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => updateField('confirm_password', e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder="Re-enter password"
                  required
                  autoComplete="new-password"
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

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2 mt-4">
              <input
                type="checkbox"
                name="agree_to_terms"
                checked={formData.agree_to_terms}
                onChange={(e) => updateField('agree_to_terms', e.target.checked)}
                className="mt-1 w-4 h-4 text-[#059669] border-gray-300 rounded focus:ring-[#059669]"
              />
              <label  className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-[#059669] hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>
          </div>
        )}

        {/* // ==========================================
        // STEP 2: STORE INFORMATION
        // ========================================== */}
        {currentStep === 2 && (<div className="space-y-5">
            {/* Store Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Description *
              </label>
              <textarea
                name="store_description"

                value={formData.store_description}
                onChange={(e) => updateField('store_description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                placeholder="Describe your store, what products you sell, and your mission..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                  {formData.store_description.length}/50 characters minimum
              </p>

            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type *
              </label>
              <select
              name="business_type"
                value={formData.business_type}
                onChange={(e) => updateField('business_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] outline-none"
                required
              >
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>
                <option value="company">Company</option>
              </select>
            </div>
          </div>
        )}

        {/* // ==========================================
        // STEP 3: BUSINESS DETAILS
        // ========================================== */}
        {currentStep ===3 && ( <div className="space-y-5">
            {/* Business Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name='business_email'
                  value={formData.business_email}
                  onChange={(e) => updateField('business_email', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                  placeholder=""
                />
              </div>
            </div>

            {/* Tax Number & License */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax Number
                </label>
                <input
                  type="text"
                  name='tax_number'
                  value={formData.tax_number}
                  onChange={(e) => updateField('tax_number', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License
                </label>
                <input
                  type="text"
                  name='business_license'
                  value={formData.business_license}
                  onChange={(e) => updateField('business_license', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Address Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name='address'
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                  placeholder="Street address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                name='city'
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              />
              <input
                type="text"
                placeholder="State *"
                name='state'
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              />
              <input
                type="text"
                name="postal-code"
                placeholder="Postal Code *"
                value={formData.postal_code}
                onChange={(e) => updateField('postal_code', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              />
            </div>
          </div>)}

        {/* // ==========================================
        // STEP 4: PAYMENT METHOD
        // ========================================== */}
        {currentStep === 4 &&(
          <div className="space-y-5">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type *
              </label>
              <select
                name='payment-type'
                value={formData.payment_type}
                onChange={(e) => updateField('payment_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              >
                <option value="">Select Payment Type</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_banking">Mobile Banking (e.g., bKash, Nagad)</option>
              </select>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name='account_name'
                placeholder="Account Name *"
                value={formData.account_name}
                onChange={(e) => updateField('account_name', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              />
              <input
                type="text"
                name='account_number'
                placeholder="Account Number *"
                value={formData.account_number}
                onChange={(e) => updateField('account_number', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
              />
            </div>

            {formData.payment_type === 'bank_transfer' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  name='bank_name'
                  placeholder="Bank Name *"
                  value={formData.bank_name}
                  onChange={(e) => updateField('bank_name', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                />
                <input
                  type="text"
                  name='bank_code'
                  placeholder="Bank Code"
                  value={formData.bank_code}
                  onChange={(e) => updateField('bank_code', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
                />
                <input
                  type="text"
                  name='routing_number'
                  placeholder="Routing Number"
                  value={formData.routing_number}
                  onChange={(e) => updateField('routing_number', e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669]"
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
                    className="flex items-center text-gray-700 hover:text-[#059669] font-medium"
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
                    className="flex items-center bg-[#059669] text-white px-5 py-2 rounded-lg hover:bg-[#047857] transition-all"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </button>
                ) : (
                  <button
                    type="submit"
                      onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center bg-[#059669] text-white px-6 py-2 rounded-lg hover:bg-[#047857] transition-all disabled:opacity-60"
                  >
                    {isLoading ? 'Submitting...' : 'Complete Registration'}
                  </button>
                )}
              </div>

            {/* Already have an account */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Already have a seller account?{' '}
              <Link to="/seller/login" className="text-[#059669] font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
    </div>
  );

}
