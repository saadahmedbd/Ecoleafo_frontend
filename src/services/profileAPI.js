// API Base URL
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

/**
 * Generic API call helper for JSON requests
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

  // Attach JWT token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Generic API call helper for multipart/form-data (file uploads)
 */
const apiCallMultipart = async (endpoint, formData, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData - browser will set it with boundary
      ...options.headers,
    },
    ...options,
  };

  // Attach JWT token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Upload failed');
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Profile API service
 */
export const profileAPI = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return await apiCall('/buyer/profile', { method: 'GET' });
  },

  /**
   * Update user profile (without image)
   */
  updateProfile: async (profileData) => {
    const requestBody = {
      phone: profileData.phone || '',
      first_name: profileData.firstName || '',
      last_name: profileData.lastName || '',
      email: profileData.email || '',
    };

    // Only include profile_picture if it's a URL (not base64)
    if (profileData.profileImage && profileData.profileImage.startsWith('http')) {
      requestBody.profile_picture = profileData.profileImage;
    }

    return await apiCall('/buyer/profile', {
      method: 'PUT',
      body: JSON.stringify(requestBody),
    });
  },

  /**
   * Upload profile picture to Cloudinary
   * @param {File} file - The image file to upload
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  uploadProfilePicture: async (file) => {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 10MB' };
    }

    // Create FormData
    const formData = new FormData();
    formData.append('profile_picture', file);

    // Upload to Cloudinary via backend
    return await apiCallMultipart('/buyer/profile/upload-picture', formData);
  },

  /**
   * Delete profile picture from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   */
  deleteProfilePicture: async (publicId) => {
    return await apiCall('/buyer/profile/delete-picture', {
      method: 'DELETE',
      body: JSON.stringify({ public_id: publicId }),
    });
  },
};

/**
 * Helper function to check if a string is a valid URL
 */
export const isValidURL = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Helper function to check if image is base64
 */
export const isBase64Image = (string) => {
  return string && string.startsWith('data:image/');
};