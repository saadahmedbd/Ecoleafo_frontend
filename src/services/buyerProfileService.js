/**
 * Buyer Profile Service
 * Business logic layer for profile operations
 */

/**
 * Validate profile update data
 */
export const validateProfileUpdate = (data) => {
  const errors = {};
  
  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.first_name = 'First name must be at least 2 characters';
  }
  
  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.last_name = 'Last name must be at least 2 characters';
  }
  
  if (data.phone && !/^(\+880|0)1[3-9]\d{8}$/.test(data.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  
  if (data.date_of_birth) {
    const date = new Date(data.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 13) {
      errors.date_of_birth = 'You must be at least 13 years old';
    }
  }
  
  return errors;
};

/**
 * Validate address data
 */
export const validateAddress = (data) => {
  const errors = {};
  
  if (!data.street_address || data.street_address.trim().length < 5) {
    errors.street_address = 'Street address must be at least 5 characters';
  }
  
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required';
  }
  
  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State is required';
  }
  
  if (!data.postal_code || data.postal_code.trim().length < 3) {
    errors.postal_code = 'Valid postal code is required';
  }
  
  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required';
  }
  
  return errors;
};

/**
 * Validate password change data
 */
export const validatePasswordChange = (data) => {
  const errors = {};
  
  if (!data.current_password) {
    errors.current_password = 'Current password is required';
  }
  
  if (!data.new_password || data.new_password.length < 8) {
    errors.new_password = 'New password must be at least 8 characters';
  }
  
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.new_password)) {
    errors.new_password = 'Password must contain uppercase, lowercase, and number';
  }
  
  if (data.new_password !== data.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }
  
  return errors;
};

/**
 * Validate profile picture upload
 */
export const validateProfilePicture = (file) => {
  const errors = [];
  
  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    errors.push('File size must be less than 2MB');
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPG, JPEG, and PNG files are allowed');
  }
  
  return errors;
};

/**
 * Format profile data for display
 */
export const formatProfileData = (profile) => {
  return {
    ...profile,
    fullName: `${profile.first_name} ${profile.last_name}`,
    formattedPhone: profile.phone || 'Not provided',
    formattedDOB: profile.date_of_birth 
      ? new Date(profile.date_of_birth).toLocaleDateString() 
      : 'Not provided',
    genderDisplay: profile.gender 
      ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
      : 'Not specified',
  };
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  const parts = [
    address.street_address,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ];
  return parts.filter(Boolean).join(', ');
};

/**
 * Get order status color
 */
export const getOrderStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
  }).format(amount);
};