import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function ForgotPasswordPage() {
  usePageTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
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

          <h1 className="text-center text-[#1A1A1A] mb-2">Forgot Password?</h1>
          <p className="text-center text-[#666666] mb-8">
            {submitted 
              ? "We've sent a password reset link to your email"
              : "Enter your email and we'll send you a reset link"
            }
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
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

              <Button type="submit" variant="primary" className="w-full mb-4">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-[#10B981]/10 border border-[#10B981] rounded-md">
              <p className="text-[#10B981] text-center">
                Check your email for the reset link
              </p>
            </div>
          )}

          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-[#568F87] hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
