import { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Shield,
  Check,
  X as XIcon,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChangePasswordMutation } from '@/features/buyerProfile/buyerProfileApi';
import { validatePasswordChange } from '@/services/buyerProfileService';

/**
 * Password Management Page
 * Secure password change with validation and strength indicator
 */
export default function BuyerPasswordPage() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Form state
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // UI state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length === 0) {
      return { score: 0, feedback: '', checks: {} };
    }

    // Length check
    const hasLength = password.length >= 8;
    if (hasLength) score += 20;

    // Uppercase check
    const hasUppercase = /[A-Z]/.test(password);
    if (hasUppercase) score += 20;

    // Lowercase check
    const hasLowercase = /[a-z]/.test(password);
    if (hasLowercase) score += 20;

    // Number check
    const hasNumber = /\d/.test(password);
    if (hasNumber) score += 20;

    // Special character check
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasSpecial) score += 20;

    // Generate feedback
    if (score <= 40) {
      feedback.push('Weak password');
    } else if (score <= 60) {
      feedback.push('Fair password');
    } else if (score <= 80) {
      feedback.push('Good password');
    } else {
      feedback.push('Strong password');
    }

    return {
      score,
      feedback: feedback.join(', '),
      checks: {
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
      },
    };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate strength for new password
    if (name === 'new_password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validatePasswordChange(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await changePassword(formData).unwrap();
      setSuccessMessage('Password changed successfully');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setPasswordStrength({ score: 0, feedback: '', checks: {} });
      setErrors({});
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrors({ 
        submit: error.data?.error || 'Failed to change password. Please check your current password.' 
      });
    }
  };

  // Get strength color
  const getStrengthColor = (score) => {
    if (score <= 40) return 'bg-red-500';
    if (score <= 60) return 'bg-yellow-500';
    if (score <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Get strength text color
  const getStrengthTextColor = (score) => {
    if (score <= 40) return 'text-red-600';
    if (score <= 60) return 'text-yellow-600';
    if (score <= 80) return 'text-blue-600';
    return 'text-green-600';
  };

  const strength = calculatePasswordStrength(formData.new_password);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2">
          <Check className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Header - Mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/buyer/account')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Change Password</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 lg:py-8">
        {/* Header - Desktop */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/buyer/account')}
            className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
        </div>

        <div className="space-y-6">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Password Security Tips
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use at least 8 characters with mixed case letters</li>
                <li>• Include numbers and special characters</li>
                <li>• Avoid using common words or personal information</li>
                <li>• Don't reuse passwords from other accounts</li>
              </ul>
            </div>
          </div>

          {/* Password Change Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.current_password}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.new_password}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {formData.new_password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium ${getStrengthTextColor(strength.score)}`}>
                        {strength.feedback}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>

                    {/* Password Requirements Checklist */}
                    <div className="space-y-1.5 mt-3">
                      <div className={`flex items-center gap-2 text-xs ${strength.checks?.hasLength ? 'text-green-600' : 'text-gray-500'}`}>
                        {strength.checks?.hasLength ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${strength.checks?.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {strength.checks?.hasUppercase ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${strength.checks?.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        {strength.checks?.hasLowercase ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${strength.checks?.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        {strength.checks?.hasNumber ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <span>One number</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs ${strength.checks?.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                        {strength.checks?.hasSpecial ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <XIcon className="w-4 h-4" />
                        )}
                        <span>One special character</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirm_password}
                  </p>
                )}
                {formData.confirm_password && formData.new_password === formData.confirm_password && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Additional Security Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Keep Your Account Secure
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Change your password regularly (every 3-6 months)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Never share your password with anyone</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Use a unique password for this account</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Enable two-factor authentication for extra security</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}