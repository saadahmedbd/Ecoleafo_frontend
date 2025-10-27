// ==========================================
// SELLER LOGIN COMPONENT (CONNECTED TO BACKEND)
// ==========================================
// Purpose: Handles seller authentication with backend API
// Features: Email/password login, remember me, error handling
// API: Uses SellerAuthService for all API calls
// ==========================================

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import SellerAuthService from '../../../services/SellerAuthService';

export default function SellerLogin() {
  const navigate = useNavigate();
  
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // ==========================================
  // FORM HANDLERS
  // ==========================================
  
  /**
   * Handle input field changes
   * Clears error message when user starts typing
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Validate form inputs before submission
   * @returns {boolean} Validation result
   */
  const validateForm = () => {
    // Check if email is provided
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Check if password is provided
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };

  /**
   * Handle form submission
   * Calls backend API and handles response
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      // Call login API using SellerAuthService
      const result = await SellerAuthService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Check if login was successful
      if (result.success) {
        console.log('Login successful:', result.data);
        
        // Check profile completion status
        const { profile_status } = result.data;
        
        // Handle remember me functionality
        if (formData.rememberMe) {
          localStorage.setItem('seller_remember', 'true');
          localStorage.setItem('seller_email', formData.email);
        } else {
          localStorage.removeItem('seller_remember');
          localStorage.removeItem('seller_email');
        }
        
        // Navigate based on profile status
        if (profile_status?.is_approved === false) {
          // Account pending approval
          navigate('/seller/pending-approval');
        } else if (profile_status?.is_profile_complete === false) {
          // Profile incomplete
          navigate('/seller/complete-profile');
        } else {
          // All good, go to dashboard
          navigate('/seller/dashboard');
        }
      } else {
        // Login failed, show error message
        setError(result.error.message || 'Invalid email or password. Please try again.');
        
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Login error details:', result.error);
        }
      }
      
    } catch (err) {
      // Catch unexpected errors
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // LIFECYCLE HOOKS
  // ==========================================
  
  /**
   * Check if user selected "Remember Me" previously
   */
  React.useEffect(() => {
    const remembered = localStorage.getItem('seller_remember');
    const savedEmail = localStorage.getItem('seller_email');
    
    if (remembered === 'true' && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        rememberMe: true
      }));
    }
  }, []);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* ==========================================
            HEADER SECTION
            ========================================== */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-[#059669] rounded-xl flex items-center justify-center shadow-lg">
              <Store className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900">PlantShop</span>
          </div>
          <p className="text-gray-600 text-lg">Seller Portal</p>
        </div>

        {/* ==========================================
            LOGIN FORM CARD
            ========================================== */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your seller account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Login Failed</p>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder="seller@example.com"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#059669] border-gray-300 rounded focus:ring-[#059669] cursor-pointer disabled:opacity-50"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link 
                to="/seller/forgot-password" 
                className="text-sm text-[#059669] hover:text-[#047857] font-medium transition-colors"
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#059669] text-white py-3 rounded-lg font-medium hover:bg-[#047857] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have a seller account?{' '}
              <Link
                to="/seller/register"
                className="text-[#059669] hover:text-[#047857] font-medium transition-colors"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>

        {/* ==========================================
            BENEFITS SECTION
            ========================================== */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Why Sell With Us?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">Access millions of buyers nationwide</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">Secure and fast payment processing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#059669] rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">24/7 dedicated seller support</p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 PlantShop. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-[#059669] transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-[#059669] transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#059669] transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// USAGE NOTES
// ==========================================
/**
 * This component requires:
 * 1. SellerAuthService imported from services
 * 2. React Router for navigation
 * 3. Proper API base URL configured in .env
 * 
 * File location: src/components/Seller/SellerLogin.jsx
 * Service location: src/services/SellerAuthService.js
 * 
 * Environment variables (.env):
 * REACT_APP_API_URL=http://localhost:3000/api
 */