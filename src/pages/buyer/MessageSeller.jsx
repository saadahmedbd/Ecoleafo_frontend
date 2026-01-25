import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, Image as ImageIcon } from 'lucide-react';
import { useGetProductByIdQuery } from '@/features/BuyerProduct/buyerProductApi';
import { 
import { usePageTitle } from '@/hooks/usePageTitle';
  useCreateConversationMutation, 
  useSendMessageMutation, 
  useGetMessagesQuery 
} from '@/features/Messaging/messagingApi';

export default function MessageSeller() {
  usePageTitle('Message Seller');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get('seller_id');
  const productId = searchParams.get('product_id');
  
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const { data: productData } = useGetProductByIdQuery(productId, { skip: !productId });
  const product = productData?.data?.product || productData?.data || productData?.product || productData;

  const [createConversation, { isLoading: creating }] = useCreateConversationMutation();
  const [sendMessage, { isLoading: sending }] = useSendMessageMutation();
  const { data: messagesData, refetch } = useGetMessagesQuery(
    { conversationId: conversationId, limit: 50 },
    { skip: !conversationId, pollingInterval: 5000 }
  );

  const messages = messagesData?.data?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (!conversationId) {
        const result = await createConversation({
          recipient_id: parseInt(sellerId),
          recipient_type: 'seller',
          context_type: 'product',
          context_id: parseInt(productId),
          initial_message: message.trim()
        }).unwrap();
        
        setConversationId(result.data.id);
        setMessage('');
      } else {
        await sendMessage({
          conversation_id: conversationId,
          message_text: message.trim()
        }).unwrap();
        
        setMessage('');
        refetch();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">Message Seller</h1>
          <p className="text-xs text-gray-500">{product?.seller?.store_name || 'Seller'}</p>
        </div>
      </div>

      {/* Product Context */}
      {product && (
        <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-3">
          <img 
            src={product.images?.[0]?.image_url || 'https://via.placeholder.com/60'} 
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
            <p className="text-sm text-green-600 font-bold">৳{product.price?.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
              msg.is_mine 
                ? 'bg-green-600 text-white' 
                : 'bg-white text-gray-900 border border-gray-200'
            }`}>
              <p className="text-sm">{msg.message_text}</p>
              <p className={`text-xs mt-1 ${msg.is_mine ? 'text-green-100' : 'text-gray-500'}`}>
                {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-green-600"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || creating || sending}
            className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating || sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
