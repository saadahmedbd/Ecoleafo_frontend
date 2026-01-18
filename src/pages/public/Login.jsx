import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Google OAuth Only Login/Signup Page
 * Single button for both signup and login
 */
export default function LoginPage({ 
  onBack, 
  onGuestContinue,
  onSellerSignUpClick 
}) {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleAuth = () => {
    setIsLoading(true);
    const apiUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google/login?role=buyer`;
  };
  
  const handleGuestContinue = () => {
    if (onGuestContinue) {
      onGuestContinue();
    } else {
      navigate('/');
    }
  };
  
  const handleSellerSignUp = () => {
    if (onSellerSignUpClick) {
      onSellerSignUpClick();
    } else {
      navigate('/seller/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-6">
        <div className="max-w-lg mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top duration-300">
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
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-12">
            {/* Info Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-emerald-900 mb-1">
                    Quick & Secure Sign In
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-700">
                    New here? No worries! Your account will be created automatically when you sign in with Google.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full bg-white border-3 border-gray-300 text-gray-800 py-4 sm:py-5 rounded-2xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-xl transition-all duration-300 font-semibold flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span className="text-base sm:text-lg">Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-base sm:text-lg">Continue with Google</span>
                </>
              )}
            </button>

            {/* Benefits List */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>No password needed - sign in instantly</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure authentication via Google</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Fast checkout for your purchases</span>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="mt-8 space-y-4">
            {/* Seller Account Button */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    Want to Sell Products?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Create a seller account and start your business
                  </p>
                </div>
                <button
                  onClick={handleSellerSignUp}
                  disabled={isLoading}
                  className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
                >
                  Become a Seller
                </button>
              </div>
            </div>

            {/* Guest Continue */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleGuestContinue}
                disabled={isLoading}
                className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-emerald-600 transition-colors font-medium group"
              >
                <span className="underline">Continue as Guest</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-center text-gray-500 max-w-sm mx-auto pt-4">
              By signing in, you agree to our{" "}
              <button className="text-emerald-600 hover:underline font-medium">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-emerald-600 hover:underline font-medium">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}