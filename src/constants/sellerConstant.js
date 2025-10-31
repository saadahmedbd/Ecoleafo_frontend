// src/constants/sellerConstants.js

/**
 * Seller-Specific Constants
 * Centralized configuration for seller features
 */

/**
 * Seller Business Types
 */
export const SELLER_BUSINESS_TYPES = {
  INDIVIDUAL: 'individual',
  COMPANY: 'company',
  NURSERY: 'nursery',
};

/**
 * Business type display labels
 */
export const BUSINESS_TYPE_LABELS = {
  [SELLER_BUSINESS_TYPES.INDIVIDUAL]: 'Individual Seller',
  [SELLER_BUSINESS_TYPES.COMPANY]: 'Company',
  [SELLER_BUSINESS_TYPES.NURSERY]: 'Plant Nursery',
};

/**
 * Payment Method Types
 */
export const PAYMENT_METHOD_TYPES = {
  BANK_TRANSFER: 'bank_transfer',
  BKASH: 'bkash',
  NAGAD: 'nagad',
  ROCKET: 'rocket',
};

/**
 * Payment method display labels
 */
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD_TYPES.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHOD_TYPES.BKASH]: 'bKash',
  [PAYMENT_METHOD_TYPES.NAGAD]: 'Nagad',
  [PAYMENT_METHOD_TYPES.ROCKET]: 'Rocket',
};

/**
 * Payment method icons/descriptions
 */
export const PAYMENT_METHOD_INFO = {
  [PAYMENT_METHOD_TYPES.BANK_TRANSFER]: {
    icon: '🏦',
    description: 'Direct bank account transfer',
    requiresBankDetails: true,
  },
  [PAYMENT_METHOD_TYPES.BKASH]: {
    icon: '💳',
    description: 'Mobile banking - bKash',
    requiresBankDetails: false,
  },
  [PAYMENT_METHOD_TYPES.NAGAD]: {
    icon: '📱',
    description: 'Mobile banking - Nagad',
    requiresBankDetails: false,
  },
  [PAYMENT_METHOD_TYPES.ROCKET]: {
    icon: '🚀',
    description: 'Mobile banking - Rocket',
    requiresBankDetails: false,
  },
};

/**
 * Seller Registration Steps
 */
export const SELLER_REGISTRATION_STEPS = {
  ACCOUNT_CREATION: 1,
  STORE_INFORMATION: 2,
  BUSINESS_DETAILS: 3,
  PAYMENT_METHOD: 4,
};

/**
 * Registration step labels
 */
export const REGISTRATION_STEP_LABELS = {
  [SELLER_REGISTRATION_STEPS.ACCOUNT_CREATION]: 'Account',
  [SELLER_REGISTRATION_STEPS.STORE_INFORMATION]: 'Store Info',
  [SELLER_REGISTRATION_STEPS.BUSINESS_DETAILS]: 'Business',
  [SELLER_REGISTRATION_STEPS.PAYMENT_METHOD]: 'Payment',
};

/**
 * Registration step descriptions
 */
export const REGISTRATION_STEP_DESCRIPTIONS = {
  [SELLER_REGISTRATION_STEPS.ACCOUNT_CREATION]: 'Create your seller account',
  [SELLER_REGISTRATION_STEPS.STORE_INFORMATION]: 'Tell us about your store',
  [SELLER_REGISTRATION_STEPS.BUSINESS_DETAILS]: 'Provide business information',
  [SELLER_REGISTRATION_STEPS.PAYMENT_METHOD]: 'Set up payment method',
};

/**
 * Seller Account Status
 */
export const SELLER_STATUS = {
  PENDING_APPROVAL: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended',
  ACTIVE: 'active',
};

/**
 * Status display labels
 */
export const SELLER_STATUS_LABELS = {
  [SELLER_STATUS.PENDING_APPROVAL]: 'Pending Approval',
  [SELLER_STATUS.APPROVED]: 'Approved',
  [SELLER_STATUS.REJECTED]: 'Rejected',
  [SELLER_STATUS.SUSPENDED]: 'Suspended',
  [SELLER_STATUS.ACTIVE]: 'Active',
};

/**
 * Status colors for UI
 */
export const SELLER_STATUS_COLORS = {
  [SELLER_STATUS.PENDING_APPROVAL]: 'yellow',
  [SELLER_STATUS.APPROVED]: 'green',
  [SELLER_STATUS.REJECTED]: 'red',
  [SELLER_STATUS.SUSPENDED]: 'orange',
  [SELLER_STATUS.ACTIVE]: 'blue',
};

/**
 * Validation Constraints
 */
export const SELLER_VALIDATION = {
  STORE_NAME_MIN_LENGTH: 3,
  STORE_NAME_MAX_LENGTH: 50,
  STORE_DESCRIPTION_MIN_LENGTH: 50,
  STORE_DESCRIPTION_MAX_LENGTH: 1000,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 11, // Bangladesh format: 01XXXXXXXXX
  PHONE_WITH_CODE_LENGTH: 13, // +8801XXXXXXXXX
  ADDRESS_MIN_LENGTH: 10,
  POSTAL_CODE_MIN_LENGTH: 4,
};

/**
 * Session Storage Keys
 */
export const SELLER_STORAGE_KEYS = {
  REGISTRATION_TEMP: 'seller_registration_temp',
  PROFILE_COMPLETION: 'seller_profile_completion',
  REMEMBERED_EMAIL: 'seller_remembered_email',
};

/**
 * Default Values
 */
export const SELLER_DEFAULTS = {
  COUNTRY: 'Bangladesh',
  CURRENCY: 'BDT',
  LANGUAGE: 'en',
};

/**
 * Phone Number Formats
 */
export const PHONE_FORMATS = {
  BANGLADESH: {
    code: '+880',
    length: 11,
    pattern: /^01[0-9]{9}$/,
    placeholder: '01712345678',
    example: '01712345678',
  },
};

/**
 * File Upload Limits (for future use)
 */
export const SELLER_FILE_LIMITS = {
  LOGO_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  DOCUMENT_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  PRODUCT_IMAGE_MAX_SIZE: 3 * 1024 * 1024, // 3MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

/**
 * Seller Dashboard Routes
 */
export const SELLER_ROUTES = {
  LOGIN: '/seller/login',
  REGISTER: '/seller/register',
  COMPLETE_PROFILE: '/seller/complete-profile',
  DASHBOARD: '/seller/dashboard',
  PRODUCTS: '/seller/products',
  ORDERS: '/seller/orders',
  ANALYTICS: '/seller/analytics',
  SETTINGS: '/seller/settings',
  PAYMENT_METHODS: '/seller/payment-methods',
};

/**
 * API Endpoints
 */
export const SELLER_API_ENDPOINTS = {
  REGISTER: '/seller/register',
  LOGIN: '/seller/login',
  LOGOUT: '/seller/logout',
  PROFILE_COMPLETE: '/seller/profile/complete',
  PROFILE_STATUS: '/seller/profile/status',
  PAYMENT_METHODS: '/seller/payment-methods',
  UPDATE_PROFILE: '/seller/profile',
  CHANGE_PASSWORD: '/seller/change-password',
};

/**
 * Error Messages
 */
export const SELLER_ERROR_MESSAGES = {
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  EMAIL_EXISTS: 'This email is already registered.',
  STORE_NAME_TAKEN: 'This store name is already taken.',
  INVALID_PHONE: 'Please enter a valid Bangladesh phone number.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters.',
  TERMS_NOT_AGREED: 'You must agree to the terms and conditions.',
  PROFILE_INCOMPLETE: 'Please complete your profile to continue.',
  PAYMENT_NOT_ADDED: 'Please add a payment method to start selling.',
  PENDING_APPROVAL: 'Your account is pending admin approval.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

/**
 * Success Messages
 */
export const SELLER_SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please wait for admin approval.',
  LOGIN_SUCCESS: 'Login successful!',
  PROFILE_COMPLETED: 'Profile completed successfully!',
  PAYMENT_ADDED: 'Payment method added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
};

/**
 * Seller Permissions (for future use)
 */
export const SELLER_PERMISSIONS = {
  CAN_LIST_PRODUCTS: 'can_list_products',
  CAN_MANAGE_ORDERS: 'can_manage_orders',
  CAN_VIEW_ANALYTICS: 'can_view_analytics',
  CAN_WITHDRAW_FUNDS: 'can_withdraw_funds',
  CAN_UPDATE_PROFILE: 'can_update_profile',
  CAN_MANAGE_PAYMENT_METHODS: 'can_manage_payment_methods',
};

/**
 * Check if seller has permission
 * 
 * @param {Object} user - User object
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasSellerPermission = (user, permission) => {
  if (!user || user.userType !== 'seller') return false;
  
  // If not approved, no permissions
  if (user.isApproved === false) return false;
  
  // If profile not complete, limited permissions
  if (!user.profileCompleted) {
    return [SELLER_PERMISSIONS.CAN_UPDATE_PROFILE].includes(permission);
  }
  
  // If payment not added, limited permissions
  if (!user.paymentMethodAdded) {
    return [
      SELLER_PERMISSIONS.CAN_UPDATE_PROFILE,
      SELLER_PERMISSIONS.CAN_MANAGE_PAYMENT_METHODS,
    ].includes(permission);
  }
  
  // All permissions granted for complete sellers
  return true;
};

/**
 * Export all constants as a namespace
 */
export default {
  SELLER_BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  PAYMENT_METHOD_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_INFO,
  SELLER_REGISTRATION_STEPS,
  REGISTRATION_STEP_LABELS,
  REGISTRATION_STEP_DESCRIPTIONS,
  SELLER_STATUS,
  SELLER_STATUS_LABELS,
  SELLER_STATUS_COLORS,
  SELLER_VALIDATION,
  SELLER_STORAGE_KEYS,
  SELLER_DEFAULTS,
  PHONE_FORMATS,
  SELLER_FILE_LIMITS,
  SELLER_ROUTES,
  SELLER_API_ENDPOINTS,
  SELLER_ERROR_MESSAGES,
  SELLER_SUCCESS_MESSAGES,
  SELLER_PERMISSIONS,
  hasSellerPermission,
};