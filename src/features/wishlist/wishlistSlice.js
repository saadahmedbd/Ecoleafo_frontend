// src/features/wishlist/wishlistSlice.js - COMPLETE WISHLIST SLICE
import { createSlice } from '@reduxjs/toolkit';
import { wishlistApi } from './wishlistApi';

const initialState = {
  items: [],
  count: 0,
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearLocalWishlist: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    // Handle getWishlist query success
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchFulfilled,
      (state, { payload }) => {
        state.items = payload.data || [];
        state.isLoading = false;
        state.error = null;
      }
    );

    // Handle getWishlist query loading
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchPending,
      (state) => {
        state.isLoading = true;
        state.error = null;
      }
    );

    // Handle getWishlist query error
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error.message;
      }
    );

    // Handle getWishlistCount query success
    builder.addMatcher(
      wishlistApi.endpoints.getWishlistCount.matchFulfilled,
      (state, { payload }) => {
        state.count = payload.count || 0;
      }
    );
  },
});

export const { clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;