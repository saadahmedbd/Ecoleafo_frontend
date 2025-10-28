import React, { useState } from 'react';
import './SignUp.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';

/* ============================================
   SIGN UP PAGE COMPONENT
   User registration with email/password and social signup
   ============================================ */
export function SignUp  ()  {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  // State management for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    console.log('Creating account:', formData);
    
    try {
      // Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setTimeout(() => {
        setIsLoading(false);
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      setErrors({ general: 'Failed to create account. Please try again.' });
      setIsLoading(false);
    }
  };

  // Handle Google sign up
  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
    // Implement Google OAuth
    alert('Google sign up - Integrate with OAuth');
  };

  // Handle Facebook sign up
  const handleFacebookSignUp = () => {
    console.log('Facebook sign up clicked');
    // Implement Facebook OAuth
    alert('Facebook sign up - Integrate with OAuth');
  };

  return (
    <div className="signup-page">
      {/* ============================================
          SIGNUP CONTAINER
          ============================================ */}
      <div className="signup-container">
        {/* Header */}
        <div className="signup-header">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">
            Already have an account? <Link to={"/login"} className="signin-link">Sign in</Link>
          </p>
        </div>

        {/* Social Signup Buttons */}
        <div className="social-signup-buttons">
          <button
            type="button"
            className="btn-social google"
            onClick={handleGoogleSignUp}
          >
            <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            className="btn-social facebook"
            onClick={handleFacebookSignUp}
          >
            <svg className="social-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
            </svg>
            <span>Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="divider">
          <span className="divider-line"></span>
          <span className="divider-text">Or with email</span>
          <span className="divider-line"></span>
        </div>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Name Fields Row */}
          <div className="name-row">
            <div className="form-group">
              <input
                type="text"
                name="firstName"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lastName"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <input
              type="password"
              name="password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-create-account"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          {/* Business Account Link */}
          <div className="business-link-container">
            <p className="business-text">
              Want to sell with us? <a href="/business-signup" className="business-link">Create business account</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;