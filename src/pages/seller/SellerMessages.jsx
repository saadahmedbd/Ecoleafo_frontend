import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Search, 
  MoreVertical,
  Package,
  ShoppingBag,
  MessageCircle,
  Paperclip
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
} from '@/features/Messaging/messagingApi';
import { formatDistanceToNow } from 'date-fns';

export default function SellerMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  // Queries
  const { data: conversationsData, isLoading: conversationsLoading, error: conversationsError, refetch } = useGetConversationsQuery(undefined, {
    pollingInterval: 10000,
    refetchOnMountOrArgChange: true,
  });

  const { data: messagesData, isLoading: messagesLoading, error: messagesError } = useGetMessagesQuery(
    {
      conversationId: selectedConversation?.id,
      limit: 50,
    },
    {
      skip: !selectedConversation?.id,
      pollingInterval: 5000,
      refetchOnMountOrArgChange: true,
    }
  );

  // Mutations
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  // Check URL params for conversation
  useEffect(() => {
    const convId = searchParams.get('conversation');
    if (convId && conversationsData?.conversations) {
      const conv = conversationsData.conversations.find(c => c.id === parseInt(convId));
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [searchParams, conversationsData]);

  // Mark as read when conversation opens
  useEffect(() => {
    if (selectedConversation?.id && selectedConversation.unread_count > 0) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation?.id, markAsRead]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.messages]);

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setSearchParams({ conversation: conv.id });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation?.id) return;

    try {
      await sendMessage({
        conversation_id: selectedConversation.id,
        message_text: messageText.trim(),
      }).unwrap();
      
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const filteredConversations = conversationsData?.conversations?.filter(conv =>
    conv.other_user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Conversations List */}
      <div className={`
        ${selectedConversation ? 'hidden md:block' : 'block'} 
        w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col
      `}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-3">Messages</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationsLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : conversationsError ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-500">Error loading conversations</p>
              <p className="text-sm text-gray-400 mt-1">{conversationsError?.error || conversationsError?.data?.message || 'Unknown error'}</p>
              <button 
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400 mt-1">Buyers will message you here</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {conv.other_user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold -mt-2 ml-8 border-2 border-white">
                      {conv.unread_count}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-gray-900 truncate ${
                      conv.unread_count > 0 ? 'font-bold' : ''
                    }`}>
                      {conv.other_user?.name || 'Unknown User'}
                    </h3>
                    {conv.last_message_at && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  
                  {conv.context && (
                    <div className="flex items-center space-x-1 mb-1">
                      {conv.context.type === 'product' ? (
                        <ShoppingBag className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Package className="w-3 h-3 text-green-500" />
                      )}
                      <span className="text-xs text-gray-500 truncate">
                        {conv.context.name}
                      </span>
                    </div>
                  )}
                  
                  <p className={`text-sm text-gray-600 truncate ${
                    conv.unread_count > 0 ? 'font-semibold text-gray-900' : ''
                  }`}>
                    {conv.last_message || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`
        ${selectedConversation ? 'block' : 'hidden md:flex'} 
        flex-1 flex flex-col bg-white
      `}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedConversation(null);
                    setSearchParams({});
                  }}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {selectedConversation.other_user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.other_user?.name || 'Unknown User'}
                  </h2>
                  <p className="text-xs text-gray-500">{selectedConversation.other_user?.user_type || 'User'}</p>
                </div>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Context Info */}
            {selectedConversation?.context && (
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center space-x-3">
                {selectedConversation?.context?.image && (
                  <img 
                    src={selectedConversation?.context?.image}
                    alt="Product"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {selectedConversation?.context?.name}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messagesLoading && !messagesData ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messagesData?.messages?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messagesData?.messages?.map((msg) => {
                  // Fix: For sellers, is_mine should be true only if sender_type is 'seller'
                  const isMine = msg.sender_type === 'seller';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isMine ? '' : 'flex items-start space-x-2'}`}>
                        {/* Avatar for received messages */}
                        {!isMine && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {msg.sender_name?.[0]?.toUpperCase() || 'U'}
                          </div>
                        )}
                        
                        <div>
                          {/* Sender name for received messages */}
                          {!isMine && (
                            <p className="text-xs text-gray-600 mb-1 ml-1">
                              {msg.sender_name}
                            </p>
                          )}
                          
                          {/* Message bubble */}
                          <div
                            className={`px-4 py-2 shadow-sm ${
                              isMine
                                ? 'bg-green-600 text-white rounded-2xl rounded-br-md'
                                : 'bg-white text-gray-900 rounded-2xl rounded-bl-md border border-gray-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.message_text}
                            </p>
                          </div>
                          
                          {/* Timestamp */}
                          <p className={`text-xs text-gray-500 mt-1 ${
                            isMine ? 'text-right mr-1' : 'ml-1'
                          }`}>
                            {new Date(msg.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows="1"
                    style={{
                      minHeight: '40px',
                      maxHeight: '120px',
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift + Enter for new line
              </p>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
