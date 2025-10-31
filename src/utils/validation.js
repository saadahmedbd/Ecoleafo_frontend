// - Extended with Seller Validations

/**
 * Seller-Specific Validation Functions
 * Extends existing buyer validation with seller requirements
 */


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

/**
 * Validate store name
 * 
 * @param {string} storeName - Store name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export default function validateStoreName  (storeName){
  if (!storeName) {
    return { isValid: false, error: 'Store name is required' };
  }
  
  if (storeName.trim().length < 3) {
    return { 
      isValid: false, 
      error: 'Store name must be at least 3 characters' 
    };
  }
  
  if (storeName.length > 50) {
    return { 
      isValid: false, 
      error: 'Store name must be less than 50 characters' 
    };
  }
  
  // Only allow letters, numbers, spaces, and common punctuation
  const storeNameRegex = /^[a-zA-Z0-9\s&',.-]+$/;
  if (!storeNameRegex.test(storeName)) {
    return { 
      isValid: false, 
      error: 'Store name contains invalid characters' 
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate phone number (Bangladesh format)
 * 
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Bangladesh phone numbers: 11 digits starting with 01
  // Format: 01XXXXXXXXX or +8801XXXXXXXXX
  if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
    return { isValid: true, error: '' };
  }
  
  if (cleanPhone.length === 13 && cleanPhone.startsWith('880')) {
    return { isValid: true, error: '' };
  }
  
  return { 
    isValid: false, 
    error: 'Please enter a valid Bangladesh phone number (e.g., 01712345678)' 
  };
};

/**
 * Validate password confirmation
 * 
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate seller registration form (Step 1)
 * 
 * @param {Object} formData - Registration form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSellerRegistration = (formData) => {
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
  
  // Validate store name
  const storeNameResult = validateStoreName(formData.storeName);
  if (!storeNameResult.isValid) {
    errors.storeName = storeNameResult.error;
  }
  
  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  
  // Validate phone
  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error;
  }
  
  // Validate password (minimum 8 characters for sellers)
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  // Validate password confirmation
  const passwordMatchResult = validatePasswordMatch(
    formData.password, 
    formData.confirmPassword
  );
  if (!passwordMatchResult.isValid) {
    errors.confirmPassword = passwordMatchResult.error;
  }
  
  // Validate terms agreement
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};




/**
 * Validate business type
 * 
 * @param {string} businessType - Business type
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateBusinessType = (businessType) => {
  const validTypes = ['individual', 'company', 'nursery'];
  
  if (!businessType) {
    return { isValid: false, error: 'Please select a business type' };
  }
  
  if (!validTypes.includes(businessType)) {
    return { isValid: false, error: 'Invalid business type' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate seller profile completion form (Step 2)
 * 
 * @param {Object} formData - Profile form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSellerProfile = (formData) => {
  const errors = {};
  
  // Validate store description
  const validateStoreDescription = (description) => {
  if (!description || description.trim() === "") {
    return { isValid: false, error: "Store description is required" };
  }
  if (description.trim().length < 10) {
    return { isValid: false, error: "Store description must be at least 10 characters long" };
  }
  return { isValid: true, error: "" };
};
  
  // Validate business type
  const typeResult = validateBusinessType(formData.businessType);
  if (!typeResult.isValid) {
    errors.businessType = typeResult.error;
  }
  
  // Validate business email (optional but must be valid if provided)
  if (formData.businessEmail) {
    const emailResult = validateEmail(formData.businessEmail);
    if (!emailResult.isValid) {
      errors.businessEmail = emailResult.error;
    }
  }
  
  // Validate address fields
  if (!formData.address || formData.address.trim().length < 10) {
    errors.address = 'Please provide a complete address (at least 10 characters)';
  }
  
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  
  if (!formData.state || formData.state.trim().length < 2) {
    errors.state = 'State/Division is required';
  }
  
  if (!formData.postalCode || formData.postalCode.trim().length < 4) {
    errors.postalCode = 'Valid postal code is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate payment method type
 * 
 * @param {string} paymentType - Payment method type
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validatePaymentType = (paymentType) => {
  const validTypes = ['bank_transfer', 'bkash', 'nagad', 'rocket'];
  
  if (!paymentType) {
    return { isValid: false, error: 'Please select a payment method' };
  }
  
  if (!validTypes.includes(paymentType)) {
    return { isValid: false, error: 'Invalid payment method' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate account number based on payment type
 * 
 * @param {string} accountNumber - Account number
 * @param {string} paymentType - Payment type
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateAccountNumber = (accountNumber, paymentType) => {
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }
  
  // Remove spaces and dashes
  const cleanNumber = accountNumber.replace(/[\s-]/g, '');
  
  // Validate based on payment type
  if (paymentType === 'bkash' || paymentType === 'nagad' || paymentType === 'rocket') {
    // Mobile banking: should be a valid phone number
    const phoneResult = validatePhone(cleanNumber);
    if (!phoneResult.isValid) {
      return { 
        isValid: false, 
        error: 'Please enter a valid mobile number for mobile banking' 
      };
    }
  } else if (paymentType === 'bank_transfer') {
    // Bank account: typically 10-20 digits
    if (cleanNumber.length < 10 || cleanNumber.length > 20) {
      return { 
        isValid: false, 
        error: 'Bank account number should be 10-20 digits' 
      };
    }
    if (!/^\d+$/.test(cleanNumber)) {
      return { 
        isValid: false, 
        error: 'Bank account number should contain only digits' 
      };
    }
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate payment method form (Step 3)
 * 
 * @param {Object} formData - Payment form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validatePaymentMethod = (formData) => {
  const errors = {};
  
  // Validate payment type
  const typeResult = validatePaymentType(formData.paymentType);
  if (!typeResult.isValid) {
    errors.paymentType = typeResult.error;
  }
  
  // Validate account name
  if (!formData.accountName || formData.accountName.trim().length < 2) {
    errors.accountName = 'Account name is required';
  }
  
  // Validate account number
  const accountResult = validateAccountNumber(
    formData.accountNumber, 
    formData.paymentType
  );
  if (!accountResult.isValid) {
    errors.accountNumber = accountResult.error;
  }
  
  // Validate bank-specific fields
  if (formData.paymentType === 'bank_transfer') {
    if (!formData.bankName || formData.bankName.trim().length < 2) {
      errors.bankName = 'Bank name is required for bank transfers';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate seller login form
 * 
 * @param {Object} formData - Login form data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSellerLogin = (formData) => {
  const errors = {};
  
  // Validate email
  const emailResult = validateEmail(formData.email);
  if (!emailResult.isValid) {
    errors.email = emailResult.error;
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};