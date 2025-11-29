
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Shield,
  Mail,
  User,
  Phone,
  Lock,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useValidateInvitationQuery, useRegisterAdminMutation } from '@/features/auth/adminAuthApi';
import { setCredentials } from '@/features/auth/authSlice';
import Button from '../../ui/Button';

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get('token');

  // State management
  const [step, setStep] = useState(1); // 1: Validate, 2: Register
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    full_name: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState({});

  // API hooks
  const { 
    data: invitationData, 
    isLoading: isValidating, 
    error: validationError 
  } = useValidateInvitationQuery(invitationToken, {
    skip: !invitationToken,
  });

  const [registerAdmin, { isLoading: isRegistering }] = useRegisterAdminMutation();

  // Redirect if no token
  useEffect(() => {
    if (!invitationToken) {
      navigate('/admin/login');
    }
  }, [invitationToken, navigate]);

  // Move to step 2 when validation succeeds
  useEffect(() => {
    if (invitationData && !validationError) {
      setStep(2);
    }
  }, [invitationData, validationError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await registerAdmin({
        token: invitationToken,
        username: formData.username.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
      }).unwrap();

      // Store credentials (assuming backend returns token + user)
      if (response.token && response.user) {
        dispatch(setCredentials({
          token: response.token,
          refresh_token: response.refresh_token,
          user: response.user,
          rememberMe: false,
        }));

        // Redirect to dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Registration successful but no auto-login
        navigate('/admin/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.' 
          } 
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ 
        submit: err.data?.message || 'Registration failed. Please try again.' 
      });
    }
  };

  // Step 1: Validating invitation
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#064232] rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={32} />
              </div>
            </div>

            <h1 className="text-center text-[#1A1A1A] text-2xl font-semibold mb-2">
              Validating Invitation
            </h1>
            <p className="text-center text-[#666666] mb-8">
              Please wait while we verify your invitation...
            </p>

            {isValidating && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-[#064232] animate-spin" />
                <p className="text-sm text-[#666666]">Checking invitation token...</p>
              </div>
            )}

            {validationError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">Invalid Invitation</p>
                  <p className="text-sm text-red-700">
                    {validationError.data?.message || 'This invitation link is invalid or has expired.'}
                  </p>
                  <Link 
                    to="/admin/login" 
                    className="text-sm text-red-600 hover:underline mt-2 inline-block"
                  >
                    Return to login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Registration form
  return (
    <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#064232] rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-[#1A1A1A] text-2xl font-semibold mb-2">
              Complete Your Registration
            </h1>
            <p className="text-[#666666]">
              Create your admin account to get started
            </p>
          </div>

          {/* Invitation Details Card */}
          <div className="bg-gradient-to-br from-[#064232] to-[#568F87] rounded-lg p-6 mb-6 text-white">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Invitation Verified</p>
                <p className="text-sm text-white/90">You've been invited to join as an administrator</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                  <Mail size={14} />
                  <span>Email</span>
                </div>
                <p className="font-medium text-sm">{invitationData?.email}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-white/80 text-xs mb-1">
                  <Building2 size={14} />
                  <span>Department</span>
                </div>
                <p className="font-medium text-sm">{invitationData?.department || 'General'}</p>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] ${
                    errors.username ? 'border-red-300' : 'border-[#E5E5E5]'
                  }`}
                  placeholder="johndoe"
                  disabled={isRegistering}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] ${
                    errors.full_name ? 'border-red-300' : 'border-[#E5E5E5]'
                  }`}
                  placeholder="John Doe"
                  disabled={isRegistering}
                />
              </div>
              {errors.full_name && (
                <p className="text-sm text-red-600 mt-1">{errors.full_name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-2.5 border rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] ${
                    errors.phone ? 'border-red-300' : 'border-[#E5E5E5]'
                  }`}
                  placeholder="+1234567890"
                  disabled={isRegistering}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] ${
                    errors.password ? 'border-red-300' : 'border-[#E5E5E5]'
                  }`}
                  placeholder="At least 8 characters"
                  disabled={isRegistering}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#064232]"
                  disabled={isRegistering}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-12 py-2.5 border rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] ${
                    errors.confirm_password ? 'border-red-300' : 'border-[#E5E5E5]'
                  }`}
                  placeholder="Re-enter your password"
                  disabled={isRegistering}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#064232]"
                  disabled={isRegistering}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-6 flex items-center justify-center gap-2"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ChevronRight size={20} />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-[#666666] text-sm mt-6">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-[#568F87] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-[#666666] text-sm mt-6">
          © 2024 E-Commerce Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}