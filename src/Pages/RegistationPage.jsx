import React, { useState } from 'react';
import { Search, ShoppingCart, Eye, EyeOff, Menu, X } from 'lucide-react';
import "./RegistationPage.css"
import { Link } from 'react-router-dom';

export function RegistrationPage  ()  {
  // State management for form data
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for loading and success states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);



  // Handle input changes and clear errors for that field
  const handleInputChange = (e) => {
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

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real application, you would make an API call here
      console.log('Registration data:', formData);
      
      setIsSuccess(true);
      // Reset form after successful registration
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if screen is desktop size (simplified for demo)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if screen is tablet or larger
  const isTabletOrLarger = window.innerWidth >= 640;

  return (
    <div className="pageContainer">
      {/* Spinning animation keyframes injection */}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* Header Navigation */}
      <header className="header">
        <div className="maxWidthContainer">
          <div className="headerContent">
            {/* Logo */}
            <div className="logoContainer">
              <div className="logoIcon"></div>
             <Link to="/"> <h1 className="logoText">Tree store</h1></Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className={isDesktop ? 'navDesktopVisible' : 'navDesktop'}>
              <a href="#" className="navLink">Shop</a>
              <a href="#" className="navLink">About</a>
              <a href="#" className="navLink">Contact</a>
            </nav>
            
            {/* Desktop Right Side Actions */}
            <div className={isDesktop ? 'headerActionsDesktopVisible' : 'headerActionsDesktop'}>
              <Link to="/login"><button className="loginBtn">Login</button></Link>
              <Search className="iconBtn" />
              <ShoppingCart className="iconBtn" />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className={isDesktop ? 'mobileMenuBtnHidden' : 'mobileMenuBtn'}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="iconBtn" />
              ) : (
                <Menu className="iconBtn" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu */}
          <div className={isMobileMenuOpen && !isDesktop ? 'mobileMenu' : 'mobileMenuHidden'}>
            <div className="mobileMenuContent">
              <a href="#" className="navLink">Shop</a>
              <a href="#" className="navLink">About</a>
              <a href="#" className="navLink">Contact</a>
              <div className="mobileMenuActions">
                <button className="loginBtn">Login</button>
                <Search className="iconBtn" />
                <ShoppingCart className="iconBtn" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mainContent">
        <div className="formContainer">
          {/* Registration Form Header */}
          <div className="formHeader">
            <h2 className="formTitle">Create an Account</h2>
            <p className="formSubtitle">
              Or <span className="formSubtitleHighlight">start your 14-day free trial</span>
            </p>
          </div>
          
          {/* Success Message */}
          {isSuccess && (
            <div className="message messageSuccess">
              <p style={{margin: 0}}>Registration successful! Welcome to Evergreen Emporium!</p>
            </div>
          )}
          
          {/* General Error Message */}
          {errors.general && (
            <div className="message messageError">
              <p style={{margin: 0}}>{errors.general}</p>
            </div>
          )}

          {/* Registration Form */}
          <form className="form" onSubmit={handleSubmit}>
            {/* Email Address Field */}
            <div className="formGroup">
              <label htmlFor="email" className="formLabel">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`formInput ${errors.email ? 'formInputError' : ''}`}
                placeholder="Enter your email"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="formError">{errors.email}</p>
              )}
            </div>

            {/* Name Fields Row */}
            <div className={isTabletOrLarger ? 'formRowTwoColumns' : 'formRow'}>
              {/* First Name Field */}
              <div className="formGroup">
                <label htmlFor="firstName" className="formLabel">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`formInput ${errors.firstName ? 'formInputError' : ''}`}
                  placeholder="First name"
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="formError">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name Field */}
              <div className="formGroup">
                <label htmlFor="lastName" className="formLabel">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`formInput ${errors.lastName ? 'formInputError' : ''}`}
                  placeholder="Last name"
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="formError">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="formGroup">
              <label htmlFor="password" className="formLabel">
                Password
              </label>
              <div className="passwordContainer">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`formInput ${errors.password ? 'formInputError' : ''}`}
                  style={{paddingRight: '2.5rem'}}
                  placeholder="Create a password"
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="passwordToggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="passwordToggleIcon" />
                  ) : (
                    <Eye className="passwordToggleIcon" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="formError">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="formGroup">
              <label htmlFor="confirmPassword" className="formLabel">
                Confirm Password
              </label>
              <div className="passwordContainer">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`formInput ${errors.confirmPassword ? 'formInputError' : ''}`}
                  style={{paddingRight: '2.5rem'}}
                  placeholder="Confirm your password"
                  aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="passwordToggle"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="passwordToggleIcon" />
                  ) : (
                    <Eye className="passwordToggleIcon" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirmPassword-error" className="formError">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submitBtn ${isLoading ? 'submitBtnDisabled' : ''}`}
            >
              {isLoading ? (
                <div className="loadingContent">
                  <div className="loadingSpinner"></div>
                  Creating Account...
                </div>
              ) : (
                'Register'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="loginLinkContainer">
            <p className="loginLinkText">
              Already have an account?{' '}
              <Link to="/login"className="loginLink">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;