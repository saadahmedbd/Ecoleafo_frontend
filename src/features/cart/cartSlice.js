
import { createSlice } from '@reduxjs/toolkit';
import { cartApi } from './cartApi';

const initialState = {
  items: [],
  savedForLater: [],
  itemCount: 0,
  savedItemCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearLocalCart: (state) => {
      state.items = [];
      state.savedForLater = [];
      state.itemCount = 0;
      state.savedItemCount = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // Handle getCart query success
    builder.addMatcher(
      cartApi.endpoints.getCart.matchFulfilled,
      (state, { payload }) => {
        // Backend returns cart summary with structure like:
        // { items: [...], saved_for_later: [...], item_count, saved_item_count, subtotal, discount, total_amount, ... }
        state.items = payload.items || [];
        state.savedForLater = payload.saved_for_later || [];
        state.itemCount = payload.item_count || 0;
        state.savedItemCount = payload.saved_item_count || 0;
        state.subtotal = payload.subtotal || 0;
        state.discount = payload.discount || 0;
        state.total = payload.total_amount || payload.total || 0;
        state.isLoading = false;
      }
    );

    // Handle getCart query loading
    builder.addMatcher(
      cartApi.endpoints.getCart.matchPending,
      (state) => {
        state.isLoading = true;
      }
    );

    // Handle getCart query error
    builder.addMatcher(
      cartApi.endpoints.getCart.matchRejected,
      (state, { error }) => {
        state.isLoading = false;
        state.error = error.message;
      }
    );

    // Handle getCartCount query
    builder.addMatcher(
      cartApi.endpoints.getCartCount.matchFulfilled,
      (state, { payload }) => {
        state.itemCount = payload.count || 0;
      }
    );

    // Handle getCartTotal query
    builder.addMatcher(
      cartApi.endpoints.getCartTotal.matchFulfilled,
      (state, { payload }) => {
        state.total = payload.total || 0;
      }
    );
  },
});

export const { clearLocalCart } = cartSlice.actions;
export default cartSlice.reducer;