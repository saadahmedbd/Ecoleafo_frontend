

import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { validateEmail } from "@/utils/validation";

/**
 * Forgot Password Page
 * Allows users to request password reset email
 * 
 * Features:
 * - Email validation
 * - Success/error states
 * - Resend functionality
 * - Backend integration
 * 
 * @param {Function} onBack - Callback for back navigation
 * @param {Function} onLoginClick - Callback to navigate to login
 */
export default function ForgotPasswordPage({ onBack, onLoginClick }) {
  // RTK Query mutation hook
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  
  // Form state
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  
  /**
   * Handle email input change
   */
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
    if (success) setSuccess(false);
  };
  
  /**
   * Handle form submission
   * Sends password reset email
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error);
      setTouched(true);
      return;
    }
    
    try {
      // Call forgot password API
      await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
      
      // Show success message
      setSuccess(true);
      setError("");
    } catch (err) {
      console.error("Forgot password error:", err);
      
      // Show error message
      const errorMessage = err?.message || err?.data?.message || 
        "Failed to send reset email. Please try again.";
      setError(errorMessage);
      setSuccess(false);
    }
  };
  
  /**
   * Handle resend email
   */
  const handleResend = () => {
    setSuccess(false);
    setError("");
    handleSubmit({ preventDefault: () => {} });
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
        <h1 className="text-lg font-medium">Forgot Password</h1>
      </div>

      <div className="px-4 py-6">
        {/* Header Text */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 mb-1">
                Reset Email Sent!
              </p>
              <p className="text-sm text-green-700">
                Check your inbox for password reset instructions. If you don't see it, check your spam folder.
              </p>
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-sm text-green-600 hover:underline mt-2 font-medium"
              >
                Didn't receive it? Resend
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && !success && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setTouched(true)}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent transition-colors ${
                    error && touched ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full bg-[#059669] text-white py-3 rounded-lg hover:bg-[#047857] transition-colors font-medium ${
                (isLoading || !email) ? "opacity-70 cursor-not-allowed" : ""
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
                  Sending...
                </span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <button
            onClick={onLoginClick}
            className="text-[#059669] font-medium hover:underline text-sm"
            disabled={isLoading}
          >
            ← Back to Login
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2 font-medium">
            Need help?
          </p>
          <p className="text-sm text-blue-700">
            If you continue having trouble accessing your account, please contact our support team at{" "}
            <a href="mailto:support@example.com" className="underline hover:text-blue-900">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}