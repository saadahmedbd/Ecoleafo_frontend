import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Enhanced Buyer Sign Up Page
 * Fully responsive design with Google OAuth integration
 */
export default function SignUpPage({ 
  onBack, 
  onLoginClick,
  onSellerSignUpClick 
}) {
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
  const [isLoading, setIsLoading] = useState(false);
  
  const checkPasswordStrength = (password) => {
    if (!password) return null;
    
    let score = 0;
    let feedback = "";
    
    if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 2;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score >= 5) {
      feedback = "Strong password";
    } else if (score >= 3) {
      feedback = "Medium strength";
    } else {
      feedback = "Weak password";
    }
    
    return { score, feedback };
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "password") {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
    
    if (apiError) {
      setApiError("");
    }
  };
  
  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };
  
  const handleSignUp = (e) => {
    if (e) e.preventDefault();
    setErrors({});
    setApiError("");
    
    // Validation
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!termsAccepted) {
      setApiError("Please accept the Terms & Conditions");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log("Sign up attempt:", formData);
      // Handle actual registration here
    }, 1500);
  };
  
  const handleGoogleSignUp = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google/login?role=buyer`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <button 
              onClick={onBack} 
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold">Sign Up</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-md mx-auto">
          {/* Welcome Text */}
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Create Account
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sign up to start shopping
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
              <button
                onClick={() => setApiError("")}
                className="text-red-600 hover:text-red-800 text-xl leading-none"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
            {/* Google Sign Up Button - Top Priority */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 sm:py-3.5 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-md mb-4"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
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
              <span className="text-sm sm:text-base">Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5 sm:my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Sign Up Form */}
            <div className="space-y-4">
              {/* First Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                    placeholder="Enter your first name"
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                      errors.firstName && touched.firstName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && touched.firstName && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                    placeholder="Enter your last name"
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                      errors.lastName && touched.lastName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && touched.lastName && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 sm:py-3.5 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                      errors.email && touched.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs sm:text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
                    placeholder="Create a password"
                    className={`w-full pl-10 pr-12 py-3 sm:py-3.5 text-sm sm:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${
                      errors.password && touched.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
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
                
                {/* Password Strength Indicator */}
                {passwordStrength && formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map(level => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            passwordStrength.score >= level * 2
                              ? passwordStrength.score >= 5 ? 'bg-green-500' : passwordStrength.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${
                      passwordStrength.score >= 5 ? 'text-green-600' : passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.feedback}
                    </p>
                  </div>
                )}
                
                {errors.password && touched.password ? (
                  <p className="text-xs sm:text-sm text-red-600 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    {errors.password}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1.5">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <button 
                    type="button" 
                    className="text-emerald-600 font-medium hover:underline"
                    onClick={(e) => {e.preventDefault(); /* Open terms modal */}}
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button 
                    type="button" 
                    className="text-emerald-600 font-medium hover:underline"
                    onClick={(e) => {e.preventDefault(); /* Open privacy modal */}}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSignUp}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 sm:py-3.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
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
                    <span className="text-sm sm:text-base">Creating Account...</span>
                  </span>
                ) : (
                  <span className="text-sm sm:text-base">Sign Up</span>
                )}
              </button>
            </div>
          </div>

          {/* Login & Seller Links */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={onLoginClick}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
                  disabled={isLoading}
                >
                  Login
                </button>
              </p>
            </div>

            {/* Seller Account Button */}
            <button
              onClick={onSellerSignUpClick}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 sm:py-3.5 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="text-sm sm:text-base">Want to Sell? Create Seller Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}