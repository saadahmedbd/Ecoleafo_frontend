import { createSlice } from '@reduxjs/toolkit';

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: {
    unreadCount: 0,
    activeConversationId: null,
    lastPolledTime: null,
  },
  reducers: {
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    setLastPolledTime: (state, action) => {
      state.lastPolledTime = action.payload;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
  },
});

export const { 
  setUnreadCount, 
  setActiveConversation, 
  setLastPolledTime,
  decrementUnreadCount 
} = messagingSlice.actions;

export const selectUnreadCount = (state) => state.messaging.unreadCount;
export const selectActiveConversationId = (state) => state.messaging.activeConversationId;

export default messagingSlice.reducer;
