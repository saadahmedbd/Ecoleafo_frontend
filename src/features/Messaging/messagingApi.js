import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const messagingApi = createApi({
  reducerPath: 'messagingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/v1/messaging`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Conversations', 'Messages', 'UnreadCount'],
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    // Get unread count
    getUnreadCount: builder.query({
      query: () => '/unread-count',
      providesTags: ['UnreadCount'],
      transformResponse: (response) => response.data,
    }),

    // Get all conversations
    getConversations: builder.query({
      query: () => {
        // No parameters - backend should handle role-based filtering from JWT
        return '/conversations';
      },
      providesTags: ['Conversations'],
      transformResponse: (response) => {
        console.log('=== CONVERSATIONS API RESPONSE ===');
        console.log('Response:', response);
        console.log('Conversations:', response.data?.conversations);
        console.log('Count:', response.data?.conversations?.length || 0);
        console.log('=================================');
        return response.data;
      },
    }),

    // Get conversation details
    getConversationDetails: builder.query({
      query: (conversationId) => `/conversations/${conversationId}`,
      providesTags: (result, error, id) => [{ type: 'Conversations', id }],
      transformResponse: (response) => response.data,
    }),

    // Get messages for a conversation
    getMessages: builder.query({
      query: ({ conversationId, since, limit = 50 }) => {
        let url = `/messages?conversation_id=${conversationId}&limit=${limit}`;
        if (since) {
          url += `&since=${since}`;
        }
        return url;
      },
      providesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId }
      ],
      transformResponse: (response) => response.data,
    }),

    // Create conversation
    createConversation: builder.mutation({
      query: (data) => ({
        url: '/conversations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Conversations'],
      transformResponse: (response) => response.data,
    }),

    // Send message
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { conversation_id }) => [
        { type: 'Messages', id: conversation_id },
        'Conversations',
        'UnreadCount',
      ],
      transformResponse: (response) => response.data,
    }),

    // Mark as read
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/conversations/${conversationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Conversations', 'UnreadCount'],
    }),
  }),
});

export const {
  useGetUnreadCountQuery,
  useGetConversationsQuery,
  useGetConversationDetailsQuery,
  useGetMessagesQuery,
  useCreateConversationMutation,
  useSendMessageMutation,
  useMarkAsReadMutation,
} = messagingApi;
