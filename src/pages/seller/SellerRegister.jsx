// ==========================================
// SELLER REGISTRATION COMPONENT 
// ==========================================
// Purpose: Multi-step seller registration with backend integration
// Flow: Account Creation → Store Info → Business Details → Payment Method
// Backend: POST /api/seller/register, /api/seller/profile/complete, /api/seller/payment-methods
// ==========================================

import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, Mail, Lock, User, Phone, Check, Building2, MapPin, 
  CreditCard, Eye, EyeOff, ChevronLeft, ArrowRight, AlertCircle 
} from 'lucide-react';
import { useRegisterSellerMutation, useAddPaymentMethodMutation, useCompleteProfileMutation, } from '../../features/auth/sellerAuthApi';
import SellerAuthService from '../../services/SellerAuthService';
import { toast } from 'sonner';
export default function SellerRegister() {
  const navigate = useNavigate();
  
  // RTK Query mutation hook
  const [registerSeller, { isLoading: isRegistering }] = useRegisterSellerMutation();

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationToken, setRegistrationToken] = useState(null); // Store token for subsequent steps

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Account Creation (required for POST /api/seller/register)
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    phone: '',
    store_name: '',
    commission: '15',
    agree_to_terms: false,
    
    // Step 2: Store Information
    store_description: '',
    business_type: '',
    
    // Step 3: Business Details
    business_email: '',
    tax_number: '',
    business_license: '',
    address: '',
    city: '',
    state: '',
    country: 'Bangladesh',
    postal_code: '',
    
    // Step 4: Payment Method
    payment_type: '',
    account_name: '',
    account_number: '',
    bank_name: '',
    bank_code: '',
    routing_number: ''
  });
  useEffect(() => {
    // Only check profile status if a token exists
    const token = localStorage.getItem('seller_token');
    if (token) {
      SellerAuthService.getProfileStatus();
    }
  }, []);

  // Inside your component:
const [completeProfile] = useCompleteProfileMutation();
const [addPaymentMethod] = useAddPaymentMethodMutation();
  // ==========================================
  // FORM HANDLERS
  // ==========================================

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  /**
   * Validate Bangladesh phone number
   */
  const validatePhone = (phone) => {
    // Accepts: 01XXXXXXXXX or +8801XXXXXXXXX
    const phoneRegex = /^(\+880|0)?1[3-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate current step
   */
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        // Account creation validation
        if (!formData.first_name?.trim() || formData.first_name.length < 2) {
          setError('First name must be at least 2 characters');
          return false;
        }
        if (!formData.last_name?.trim() || formData.last_name.length < 2) {
          setError('Last name must be at least 2 characters');
          return false;
        }
        if (!formData.store_name?.trim() || formData.store_name.length < 3) {
          setError('Store name must be at least 3 characters');
          return false;
        }
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!validatePhone(formData.phone)) {
          setError('Please enter a valid Bangladesh phone number (e.g., 01712345678)');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.password !== formData.confirm_password) {
          setError('Passwords do not match');
          return false;
        }
        if (!formData.agree_to_terms) {
          setError('You must agree to the terms and conditions');
          return false;
        }
        if (!formData.commission || parseFloat(formData.commission) < 15) {
          toast.error('Commission must be at least 15%');
          setError('Commission must be at least 15%');
          return false;
        }
        break;
      
      case 2:
        // Store information validation
        if (!formData.store_description?.trim() || formData.store_description.length < 50) {
          setError('Store description must be at least 50 characters');
          return false;
        }
        if (!formData.business_type) {
          setError('Please select a business type');
          return false;
        }
        break;
      
      case 3:
        // Business details validation
        if (!validateEmail(formData.business_email)) {
          setError('Please enter a valid business email');
          return false;
        }
        if (!formData.address?.trim() || formData.address.length < 10) {
          setError('Please enter a complete address (minimum 10 characters)');
          return false;
        }
        if (!formData.city?.trim()) {
          setError('City is required');
          return false;
        }
        if (!formData.state?.trim()) {
          setError('State/Division is required');
          return false;
        }
        if (!formData.postal_code?.trim()) {
          setError('Postal code is required');
          return false;
        }
        break;
      
      case 4:
        // Payment method validation
        if (!formData.payment_type) {
          setError('Please select a payment method');
          return false;
        }
        if (!formData.account_name?.trim()) {
          setError('Account name is required');
          return false;
        }
        if (!formData.account_number?.trim()) {
          setError('Account number is required');
          return false;
        }
        if (formData.payment_type === 'bank_transfer' && !formData.bank_name?.trim()) {
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
  const handleNext = async () => {
    if (!validateStep()) return;

    // If completing step 1, register the seller account
    if (currentStep === 1) {
      await handleAccountRegistration();
    } else if (currentStep === 2 || currentStep === 3) {
      // For steps 2 and 3, just move to next step (will save on step 4)
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle account registration (Step 1)
   */
  const handleAccountRegistration = async () => {
    setError('');
    try {
      const result = await registerSeller({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        store_name: formData.store_name.trim(),
        phone: formData.phone.trim(),
        commission: parseFloat(formData.commission),
        agree_to_terms: formData.agree_to_terms
      }).unwrap();
      
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Registration succeeded but no token received.');
        toast.error('Registration succeeded but no token received.');
        return;
      }
      
      setRegistrationToken(token);
      toast.success('Account created successfully!');
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errorMsg = err?.data?.message || err?.message || 'Registration failed.';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  /**
   * Navigate to previous step
   */
  const handleBack = () => {
    // Don't allow going back from step 2 (after account creation)
    if (currentStep === 2) {
      setError('You cannot go back after creating your account. Please continue.');
      return;
    }
    
    setCurrentStep(prev => prev - 1);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // /**
  //  * Submit complete registration (after all steps)
  //  */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateStep()) return;
    
  //   if (!registrationToken) {
  //     setError('Session expired. Please start registration again.');
  //     return;
  //   }

  //   try {
  //     // Step 2 & 3: Complete business profile
  //     const profileData = {
  //       business_email: formData.business_email,
  //       phone: formData.phone,
  //       store_description: formData.store_description,
  //       business_type: formData.business_type,
  //       tax_number: formData.tax_number || '',
  //       business_license: formData.business_license || '',
  //       address: formData.address,
  //       city: formData.city,
  //       state: formData.state,
  //       country: formData.country,
  //       postal_code: formData.postal_code
  //     };

  //     const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/seller/profile/complete`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${registrationToken}`
  //       },
  //       body: JSON.stringify(profileData)
  //     });

  //     if (!profileResponse.ok) {
  //       throw new Error('Failed to complete profile');
  //     }

  //     // Step 4: Add payment method
  //     const paymentData = {
  //       type: formData.payment_type,
  //       account_name: formData.account_name,
  //       account_number: formData.account_number,
  //       is_default: true,
  //       ...(formData.payment_type === 'bank_transfer' && {
  //         bank_name: formData.bank_name,
  //         bank_code: formData.bank_code || '',
  //         routing_number: formData.routing_number || ''
  //       })
  //     };

  //     const paymentResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/seller/payment-methods`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${registrationToken}`
  //       },
  //       body: JSON.stringify(paymentData)
  //     });

  //     if (!paymentResponse.ok) {
  //       throw new Error('Failed to add payment method');
  //     }

  //     // Success! Redirect to login with success message
  //     navigate('/seller/login', {
  //       state: {
  //         message: 'Registration complete! Your account is pending admin approval. You will be notified via email once approved.',
  //         type: 'success'
  //       }
  //     });
      
  //   } catch (err) {
  //     setError(err?.message || 'Failed to complete registration. Please try again.');
  //     console.error('Registration completion error:', err);
  //   }
  // };
  /**
   * Submit complete registration (after all steps)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    const token = registrationToken || localStorage.getItem('auth_token');
    
    if (!token) {
      setError('Session expired. Please start registration again.');
      toast.error('Session expired. Please login and complete your profile.');
      return;
    }

    try {
      const profileData = {
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
        postal_code: formData.postal_code,
      };

      await completeProfile(profileData).unwrap();
      toast.success('Profile completed successfully!');

      const paymentData = {
        type: formData.payment_type,
        account_name: formData.account_name,
        account_number: formData.account_number,
        is_default: true,
        ...(formData.payment_type === 'bank_transfer' && {
          bank_name: formData.bank_name,
          bank_code: formData.bank_code || '',
          routing_number: formData.routing_number || '',
        }),
      };

      await addPaymentMethod(paymentData).unwrap();
      toast.success('Payment method added successfully!');
      toast.success('Registration complete! Please wait for admin approval.');
      
      navigate('/seller/login', {
        state: {
          message: 'Registration complete! Your account is pending admin approval. You will be notified via email once approved.',
          type: 'success',
        },
      });
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to complete registration. Please try again.');
      toast.error(err?.data?.message || err?.message || 'Failed to complete registration');
    }
  };


  // ==========================================
  // RENDER
  // ==========================================
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

        {/* Error Message */}
        {error && (
          <div className="flex items-center bg-red-50 text-red-700 p-3 rounded-lg mb-5">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Step Forms */}
        <form onSubmit={handleSubmit}>
          {/* STEP 1: ACCOUNT CREATION */}
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
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                      placeholder="John"
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
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                      placeholder="Doe"
                      required
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="John's Plant Store"
                    required
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="seller@example.com"
                    required
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="+8801712345678"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: 01XXXXXXXXX or +8801XXXXXXXXX</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commission (%) *
                </label>
                <input
                  type="number"
                  name="commission"
                  value={formData.commission}
                  onChange={handleChange}
                  step="0.1"
                  min="15"
                  max="100"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                  placeholder="15"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 15% commission required</p>
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
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="Minimum 8 characters"
                    required
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
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
                    placeholder="Re-enter password"
                    required
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
                  I agree to the{' '}
                  <Link to="/terms" className="text-emerald-600 hover:underline">
                    Terms & Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          )}

          {/* STEP 2: STORE INFORMATION */}
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
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                  placeholder="Describe your store, products, mission, and what makes you unique..."
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
            </div>
          )}

          {/* STEP 3: BUSINESS DETAILS */}
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder="business@yourstore.com"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">For official business communications</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none resize-none"
                    placeholder="Street address, building name, etc."
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
          )}

          {/* STEP 4: PAYMENT METHOD */}
          {currentStep === 4 && (
            <div className="space-y-5">
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
                <p className="text-xs text-gray-500 mt-1">Where you'll receive payments from customers</p>
              </div>

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

              {formData.payment_type === 'bank_transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="e.g., Bangladesh Bank"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Code
                    </label>
                    <input
                      type="text"
                      name="bank_code"
                      value={formData.bank_code}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      name="routing_number"
                      value={formData.routing_number}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment Information</p>
                    <p>This payment method will be used to receive earnings from your sales. You can add more payment methods later from your dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t mt-6">
            {currentStep > 1 && currentStep !== 2 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isRegistering}
                className="flex items-center text-gray-700 hover:text-emerald-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isRegistering}
                className="flex items-center bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering && currentStep === 1 ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isRegistering}
                className="flex items-center bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Completing Registration...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Complete Registration
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Already have account */}
        <p className="text-center text-sm text-gray-600 mt-6 pt-6 border-t">
          Already have a seller account?{' '}
          <Link to="/seller/login" className="text-emerald-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}