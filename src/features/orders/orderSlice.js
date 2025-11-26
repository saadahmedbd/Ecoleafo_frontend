import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentOrder: null,
  recentOrderId: null, // Store most recent order ID after creation
  orderHistory: [],
  isLoading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setRecentOrderId: (state, action) => {
      state.recentOrderId = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearRecentOrderId: (state) => {
      state.recentOrderId = null;
    },
  },
});

export const {
  setCurrentOrder,
  setRecentOrderId,
  clearCurrentOrder,
  clearRecentOrderId,
} = ordersSlice.actions;

export default ordersSlice.reducer;
