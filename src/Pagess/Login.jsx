import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/* ============================================
   LOGIN PAGE COMPONENT
   User authentication with email/password and social login
   ============================================ */
export function Login () {
  // State management for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    console.log('Login attempt:', { email, password });
    
    // Replace with actual API call
    setTimeout(() => {
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 1000);
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked');
    // Implement Google OAuth
    alert('Google sign in - Integrate with OAuth');
  };

  // Handle Facebook sign in
  const handleFacebookSignIn = () => {
    console.log('Facebook sign in clicked');
    // Implement Facebook OAuth
    alert('Facebook sign in - Integrate with OAuth');
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // Navigate to password reset page
    alert('Redirect to password reset page');
  };

  return (
    <div className="login-page">
      {/* ============================================
          LOGIN CONTAINER
          ============================================ */}
      <div className="login-container">
        {/* Welcome Header */}
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to continue your green journey.</p>
        </div>

        {/* Login Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password-container">
            <Link to={"/forgot-password"}>
                <button
              type="button"
              className="forgot-password-link"
             
            >
              Forgot your password?
            </button>
            </Link>
          
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn-sign-in"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">Or continue with</span>
            <span className="divider-line"></span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-login-buttons">
            <button
              type="button"
              className="btn-social google"
              onClick={handleGoogleSignIn}
            >
              <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>
            <button
              type="button"
              className="btn-social facebook"
              onClick={handleFacebookSignIn}
            >
              <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
            </button>
          </div>
        </form>

        {/* Sign Up Links */}
        <div className="signup-links">
          <p className="signup-text">
            Don't have an account? <Link to={"/sign-up"} className="signup-link">Sign up</Link>
          </p>
          <p className="signup-text">
            Want to sell? <a href="/business-signup" className="business-link">Create business account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;