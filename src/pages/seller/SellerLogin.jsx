// ==========================================
// SELLER LOGIN COMPONENT 
// ==========================================
// Purpose: Seller login with comprehensive profile completion checks
// Flow: Login → Check Approval → Check Profile → Check Payment → Dashboard
// Backend: POST /api/seller/login, GET /api/seller/profile/status
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store, AlertCircle, CheckCircle } from 'lucide-react';
import { useLoginSellerMutation, useGetProfileStatusQuery } from '../../features/auth/sellerAuthApi';
import { useAppSelector } from '../../app/hooks';
import { selectIsAuthenticated, selectProfileStatus } from '../../features/auth/authSlice';
import SellerAuthService from '../../services/SellerAuthService';
export default function SellerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get message from navigation state (e.g., from registration)
  const successMessage = location.state?.message;
  const messageType = location.state?.type;

  // RTK Query hooks
  const [loginSeller, { isLoading }] = useLoginSellerMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  
  // Local state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember_me: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  // ==========================================
  // REDIRECT IF ALREADY AUTHENTICATED
  // ==========================================
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     // Will be handled by profile check after login
  //     checkProfileAndRedirect();
  //   }
  // }, [isAuthenticated]);

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
   * Validate form inputs
   */
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    return true;
  };

  /**
   * Check profile completion status and redirect accordingly
   */
  const checkProfileAndRedirect = async () => {
    setIsCheckingProfile(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        navigate('/seller/login');
        return;
      }

      // Fetch profile status from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/seller/profile/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile status');
      }

      const profileStatus = await response.json();

      // Check approval status first
      if (!profileStatus.is_approved) {
        if (profileStatus.approval_status === 'rejected') {
          // Account was rejected
          navigate('/seller/account-rejected', {
            state: {
              reason: profileStatus.rejection_reason || 'Your account was not approved.'
            }
          });
          return;
        }
        
        // Account pending approval
        navigate('/seller/pending-approval');
        return;
      }

      // Check profile completion
      if (!profileStatus.is_profile_complete) {
        if (!profileStatus.has_business_info || !profileStatus.has_address) {
          navigate('/seller/complete-profile', {
            state: { missingFields: profileStatus.missing_fields }
          });
          return;
        }
      }

      // Check payment method
      if (!profileStatus.has_payment_method) {
        navigate('/seller/add-payment', {
          state: { message: 'Please add at least one payment method to start selling.' }
        });
        return;
      }

      // All checks passed - go to dashboard
      navigate('/seller/account');

    } catch (err) {
      console.error('Profile check error:', err);
      setError('Failed to verify account status. Please try again.');
    } finally {
      setIsCheckingProfile(false);
    }
  };

  /**
   * Handle login form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await SellerAuthService.login({
        email: formData.email,
        password: formData.password,
        remember_me: formData.remember_me
      });

      console.log('Login response:', response);

      if (response.success) {
        const redirectPath = response.redirectTo || '/seller/account';
        console.log('Redirecting to:', redirectPath);
        
        // Small delay to ensure Redux state is fully updated
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 100);
      } else {
        setError(response.error || response.message);
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err.status === 401) {
        setError('Invalid email or password');
      } else if (err.status === 403) {
        setError('Your account has been suspended. Please contact support.');
      } else {
        setError(err?.data?.message || 'Login failed. Please try again.');
      }
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-3 rounded-2xl">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Seller Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your seller dashboard
          </p>
        </div>

        {/* Success Message (from registration) */}
        {successMessage && messageType === 'success' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-800">
              <p className="font-medium mb-1">Registration Successful!</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Checking Profile Status */}
          {isCheckingProfile && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-sm text-blue-700">Verifying account status...</span>
            </div>
          )}

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
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                  placeholder="seller@example.com"
                  required
                  autoComplete="email"
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
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={formData.remember_me}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-600"
                />
                <label htmlFor="remember_me" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link 
                to="/seller/forgot-password" 
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isCheckingProfile}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have a seller account?{' '}
              <Link 
                to="/seller/register" 
                className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
              >
                Register now
              </Link>
            </p>
          </div>

          {/* Buyer Link */}
          <div className="mt-4">
            <p className="text-center text-xs text-gray-500">
              Looking to buy?{' '}
              <Link 
                to="/buyer/login" 
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Login as buyer
              </Link>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Need help?{' '}
          <Link to="/support" className="text-emerald-600 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}