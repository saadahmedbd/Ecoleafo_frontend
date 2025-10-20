import React, { useState } from 'react';
import './ForgotPassword.css';

/* ============================================
   FORGOT PASSWORD PAGE COMPONENT
   Email reset request and password reset forms
   ============================================ */
export function ForgotPassword  ()  {
  // State management
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle send reset link
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoadingReset(true);

    // Validate email
    if (!email || !email.includes('@')) {
      setErrors({ email: 'Please enter a valid email address' });
      setIsLoadingReset(false);
      return;
    }

    // Simulate API call
    console.log('Sending reset link to:', email);
    
    try {
      // Replace with actual API call
      // await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setTimeout(() => {
        setResetSent(true);
        setIsLoadingReset(false);
        alert('Reset link sent! Check your email.');
      }, 1000);
    } catch (error) {
      setErrors({ email: 'Failed to send reset link. Please try again.' });
      setIsLoadingReset(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoadingPassword(true);

    // Validate passwords
    if (!newPassword || newPassword.length < 8) {
      setErrors({ newPassword: 'Password must be at least 8 characters' });
      setIsLoadingPassword(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setIsLoadingPassword(false);
      return;
    }

    // Simulate API call
    console.log('Resetting password');
    
    try {
      // Replace with actual API call
      // await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password: newPassword, token: resetToken })
      // });

      setTimeout(() => {
        setIsLoadingPassword(false);
        alert('Password reset successful! Redirecting to login...');
        // window.location.href = '/login';
      }, 1000);
    } catch (error) {
      setErrors({ general: 'Failed to reset password. Please try again.' });
      setIsLoadingPassword(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* ============================================
          FORGOT PASSWORD SECTION
          ============================================ */}
      <section className="forgot-section">
        <div className="forgot-container">
          <div className="forgot-header">
            <h1 className="forgot-title">Forgot your password?</h1>
            <p className="forgot-subtitle">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form className="forgot-form" onSubmit={handleSendResetLink}>
            <div className="form-group">
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={isLoadingReset}
            >
              {isLoadingReset ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="login-link-container">
              <span className="login-text">Remember your password? </span>
              <a href="/login" className="login-link">Log in</a>
            </div>
          </form>
        </div>
      </section>

      {/* ============================================
          SET NEW PASSWORD SECTION
          ============================================ */}
      <section className="reset-section">
        <div className="reset-container">
          <div className="reset-header">
            <h2 className="reset-title">Set a new password</h2>
            <p className="reset-subtitle">
              Your new password must be different from previous used passwords.
            </p>
          </div>

          <form className="reset-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <input
                type="password"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              {errors.newPassword && (
                <span className="error-message">{errors.newPassword}</span>
              )}
            </div>

            <div className="form-group">
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            {errors.general && (
              <div className="error-message general">{errors.general}</div>
            )}

            <button
              type="submit"
              className="btn-submit"
              disabled={isLoadingPassword}
            >
              {isLoadingPassword ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </section>

      {/* ============================================
          FOOTER COPYRIGHT
          ============================================ */}
      <footer className="page-footer">
        <p className="copyright">© 2024 Evergreen. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;