import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../ui/Button';

export default function LoginPage({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#FFF5F2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(6,66,50,0.08)] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[#064232] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">E</span>
            </div>
          </div>

          <h1 className="text-center text-[#1A1A1A] mb-2">Welcome Back</h1>
          <p className="text-center text-[#666666] mb-8">Sign in to your admin account</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-[#1A1A1A] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:border-[#568F87] bg-white text-[#1A1A1A]"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#064232]"
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
                />
                <span className="text-[#666666] text-sm">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#568F87] text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button type="submit" variant="primary" className="w-full">
              Sign In
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
