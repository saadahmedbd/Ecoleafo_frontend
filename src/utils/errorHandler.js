

import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

/**
 * Centralized error handling utility
 * Transforms API errors into user-friendly messages
 * 
 * @param {Object} error - Error object from RTK Query or fetch
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  // Network error (no response from server)
  if (error.name === 'TypeError' || !error.status) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // RTK Query error format
  if (error.status) {
    switch (error.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return error.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      
      case HTTP_STATUS.UNAUTHORIZED:
      case HTTP_STATUS.FORBIDDEN:
        return error.data?.message || ERROR_MESSAGES.UNAUTHORIZED;
      
      case HTTP_STATUS.NOT_FOUND:
        return error.data?.message || 'Resource not found.';
      
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      default:
        return error.data?.message || ERROR_MESSAGES.SERVER_ERROR;
    }
  }

  // Fallback for unknown errors
  return error.message || ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Extract error message from various error formats
 * 
 * @param {Object} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.data?.message) return error.data.message;
  if (error.message) return error.message;
  return ERROR_MESSAGES.SERVER_ERROR;
};

/**
 * Log errors in development mode
 * Can be extended to send to error tracking service (e.g., Sentry)
 * 
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export const logError = (error, context = 'Unknown') => {
  if (import.meta.env.DEV) {
    console.error(`[${context}] Error:`, error);
  }
  
  // TODO: Send to error tracking service in production
  // Example: Sentry.captureException(error);
};