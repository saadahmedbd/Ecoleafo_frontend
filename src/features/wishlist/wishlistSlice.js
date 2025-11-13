
import { createSlice } from '@reduxjs/toolkit';
import { wishlistApi } from './wishlistApi';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearLocalWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // Handle getWishlist query success
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchFulfilled,
      (state, { payload }) => {
        // Your backend returns array of wishlist items
        state.items = payload || [];
        state.isLoading = false;
      }
    );

    // Handle getWishlist query loading
    builder.addMatcher(
      wishlistApi.endpoints.getWishlist.matchPending,
      (state) => {
        state.isLoading = true;
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
  },
});

export const { clearLocalWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;