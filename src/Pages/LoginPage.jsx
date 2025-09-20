import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

/**
 * LoginPage Component
 * 
 * A React component that renders a login form for Evergreen Emporium.
 * Features include:
 * - Email/Username input validation
 * - Password input with toggle visibility
 * - Form submission handling
 * - Responsive design
 * - Clean, modern UI matching the brand theme
 */
export function LoginPage  ()  {
  // State management for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for form validation and UI feedback
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input changes and update form state
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form inputs
   * @returns {boolean} - Returns true if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email or Username is required';
    } else if (formData.email.includes('@') && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an actual API call
      console.log('Login attempt:', formData);
      alert('Login successful! (This is a demo)');
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle forgot password link click
   */
  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here');
  };

  /**
   * Handle register link click
   */
  const handleRegister = () => {
    alert('Registration page would open here');
  };

  return (
    <div className="login-container">
      {/* Header Section */}
      <header className="login-header">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <Link to="/"><h1 className="brand-name">Tree store</h1></Link>
        </div>
        <nav className="nav-links">
          <a href="#shop" className="nav-link">Shop</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <div className="header-icons">
          <button className="icon-btn search-btn" aria-label="Search">
            🔍
          </button>
          <button className="icon-btn cart-btn" aria-label="Shopping Cart">
            🛒
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main">
        <div className="login-card">
          <div className="login-content">
            {/* Welcome Message */}
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Sign in to continue your green journey.</p>
            </div>

            {/* Login Form */}
            <div className="login-form">
              {/* Email/Username Input */}
              <div className="input-group">
                <input
                  type="text"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Email or Username"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  aria-label="Email or Username"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Input */}
              <div className="input-group">
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Submit Error */}
              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              {/* Forgot Password Link */}
              <div className="forgot-password-container">
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? 'Signing In...' : 'Login'}
              </button>

              {/* Register Link */}
              <div className="register-container">
                <span className="register-text">Don't have an account? </span>
                <button
                  type="button"
                  className="register-link"
                  
                >
                  <Link to="/registation">Register</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;