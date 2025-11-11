import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewService = {
  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await api.post('/buyer/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create review' };
    }
  },

  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    try {
      const response = await api.get('/reviews/product', {
        params: {
          product_id: productId,
          page: params.page || 1,
          per_page: params.perPage || 10,
          rating: params.rating || null,
          sort_by: params.sortBy || 'newest',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  // Get buyer's reviews
  getMyReviews: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get('/buyer/reviews/my-reviews', {
        params: { page, per_page: perPage },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your reviews' };
    }
  },

  // Check if buyer can review a product
  canReview: async (productId) => {
    try {
      const response = await api.get('/buyer/reviews/can-review', {
        params: { product_id: productId },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check review eligibility' };
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/buyer/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update review' };
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/buyer/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete review' };
    }
  },
};