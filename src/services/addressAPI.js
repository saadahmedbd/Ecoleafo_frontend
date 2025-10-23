// API Base URL - Update this to your Go backend URL
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Helper function for API calls
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Address API Service
 * Handles all address-related API calls to Go backend
 */
export const addressAPI = {
  // Get all addresses for the authenticated buyer
  getAddresses: async () => {
    return await apiCall('/buyer/addresses', {
      method: 'GET',
    });
  },

  // Create a new address
  createAddress: async (addressData) => {
    return await apiCall('/buyer/addresses', {
      method: 'POST',
      body: JSON.stringify({
        label: addressData.label,
        full_name: addressData.fullName,
        phone: addressData.phone,
        address_line1: addressData.address_line1,
        address_line2: addressData.address_line2,
        street: addressData.street,
        city: addressData.city,
        district: addressData.district,
        state: addressData.state,
        country: addressData.country,
        postal_code: addressData.postal_code,
        is_default: addressData.is_default || false,
      }),
    });
  },

  // Update an existing address
  updateAddress: async (id, addressData) => {
    return await apiCall(`/buyer/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        label: addressData.label,
        full_name: addressData.fullName,
        phone: addressData.phone,
        address_line1: addressData.address_line1,
        address_line2: addressData.address_line2,
        street: addressData.street,
        city: addressData.city,
        district: addressData.district,
        state: addressData.state,
        country: addressData.country,
        postal_code: addressData.postal_code,
        is_default: addressData.is_default || false,
      }),
    });
  },

  // Delete an address
  deleteAddress: async (id) => {
    return await apiCall(`/buyer/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  // Set an address as default
  setDefaultAddress: async (id) => {
    return await apiCall(`/buyer/addresses/${id}/set-default`, {
      method: 'PUT',
    });
  },
};

export default addressAPI;