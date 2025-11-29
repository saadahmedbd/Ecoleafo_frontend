// src/pages/admin/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import AdminAuthService from '@/services/adminAuthService';
import { setAdminAuth } from '@/features/auth/authSlice';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminAuthService = new AdminAuthService(dispatch);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already authenticated
  useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await adminAuthService.login({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.success) {
        // Update Redux state with correct response structure
        dispatch(setAdminAuth({
          token: result.access_token || result.token,
          refresh_token: result.refresh_token,
          user: {
            id: result.user_id,
            email: result.email,
            first_name: result.first_name,
            last_name: result.last_name,
            userType: result.user_type || 'admin',
            roles: result.roles || ['admin'],
          },
        }));

        // Redirect to dashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#064232] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">E</span>
            </div>
          </div>

          <h1 className="text-center text-[#1A1A1A] text-2xl font-semibold mb-2">
            Welcome Back
          </h1>
          <p className="text-center text-[#666666] mb-8">
            Sign in to your admin account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                placeholder="admin@example.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[#1A1A1A] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A] pr-12"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#064232] disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E5E5] text-[#064232] focus:ring-[#568F87]"
                  disabled={isLoading}
                />
                <span className="text-[#666666] text-sm">Remember me</span>
              </label>
              <Link 
                to="/admin/forgot-password" 
                className="text-[#568F87] text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[#666666] text-sm mt-6">
          © 2024 E-Commerce Admin. All rights reserved.
        </p>
      </div>
    </div>
  );
}