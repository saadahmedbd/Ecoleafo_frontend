import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedAddress: null,
  paymentMethod: 'cash_on_delivery',
  shippingMethod: 'standard', // standard, express
  orderNotes: '',
  isProcessing: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    setOrderNotes: (state, action) => {
      state.orderNotes = action.payload;
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    setCheckoutError: (state, action) => {
      state.error = action.payload;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setSelectedAddress,
  setPaymentMethod,
  setShippingMethod,
  setOrderNotes,
  setProcessing,
  setCheckoutError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;