
/**
 * Form Validation Utilities
 * Reusable validation functions for authentication forms
 */
import DOMPurify from 'dompurify';
/**
 * Email validation regex
 * Validates standard email format
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password strength regex
 * At least 6 characters (can be customized for stronger requirements)
 */
const PASSWORD_MIN_LENGTH = 6;

/**
 * Strong password regex (optional - for enhanced security)
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validate email address
 * 
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password
 * 
 * @param {string} password - Password to validate
 * @param {boolean} requireStrong - Whether to require strong password (default: false)
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePassword = (password, requireStrong = false) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` 
    };
  }
  
  if (requireStrong && !STRONG_PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain uppercase, lowercase, number, and special character',
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate name (first name or last name)
 * 
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message (e.g., "First name")
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (name.trim().length < 2) {
    return { 
      isValid: false, 
      error: `${fieldName} must be at least 2 characters` 
    };
  }
  
  if (name.length > 50) {
    return { 
      isValid: false, 
      error: `${fieldName} must be less than 50 characters` 
    };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return { 
      isValid: false, 
      error: `${fieldName} contains invalid characters` 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate registration form
 * Validates all registration fields at once
 * 
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate first name
  const firstNameResult = validateName(formData.firstName, 'First name');
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error;
  }
  
  // Validate last name
  const lastNameResult = validateName(formData.lastName, 'Last name');
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error;
  }
  
  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  
  // Validate password
  const passwordResult = validatePassword(formData.password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login form
 * Validates email and password for login
 * 
 * @param {Object} formData - Form data to validate
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  
  // Validate password (less strict for login)
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize input string
 * Removes leading/trailing whitespace and prevents XSS
 * 
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  return DOMPurify.sanitize(input.trim());
};


/**
 * Check password strength
 * Returns strength level and feedback
 * 
 * @param {string} password - Password to check
 * @returns {Object} { strength: string, feedback: string, score: number }
 */
export const checkPasswordStrength = (password) => {
  if (!password) {
    return { strength: 'none', feedback: 'Enter a password', score: 0 };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;
  
  // Determine strength level
  let strength = 'weak';
  if (score <= 2) {
    strength = 'weak';
    feedback.push('Use at least 8 characters');
    feedback.push('Add uppercase and lowercase letters');
  } else if (score <= 4) {
    strength = 'medium';
    feedback.push('Add numbers and special characters for better security');
  } else {
    strength = 'strong';
    feedback.push('Great password!');
  }
  
  return {
    strength,
    feedback: feedback.join('. '),
    score,
  };
};