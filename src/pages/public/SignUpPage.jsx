

import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/features/auth/buyerAuthApi";
import { useAppDispatch } from "@/app/hooks";
import { setCredentials, clearAuthError } from "@/features/auth/authSlice";
import { validateRegistrationForm, sanitizeInput } from "@/utils/validation";
import { checkPasswordStrength } from '@/utils/validation';
import BuyerAuthService from "../../services/BuyerAuthService";

/**
 * Buyer Sign Up Page
 * Handles buyer registration with backend integration
 * 
 * Features:
 * - Form validation
 * - Backend API integration
 * - Error handling
 * - Loading states
 * - Password strength indicator
 * 
 * @param {Function} onBack - Callback for back navigation
 * @param {Function} onLoginClick - Callback to navigate to login
 */
export default function SignUpPage({ onBack, onLoginClick }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  
  
  // RTK Query mutation hook
  const [register, { isLoading }] = useRegisterMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [touched, setTouched] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Clear errors on component mount
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);
  
  /**
   * Handle input change
   * Sanitizes input and clears field error
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError("");
    }
  };
  
  /**
   * Handle input blur
   * Validates field when user leaves it
   */
  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate single field on blur
    const validation = validateRegistrationForm(formData);
    if (validation.errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: validation.errors[fieldName],
      }));
    }
  };
  
  /**
   * Handle form submission
   * Validates form and calls registration API
   */
  const handleSignUp = async (e) => {
  e.preventDefault();

  setErrors({});
  setApiError("");

  const validation = validateRegistrationForm(formData);
  if (!validation.isValid) {
    setErrors(validation.errors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });
    return;
  }

  if (!termsAccepted) {
    setApiError("Please accept the Terms & Conditions");
    return;
  }

  try {
    // ✅ Use unwrap() to catch backend errors
    const result = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }).unwrap();

    // Save credentials to Redux/localStorage
    dispatch(setCredentials(result));

    // Navigate to dashboard
    navigate("/buyer/dashboard");
  } catch (err) {
    console.error("Registration error:", err);
    const errorMessage = err?.data?.message || err?.message || "Registration failed. Please try again.";
    setApiError(errorMessage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

  
  /**
   * Handle Google Sign Up
   * TODO: Implement Google OAuth integration
   */
  const handleGoogleSignUp = () => {
    // This would integrate with Google OAuth
    // For now, show a message
    setApiError("Google Sign Up is not available yet. Please use email registration.");
  };
  const handlePasswordChange = (e) => {
  const value = e.target.value;
  setFormData(prev => ({ ...prev, password: value }));
  
  // Check strength
  const strength = checkPasswordStrength(value);
  setPasswordStrength(strength);
};


  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button 
          onClick={onBack} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium">Sign Up</h1>
      </div>

      <div className="px-4 py-6">
        {/* Welcome Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Sign up to start shopping</p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
            <button
              onClick={() => setApiError("")}
              className="text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4" noValidate>
          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter your first name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-colors ${
                  errors.firstName && touched.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
                disabled={isLoading}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <p id="firstName-error" className="text-sm text-red-600 mt-1">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
                placeholder="Enter your last name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-colors ${
                  errors.lastName && touched.lastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
                disabled={isLoading}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
            </div>
            {errors.lastName && touched.lastName && (
              <p id="lastName-error" className="text-sm text-red-600 mt-1">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Email Field */}
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
                onBlur={() => handleBlur("email")}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-colors ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && touched.email && (
              <p id="email-error" className="text-sm text-red-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                placeholder="Create a password"
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-colors ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
                minLength={6}
                disabled={isLoading}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && touched.password ? (
              <p id="password-error" className="text-sm text-red-600 mt-1">
                {errors.password}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            )}
          </div>
          {/* Password Strength Indicator */}
          {passwordStrength && (
            <div className="mt-2">
                <div className="flex gap-1">
                {[1, 2, 3].map(level => (
                    <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                        passwordStrength.score >= level * 2
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                    />
                ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                {passwordStrength.feedback}
                </p>
            </div>
            )}


          {/* Terms & Conditions */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#059669] cursor-pointer"
              required
              disabled={isLoading}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{" "}
              <button 
                type="button" 
                className="text-[#059669] hover:underline"
                onClick={() => {/* TODO: Open terms modal */}}
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button 
                type="button" 
                className="text-[#059669] hover:underline"
                onClick={() => {/* TODO: Open privacy modal */}}
              >
                Privacy Policy
              </button>
            </label>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating Account...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={onLoginClick}
              className="text-[#059669] font-medium hover:underline"
              disabled={isLoading}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}